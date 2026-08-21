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

test("the standalone Fabric experience owns its viewport and compact shell", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(page, /class="gwf-experience-bar"/);
  assert.match(page, /class="gwf-skip-link"/);
  assert.match(page, /id="greenways-fabric-main"/);
  assert.doesNotMatch(page, /CatalogueNavigation|CataloguePageFooter|gw-v2-catalogue-main/);
});

test("tablet composition removes secondary chrome before squeezing the workspace", async () => {
  const css = await readStyles();

  assert.match(css, /@media \(max-width:\s*64rem\)[\s\S]*?\.gwf-workspace__body\s*\{[\s\S]*?grid-template-columns:\s*3rem\s+9\.5rem\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /@media \(max-width:\s*64rem\)[\s\S]*?\.gwf-inspector\s*\{[\s\S]*?display:\s*none/);
  assert.match(css, /@media \(max-width:\s*48rem\)[\s\S]*?\.gwf-object-rail\s*\{[\s\S]*?display:\s*none/);
  assert.match(css, /@media \(max-width:\s*48rem\)[\s\S]*?\.gwf-workspace__body\s*\{[\s\S]*?grid-template-columns:\s*3rem\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /@media \(max-width:\s*48rem\)[\s\S]*?\.gwf-spaces-view\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
});

test("phone composition keeps one readable application canvas and deliberate controls", async () => {
  const css = await readStyles();

  assert.match(css, /@media \(max-width:\s*30rem\)[\s\S]*?\.gwf-experience-bar\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width:\s*30rem\)[\s\S]*?\.gwf-mode-switch\s*\{[\s\S]*?flex:\s*1/);
  assert.match(css, /@media \(max-width:\s*30rem\)[\s\S]*?\.gwf-workspace__dock\s*\{[\s\S]*?display:\s*none/);
  assert.match(css, /@media \(max-width:\s*30rem\)[\s\S]*?\.gwf-workspace__body\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width:\s*30rem\)[\s\S]*?\.gwf-app-tabs\s*\{[\s\S]*?inline-size:\s*100%/);
  assert.match(css, /@media \(max-width:\s*30rem\)[\s\S]*?\.gwf-boundary-scene\s*>\s*footer\s+button\s*\{[\s\S]*?inline-size:\s*100%/);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/i);
});

test("mobile clutter is reduced rather than compressed into unreadable fragments", async () => {
  const css = await readStyles();

  assert.match(css, /@media \(max-width:\s*48rem\)[\s\S]*?data-gwf-fragment="agent"[\s\S]*?display:\s*none/);
  assert.match(css, /@media \(max-width:\s*48rem\)[\s\S]*?data-gwf-fragment="tasks"[\s\S]*?display:\s*none/);
  assert.match(css, /@media \(max-width:\s*48rem\)[\s\S]*?\.gwf-flow-lanes\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});
