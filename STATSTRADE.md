# Statstrade: feed and world

Statstrade has two deliberately different surfaces joined by the same red **S**, identity, communities and live markets.

1. **Feed** — the everyday product. Fast, text-first and familiar, structurally closer to Reddit than to a trading terminal.
2. **World** — an opt-in, high-concept spatial surface. A human Roman civic arena reconstructed and delivered as Gaussian splats.

The world is not a reskin of the feed, and the feed is not a miniature game world. Each surface does the job it is best at.

## 1. The feed is home

The default route should be the feed. It must work immediately on a phone, remain useful on a poor connection and never require WebGL.

### Structure

- A narrow global header with the red S, search, account and a clear **Enter world** action.
- A left rail for communities, followed leagues and saved feeds on wide screens.
- A central ranked stream of posts.
- A right rail for live arenas, upcoming resolutions and community context.
- On mobile, the central stream comes first and the rails collapse into sheets.

### Post anatomy

A post can contain ordinary discussion, a live prediction, a match moment, an evidence link, an image or a resolved result. It should still feel like one coherent post type.

Each post may show:

- community and author;
- timestamp and live/resolved state;
- title and optional body/media;
- a compact position or probability module;
- score, comments, share and save;
- an **Enter arena** link when the post has a spatial representation.

The feed should not become a glass dashboard. Use calm flat surfaces, thin mineral borders, dense readable typography, square media, compact spacing and red only for active state or commitment.

### Reddit-style, not a Reddit copy

Borrow the useful information architecture:

- ranked streams;
- communities;
- nested discussion;
- vote/conviction controls;
- sort modes;
- visible moderation and provenance.

Do not copy Reddit's branding, mascots, orange palette or exact component styling.

## 2. The world is entered, not imposed

The world is a separate route and frame. It is entered from the feed, a post, a live market or the global header.

It should feel like crossing a threshold from public discussion into a civic arena where collective conviction is made spatial.

### World direction

- intact Roman civic and military architecture, not archaeological ruins;
- monumental amphitheatre geometry;
- black basalt, pale travertine, porphyry, weathered bronze and red smalti;
- red standards, human crowds and operators at believable scale;
- the existing angular S as an inlaid floor mark, standard and wayfinding device;
- restrained interface chrome over the spatial scene;
- no cartoon spectacle and no active violence.

The central world is **The Arena of Conviction**. Markets appear as districts, rings, standards or marked positions in the space. A feed post can map to a spatial marker; a spatial event can emit a normal feed post. The content model is shared even though the presentation changes.

## 3. Gaussian-splat delivery

The visual target is a true Gaussian-splat scene, not a point-cloud CSS effect pretending to be one.

Recommended production path:

1. Build or capture one coherent architectural environment with locked scale and camera logic.
2. Produce a dense multi-view image set from a real location, a physical model or a high-quality synthetic environment.
3. Train the 3D Gaussian splat.
4. Clean floaters, crop dead volume, correct colour and define camera paths.
5. Export a compressed `.sog` scene for a compact arena or streamed `lod-meta.json` bundle for a large environment.
6. Self-host the official SuperSplat viewer and assets under the Statstrade domain.
7. Keep a static poster and normal feed fallback for unsupported devices, reduced-data mode and social cards.

The static concept in `site/statstrade/assets/arena-splat-concept.svg` is a visual target and loading poster. It is not represented as a real splat file.

### Runtime boundary

The feed owns navigation, identity, discussion and market state. The splat viewer owns rendering and camera movement.

Use a small bridge between them:

```text
feed post / market id
        ↓
world route + camera bookmark + hotspot id
        ↓
viewer emits select / enter / exit / camera events
        ↓
normal Statstrade state and feed actions
```

Do not put the application state inside a 3D engine. The world is another projection of the same Statstrade data.

## 4. Red S

The current angular S remains the canonical mark. Do not replace it with a shield, eagle, helmet, laurel monogram or Roman serif letter.

Use it in three ways:

- flat red at small interface sizes;
- cut red smalti at large brand sizes;
- physically embedded in the world as mosaic, metal, cloth or stone.

Never repeat it as wallpaper.

## 5. No robot imagery

AI and automation are infrastructure, not characters.

Forbidden visual shorthand:

- robots, androids or synthetic humanoids;
- chrome heads, glowing faces or neural-network brains;
- mechs, exoskeletons or powered armour;
- AI assistants standing beside people;
- cyberpunk control rooms, blue hologram people or generic sci-fi machinery;
- robot gladiators of any kind.

Use people, crowds, architecture, standards, documents, scoreboards, animals only when natural to the place, and real material systems. The world can be futuristic in craft and computation without depicting machines as personalities.

## 6. Transition between surfaces

The transition should be explicit and reversible.

- **Enter world** preserves the current post or market as the destination.
- The world opens full-screen with a short material dissolve, not a game loading lobby.
- **Return to feed** restores scroll position and discussion context.
- Deep links should open either the feed post or a world camera bookmark.
- The world never blocks core participation.

## 7. First visual deliverables

The first production pass should contain:

- a working feed visual prototype;
- one canonical world poster;
- the red S assets in detailed and small forms;
- a viewer manifest and poster fallback;
- one real Arena of Conviction splat capture;
- three camera bookmarks: threshold, tribune and arena floor;
- one example where a live feed post opens the matching spatial marker.

Only after this works should the world expand into multiple districts or venues.
