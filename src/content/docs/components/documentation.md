---
title: Documentation shell
description: Astro and Starlight provide one documentation model across Greenways OSS projects.
---

The Visual Language site uses the same Astro and Starlight architecture as Hoplite.

## Structure

- Starlight owns routing, sidebar navigation, table of contents, Pagefind, metadata, and edit links.
- The Visual Language package owns the visible project header, search experience, theme state, code panels, and project switching.
- Project CSS maps Starlight tokens to the project palette and material direction.
- Splash pages hide the default content heading and render full-width editorial components.

## Header override

```js
starlight({
  components: {
    Header: "./src/site/components/SharedSiteHeader.astro",
    ThemeProvider: "./src/site/components/GreenwaysThemeProvider.astro",
    ThemeSelect: "./src/site/components/GreenwaysThemeSelect.astro",
  },
})
```

## Content location

Documentation lives under `src/content/docs/`. The sidebar is explicit so the information architecture stays deliberate and reviewable.

## Site assets

Generated favicons, artwork, sigils, and social cards remain outside the Astro source tree. A post-build copy step places only these asset directories into `dist`; legacy static HTML shells are not deployed.
