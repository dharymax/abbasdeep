# abbasdeep

**A mobile-first Arabic companion for the existing Applio + Google Colab workflow.**

This repository contains the first runnable web/PWA interface for **abbasdeep**. It is a mobile-friendly companion shell; Applio remains the audio engine and Google Colab remains the execution environment.

## Included in this first milestone

- Arabic-first RTL responsive dashboard.
- Navigation for conversion, training, voice library, and setup guide.
- One-tap launch of the official Applio Colab notebook.
- Local audio preview before handing the workflow to Applio.
- Optional manual opening of an Applio Gradio share URL on its own page.
- PWA manifest, app icon, and a small offline app-shell cache.

## Important integration boundary

abbasdeep does **not** control a Colab runtime, mount Drive, upload training files to Colab, or perform voice conversion itself yet. Google sign-in, Drive authorization, notebook execution, and the Applio runtime remain in Google's/Applio's own interfaces. The app never asks for a Google password, browser cookie, OAuth token, or Colab session credential.

The first milestone intentionally uses an explicit browser hand-off. Automatic embedding/proxying of a Colab-hosted Gradio interface is not assumed: it must be tested against current Colab policies, Gradio/browser framing restrictions, and the session's actual behavior before being implemented.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Install as an app

After deploying the production build over HTTPS, open it in a supported mobile browser and choose **Add to Home Screen / Install app**. Capacitor packaging can be added after the web flow is stable.

## Upstream links

- [Applio source](https://github.com/IAHispano/Applio)
- [Official Applio Colab notebook](https://colab.research.google.com/github/iahispano/applio/blob/main/assets/Applio.ipynb)
- [Google Colab FAQ and usage limits](https://research.google.com/colaboratory/faq.html)

## Responsible use

Use voice models only for voices you own or have explicit permission to use. Do not use generated or converted audio to impersonate someone or mislead listeners.


## Mobile Applio interface

The upstream Applio Gradio interface already includes responsive breakpoints. An optional additive CSS patch and a safe apply/restore script are included under `patches/` and `tools/`. See [the mobile compatibility notes](docs/MOBILE_APPLIO.md). The patch is intended only for a runtime where external web UI use is permitted; Colab Free must remain notebook-first.
