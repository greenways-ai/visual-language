import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const screenIds = [
  "today",
  "workrooms",
  "studio",
  "campaigns",
  "packages",
  "keyring",
  "receipts",
];

test("the Greenways product model defines exactly seven connected screens", async () => {
  const source = await read("src/greenways-product-screens.ts");
  const definitions = [...source.matchAll(/^\s{4}id: "([a-z-]+)",$/gm)].map((match) => match[1]);

  assert.deepEqual(definitions, screenIds);
  assert.match(source, /Human-readable place to manage personal keys/);
  assert.match(source, /Accountability without surveillance/);
  assert.match(source, /portable publication/);
});

test("the dynamic route statically expands every Greenways screen", async () => {
  const source = await read("src/pages/concepts/greenways/[screen].astro");

  assert.match(source, /export function getStaticPaths\(\)/);
  assert.match(source, /greenwaysProductScreens\.map\(\(screen, position\)/);
  assert.match(source, /params: \{ screen: screen\.id \}/);
  assert.match(source, /<GreenwaysProductView screen=\{screen\} position=\{position\} \/>/);
});

test("the shared shell carries navigation, colour theme and mobile controls", async () => {
  const source = await read("src/site/layouts/GreenwaysProductShell.astro");

  assert.match(source, /aria-label="Greenways product navigation"/);
  assert.match(source, /greenwaysProductScreens\.map/);
  assert.match(source, /data-theme-toggle/);
  assert.match(source, /greenways-product-theme/);
  assert.match(source, /data-nav-open/);
  assert.match(source, /gw-skip-link/);
});

test("each screen contains a purpose-built workflow", async () => {
  const source = await read("src/site/components/GreenwaysProductView.astro");

  for (const id of screenIds) {
    assert.match(source, new RegExp(`screen\\.id === "${id}"`));
  }

  assert.match(source, /Snippet of the day/);
  assert.match(source, /People and agents/);
  assert.match(source, /Source relationship/);
  assert.match(source, /Distribution channels/);
  assert.match(source, /Namespace maintainers/);
  assert.match(source, /Recovery circle/);
  assert.match(source, /Action trace/);
});

test("the product screens adapt to dark mode, reduced motion and smaller viewports", async () => {
  const source = await read("src/site/styles/greenways-product.css");

  assert.match(source, /html\[data-theme="dark"\]/);
  assert.match(source, /@media \(max-width: 980px\)/);
  assert.match(source, /@media \(max-width: 720px\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /\.gw-workrooms-layout/);
  assert.match(source, /\.gw-studio-shell/);
  assert.match(source, /\.gw-receipts-layout/);
});

test("the Greenways overview explains the connected product model", async () => {
  const source = await read("src/pages/concepts/greenways/index.astro");

  assert.match(source, /These seven screens form the product spine/);
  assert.match(source, /Human decisions stay visible/);
  assert.match(source, /Receipts, not surveillance/);
  assert.match(source, /Portable by default/);
  assert.match(source, /Open systems feel approachable/);
});
