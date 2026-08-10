---
title: Generators
description: Source files and commands behind the asset catalogue.
---

| Source | Purpose |
| --- | --- |
| `bin/smalti.mjs` | Voronoi bed, colour variation, clipping, fitting, and SVG rendering |
| `bin/sigil-studies.mjs` | Sixty-two named geometries and palettes |
| `bin/generate-v3-favicons.mjs` | Canonical project mark variants |
| `bin/generate-sigil-explorations.mjs` | Exploration catalogue and manifest |
| `bin/compose-scene-prompts.mjs` | Day-master and night-edit prompt review |
| `bin/build-raster-artwork.mjs` | Desktop and mobile WebP derivatives |
| `bin/generate-og-images.mjs` | Social preview cards |
| `bin/gw-visual-audit.mjs` | Consumer-project integrity audit |

## Determinism

Sigil generation uses a fixed seed. The same source geometry and palette produce reviewable output rather than a new random mark on each run.

## Geometry

Study regions may be SVG path strings or even-odd compound paths. Fine details can be designated as flat within a detailed mark, but the compact mark as a whole remains a coarse mosaic.
