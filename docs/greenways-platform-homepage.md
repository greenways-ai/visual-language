# Greenways Fabric homepage experience

Issue: [#54](https://github.com/greenways-ai/visual-language/issues/54)

Route: `/v2/applications/greenways-platform/homepage/`

## Decision

The homepage is an interface experience, not an explanatory catalogue.

The page demonstrates the product by beginning in a scattered state and settling into one coherent Fabric workspace. The visitor can replay the transition, switch the same underlying workspace between Spaces and Flow, and move one selected projection across the optional Platform boundary.

The visible copy is deliberately sparse:

- `Everything settles into place.`
- `Your work. Your identity. Clear roles.`
- `One Fabric. Two current views.`
- `Only the selected piece crosses.`
- `Keep the centre.`

Everything else is communicated through texture, spatial continuity, controls, state, colour, and interface composition.

## Experience sequence

1. **Scattered** — detached tabs, downloads, notes, accounts, tasks, agent output, receipts, and sources occupy the field.
2. **Fabric** — those fragments settle into a workspace with one storage context, one identity thread, bounded agents, and retained history.
3. **Applications as views** — Spaces and Flow switch over the same Fabric frame rather than opening separate product silos.
4. **Explicit boundary** — one selected projection may move into Greenways Platform while the private stack remains in place.
5. **Quiet close** — applications may change; the Fabric remains.

## Visual contract

- Reuse the atmosphere, glass, depth, fine grid, peacock signal, and interface scale established by `/concepts/greenways-v2/`.
- The workspace is the primary explanatory object.
- Body copy never carries the product story by itself.
- The mosaic mark remains the strongest multicolour identity object.
- Surfaces are layered and tactile rather than repeated documentation cards.
- Clutter is shown as temporary spatial disorder, not a before/after marketing table.
- Decluttering is reversible and replayable.
- Light and dark modes preserve equivalent hierarchy.
- Desktop, tablet, 390px, and 320px layouts remain deliberate and overflow-free.
- Reduced-motion users receive the settled state without the transition.

## Colour lineage

The homepage consumes the same palette source as `/concepts/greenways-v2/`: `src/site/styles/greenways-os-v2-foundation.css`.

It does not define a second literal palette. The route assigns the shared roles deliberately:

- **Emerald** — Spaces, private Fabric, storage, settled context, grounded sources.
- **Sky** — Flow, commands, identity links, active references, explicit crossing lines.
- **Warm gold** — retained history, review, the selected piece before it crosses.
- **Coral** — ambiguous agent output in the scattered state.
- **Violet** — bounded agents, relationship maps, optional hosted Platform.

The same Fabric frame changes its active accent when the user switches between Spaces and Flow. Colour supports labels, shape, position, and state; it is never the sole carrier of meaning.

## Current product boundary

Only the current applications appear:

```text
Spaces   understand
Flow     coordinate
```

Build and Research are compatibility lineage. Imagine, World, Studio, and Socials are not announced or teased.

Greenways Platform remains optional. The boundary interaction moves one visual specimen only; it does not imply upload, sync, publication, account creation, or unrestricted access to the private Fabric.

## Truthfulness

All controls alter the local visual specimen only:

- `Scattered / Fabric` changes the decluttering state.
- `Spaces / Flow` changes the application view over the same frame.
- `Share selected piece` demonstrates an explicit boundary crossing.
- Theme and replay controls change presentation only.

No storage, identity, agent, application, account, upload, sync, collaboration, publication, or hosted operation is connected.

## Source ownership

- `src/v2/greenways-platform-homepage.js` owns the closed, current, sparse experience model.
- `src/pages/v2/applications/greenways-platform/homepage.astro` owns the standalone executable experience.
- `src/v2/greenways-platform-homepage.css` is the route entry and imports the atmosphere, workspace, scene, responsive, and colour modules.
- `src/v2/greenways-platform-homepage-publication.css` owns the atmospheric field and scattered-to-Fabric transition.
- `src/v2/greenways-platform-homepage-workspace.css` owns the shared Fabric frame and Spaces/Flow views.
- `src/v2/greenways-platform-homepage-editorial.css` owns the application ribbon, optional Platform boundary, and quiet close.
- `src/v2/greenways-platform-homepage-responsive.css` owns deliberate desktop-to-320px composition and reduced motion.
- `src/v2/greenways-platform-homepage-colour.css` maps the existing Greenways V2 palette roles into fragments, application views, Fabric state, and the private/hosted boundary.
- `src/v2/CatalogueShell.astro` no longer injects legacy homepage cascade repairs because the homepage owns a standalone shell.
- `test/greenways-platform-homepage*.test.mjs` owns product, interaction, visual-density, colour-lineage, responsive, accessibility, and non-announcement contracts.
