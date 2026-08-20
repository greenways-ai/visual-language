# Greenways visual language v2 package contract

Greenways v2 is additive. Existing exports keep their current paths and behaviour; consumers opt into the new layers explicitly.

## Entry points

### Tokens only

```css
@import "@greenways-ai/visual-language/v2/tokens.css";
```

Use this when a host owns all layout and only needs the Greenways semantic variables.

### Document and product surfaces

```css
@import "@greenways-ai/visual-language/v2/document.css";
```

```html
<body class="gw-v2 gw-v2-document">
  <main class="gw-v2-page">…</main>
</body>
```

The document layer imports the existing typography and theme foundations, then the complete v2 token family. It supplies low-specificity composition primitives rather than product screens.

### Workbench surfaces

```css
@import "@greenways-ai/visual-language/v2/workbench.css";
```

```html
<section class="gw-v2 gw-v2-workbench">
  <header class="gw-v2-workbench__bar">…</header>
  <div class="gw-v2-workbench__frame">…</div>
  <footer class="gw-v2-workbench__status">…</footer>
</section>
```

The workbench entry imports the document foundation. It provides six product-neutral regions: command bar, project and buildout navigation, primary workspace, inspector, activity and log, and compact status. Density changes across document and workbench layers; identity and semantic tokens do not.

### Reusable component presentation

```css
@import "@greenways-ai/visual-language/v2/components.css";
```

The component layer imports the document foundation and styles the reusable Astro implementations. It contains no product data, provider call, state manager, command dispatcher, persistence or success simulation. Components expose state through semantic markup, text and data attributes rather than colour alone.

## Authoritative catalogue and reusable implementations

The merged catalogue remains the single inventory of shared component, workflow-state and workbench contracts:

```js
import {
  greenwaysV2Components,
  greenwaysV2WorkflowStates,
  greenwaysV2Workflows,
  greenwaysV2WorkbenchRegions,
} from "@greenways-ai/visual-language/v2/component-catalogue.js";
```

The package adapter maps selected catalogue records to reusable Astro implementations without defining a competing inventory:

```js
import {
  greenwaysV2AstroComponents,
  greenwaysV2ComponentDefinitions,
  getGreenwaysV2AstroComponent,
} from "@greenways-ai/visual-language/v2/component-contract.js";
```

Every adapter record names the package export, source file, authoritative catalogue identifiers, behaviour owner and application boundary.

## Astro components

Each reusable implementation has an explicit export. For example:

```astro
---
import Action from "@greenways-ai/visual-language/v2/astro/Action.astro";
import ApprovalCard from "@greenways-ai/visual-language/v2/astro/ApprovalCard.astro";
import WorkbenchShell from "@greenways-ai/visual-language/v2/astro/WorkbenchShell.astro";
---

<WorkbenchShell
  id="project-workbench"
  title="Project review"
  statusLabel="Specimen data"
>
  <Action slot="command-bar" variant="primary">Review selection</Action>
  <ApprovalCard
    id="approval-1"
    slot="inspector"
    title="Read one project"
    requestedBy="Review session"
    requestedState="Approval requested"
    actualState="Waiting for a person"
    scope={["Read the selected project"]}
  />
</WorkbenchShell>
```

The stable Astro set is:

- `Navigation`, `Action`, `Toggle`, `Field`, `Tabs`, `FilterBar`, `List`;
- `Card`, `DataTable`, `Panel`, `Dialog`;
- `Status`, `ActivityList`, `ApprovalCard`, `Receipt`;
- `WorkbenchShell`.

These implementations cover the merged catalogue’s navigation, command, field, tab, filter, list, card, table, panel, dialog, status, activity, approval, receipt and workbench contracts. Several merged catalogue records compose into one implementation where that produces a clearer stable boundary. For example, `WorkbenchShell` owns the generic command-bar, rail, inspector, activity-region and status-line structure while hosts supply all application content and behaviour.

## Behaviour ownership

The adapter distinguishes three behaviour owners:

- **none** — presentation only; the component reports supplied data without interaction behaviour;
- **native** — ordinary browser semantics such as links, forms or `<details>` are sufficient;
- **host** — an application must supply data, commands and outcomes.

A requested toggle state is not an actual connection. A submitted action is not a completed effect. An approval control is not an authorisation receipt. A styled receipt cannot replace supplied evidence. Components therefore expose requested state, actual state, actors, timestamps, identifiers and evidence as separate fields where applicable.

The package owns semantic structure, accessible labels, focus, responsive presentation, state markers and reduced-motion behaviour. The host owns data, selection changes, commands, validation, authority evaluation, provider connections, persistence, external effects and evidence creation.

## Machine-readable visual contract

```js
import {
  greenwaysV2ColourRoles,
  greenwaysV2Entries,
  greenwaysV2Identity,
  greenwaysV2TokenFamilies,
} from "@greenways-ai/visual-language/v2/contract.js";
```

The visual contract is intended for tests, adapters and documentation generators. CSS remains the runtime source of token values, the component catalogue remains the authoritative semantic inventory, and Astro components remain the runtime source of reusable markup.

## Ownership boundary

Package contracts live at exported `src/` paths. The executable catalogue, specimens, concept shells, product studies and route-specific CSS live under `src/site/**` or `src/pages/**` and are not exports. The `/v2/library/components/` and `/v2/library/workflows/` routes demonstrate the authoritative catalogue but their specimen data and page composition are not package contracts.

A shared addition must be product-neutral, theme-complete, keyboard and narrow-screen safe, named in ordinary Greenways language, mapped to the catalogue, documented here, and protected by contract tests. Provider calls, persistence, commands and application state remain outside this package.

## Protected identity

The v2 layers preserve the existing mosaic mark and semantic `Sigil`/`MosaicLogo` entry points. Display, body and code typography continue to come from `--gw-font-display`, `--gw-font-sans` and `--gw-font-mono`.

Greenways identity uses a peacock spectrum of emerald, aqua, sapphire and violet. The mark is the strongest multicolour identity moment. These colours may appear as restrained interaction and data accents, but they are not the application background.

Neither v2 layer substitutes another project’s mark, vocabulary or imagery.

## Colour-role contract

The interface is neutral. The mark is peacock-coloured. Colour behaves like a jewel-like signal rather than an ambient field.

### Neutral structure

Canvas, rails, work areas, panels, dialogs, seams and elevation use neutral values in both themes:

- light mode: paper, off-white, stone, cool grey and charcoal;
- dark mode: near-black, graphite, slate and soft white.

Structural tokens must not resolve through a brand, signal, focus or semantic-state token. Document, workbench and component layers share the same neutral base; density may change, atmosphere may not.

### Peacock brand

The protected brand family is:

```text
--gw-v2-brand-emerald
--gw-v2-brand-aqua
--gw-v2-brand-sapphire
--gw-v2-brand-violet
--gw-v2-brand-spectrum
```

Use it for the Greenways mark, identity details and small data emphasis. Do not use it for page-wide gradients, broad sidebars, work surfaces or dialogs.

### Interaction signal

`--gw-v2-signal*` is the restrained primary interaction family. It is appropriate for selection, primary commands, links and small badges. It is deliberately sapphire-led rather than success-green.

### Semantic state

`--gw-v2-state-*` communicates neutral, information, success, warning and danger states. These tokens are separately named and tested. Success green is not the Greenways brand atmosphere, and brand colour cannot replace warning or danger.

Focus uses the aqua brand anchor plus a neutral offset. No state or required action may depend on colour alone.

## Theme contract

Light, explicit dark and system-dark modes define every theme-scoped token. Spacing, type, radius and motion values are shared across themes. Components consume semantic variables rather than embedding theme colours. Reduced-motion handling is part of the document and component layers.

## Compatibility

No v1 export or concept route is removed, redirected or reinterpreted. Product-specific Statstrade exports remain available for compatibility but are deprecated for new shared work. See `V2-MIGRATION.md` for the source-by-source ownership map.
