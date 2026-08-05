---
title: Colour & material
description: Project palettes are named material families rather than generic brand swatches.
---

Each project owns a five-step accent ramp and a material vocabulary. The ramp drives sigils, focus states, active controls, diagrams, and restrained highlights.

## Project families

| Project | Accent family | Material direction |
| --- | --- | --- |
| Greenways | Emerald, verdigris, turquoise | Glass smalti, ivory limestone, living trees, pale gold |
| Hestia | Garnet, oxblood, ember | Red glass, black onyx, brushed brass, velvet |
| Hoplite | Cyan, teal, ice | Cyan glass, pale stone, dark green marble, clipped foliage |
| Historia | Lapis, midnight, cyan | Lapis smalti, black marble, ivory, gold leaf |
| Hodos | Malachite, celadon, pearl | Mother-of-pearl, green glass, silk, aged mirror |
| Visual Language | Amethyst, violet, lilac | Purple smalti, warm mineral ground, dark plum stone |
| Statstrade | Legion red, oxblood, bronze | Red smalti, basalt, travertine, porphyry, bronze |

## Accent ramps

A ramp contains real tonal separation. Adjacent steps should remain distinguishable when used as neighbouring mosaic regions.

```css
:root[data-project="visual-language"] {
  --gw-accent-1: #452a5e;
  --gw-accent-2: #5e3680;
  --gw-accent-3: #764a98;
  --gw-accent-4: #9367c5;
  --gw-accent-5: #b899da;
}
```

## Grounds and surfaces

Use calm mineral grounds around detailed imagery. Light mode favours warm ivory and pale stone rather than pure white. Dark mode uses near-black mineral tones rather than blue-black SaaS gradients.

## Metallic accents

Gold and bronze indicate resolution, craft, or structure. They are not default button colours. Reserve them for meaningful architectural or editorial moments.

## Avoid

- neon gradients without material cause;
- one accent colour covering every surface;
- fake glassmorphism as a substitute for depth;
- sepia filters applied to otherwise modern imagery;
- decorative texture behind small body text.
