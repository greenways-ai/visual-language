# Greenways visual language v1 documentation package

The v1 package is the documentation-first visual contract for Greenways
product sites. It provides a stable reading shell and semantic tokens while
leaving each project free to select its own accent signal.

## Entry points

```css
@import "@greenways-ai/visual-language/v1/document.css";
```

```html
<body class="gw-v1">
  <main class="gw-v1-main">…</main>
</body>
```

Use `v1/tokens.css` when a host owns its own documentation shell but needs the
shared canvas, surface, text, signal, and focus roles.

The v1 typography relationship is shared with v2:

- Marcellus for display and orientation;
- Manrope for interface and body text;
- IBM Plex Mono for code and technical metadata.

The type sizes remain system-specific. v1 is a documentation shell with a
sidebar, reading column, local page index, material grid, and bounded project
accent. It is not an application workbench.

## Machine-readable contract

```js
import {
  greenwaysV1Entries,
  greenwaysV1Identity,
  greenwaysV1TokenFamilies,
} from "@greenways-ai/visual-language/v1/contract.js";
```
