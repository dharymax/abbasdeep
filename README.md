# abbasdeep

**A mobile-first Arabic companion for the existing Applio + Google Colab workflow.**

This repository contains the first runnable web/PWA interface for **abbasdeep**. It is a mobile-friendly companion shell; Applio remains the audio engine and Google Colab remains the execution environment.

## Included in this first milestone

- Arabic-first RTL responsive dashboard.
- Navigation for conversion, training, voice library, and setup guide.
- One-tap launch of the official Applio Colab notebook.
- Local audio preview before handing the workflow to Applio.
- Dedicated "Connect project" screen: save an Applio `.gradio.live` URL and launch it in the current browser tab or a new tab.
- PWA manifest, app icon, and a small offline app-shell cache.

## Important integration boundary

abbasdeep does **not** control a Colab runtime, mount Drive, upload training files to Colab, or perform voice conversion itself yet. Google sign-in, Drive authorization, notebook execution, and the Applio runtime remain in Google's/Applio's own interfaces. The app never asks for a Google password, browser cookie, OAuth token, or Colab session credential.

The app does not proxy the Gradio session. It opens the supplied share URL directly in the current or a new browser tab. Official Gradio embedding instructions cover Hugging Face Spaces or a server you own; they do not guarantee embedding a temporary `.gradio.live` share URL. Google Colab Free may terminate sessions that bypass the notebook UI to interact primarily through an external web UI, so this is not presented as a guaranteed or policy-approved Colab Free workflow. See [the connection guide](docs/MOBILE_APPLIO.md).

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
