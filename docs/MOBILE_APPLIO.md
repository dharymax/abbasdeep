# abbasdeep Colab runtime

## Intended workflow

The main application is the Gradio interface rendered inline by the Colab notebook, not an external website embedding a `.gradio.live` URL.

1. Open `notebooks/abbasdeep.ipynb` using the Google Colab link in the repository README.
2. Run the Drive mount cell and authorize the account.
3. Run the setup cell; it downloads Applio and its dependencies into the Colab runtime.
4. Run the Drive synchronization cell.
5. Run the branding/mobile setup cell.
6. Run the final cell. The Gradio interface is launched with `inline=True`, so Colab displays it in the notebook output.

A Gradio share URL may also appear in the cell output. It is not required to use the embedded notebook interface. Do not make a free Colab runtime primarily operate through a separate external web UI.

## What is customized

- Product name and logo changed to abbasdeep in the interface.
- Arabic language selection enabled through Applio's existing `ar_AR` translation.
- RTL layout adjustments.
- Mobile menu, touch target, tab overflow, input size, and output-grid refinements.
- Models and training logs synchronized with `MyDrive/abbasdeepBackup`.

## Limitations

- This notebook does not create a permanent backend or guarantee GPU availability.
- Colab may terminate sessions due to dynamic limits, idle timeouts, or its usage policy.
- Google Colab managed runtimes prohibit creating deepfakes. Use only permitted, non-deceptive processing and obey Colab's terms.
- The notebook must remain the primary interface for this free-runtime workflow.

See [Google Colab FAQ](https://research.google.com/colaboratory/faq.html).
