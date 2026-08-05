---
title: Typography
description: Display, interface, and technical voices have distinct jobs.
---

The shared typography contract uses three voices.

## Display

**Marcellus** is used by the Astro documentation sites for large editorial headings and project titles. The package also exposes a broader display token for consumers that need the established Greenways editorial contract.

Display type should feel architectural, not ornamental. Keep line heights tight and avoid fake Roman, medieval, or futuristic fonts.

## Interface

**Manrope** carries navigation, controls, labels, and body copy. It remains legible at compact sizes and across light and dark themes.

## Technical

**IBM Plex Mono** carries commands, metadata, section indices, measurements, and status labels. Use uppercase and letter spacing sparingly.

```css
:root {
  --sl-font: "Manrope", system-ui, sans-serif;
  --sl-font-mono: "IBM Plex Mono", monospace;
}

h1, h2, h3 {
  font-family: "Marcellus", Georgia, serif;
}
```

## Hierarchy

- One dominant display statement per major section.
- Technical kickers describe category, state, or sequence.
- Body copy remains sentence case and comfortably spaced.
- Buttons use verbs rather than atmospheric slogans.
- Monospace text is not used for long prose.

## Line length

Documentation prose should remain near 65–75 characters per line. Splash pages can use wider copy when the surrounding composition gives it breathing room.
