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
| Tahto | Aubergine, crimson violet, ruby, orchid magenta | Iridescent smalti, rose quartz, warm oxidised silver, dark water, living reeds |
| Ignatius | Obsidian, charcoal, ochre, yellow | Black basalt, yellow glass, gold smalti, blackened steel |
| Visual Language | Emerald, turquoise, sapphire | Peacock glass, warm ivory ground, deep teal stone and restrained gold |
| Statstrade | Legion red, oxblood, bronze | Red smalti, basalt, travertine, porphyry, bronze |

## Accent ramps

A ramp contains real tonal separation. Adjacent steps should remain distinguishable when used as neighbouring mosaic regions.

```css
:root[data-project="visual-language"] {
  --gw-accent-1: #0b4e41;
  --gw-accent-2: #087f72;
  --gw-accent-3: #19b7b7;
  --gw-accent-4: #1855a3;
  --gw-accent-5: #e4c778;
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
