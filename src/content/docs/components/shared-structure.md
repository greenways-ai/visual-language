---
title: Shared structure
description: Portable Astro components keep Greenways navigation and identity coherent.
---

Shared structure gives each project a common operational frame while its palette and imagery remain project-specific.

## Core components

| Component | Responsibility |
| --- | --- |
| `DocumentationHeader.astro` | Project identity, Docs link, search, one-press theme control |
| `ProjectSwitcher.astro` | Canonical OSS project navigation |
| `DocumentationSearch.astro` | Pagefind search dialog and keyboard shortcut |
| `ThemeToggle.astro` | Auto → light → dark theme cycling |
| `CodePanel.astro` | Highlighted code isolated from prose styles |
| `DocumentationCard.astro` | Explanation, significance, and implementation example |
| `ThemedArtwork.astro` | Day/night and responsive image selection |
| `Sigil.astro` | Canonical project mark with adaptive asset pairing |

## Project identity

Set the project on the root element before paint so shared tokens resolve without a flash of the wrong palette.

```html
<script>
  document.documentElement.dataset.project = "visual-language";
</script>
```

## Do not fork the shell

A project may wrap a shared component to supply title, routes, and search base. It should not copy the component and create a private variant unless the shared contract genuinely cannot express the requirement.
