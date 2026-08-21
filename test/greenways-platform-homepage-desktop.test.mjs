import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const stylePaths = [
  "src/v2/greenways-platform-homepage.css",
  "src/v2/greenways-platform-homepage-publication.css",
  "src/v2/greenways-platform-homepage-workspace.css",
  "src/v2/greenways-platform-homepage-editorial.css",
  "src/v2/greenways-platform-homepage-responsive.css",
];
const readStyles = async () => (await Promise.all(stylePaths.map(read))).join("\n");

test("the desktop homepage is one experiential field rather than a catalogue of prose cards", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /class="gwf-declutter-stage"/);
  assert.match(page, /class="gwf-workspace"/);
  assert.match(page, /class="gwf-view-ribbon"/);
  assert.match(page, /class="gwf-boundary-plane"/);
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.ok((page.match(/<section\b/g) || []).length < 16, "the page should not return to the previous feature-section wall");
  assert.doesNotMatch(page, /Production handoff|product laboratory|High-fidelity static specimen|Operating plate/);
});

test("texture, depth, and interface motion carry the desktop story", async () => {
  const css = await readStyles();

  assert.match(css, /\.gwf-declutter-stage\s*\{[\s\S]*?min-block-size:\s*clamp\(38rem,\s*68vw,\s*55rem\)/);
  assert.match(css, /\.gwf-declutter-stage\s*\{[\s\S]*?radial-gradient/);
  assert.match(css, /\.gwf-workspace\s*\{[\s\S]*?backdrop-filter:\s*blur\(28px\)/);
  assert.match(css, /\[data-gwf-mode="scatter"\] \.gwf-workspace\s*\{[\s\S]*?scale\(0\.92\)/);
  assert.match(css, /\[data-gwf-mode="fabric"\] \.gwf-workspace\s*\{[\s\S]*?transform:\s*none/);
  assert.match(css, /\.gwf-fragment\s*\{[\s\S]*?transition:/);
  assert.match(css, /@keyframes gwf-dock-arrival/);
});

test("the main workspace stays balanced at desktop scale", async () => {
  const css = await readStyles();

  assert.match(css, /\.gwf-workspace__body\s*\{[\s\S]*?grid-template-columns:\s*3\.25rem\s+11\.5rem\s+minmax\(0,\s*1fr\) 13rem/);
  assert.match(css, /\.gwf-spaces-view\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+11rem/);
  assert.match(css, /\.gwf-flow-lanes\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-view-ribbon\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto\s+minmax\(0,\s*1fr\)\s+auto\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /\.gwf-boundary-plane\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(8rem,\s*0\.32fr\)\s+minmax\(0,\s*0\.8fr\)/);
});

test("the Greenways V2 reference remains a visual lineage rather than homepage copy", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");
  const css = await readStyles();

  assert.match(css, /greenways-os-v2-foundation\.css/);
  assert.doesNotMatch(`${page}\n${css}`, /\b(?:IBM|Dior)\b/i);
  assert.doesNotMatch(page, /one workspace.*five manifestations/i);
});
