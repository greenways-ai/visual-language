# Greenways OS neutral-surface retrofit

Issue: `greenways-ai/visual-language#41`

## Protected rule

The Greenways interface is neutral. The Greenways mark is peacock-coloured. Peacock colour acts as a restrained identity or interaction signal, not as an ambient structural field.

## Shared v2 authority

The atlas imports `src/v2/greenways-os-neutral.css` last. That bridge maps the historical `--gw2-*` vocabulary onto the protected Greenways v2 roles:

| Historical role | Protected v2 authority |
| --- | --- |
| canvas and background | `--gw-v2-canvas*` |
| field, panel and overlay | `--gw-v2-surface*` |
| border and divider | `--gw-v2-seam*` |
| text hierarchy | `--gw-v2-text*` |
| selection and command | `--gw-v2-signal*` |
| focus | `--gw-v2-focus-ring` |
| success, warning and danger | `--gw-v2-state-*` |
| peacock identity | `--gw-v2-brand-*` |

The bridge owns no literal colour values. Light and dark mode therefore inherit the same structural hierarchy directly from the shared v2 token contract.

## Atlas coverage

The active adoption layer now covers the complete five-surface atlas while preserving its established information and capability boundaries:

- **Native desktop:** title bar, activity rail, buffer list, room rail, editor field, inspector, command surface, briefing, mode line, and status treatment.
- **Browser desktop:** neutral browser chrome, extension context bar, workspace panes, action controls, and host framing.
- **Browser side panel:** neutral host page, page navigation, code/table examples, companion panel, tabs, receipts, and approvals.
- **Compact popup:** neutral browser context, launcher field, health/status treatment, actions, and footer.
- **Public web:** neutral navigation, hero chrome, proof section, world cards, workspace section, and footer; publication and world artwork remains free to carry rich colour.

The first visual impression across native desktop, browser desktop, side panel, popup, and public web is now graphite/paper rather than dark teal or pale green.

## Colour roles

### Identity

The Greenways mosaic mark uses `--gw-v2-brand-spectrum` and remains the strongest multicolour moment. Small application identifiers may use emerald, aqua, sapphire, violet, or restrained mixes from that protected family.

### Interaction

Ordinary primary commands, active navigation, links, selected states, and branch/context markers use the sapphire-led `--gw-v2-signal` family. They no longer borrow success green.

### Semantic state

Success, warning, danger, offline, and approval treatments remain separate semantic roles and retain adjacent text, icon, count, or shape cues. No required action or authority claim depends on colour alone.

## Correct use

Peacock colour may appear in:

- the Greenways mosaic/peacock mark;
- a selected navigation or object marker;
- focus rings;
- a primary command;
- links, small badges, chart emphasis, and signal details;
- publication and world artwork, where colour belongs to the content rather than interface chrome.

## Incorrect use

The following remain forbidden in active interface chrome:

- green-, aqua-, blue-, or violet-tinted global canvases;
- coloured broad rails, title bars, work areas, panels, or dialogs;
- page-wide peacock gradients;
- success green used as a general Greenways brand atmosphere;
- state or authority claims communicated by colour alone.

## Source ownership

Host-specific stylesheets continue to own composition, density, responsive collapse, and surface boundaries. The final bridge owns theme and colour authority. Historical colour declarations earlier in the cascade are no longer active; removing those redundant declarations can follow visual comparison without changing the rendered contract.

## Remaining validation

1. Review generated light and dark screenshots for every atlas route at desktop, 980px, 680px, 390px, and 320px where applicable.
2. Confirm focus-visible, keyboard traversal, reduced motion, non-colour state cues, contrast, and document overflow against the rendered build.
3. Apply the same protected role boundary separately to the earlier seven-application Greenways exploration if that historical route remains an active adoption target.

This work changes visual treatment only. Host responsibilities, capability boundaries, keyboard interactions, responsive collapse, and runtime behaviour remain unchanged.
