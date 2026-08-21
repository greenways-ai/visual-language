# Greenways v2 delicate material calibration

Primary issue: `greenways-ai/visual-language#41`

Reference implementation: `agent/v2-delicate-material-41`

## Direction

The active `/v2/` family now treats the originating
`/concepts/greenways-v2/` atlas as the material reference as well as the
composition reference.

The qualities being carried through the site are:

- smaller editorial and interface typography;
- compact monospaced labels;
- fine neutral seams rather than heavy container borders;
- rounded cards, frames, controls and menus;
- subtle paper, point and grid patterning;
- one compact global menu with direct routes and a complete index behind it;
- quiet shadow and elevation;
- peacock colour used as a precise thread rather than a broad atmosphere; and
- complete application specimens shown inside calm neutral chrome.

The result is deliberately adjacent to the density and calm-surface grammar of
`hara-lang/visual-language`, but it does not copy Hara branding. Greenways keeps
its own display face, mosaic mark, peacock spectrum, application signals and
spatial product language.

## Current product law

The foreground application surface remains exactly:

```text
Spaces    understand
Flow      coordinate
```

Foreman remains Flow's internal engine. System surfaces remain subordinate.
Imagine and World remain unactivated and absent from current product
navigation. No visual calibration changes record ownership, authority,
freshness, evidence, handoff or external-truth semantics.

## Shared implementation

`CatalogueShell.astro` emits one late, site-only calibration:

```text
src/v2/catalogue-material.css
```

It is emitted after route-specific styles, including the public Fabric homepage
calibrations. This makes the material grammar apply to every route rendered by
`CatalogueShell` without requiring application laboratories to copy another
stylesheet.

The cascade is scoped to:

```text
body.gw-v2-catalogue[data-gw-v2-material="delicate"]
```

It does not change the exported package entry points in `package.json` and does
not alter the reusable `tokens.css`, `document.css`, `workbench.css` or
`contract.js` interfaces consumed downstream.

## Type and density

The site calibration uses:

- `15px` base interface type;
- `11px` small labels and metadata;
- compact body leading;
- smaller display clamps;
- reduced spacing steps; and
- application-workbench headings that stay below editorial-page headings.

The type hierarchy remains the Greenways hierarchy:

```text
display     Marcellus
body        Manrope
code/meta   IBM Plex Mono
```

## Corners and seams

The active material scale is:

```text
control     8px
card        12px
frame       14px
menu        14px
```

Cards and panes use fine semantic seams and little or no drop shadow. Hover and
focus strengthen the seam before adding elevation. Rounded treatment does not
turn status, authority or selection into decorative pills.

## Pattern and colour

Neutral point and grid patterns provide texture to canvases, maps, previews,
viewport fields and system diagrams. They are built entirely from shared
semantic seam roles.

Peacock colour is reserved for bounded identity moments. The Greenways spectrum appears in:

- the mosaic mark;
- a one-pixel thread on the floating atlas frame;
- current quick-navigation underline;
- a fine edge on selected cards;
- compact application and surface code marks; and
- content imagery and diagrams where colour is the subject.

The global canvas, broad sidebars, work areas, panels and tables remain neutral.
Semantic success, warning, danger and uncertainty colours remain independent of
the peacock identity spectrum.

## Menu system

The global frame now has two levels:

1. a direct compact menu for **Overview, Foundations, Library, Spaces and
   Flow**; and
2. an **Atlas index** pane containing the complete typed catalogue, child
   routes, maturity and ownership metadata.

The direct menu is always a navigation aid. It does not imply application
installation or runtime authority. The complete index remains keyboard
addressable, closes on Escape and returns focus to its trigger.

Route breadcrumbs, family siblings, maturity, ownership, issue references and
the local section menu remain available as a quiet folio below and beside the
specimen.

## Route-family coverage

The late calibration covers:

- the `/v2/` atlas front door;
- Foundations;
- Library, components and workflow studies;
- the current Greenways Suite;
- Spaces desktop and companion compositions;
- Flow browser, CLI, handoff and Foreman laboratories;
- Greenways Platform homepage and public-work specimens;
- planned and historical catalogue routes rendered by the shared shell; and
- shared tables, code panels, forms, states, neighbours and footers.

Application-specific information architecture remains application-owned. The
shared calibration changes scale, material and menu hierarchy only.

## Responsive behavior

The direct menu remains visible as a compact horizontal strip through tablet
widths, then yields to the Atlas index on phones. The index becomes a nearly
full-viewport pane without document overflow.

The calibration explicitly covers:

```text
78rem
61.25rem
52.5rem
42.5rem
26.25rem
20rem
```

At `320px`, the brand, Atlas trigger, theme control, route identity and local
section access remain available without preserving desktop-only width
constraints.

## Accessibility and motion

- keyboard focus uses a two-pixel visible ring;
- the Atlas index retains native `details` semantics;
- Escape closes the index and restores trigger focus;
- selected routes use text, position, seam and underline in addition to colour;
- reduced motion removes transition and animation duration; and
- no required state or action depends on the new patterning.

## Runtime boundary

This is a static Visual Language calibration. It does not connect application
launch, capture, approval, handoff, claim, execution, publication, provider
effects or external read-back.

## Validation

```bash
node --test test/v2-delicate-material.test.mjs
npm test
npm run build
```

The focused gate checks:

- late shell-wide stylesheet emission;
- compact direct navigation and complete Atlas index coexistence;
- smaller type and rounded material roles;
- neutral structural patterning and bounded peacock threads;
- absence of local literal colour values;
- current Spaces/Flow product exposure;
- responsive and reduced-motion coverage; and
- the site-only package boundary.
