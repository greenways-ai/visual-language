---
title: Getting started
description: Install the shared package and establish project identity before styling pages.
---

## Install

```bash
npm install github:greenways-ai/visual-language
```

Pin a commit in production projects when you need repeatable builds.

## Import the foundation

```css
@import "@greenways-ai/visual-language/typography.css";
@import "@greenways-ai/visual-language/theme.css";
```

## Set the project

Resolve theme and project identity before the page paints.

```html
<script>
  document.documentElement.dataset.theme = "dark";
  document.documentElement.dataset.project = "hoplite";
</script>
```

## Use the shared header

```astro
---
import DocumentationHeader from "@greenways-ai/visual-language/DocumentationHeader.astro";
---

<DocumentationHeader
  project="hoplite"
  title="Hoplite"
  docsHref="/hoplite/getting-started/"
  searchBase="/hoplite"
/>
```

## Sync the favicon

Use the canonical project assets from `assets/favicons/`. Detailed and compact variants are generated together and should not be redrawn inside the consuming project.

## Add the integrity check

Run the visual audit in CI after the site build. It detects missing canonical marks, obsolete identity assets, and theme leakage.
