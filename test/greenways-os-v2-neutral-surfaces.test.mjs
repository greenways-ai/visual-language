import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the Greenways OS entry gives final structural authority to the neutral v2 bridge", async () => {
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
    assert.match(bridge, new RegExp(`${legacy}:\\s*var\\(${token.replaceAll("-", "\\-")}\\)`), `${legacy} must map to ${token}`);
  }

  const structuralDeclarations = [...bridge.matchAll(/--gw2-(?:bg|bg-deep|field|field-2|surface|surface-2|surface-3|overlay|line|line-strong|text|text-2|muted|faint):\s*([^;]+);/g)]
    .map((match) => match[1]);
  for (const value of structuralDeclarations) {
    assert.doesNotMatch(value, /brand|signal|state-success|state-warning|state-danger/i);
  }
});

test("brand, interaction and semantic state remain separately named", async () => {
  const bridge = await read("src/v2/greenways-os-neutral.css");
  assert.match(bridge, /--gw2-signal:\s*var\(--gw-v2-signal\)/);
  assert.match(bridge, /--gw2-green:\s*var\(--gw-v2-state-success\)/);
  assert.match(bridge, /--gw2-warm:\s*var\(--gw-v2-state-warning\)/);
  assert.match(bridge, /--gw2-danger:\s*var\(--gw-v2-state-danger\)/);
  assert.match(bridge, /--gw2-violet:\s*var\(--gw-v2-brand-violet\)/);
});

test("the active shell atmosphere is neutral while the peacock mark stays coloured", async () => {
  const [bridge, foundation] = await Promise.all([
    read("src/v2/greenways-os-neutral.css"),
    read("src/site/styles/greenways-os-v2-foundation.css"),
  ]);

  const bodyBlock = bridge.match(/\.gw2-body\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.match(bodyBlock, /var\(--gw-v2-canvas\)/);
  assert.match(bodyBlock, /var\(--gw-v2-canvas-subtle\)/);
  assert.doesNotMatch(bodyBlock, /brand-(?:emerald|aqua|sapphire|violet)|state-success|#(?:2fe0bb|5596ff|aa66e5)/i);

  assert.match(foundation, /\.gw2-mark i[^}]+linear-gradient\(145deg, #2fe0bb, #5596ff 58%, #aa66e5\)/);
  assert.match(bridge, /\.gw2-mark::after/);
  assert.match(bridge, /var\(--gw-v2-canvas-inverse\)/);
});

test("the first retrofit slice preserves host boundaries and interaction contracts", async () => {
  const shell = await read("src/site/layouts/GreenwaysOsV2Shell.astro");
  for (const marker of [
    "data-greenways-os-version=\"2\"",
    "data-gw2-command-layer",
    "data-gw2-surface-menu",
    "data-gw2-theme-toggle",
    "data-gw2-inspector-toggle",
    "data-gw2-approval",
  ]) assert.match(shell, new RegExp(marker));
});

test("the audit records the remaining route and screenshot work", async () => {
  const audit = await read("docs/greenways-os-neutral-surface-audit.md");
  assert.match(audit, /The Greenways interface is neutral/);
  assert.match(audit, /desktop, 980px, 680px, 390px and 320px/);
  assert.match(audit, /visual treatment only/);
});
