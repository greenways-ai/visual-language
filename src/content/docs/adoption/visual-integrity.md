---
title: Visual integrity
description: Automated checks keep the shared system from quietly fragmenting.
---

Visual integrity complements visual review. It protects rules that can be expressed deterministically.

## Current checks

- required package exports;
- canonical project motifs;
- adaptive and fixed-mode sigil variants;
- Voronoi tesserae in detailed and compact marks;
- transparent canonical mark backgrounds;
- contrast of essential foreground/background pairs;
- day/night artwork counts and mobile derivatives;
- semantic control tokens;
- documentation interaction contracts;
- Statstrade's feed/world and no-robot rules.

## Run locally

```bash
npm test
```

The test command regenerates canonical favicons first, then executes the Node test suite.

## Reusable workflow

Projects can call `.github/workflows/visual-integrity.yml` with their project name, site root, and favicon path.

## What tests cannot decide

Automation cannot determine whether an environment feels luxurious, whether the subject behaves naturally, whether an image is visually repetitive, or whether a composition communicates the product. Those remain review responsibilities.
