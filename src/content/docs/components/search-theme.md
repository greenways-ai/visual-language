---
title: Search & theme
description: Search is keyboard-accessible and theme selection is one direct control.
---

## Search

Documentation search opens from the header or with <kbd>⌘K</kbd>/<kbd>Ctrl+K</kbd>. Results are loaded from Starlight's Pagefind output and remain scoped to the current documentation site.

The dialog is centred, focusable, dismissible with Escape, and usable on mobile without relying on hover.

## Theme

The theme control cycles through:

1. Auto
2. Light
3. Dark

The current preference is stored in local storage and a `gw-theme` cookie. On Greenways production hosts, the cookie is scoped to the parent domain so project transitions preserve the choice.

## Before paint

The theme provider resolves the stored preference in an inline script before components render. This avoids a visible light-to-dark flash.

## Reduced motion

Theme and artwork transitions collapse to effectively zero duration when the user requests reduced motion.
