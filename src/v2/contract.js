const freeze = (value) => Object.freeze(value);

export const GREENWAYS_V2_VERSION = "2.0";

export const greenwaysV2Entries = freeze({
  tokens: "@greenways-ai/visual-language/v2/tokens.css",
  document: "@greenways-ai/visual-language/v2/document.css",
  workbench: "@greenways-ai/visual-language/v2/workbench.css",
  components: "@greenways-ai/visual-language/v2/components.css",
  contract: "@greenways-ai/visual-language/v2/contract.js",
  componentContract: "@greenways-ai/visual-language/v2/component-contract.js",
});

export const greenwaysV2Identity = freeze({
  mark: "mosaic",
  markComponent: "@greenways-ai/visual-language/MosaicLogo.astro",
  sigilComponent: "@greenways-ai/visual-language/Sigil.astro",
  typography: freeze({
    display: "--gw-font-display",
    body: "--gw-font-sans",
    code: "--gw-font-mono",
  }),
  material: freeze(["mosaic", "smalti", "paper", "stone"]),
  structuralBase: "neutral",
  colourAnchors: freeze(["emerald", "aqua", "sapphire", "violet"]),
});

const family = (scope, tokens) => freeze({ scope, tokens: freeze(tokens) });

export const greenwaysV2TokenFamilies = freeze({
  canvas: family("theme", [
    "--gw-v2-canvas",
    "--gw-v2-canvas-subtle",
    "--gw-v2-canvas-strong",
    "--gw-v2-canvas-inverse",
  ]),
  text: family("theme", [
    "--gw-v2-text",
    "--gw-v2-text-muted",
    "--gw-v2-text-subtle",
    "--gw-v2-text-inverse",
    "--gw-v2-text-link",
  ]),
  surface: family("theme", [
    "--gw-v2-surface",
    "--gw-v2-surface-muted",
    "--gw-v2-surface-raised",
    "--gw-v2-surface-recessed",
    "--gw-v2-surface-overlay",
    "--gw-v2-material-grain",
  ]),
  seam: family("theme", [
    "--gw-v2-seam",
    "--gw-v2-seam-subtle",
    "--gw-v2-seam-strong",
  ]),
  brand: family("theme", [
    "--gw-v2-brand-emerald",
    "--gw-v2-brand-aqua",
    "--gw-v2-brand-sapphire",
    "--gw-v2-brand-violet",
    "--gw-v2-brand-spectrum",
  ]),
  signal: family("theme", [
    "--gw-v2-signal",
    "--gw-v2-signal-hover",
    "--gw-v2-signal-soft",
    "--gw-v2-on-signal",
  ]),
  state: family("theme", [
    "--gw-v2-state-neutral",
    "--gw-v2-state-neutral-soft",
    "--gw-v2-state-info",
    "--gw-v2-state-info-soft",
    "--gw-v2-state-success",
    "--gw-v2-state-success-soft",
    "--gw-v2-state-warning",
    "--gw-v2-state-warning-soft",
    "--gw-v2-state-danger",
    "--gw-v2-state-danger-soft",
  ]),
  focus: family("theme", [
    "--gw-v2-focus-ring",
    "--gw-v2-focus-offset",
  ]),
  spacing: family("shared", [
    "--gw-v2-space-0",
    "--gw-v2-space-3xs",
    "--gw-v2-space-2xs",
    "--gw-v2-space-xs",
    "--gw-v2-space-sm",
    "--gw-v2-space-md",
    "--gw-v2-space-lg",
    "--gw-v2-space-xl",
    "--gw-v2-space-2xl",
    "--gw-v2-space-3xl",
  ]),
  type: family("shared", [
    "--gw-v2-font-display",
    "--gw-v2-font-body",
    "--gw-v2-font-code",
    "--gw-v2-type-xs",
    "--gw-v2-type-sm",
    "--gw-v2-type-md",
    "--gw-v2-type-lg",
    "--gw-v2-type-xl",
    "--gw-v2-type-2xl",
    "--gw-v2-leading-tight",
    "--gw-v2-leading-body",
    "--gw-v2-leading-loose",
    "--gw-v2-measure",
  ]),
  radius: family("shared", [
    "--gw-v2-radius-none",
    "--gw-v2-radius-xs",
    "--gw-v2-radius-sm",
    "--gw-v2-radius-md",
    "--gw-v2-radius-lg",
    "--gw-v2-radius-pill",
  ]),
  elevation: family("theme", [
    "--gw-v2-elevation-0",
    "--gw-v2-elevation-1",
    "--gw-v2-elevation-2",
    "--gw-v2-elevation-3",
  ]),
  motion: family("shared", [
    "--gw-v2-motion-instant",
    "--gw-v2-motion-fast",
    "--gw-v2-motion-base",
    "--gw-v2-motion-slow",
    "--gw-v2-ease-standard",
    "--gw-v2-ease-enter",
    "--gw-v2-ease-exit",
  ]),
});

export const greenwaysV2ColourRoles = freeze({
  structure: freeze({
    character: "neutral",
    families: freeze(["canvas", "surface", "seam", "elevation"]),
    rule: "Structural canvas, rails, work areas, panels and dialogs cannot resolve through brand, signal, focus or state tokens.",
  }),
  brand: freeze({
    character: "peacock-spectrum",
    family: "brand",
    use: freeze(["mark", "identity detail", "small data emphasis"]),
  }),
  signal: freeze({
    character: "restrained-interaction",
    family: "signal",
    use: freeze(["selection", "primary command", "link", "small badge"]),
  }),
  state: freeze({
    character: "semantic",
    family: "state",
    use: freeze(["neutral", "information", "success", "warning", "danger"]),
  }),
});

export const greenwaysV2ProtectedContracts = freeze({
  entries: freeze(Object.values(greenwaysV2Entries)),
  identity: greenwaysV2Identity,
  tokenFamilies: greenwaysV2TokenFamilies,
  colourRoles: greenwaysV2ColourRoles,
});
