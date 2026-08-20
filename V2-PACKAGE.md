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
<body class="gw-v2 gw-v2-workbench">
  <header class="gw-v2-workbench__bar">…</header>
  <div class="gw-v2-workbench__frame">…</div>
  <footer class="gw-v2-workbench__status">…</footer>
</body>
```

The workbench entry imports the document foundation. It changes density and provides generic rail, workspace, inspector and status regions; it does not contain Foreman behaviour or presentation.

### Machine-readable contract

```js
import {
  greenwaysV2Entries,
  greenwaysV2Identity,
  greenwaysV2TokenFamilies,
} from "@greenways-ai/visual-language/v2/contract.js";
```

The contract is intended for tests, adapters and documentation generators. CSS remains the runtime source of token values.

## Ownership boundary

Package contracts live at exported `src/` paths. The executable catalogue, specimens, concept shells, product studies and route-specific CSS live under `src/site/**` or `src/pages/**` and are not exports. A visually useful laboratory component is not automatically a reusable package component.

A shared addition must be product-neutral, theme-complete, keyboard and narrow-screen safe, named in ordinary Greenways language, documented here, and protected by contract tests. Provider calls, persistence, commands and application state remain outside this package.

## Protected identity

The v2 layers preserve the existing mosaic mark and semantic `Sigil`/`MosaicLogo` entry points. Display, body and code typography continue to come from `--gw-font-display`, `--gw-font-sans` and `--gw-font-mono`. Verdigris, gold, terracotta and silver remain the material colour anchors. Neither v2 layer substitutes another project’s mark, vocabulary or imagery.

## Theme contract

Light, explicit dark and system-dark modes define every theme-scoped token. Spacing, type, radius and motion values are shared across themes. Components consume semantic variables rather than embedding theme colours. Reduced-motion handling is part of the document layer.

## Compatibility

No v1 export or concept route is removed, redirected or reinterpreted. Product-specific Statstrade exports remain available for compatibility but are deprecated for new shared work. See `V2-MIGRATION.md` for the source-by-source ownership map.
