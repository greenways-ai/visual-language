---
title: Theme tokens
description: Semantic variables connect project palettes to interface behaviour.
---

## Core surfaces

| Token | Meaning |
| --- | --- |
| `--gw-canvas` | Page background |
| `--gw-surface` | Primary raised surface |
| `--gw-surface-muted` | Secondary or quiet surface |
| `--gw-text` | Primary text |
| `--gw-text-muted` | Supporting text |
| `--gw-line` | Quiet division |
| `--gw-line-strong` | Interactive or structural border |
| `--gw-header` | Translucent sticky header surface |

## Project accents

`--gw-accent-1` through `--gw-accent-5` form the named project ramp. `--gw-focus` must remain visible against both canvas and control surfaces.

## Controls

- `--gw-control-bg`
- `--gw-control-text`
- `--gw-control-hover`

## Sigils and artwork

- `--gw-sigil-ground`
- `--gw-sigil-grout`
- `--gw-art-veil`

## Theme state

The resolved state is stored on `document.documentElement.dataset.theme`. The preference is stored separately as `data-theme-preference` so Auto can remain selected while the resolved theme follows the operating system.
