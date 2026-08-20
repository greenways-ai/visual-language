import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the Greenways OS entry gives final authority to the neutral v2 bridge", async () => {
  const entry = await read("src/site/styles/greenways-os-v2.css");
  const imports = [...entry.matchAll(/@import\s+"([^"]+)";/g)].map((match) => match[1]);

  assert.equal(imports.at(-1), "../../v2/greenways-os-neutral.css");
});

test("historical structural roles map only to protected neutral token families", async () => {
  const bridge = await read("src/v2/greenways-os-neutral.css");
  const expected = new Map([
    ["--gw2-bg", "--gw-v2-canvas"],
    ["--gw2-bg-deep", "--gw-v2-canvas-subtle"],
    ["--gw2-field", "--gw-v2-surface-recessed"],
    ["--gw2-field-2", "--gw-v2-canvas-strong"],
    ["--gw2-surface", "--gw-v2-surface"],
    ["--gw2-surface-2", "--gw-v2-surface-muted"],
    ["--gw2-surface-3", "--gw-v2-surface-raised"],
    ["--gw2-overlay", "--gw-v2-surface-overlay"],
    ["--gw2-line", "--gw-v2-seam"],
    ["--gw2-line-strong", "--gw-v2-seam-strong"],
    ["--gw2-text", "--gw-v2-text"],
    ["--gw2-text-2", "--gw-v2-text-muted"],
    ["--gw2-muted", "--gw-v2-text-muted"],
    ["--gw2-faint", "--gw-v2-text-subtle"],
  ]);

  for (const [legacy, token] of expected) {
    assert.match(
      bridge,
      new RegExp(`${legacy}:\\s*var\\(${token.replaceAll("-", "\\-")}\\)`),
      `${legacy} must map to ${token}`,
    );
  }

  const structuralDeclarations = [
    ...bridge.matchAll(
      /--gw2-(?:bg|bg-deep|field|field-2|surface|surface-2|surface-3|overlay|line|line-strong|text|text-2|muted|faint):\s*([^;]+);/g,
    ),
  ].map((match) => match[1]);

  for (const value of structuralDeclarations) {
    assert.doesNotMatch(value, /brand|signal|state-success|state-warning|state-danger/i);
  }

  assert.doesNotMatch(bridge, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
});

test("identity, interaction, and semantic state remain separately named", async () => {
  const bridge = await read("src/v2/greenways-os-neutral.css");

  assert.match(bridge, /--gw2-signal:\s*var\(--gw-v2-signal\)/);
  assert.match(bridge, /--gw2-green:\s*var\(--gw-v2-state-success\)/);
  assert.match(bridge, /--gw2-warm:\s*var\(--gw-v2-state-warning\)/);
  assert.match(bridge, /--gw2-danger:\s*var\(--gw-v2-state-danger\)/);
  assert.match(bridge, /\.gw2-mark i\s*\{[\s\S]*background: var\(--gw-v2-brand-spectrum\)/);
  assert.match(
    bridge,
    /\.gw2-live-dot,[\s\S]*background: var\(--gw-v2-state-success\)/,
  );
});

test("the active shell atmosphere is neutral and materially consistent with v2", async () => {
  const bridge = await read("src/v2/greenways-os-neutral.css");
  const bodyBlock = bridge.match(/\.gw2-body\s*\{([\s\S]*?)\}/)?.[1] ?? "";

  assert.match(bodyBlock, /var\(--gw-v2-canvas\)/);
  assert.match(bodyBlock, /var\(--gw-v2-canvas-subtle\)/);
  assert.match(bodyBlock, /var\(--gw-v2-material-grain\)/);
  assert.doesNotMatch(
    bodyBlock,
    /brand-(?:emerald|aqua|sapphire|violet)|state-success/i,
  );
});

test("ordinary commands use the sapphire signal instead of success green", async () => {
  const bridge = await read("src/v2/greenways-os-neutral.css");

  assert.match(
    bridge,
    /\.gw2-overview-hero__actions a:first-child,[\s\S]*background: var\(--gw-v2-signal\);/,
  );
  assert.match(
    bridge,
    /\.gw2-panel-primary-actions button:first-child,[\s\S]*background: var\(--gw-v2-signal-soft\);/,
  );
  assert.match(
    bridge,
    /\.gw2-mode-line__branch\s*\{[\s\S]*background: var\(--gw-v2-signal\);/,
  );
});

test("the neutralisation covers every Greenways OS atlas host surface", async () => {
  const bridge = await read("src/v2/greenways-os-neutral.css");

  for (const selector of [
    ".gw2-native-titlebar",
    ".gw2-browser-tabs",
    ".gw2-simulated-webpage",
    ".gw2-popup-browser-toolbar",
    ".gw2-device--web",
  ]) {
    assert.ok(bridge.includes(selector), `${selector} must be covered by the v2 bridge`);
  }

  assert.match(
    bridge,
    /\.gw2-browser-and-panel,[\s\S]*background-color: var\(--gw-v2-canvas-subtle\)/,
  );
  assert.match(bridge, /\.gw2-web-hero\s*\{[\s\S]*background: var\(--gw-v2-canvas\)/);
  assert.match(
    bridge,
    /\.gw2-web-workspace\s*\{[\s\S]*background: var\(--gw-v2-canvas-strong\)/,
  );
});

test("focus, reduced motion, and host interaction contracts remain present", async () => {
  const [bridge, shell] = await Promise.all([
    read("src/v2/greenways-os-neutral.css"),
    read("src/site/layouts/GreenwaysOsV2Shell.astro"),
  ]);

  assert.match(
    bridge,
    /:where\(a, button, input, textarea, select, summary\):focus-visible\s*\{[\s\S]*--gw-v2-focus-ring/,
  );
  assert.match(bridge, /@media \(prefers-reduced-motion: reduce\)/);

  for (const marker of [
    'data-greenways-os-version="2"',
    "data-gw2-command-layer",
    "data-gw2-surface-menu",
    "data-gw2-theme-toggle",
    "data-gw2-inspector-toggle",
    "data-gw2-approval",
  ]) {
    assert.match(shell, new RegExp(marker));
  }
});

test("the audit records atlas coverage and the remaining visual review", async () => {
  const audit = await read("docs/greenways-os-neutral-surface-audit.md");

  assert.match(audit, /The Greenways interface is neutral/);
  assert.match(audit, /native desktop, browser desktop, side panel, popup, and public web/);
  assert.match(audit, /desktop, 980px, 680px, 390px, and 320px/);
  assert.match(audit, /visual treatment only/);
});
