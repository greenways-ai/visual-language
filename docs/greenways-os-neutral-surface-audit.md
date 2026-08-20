# Greenways OS neutral-surface retrofit

Issue: `greenways-ai/visual-language#41`

## Protected rule

The Greenways interface is neutral. The Greenways mark is peacock-coloured. Peacock colour acts as a restrained identity or interaction signal, not as an ambient structural field.

## Slice 1: shared shell neutralisation

This pull request introduces a final structural bridge from the historical `--gw2-*` vocabulary to the protected Greenways v2 token roles:

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

The bridge is imported last by `greenways-os-v2.css`, making it the active structural authority while preserving the host-specific desktop, extension, side-panel, popup and web layouts.

## Correct use

Peacock colour may appear in:

- the Greenways mosaic/peacock mark;
- selected navigation or object markers;
- focus rings;
- the primary command signal;
- links, small badges, chart emphasis and signal details.

Semantic success, warning and danger remain separate from the brand family and include visible text or shape cues.

## Incorrect use

The following remain forbidden in active interface chrome:

- green-, aqua-, blue- or violet-tinted global canvases;
- coloured broad rails, title bars, work areas, panels or dialogs;
- page-wide peacock gradients;
- success green used as a general Greenways brand atmosphere;
- state or authority claims communicated by colour alone.

## Remaining slices

1. Audit and clean route-specific decorative fields and broad gradients across all five historical host-surface studies.
2. Apply the same token-role boundary to the earlier seven-application Greenways product exploration.
3. Validate screenshots in both themes at desktop, 980px, 680px, 390px and 320px, then record any explicit artwork/content exceptions.

This work changes visual treatment only. Host responsibilities, capability boundaries, keyboard interactions, responsive collapse and runtime behaviour remain unchanged.
