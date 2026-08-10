---
title: Asset generation
description: Rebuild canonical marks, exploration studies, artwork derivatives, and social cards.
---

The repository keeps generators and generated assets together so visual changes can be reviewed as code and output.

## Canonical project marks

```bash
npm run assets
```

This generates detailed and coarse-mosaic variants for every named project in adaptive, light, and dark forms.

## Exploration studies

```bash
npm run sigils
```

This rebuilds the sixty-two-study catalogue and manifest under `site/sigils/`.

## Scene prompts

```bash
npm run prompts
```

The prompt composer produces scored day masters and locked night-edit instructions from `scene-language.js`.

Mosaic construction applies to built surfaces, architecture and crafted objects. Living animals remain photorealistic and biological rather than becoming tiled sculptures.

## Responsive artwork

```bash
npm run artwork:raster
```

This converts accepted native masters into desktop and 3:4 mobile WebP variants using the scene's focal crop.

## Social cards

```bash
npm run og
```

Open Graph cards combine a signature scene, veil, project mark, wordmark, and restrained project tagline at 1200×630.

## Review generated files

Generated assets are part of the pull request. Do not merge only the generator source when the canonical output is expected to change.
