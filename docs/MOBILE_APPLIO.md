# Applio on mobile — compatibility and styling

## Upstream audit

The upstream Applio web interface is a Gradio app. In the current upstream source:

- `app.py` builds the interface with `gr.Blocks` and loads `stylesheet()` from `assets/app_shell.py`.
- `assets/app_shell.py` loads `assets/ui/shell.css`.
- The upstream stylesheet already has a mobile breakpoint at 800px: the side navigation becomes a collapsible menu, navigation becomes a three-column grid, and content takes the available width.
- At 680px, selected output panels collapse to a single column.

The abbasdeep patch adds narrower-screen safeguards: horizontal tab scrolling, larger touch targets, 16px form text to avoid browser auto-zoom, less horizontal overflow, and safe-area-aware notifications.

## Google Colab Free limitation

Google's Colab FAQ states that free managed runtimes may be terminated for bypassing the notebook UI to interact primarily through an external web UI. It specifically calls out this pattern for content-generation workloads.

Therefore:
- For a free managed Colab session, keep the Colab notebook as the primary interaction surface and follow the notebook's intended workflow.
- Do not treat an external Gradio share page embedded in abbasdeep as a supported free-Colab mode.
- The optional CSS patch is for a local/self-managed runtime, or another runtime/account where external Applio web UI use is permitted.

Reference: https://research.google.com/colaboratory/faq.html

## Apply the optional CSS patch

The patch does not alter Applio's training, conversion, model loading, or Python backend. It only appends responsive CSS to the upstream shell stylesheet.

1. Clone Applio from its official repository.
2. Keep the `patches/` and `tools/` folders from this abbasdeep repository alongside each other.
3. Run:

```bash
python tools/apply_mobile_css.py --applio-dir /path/to/Applio
```

4. Restart the Applio UI.

The script creates `assets/ui/shell.css.abbasdeep-backup` and is idempotent. To restore the original stylesheet:

```bash
python tools/apply_mobile_css.py --applio-dir /path/to/Applio --restore
```

## Mobile browser recommendations

- Use a current mobile browser.
- Keep browser zoom at 100%; the patch uses 16px form text to prevent automatic input zoom.
- Use portrait orientation for ordinary conversion forms.
- Rotate to landscape if a graph or dense panel is still cramped.
- Allow microphone permission only when using Applio's real-time features and only on a trusted session.
- Gradio share links are public URLs; do not expose sensitive files or leave a session running unnecessarily.

## What the patch does not do

- It does not embed the Gradio app in abbasdeep.
- It does not keep Colab sessions alive or increase quotas.
- It does not make a free Colab external-UI workflow compliant.
- It does not transfer selected files from the abbasdeep browser page into the Colab runtime.
