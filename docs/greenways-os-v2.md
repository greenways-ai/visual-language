# Greenways OS v2: desktop, browser and publishing interfaces

## Decision

Greenways OS v2 is a portable programmable workspace expressed through three different instruments:

1. **Desktop frame** — the complete environment for composing, coordinating and publishing work.
2. **Chrome extension** — the browser shell and browser capability provider.
3. **Web surface** — the public reading, discovery and lightweight publisher interface.

The extension is the initial distribution vehicle, but it is not the boundary of the system. The same workspaces, buffers, objects, grants, providers and receipts survive outside Chrome.

## From desktop imitation to programmable frame

The existing Greenways concept establishes a persistent menu bar, dock and application window. V2 keeps the seven product applications but changes the primary composition to:

```text
Frame
├── Workspaces
├── Buffers
├── Split panes
├── Object inspector
├── Command palette
└── Capability/status line
```

This is closer to Emacs than macOS. The browser already supplies tabs and windows, so Greenways does not create a second freely overlapping window manager inside a tab.

The seven applications remain:

- Today
- Workrooms
- Studio
- Campaigns
- Packages
- Keyring
- Receipts

They are views over common objects rather than isolated products. Selecting a campaign buffer opens Campaigns; a package buffer opens Packages; a receipt trace opens Receipts. Authority and provenance remain visible in the shared inspector.

## Chrome surface contract

### Full-page desktop

`desktop.html` is the primary operating environment. It contains virtual workspaces, open buffers, navigator and editor panes, inspector tabs, a global command palette, provider status and the complete seven-application suite.

### Persistent side panel

`sidepanel.html` is tied to current browser context. It can:

- save the current page as a source object;
- add the source to a workroom;
- submit bounded work to an agent;
- inspect source and provenance information;
- approve or deny named capability requests;
- review agents and receipts;
- open the object in Studio.

### Toolbar popup

`popup.html` remains deliberately small. It shows provider health, approval/agent/receipt counts and four launcher actions. It does not attempt to compress the desktop into a popup.

### Settings and approval

`options.html` makes provider status, browser/native custody, confirmation policy, storage boundaries and package execution classes explicit. `approval.html` shows the exact actor, named operation, object scope, grant, provider, duration and future receipt before a human decision.

### Manifest V3 background

`service-worker.js` is an event broker, not an in-memory operating-system kernel. It stores serialisable state, rehydrates it on demand, handles commands and context-menu effects, opens surfaces, captures the active tab and resolves approvals.

The manifest intentionally has:

- no New Tab override;
- no host permissions;
- no remote code;
- only `activeTab`, `contextMenus`, `sidePanel` and `storage` permissions;
- one explicitly sandboxed page.

## Capability and package boundary

The bundled sandbox accepts only declared pure operations:

```text
document/transform
package/inspect
text/summarise
```

It has no direct `chrome.*` path. Privileged work is represented as named requests such as:

```clojure
{:op :browser/capture
 :grant :grant/capture-current-page
 :input {:tab-id 381}}

{:op :keyring/sign
 :grant :grant/publish-release
 :input {:digest "..."}}

{:op :filesystem/write
 :grant :grant/workroom-source
 :input {:path "release/manifest.hal"
         :content "..."}}
```

The broker checks authority, invokes the relevant provider and records a receipt. Package classes stay explicit:

| Package kind | Execution class |
| --- | --- |
| Theme, data, manifest | Declarative data |
| Document transformation | Bundled Hara pure sandbox |
| UI contribution | Declarative component specification |
| Privileged provider | Bundled with reviewed extension release |
| Native provider | Optional `greenwaysd` native messaging host |
| Remote provider | API call; logic runs remotely |

## Custody and durable state

Browser custody covers encrypted extension-local keys, session credentials, provider OAuth and lower-value signing. Native custody covers publisher master identity, recovery material, OS-keychain access and unattended signing policy through optional `greenwaysd`.

Storage is divided by responsibility:

| Store | Responsibility |
| --- | --- |
| `chrome.storage.local` | installation state, grants, provider metadata, recent indexes |
| sync preference layer | theme, device preferences, selected providers, small pointers |
| IndexedDB / Hestia | original documents, chats, releases, media, artefacts, receipt evidence |
| `greenwaysd` | native files, repositories, keychain secrets, long-running jobs |

## Public web surface

`web.html` has two modes. Reader mode presents a calm publication with author identity, portable formats and a concise derivation chain. Publisher mode provides release status and aggregate signals while directing full composition back to Studio. The public surface can save clippings, add sources to workrooms and inspect receipts without exposing private workspace detail.

## Prototype paths

- `/greenways-os-v2/`
- `/greenways-os-v2/desktop.html`
- `/greenways-os-v2/web.html`
- `/greenways-os-v2/popup.html`
- `/greenways-os-v2/sidepanel.html`
- `/greenways-os-v2/options.html`
- `/greenways-os-v2/approval.html`
- `/greenways-os-v2/sandbox.html`
- `/concepts/greenways-v2/` redirects to the interface overview.
