# abbasdeep

**Arabic-first Applio companion notebook for Google Colab.**

The main application now launches from the user's Google Colab notebook. The notebook prepares Applio in the runtime, syncs model/training folders with Google Drive, and displays the abbasdeep-branded interface inline in the notebook output. No private GPU server is needed.

## Main entry point

- Notebook: [notebooks/abbasdeep.ipynb](notebooks/abbasdeep.ipynb)
- Open in Colab: https://colab.research.google.com/github/dharymax/abbasdeep/blob/main/notebooks/abbasdeep.ipynb

## How it works

1. Open the notebook in your Google account.
2. Mount Google Drive when prompted.
3. Install the upstream Applio runtime in the Colab session.
4. Sync model/training folders with `MyDrive/abbasdeepBackup`.
5. Run the final cell. The Arabic, RTL, mobile-refined abbasdeep interface is displayed inline inside the notebook output.

The notebook uses the upstream Applio engine and UI builders, with an abbasdeep identity, Arabic language selection, RTL/mobile refinements, and inline notebook launch. The notebook itself is the main app entry; it does not ask you to paste a Gradio URL into an external website.

## Colab limitations and responsible use

Colab GPU availability and session duration are dynamic and not guaranteed. Its FAQ prohibits creating deepfakes on managed runtimes and notes that free sessions may be terminated when users bypass the notebook UI to use an external web UI for content generation. abbasdeep is therefore designed to display the interface inside the notebook.

Use only voice samples you own or are explicitly authorized to process. Do not impersonate people or mislead listeners. Do not use Colab for activities prohibited by its terms.

## Upstream

- [Applio](https://github.com/IAHispano/Applio)
- [Google Colab FAQ](https://research.google.com/colaboratory/faq.html)
- [Gradio share links](https://gradio.app/guides/understanding-gradio-share-links)

## Web launcher

The React/PWA in this repository is now a launchpad and guide. Audio processing and the Applio UI run inside the notebook runtime.
