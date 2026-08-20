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

The workbench entry imports the document foundation. It changes density and provides generic command-bar, navigation, workspace, inspector, activity and status regions; it does not contain Foreman behaviour or presentation.

### Shared component presentation

```css
@import "@greenways-ai/visual-language/v2/components.css";
```

The component layer imports the document foundation and styles the stable Astro primitives. It contains no product data, provider calls, state manager, command dispatcher, persistence or success simulation. Components consume semantic tokens and expose state through text, markup and data attributes rather than colour alone.

### Astro primitives

Each shared primitive has an explicit export. For example:

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

The complete stable set is:

- `Navigation`, `Action`, `Toggle`, `Field`, `Tabs`, `FilterBar`, `List`;
- `Card`, `DataTable`, `Panel`, `Dialog`;
- `Status`, `ActivityList`, `ApprovalCard`, `Receipt`;
- `WorkbenchShell`.

The component owns semantic structure, accessible labels, focus, state markers and responsive presentation. The host owns data, selection changes, commands, validation, authority evaluation, external effects and evidence creation.

### Machine-readable contracts

The visual foundation contract is available through:

```js
import {
  greenwaysV2ColourRoles,
  greenwaysV2Entries,
  greenwaysV2Identity,
  greenwaysV2TokenFamilies,
} from "@greenways-ai/visual-language/v2/contract.js";
```

The component contract is available through:

```js
import {
  greenwaysV2Components,
  greenwaysV2StateMarkers,
  greenwaysV2WorkbenchRegions,
} from "@greenways-ai/visual-language/v2/component-contract.js";
```

The workflow-state contract is available through:

```js
import {
  greenwaysV2WorkflowOwnership,
  greenwaysV2WorkflowStates,
  greenwaysV2WorkflowStudies,
} from "@greenways-ai/visual-language/v2/workflow-contract.js";
```

These contracts are intended for tests, adapters and documentation generators. CSS remains the runtime source of token values, and Astro components remain the runtime source of shared markup.

## Component behaviour boundary

The package distinguishes three behaviour owners:

- **none** — presentation only; the component reports supplied data without interaction behaviour;
- **native** — ordinary browser semantics such as links, forms or `<details>` are sufficient;
- **host** — an application must supply data, commands and outcomes.

A requested toggle state is not an actual connection. A submitted action is not a completed effect. An approval control is not an authorisation receipt. A styled receipt cannot replace supplied evidence. Components therefore expose requested state, actual state, actors, timestamps, identifiers and evidence as separate fields where applicable.

## Workflow-state contract

The shared workflow vocabulary contains four product-neutral studies:

- search, filter, select and inspect;
- create, validate, preview, approve and receipt;
- load session, run, observe and recover;
- connect, request authority, reconnect and revoke.

The contract names thirteen states: initial, first-use empty, filtered empty, loading, active, waiting for approval, stale, partial, offline, recoverable error, fatal error, cancelled and success.

Every state defines:

- a written, non-colour cue;
- the supplied evidence required to justify the state;
- whether the state is terminal;
- a bounded continuation or recovery path.

The package owns the vocabulary and presentation semantics. The host owns loading, mutation, commands, cancellation, authority evaluation, provider connection, persistence, failure classification and evidence creation. A requested state never becomes an actual state merely because a control changed. Success requires a supplied result or receipt adjacent to the claim.

## Ownership boundary

Package contracts live at exported `src/` paths. The executable catalogue, specimens, concept shells, product studies and route-specific CSS live under `src/site/**` or `src/pages/**` and are not exports. The `/v2/library/components/` and `/v2/library/workflows/` routes are executable review laboratories; their example data and layouts are not package contracts.

A shared addition must be product-neutral, theme-complete, keyboard and narrow-screen safe, named in ordinary Greenways language, documented here, and protected by contract tests. Provider calls, persistence, commands and application state remain outside this package.

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
