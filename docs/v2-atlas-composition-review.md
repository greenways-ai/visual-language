# Greenways v2 atlas composition review

Primary implementation issue: `greenways-ai/visual-language#41`

Related work:

- `greenways-ai/visual-language#30` — Greenways v2 visual language epic
- `greenways-ai/visual-language#39` — final visual validation
- `greenways-ai/visual-language#58` — current Spaces and Flow suite
- `/concepts/greenways-v2/` — originating host-atlas composition
- `/v2/` — current executable catalogue

## Decision

The originating Greenways V2 concept is the composition reference for the active `/v2/` site.

This does **not** restore its historical product taxonomy. The current product contract remains:

```text
Spaces    understand
Flow      coordinate
```

The reference is visual and compositional:

- one compact global bar;
- a strong, spatial opening composition;
- numbered editorial chapters;
- full-scale host or product specimens;
- restrained metadata;
- neutral paper/graphite structure;
- the Greenways mosaic as the strongest multicolour moment;
- small durable application signals;
- deliberate responsive recomposition rather than card compression.

## Review findings

### 1. The catalogue chrome had become the primary interface

The active shell stacked:

1. global catalogue header;
2. expandable route taxonomy;
3. breadcrumb and parent route bar;
4. sibling route tabs;
5. route status and ownership badges;
6. local section navigation;
7. previous/next page cards;
8. global footer.

Each part was individually useful. Together they framed every specimen as documentation inside documentation. The originating concept instead keeps one compact bar and lets the composition own the viewport.

**Resolution:** retain every navigation and truth function, but move catalogue taxonomy into an overlay atlas index, compress route context into a folio strip, and make local section navigation a bounded floating control.

### 2. The `/v2/` homepage treated every route as equal-weight inventory

The former homepage opened with a generic catalogue statement and repeated a card for every route. It communicated completeness, but not visual hierarchy or current product identity.

**Resolution:** replace the route-card wall with:

- an immersive visual-system map;
- a direct Spaces and Flow application plane;
- numbered visual-layer chapters;
- route rows subordinate to chapter composition;
- explicit composition laws and starting points.

All typed manifest routes remain discoverable.

### 3. Suite pages repeated product identity before reaching the specimen

The current suite mounted a page hero, application launcher, screen navigation and then the actual host study. These were laid out as three similarly weighted horizontal sections. The result felt like a catalogue entry rather than a product atlas.

**Resolution:** compose the page as:

- a large suite system map with the Fabric at the centre;
- Spaces and Flow as the only foreground application nodes;
- a restrained application rail;
- numbered host-surface navigation;
- the existing detailed specimen at full width.

No current record owner, state law, host boundary or static-runtime disclaimer changes.

### 4. Neutrality was present in tokens but weakened by component density

The v2 palette already follows the neutral-surface contract. The loss of elegance came less from colour than from:

- too many borders in the first viewport;
- repeated small metadata labels;
- equal-weight cards;
- insufficient negative space before dense workbench content;
- navigation occupying the same visual plane as the specimen.

**Resolution:** preserve semantic tokens and reduce structural competition. Peacock signals identify the mark, selection and application ownership; semantic state colours remain separate.

## Route-family review

| Surface family | Finding | Atlas treatment |
| --- | --- | --- |
| `/v2/` | Inventory-first opening | Immersive system map, application plane and numbered chapters |
| Foundations | Good content, over-framed by catalogue chrome | Compact global frame; content becomes the main chapter |
| Library and components | Component specimens need breathing room | Full-width route body; metadata moves to atlas index and folio |
| Workflows and evidence | Dense content is appropriate after an editorial threshold | Keep density; strengthen section transitions |
| Current Greenways suite | Strong underlying specimens, repetitive wrapper | Fabric orbit, application rail, numbered surface navigation |
| Spaces desktop | Host-scale composition should dominate | Preserve the workbench; remove catalogue-card feeling |
| Flow browser | Project Control Room should read as an application | Preserve truth lanes; give it the full specimen plane |
| Companion and CLI | Compact surfaces should not inherit desktop framing | Keep bounded host proportions within the common atlas chapter |
| Greenways Platform homepage | Already has route-specific editorial calibration | Shared atlas shell remains quiet around it |
| Foreman studies | Active parallel work must not be overwritten | Shared shell only; no Foreman workbench files changed |
| Historical concepts | Valuable design lineage, not current product identity | Linked as origin studies and labelled by catalogue ownership |

## Composition laws

### Law 1 — The specimen leads

A route opens as the thing being studied. Catalogue ownership, maturity and issue identity remain available without occupying the principal visual plane.

### Law 2 — One bar, one folio, one optional index

The persistent shell has three jobs:

- identify Greenways Visual Language;
- disclose current route context;
- open the atlas index.

It is not a permanent sitemap.

### Law 3 — Chapters establish pace

Large headings and numbered transitions introduce a change in layer, host or application. Dense workbench material begins only after the user understands the composition.

### Law 4 — Applications retain distinct spatial grammar

Spaces and Flow use the same tokens and cross-application reference laws. They do not become identical dashboards.

### Law 5 — Product truth is not visual decoration

Current application identity, semantic state, ownership, freshness, authority and external truth remain distinct. No visual simplification may merge those claims.

### Law 6 — Compact hosts recompose

At 980px, 680px, 420px and 320px, layouts change hierarchy rather than merely shrinking. Orbit maps simplify, application rails stack, chapter rows become linear and navigation moves to bounded overlays.

## Implementation boundary

This pass changes shared composition and presentation only.

It does not:

- add a third current application;
- activate Imagine or World;
- change Spaces or Flow record ownership;
- change handoff lifecycle or authority;
- connect any static specimen action;
- alter Foreman execution or workbench logic;
- remove typed catalogue routes, status or issue metadata.

## Acceptance checklist

- [x] `/v2/` reads as an interface atlas rather than a route directory.
- [x] every active route receives a quieter shared frame.
- [x] catalogue taxonomy remains accessible through the atlas index.
- [x] route family, status, ownership and issue metadata remain available.
- [x] Spaces and Flow are the only foreground suite applications.
- [x] the Greenways mosaic remains the strongest multicolour identity moment.
- [x] suite host specimens retain their existing truth and runtime boundaries.
- [x] no Foreman workbench files overlap the active Foreman PR.
- [x] responsive rules include 78rem, 61.25rem, 52.5rem, 42.5rem and 26.25rem.
- [x] reduced-motion handling remains explicit.
- [x] new styles use shared semantic colour roles rather than literal palette values.
