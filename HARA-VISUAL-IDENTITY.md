# Hara visual identity

Hara is the symbolic-computation layer of the Greenways visual language. It should feel like a language kernel becoming visible: compact, recursive, inspectable, and alive without becoming decorative noise.

## Identity anchors

### Spectrum

The Hara spectrum is fixed:

- **Hara cyan** `#36F1DE` — live state, entry, signal
- **Hara blue** `#35A8FF` — evaluation, movement, connection
- **Hara violet** `#A23CFF` — expansion, agency, emergence
- **Hara void** `#05070E` — dark computational field
- **Hara frost** `#E8FFFC` — light on the dark field

Use the cyan → blue → violet progression as a directional spectrum, not as a generic rainbow. Cyan should usually enter from the upper or left side; violet should resolve toward the lower or right side.

### Evaluation knot

The five-strand evaluation knot is a **secondary field motif and adaptive project sigil**. It expresses:

1. paired Lisp parentheses;
2. a central evaluation spine;
3. two crossing bridges;
4. explicit over/under ordering;
5. one stable state node at the centre.

It may appear as a watermark, favicon, loading field, diagram focus, or spatial anchor. It does not replace a separately approved primary Hara wordmark.

### Spatial grammar

Hara imagery is built from five recurring structures:

- **AST fields** — branching nodes and explicit edges;
- **evaluation auroras** — soft spectral motion behind readable content;
- **symbol lattices** — repeated forms that suggest code as data;
- **dataflow orbits** — state moving through observable paths;
- **kernel depth** — nested frames, stacks, and execution layers.

The system should remain legible at interface scale. Use one dominant structure and no more than two supporting effects in a single viewport.

## Assets

All Hara backgrounds are vector SVGs on a `3840 × 2160` design canvas. They are resolution-independent and may be rasterised at 4K, 8K, print, or smaller interface sizes without changing the source asset.

| Asset | Purpose |
| --- | --- |
| `assets/hara/evaluation-knot.svg` | Secondary Hara field motif |
| `assets/hara/backgrounds/eval-aurora.svg` | Hero, launch, and ambient coding background |
| `assets/hara/backgrounds/ast-field.svg` | Architecture, compiler, and macroexpansion material |
| `assets/hara/backgrounds/symbol-lattice.svg` | Section fields, posters, and repeated texture |
| `assets/hara/backgrounds/dataflow-orbit.svg` | State, agent, event, and orchestration material |
| `assets/hara/backgrounds/kernel-depth.svg` | Runtime, WASM, VM, and execution-stack material |

The SVGs adapt to `prefers-color-scheme`. They are intentionally text-free so that localisation and responsive cropping do not damage the composition.

## Live effects

Import the shared theme and the Hara effect layer:

```astro
---
import HaraBackdrop from "@greenways-ai/visual-language/HaraBackdrop.astro";
import "@greenways-ai/visual-language/theme.css";
import "@greenways-ai/visual-language/hara.css";
---

<section class="hero">
  <HaraBackdrop variant="ast" density="balanced" />
  <div class="hero__content">
    <h1>Lisp for the agentic age.</h1>
  </div>
</section>

<style>
  .hero {
    position: relative;
    isolation: isolate;
    min-height: 42rem;
    overflow: hidden;
  }

  .hero__content {
    position: relative;
    z-index: 1;
  }
</style>
```

Available variants are `aurora`, `ast`, `lattice`, `orbit`, and `kernel`. Density may be `quiet`, `balanced`, or `dense`. Motion is enabled by default and automatically stops under `prefers-reduced-motion`.

For a meaningful illustration rather than a decorative field, provide a label:

```astro
<HaraBackdrop
  variant="orbit"
  label="Live state moving through Hara evaluation paths"
/>
```

## Usage rules

Keep text outside the SVG assets and above the effect layer. Maintain strong contrast by placing content in a surface, applying a local veil, or selecting a quieter density.

Do not recolour the spectrum into project palettes, add random neon colours, flatten the crossing gaps, place the knot inside generic crypto imagery, or use particle density that competes with code and documentation.

The Hara identity should read as **symbolic machinery with calm agency**, not cyberpunk decoration.
