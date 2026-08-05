# Greenways brand assets

The Greenways names, wordmarks, mosaic marks, the Statstrade name and angular S mark, and original Greenways or Statstrade world artwork are not licensed under Apache-2.0. All rights in those brand assets are reserved by Greenways Pty Ltd.

The software and documentation used to render and operate the visual language are licensed under Apache-2.0 as described in `LICENSE`.

## Mosaic invariant

The irregular Voronoi/smalti mosaic is part of every Greenways project mark. It is not a decorative effect that may be removed for compact icons.

Canonical SVGs live in `assets/favicons` and are published at `/visual-language/favicons/` on `oss.greenways.ai`:

- `<project>.svg` is the adaptive detailed mosaic.
- `<project>-light.svg` and `<project>-dark.svg` are fixed-theme detailed mosaics.
- `<project>-small.svg` is an adaptive coarser mosaic for compact uses.
- `<project>-small-light.svg` and `<project>-small-dark.svg` are fixed-theme coarser mosaics.

Small variants use larger tesserae, but never collapse the mark to a flat path. Site logos should use the shared `Sigil.astro` component rather than redrawing or simplifying a project mark.

## Canonical project motifs

| Project | Motif | Exploration study |
| --- | --- | --- |
| Greenways | Peacock eye shield | `peacock-eye-shield` |
| Hestia | Eight-point star | `star-eight` |
| Hoplite | Star compass | `star-compass` |
| Historia | Mountains | `mountain-pair` |
| Hodos | Double ring | `ring-double` |
| Visual Language | Lotus · three petals | `lotus-three` |

The shared sigil generator is the source of truth for detailed, fixed-theme, and compact variants.

## OSS header contract

Documentation sites under `oss.greenways.ai/*` should use `DocumentationHeader.astro`, following Hoplite's wrapper pattern. The standard bar includes:

- the mosaic project switcher;
- the project title and home link;
- a single documentation link;
- shared documentation search; and
- the one-press theme control.

Project repositories should configure only their project id, title, base path, documentation path, and search path. They should not fork the menu layout or provide a separate flat logo.
