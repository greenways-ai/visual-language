import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const backgrounds = [
  "eval-aurora.svg",
  "ast-field.svg",
  "symbol-lattice.svg",
  "dataflow-orbit.svg",
  "kernel-depth.svg",
];

test("Hara package exports are present", async () => {
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.equal(pkg.exports["./hara.css"], "./src/hara.css");
  assert.equal(pkg.exports["./HaraBackdrop.astro"], "./src/HaraBackdrop.astro");
  assert.equal(pkg.exports["./assets/hara/*"], "./assets/hara/*");
});

test("Hara backgrounds are accessible 4K vector assets", async () => {
  for (const name of backgrounds) {
    const source = await readFile(
      new URL(`assets/hara/backgrounds/${name}`, root),
      "utf8",
    );

    assert.match(source, /viewBox="0 0 3840 2160"/);
    assert.match(source, /role="img"/);
    assert.match(source, /<title id="title">/);
    assert.match(source, /prefers-color-scheme:\s*dark/);
    assert.match(source, /#36F1DE/i);
    assert.match(source, /#35A8FF/i);
    assert.match(source, /#A23CFF/i);
  }
});

test("Hara theme and reduced-motion behavior are defined", async () => {
  const effects = await readFile(new URL("src/hara.css", root), "utf8");

  assert.match(effects, /data-project="hara"/);
  assert.match(effects, /\.gw-sigil--hara/);
  assert.match(effects, /prefers-reduced-motion:\s*reduce/);
  assert.match(effects, /data-variant="kernel"/);
});
