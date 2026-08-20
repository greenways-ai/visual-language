# Greenways platform homepage laboratory

Issue: [#54](https://github.com/greenways-ai/visual-language/issues/54)

Route: `/v2/applications/greenways-platform/homepage/`

## Purpose

This route is the proposed public doorway for `www.greenways.ai`. It replaces an infrastructure-first or generic software-feature story with one clear idea:

> Greenways is a publishing system in which one work may become a world, a book, a document, and a public site.

The route is an executable visual-language specimen. It does not change the production homepage and none of its controls sign in, create, coordinate, or publish.

## Product order

The public page uses this disclosure order:

1. **The work** — what a person is making and where it can live on the web.
2. **The publishing sequence** — gather, shape, and release.
3. **The public forms** — world, book, document, and site as related editions.
4. **Greenways OS** — the calm desk where those editions are composed and reviewed.
5. **Foreman** — optional coordination for people, agents, approvals, and evidence.
6. **Open foundations** — discoverable after the product story rather than occupying the first viewport.

This order is intentional. Hara, Hestia, Tahto, Hoplite, Historia, Hodos, Ignatius, providers, sandboxes, protocols, and storage layers are not public-homepage navigation.

## Visual contract

- Structural canvas, header, panels, desktop specimen, and footer use the shared neutral v2 roles.
- The Greenways mosaic mark is the strongest multicolour moment.
- Emerald, aqua, sapphire, and violet identify small edition, sequence, and focus signals.
- Sapphire remains the primary interaction signal.
- Success, warning, and danger are semantic states and are not replaced by brand colour.
- The page uses editorial plates, numbering, rules, and terse instructional copy instead of a generic SaaS card wall.
- Light and dark themes preserve the same hierarchy.

The route-specific stylesheet contains no literal colour palette. It consumes `--gw-v2-*` tokens from the shared package contract.

## Truthfulness boundary

All specimen links are in-page anchors. The route explicitly states that it performs no account, publication, agent, or provider action. The Greenways OS window is a visual composition only, and its status line says that no publication action is connected.

A later production adoption must replace specimen destinations only when the corresponding product routes and actions actually exist.

## Production adoption checklist

- Keep the first viewport centred on making and publishing one work.
- Preserve the relationship between world, book, document, and site.
- Keep the production header small; do not restore a project catalogue as primary navigation.
- Connect calls to action only to truthful, available destinations.
- Show signed-in or publication state only after authoritative state is available.
- Keep Greenways OS and Foreman subordinate to the public publication journey.
- Keep infrastructure names in technical documentation or diagnostics.
- Keep open-source foundations available through About or the footer.
- Review light and dark rendering at desktop, 820px, 390px, and 320px.
- Verify keyboard focus, reduced motion, contrast, and no document-level horizontal overflow.

## Source ownership

- `src/v2/greenways-platform-homepage.js` owns the closed editorial and section contract.
- `src/pages/v2/applications/greenways-platform/homepage.astro` owns the executable catalogue composition.
- `src/v2/greenways-platform-homepage*.css` owns route-specific core, publication, workspace, and responsive presentation using shared tokens.
- `src/v2/catalogue-manifest.js` owns route discovery and application-family placement.
- `test/greenways-platform-homepage.test.mjs` owns focused contract enforcement.

Production navigation, authentication, persistence, rendering, publication, coordination, and deployment remain outside `@greenways-ai/visual-language`.
