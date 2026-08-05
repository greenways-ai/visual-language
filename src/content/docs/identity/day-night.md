---
title: Day & night
description: Adaptive themes represent two states of one place, not unrelated art direction.
---

Every major image can have a day and night master. The pair is locked spatially and changes through illumination, atmosphere, and natural behaviour.

## What remains fixed

- camera and lens;
- architecture and room proportions;
- furniture and object positions;
- landscape and paths;
- mosaic patterns;
- responsive focal region.

## What may change

- sunlight, moonlight, practical lamps, and reflections;
- weather or restrained atmospheric effects;
- the natural pose of the living subject;
- stated peripheral activity.

## Runtime selection

`ThemedArtwork.astro` exposes light, dark, and mobile sources through CSS custom properties. The shared theme event updates accessible labels when the page theme changes.

```astro
<ThemedArtwork
  light="/artwork/hoplite/open-gate-day.webp"
  dark="/artwork/hoplite/open-gate-night.webp"
  lightMobile="/artwork/hoplite/open-gate-day-mobile.webp"
  darkMobile="/artwork/hoplite/open-gate-night-mobile.webp"
  lightAlt="A rabbit paused in a cyan mosaic gate by day"
  darkAlt="A rabbit sheltered inside the same gate at night"
/>
```

## Avoid

A dark overlay on the day image is not a night master. Night requires local light sources, changed reflections, credible shadow, and a naturally different state.
