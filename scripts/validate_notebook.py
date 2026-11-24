#!/usr/bin/env python3
"""Validate the abbasdeep Colab notebook and its embedded custom Gradio shell."""
from __future__ import annotations

import ast
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NOTEBOOK = ROOT / "notebooks" / "abbasdeep.ipynb"


def source_of(cell: dict) -> str:
    source = cell.get("source", "")
    return "".join(source) if isinstance(source, list) else str(source)


def main() -> int:
    data = json.loads(NOTEBOOK.read_text(encoding="utf-8"))
    cells = {cell.get("id"): cell for cell in data.get("cells", [])}

    branding_cell = cells.get("abbasdeep-brand-mobile")
    launch_cell = cells.get("abbasdeep-start")
    if branding_cell is None or launch_cell is None:
        raise SystemExit("Required abbasdeep setup/start cells are missing.")

    branding_source = source_of(branding_cell)
    launch_source = source_of(launch_cell)

    # This setup cell has no IPython magics; parse its Python syntax directly.
    branding_ast = ast.parse(branding_source, filename="abbasdeep-brand-mobile")
    shell_node = next(
        (
            node for node in ast.walk(branding_ast)
            if isinstance(node, ast.Assign)
            and any(isinstance(target, ast.Name) and target.id == "custom_shell_source"
                    for target in node.targets)
        ),
        None,
    )
    if shell_node is None:
        raise SystemExit("Embedded custom_shell_source assignment is missing.")

    shell_source = ast.literal_eval(shell_node.value)
    ast.parse(shell_source, filename="assets/abbasdeep_shell.py")
    ast.parse(launch_source, filename="abbasdeep-start")

    if "inline=True" not in branding_source:
        raise SystemExit("The notebook no longer configures the interface for inline Colab display.")
    if "runpy.run_path" not in launch_source:
        raise SystemExit("The notebook launch cell no longer runs the Applio app in the notebook kernel.")

    print("Notebook JSON: valid")
    print("Branding/setup cell: valid Python")
    print("Embedded abbasdeep shell: valid Python")
    print("Notebook launch cell: valid Python")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
