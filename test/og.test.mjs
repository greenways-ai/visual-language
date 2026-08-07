import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const cards = [
  "greenways",
  "hestia",
  "historia",
  "hodos",
  "hoplite",
  "visual-language",
];

test("the committed PNG masters are converted to compact progressive JPEG cards", async () => {
  const [pkg, optimizer] = await Promise.all([
    read("package.json"),
    read("bin/optimize-og-images.mjs"),
  ]);

  assert.match(pkg, /"build": "npm run assets && npm run og:optimize/);
  assert.match(pkg, /"og": "node bin\/generate-og-images\.mjs && npm run og:optimize"/);
  assert.match(optimizer, /from "sharp"/);
  assert.match(optimizer, /quality: 82/);
  assert.match(optimizer, /progressive: true/);
  assert.match(optimizer, /maxBytes = 350_000/);

  for (const name of cards) {
    const master = await stat(new URL(`site/assets/og-${name}.png`, root));
    assert.ok(master.size > 100_000, `${name} should retain a rendered PNG master`);
    assert.match(optimizer, new RegExp(`"${name}"`));
  }
});

test("the documentation site advertises and verifies the JPEG derivative", async () => {
  const [config, verify] = await Promise.all([
    read("astro.config.mjs"),
    read("scripts/verify-site-output.mjs"),
  ]);

  assert.match(config, /og-visual-language\.jpg/);
  assert.match(config, /og:image:type", content: "image\/jpeg"/);
  assert.match(config, /og:image:width", content: "1200"/);
  assert.match(config, /og:image:height", content: "630"/);
  assert.match(config, /twitter:image:alt/);
  assert.doesNotMatch(config, /og-visual-language\.png/);

  for (const name of cards) {
    assert.match(verify, new RegExp(`"${name}"`));
  }
  assert.match(verify, /metadata\.format !== "jpeg"/);
  assert.match(verify, /file\.size > 350_000/);
});
