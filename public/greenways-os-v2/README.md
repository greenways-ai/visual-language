# Greenways OS v2 interface system

This directory is both a static website prototype and a loadable Manifest V3 extension.

## Open as a website

Serve this directory over HTTP and open `index.html`:

```bash
python3 -m http.server 8000 --directory public/greenways-os-v2
```

The main views are:

- `index.html` — interface and architecture overview
- `desktop.html` — full-page Frame / Workspace / Buffer / Pane environment
- `web.html` — public reader and lightweight publisher surface
- `popup.html` — toolbar launcher and installation health
- `sidepanel.html` — current-page capture, agents, approvals and receipts
- `options.html` — providers, custody, permissions and durable state
- `approval.html` — exact-scope human decision flow
- `sandbox.html` — isolated pure-operation package evaluator

## Load as a Chrome extension

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select `public/greenways-os-v2`.
5. Pin **Greenways OS v2** to the toolbar.

The extension intentionally does not override the New Tab page and requests no host permissions. The full desktop opens in a normal extension tab; the side panel remains the everyday browser companion.

## Architecture boundary

```text
Chrome extension = browser shell + browser capability provider
Greenways OS     = portable workspace model
optional daemon  = greenwaysd native capability provider
```

The Manifest V3 service worker only brokers events and reconstructs durable state. Sandboxed package logic receives serialised values and can request only declared pure operations. Privileged effects use named operations and scoped grants, then write receipts.
