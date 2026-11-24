#!/usr/bin/env python3
"""Apply or restore the optional abbasdeep mobile CSS refinements for Applio."""
from __future__ import annotations
import argparse
import shutil
from pathlib import Path

MARKER = "/* ABBASDEEP MOBILE OVERRIDES v1"

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--applio-dir", required=True, help="Path to the root folder of an Applio checkout")
    parser.add_argument("--restore", action="store_true", help="Restore the original CSS backup created by this script")
    args = parser.parse_args()

    root = Path(args.applio_dir).expanduser().resolve()
    css_path = root / "assets" / "ui" / "shell.css"
    backup_path = css_path.with_name("shell.css.abbasdeep-backup")
    if not css_path.is_file():
        parser.error(f"Could not find Applio stylesheet: {css_path}")

    if args.restore:
        if not backup_path.is_file():
            parser.error(f"No backup found at: {backup_path}")
        shutil.copy2(backup_path, css_path)
        print(f"Restored original stylesheet: {css_path}")
        return 0

    current_css = css_path.read_text(encoding="utf-8")
    if MARKER in current_css:
        print("abbasdeep mobile CSS is already applied; no changes made.")
        return 0

    patch_path = Path(__file__).resolve().parents[1] / "patches" / "applio-mobile.css"
    if not patch_path.is_file():
        parser.error(f"Could not find patch file: {patch_path}")
    patch_css = patch_path.read_text(encoding="utf-8")
    if not backup_path.exists():
        shutil.copy2(css_path, backup_path)
    css_path.write_text(current_css.rstrip() + "\n\n" + patch_css.rstrip() + "\n", encoding="utf-8")
    print(f"Applied abbasdeep mobile CSS to: {css_path}")
    print(f"Original CSS backup: {backup_path}")
    print("To restore: run this script again with --restore.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
