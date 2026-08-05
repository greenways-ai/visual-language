---
title: Project integration
description: Map shared components into a project's own routes, content, and palette.
---

A Greenways project should consume the shared system through a thin local wrapper.

## Astro documentation projects

Use Starlight component overrides for the header and theme provider. Keep route-specific values in the wrapper:

```astro
<DocumentationHeader
  project="historia"
  title="Historia"
  homeHref={base}
  docsHref={`${base}getting-started/`}
  searchBase={base.replace(/\/$/, "")}
/>
```

## Application interfaces

Applications can import `theme.css`, use the same data attributes, and reproduce the component contract in their native framework. Do not import Starlight-specific CSS into the product application.

## Artwork paths

Use stable absolute paths from the Visual Language site for shared editorial artwork, or copy the selected assets into the product's own deployment when availability must be isolated.

## Project CSS

Project CSS should primarily map:

- Starlight or application tokens to `--gw-*` variables;
- project-specific spacing and layout;
- the hero and product-specific components;
- light and dark surface treatment.

It should not redefine the canonical sigil geometry or theme storage logic.
