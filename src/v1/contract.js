const freeze = (value) => Object.freeze(value);

export const GREENWAYS_V1_VERSION = "1.0";

export const greenwaysV1Identity = freeze({
  typography: freeze({
    display: "--gw-font-display",
    body: "--gw-font-sans",
    code: "--gw-font-mono",
  }),
  shell: "documentation",
  material: freeze(["paper", "stone", "grid", "mosaic"]),
  accent: "verdigris-led",
});

export const greenwaysV1TokenFamilies = freeze({
  canvas: freeze(["--gw-v1-canvas", "--gw-v1-surface", "--gw-v1-surface-muted", "--gw-v1-surface-raised"]),
  text: freeze(["--gw-v1-text", "--gw-v1-text-muted", "--gw-v1-text-subtle"]),
  structure: freeze(["--gw-v1-line", "--gw-v1-line-strong", "--gw-v1-shadow"]),
  signal: freeze(["--gw-v1-accent", "--gw-v1-accent-soft", "--gw-v1-focus"]),
  semantic: freeze(["--gw-v1-gold", "--gw-v1-danger"]),
});

export const greenwaysV1Entries = freeze({
  tokens: "@greenways-ai/visual-language/v1/tokens.css",
  document: "@greenways-ai/visual-language/v1/document.css",
  contract: "@greenways-ai/visual-language/v1/contract.js",
});
