---
title: Mosaic construction
description: Irregular tesserae remain visible from full artwork down to compact marks.
---

Greenways marks are made from **irregular interlocking tesserae**, not a regular pixel grid and not a flat silhouette.

## Canonical process

1. Define named semantic regions for the motif.
2. Generate a jittered Voronoi bed.
3. Clip the bed independently into each region.
4. Assign five hand-mixed shades per region.
5. Stroke each polygon with its own fill to hide antialiasing seams.
6. Fit the complete mark to the canvas.
7. Generate adaptive, light, and dark variants.

## Compact variants

Compact marks use a coarser tessellation pitch. They do **not** replace the mosaic with one flat fill. The larger pieces preserve the same construction while surviving at small sizes.

| Variant | Purpose |
| --- | --- |
| `project.svg` | Detailed adaptive mark |
| `project-light.svg` | Detailed fixed light palette |
| `project-dark.svg` | Detailed fixed dark palette |
| `project-small.svg` | Coarse adaptive mosaic |
| `project-small-light.svg` | Coarse fixed light mosaic |
| `project-small-dark.svg` | Coarse fixed dark mosaic |

## Grout

Canonical project marks are groutless smalti: pieces touch edge to edge. Presentation cards may place a mark on a mineral ground, but the exported mark remains transparent.

## Visual Language lotus

The three-petal lotus uses a dark left petal, mid-violet centre, and pale right petal. Internal Voronoi variation must remain visible at every exported size.

## Never use

- a single-colour fallback at small sizes;
- a regular square grid pretending to be mosaic;
- gradients inside individual tesserae;
- blurred glass effects in the mark itself;
- a background tile baked into canonical transparent assets.
