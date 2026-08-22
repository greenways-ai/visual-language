import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  flattenVisualLayoutDestinations,
  visualLayoutDestinationKinds,
  visualLayoutSections,
} from "../src/v2/visual-layout-manifest.js";

test("visual-layout root covers Brand, OS, Product and Infra", () => {
  assert.deepEqual(visualLayoutSections.map((section) => section.id), [
    "brand",
    "os",
    "product",
    "infra",
  ]);

  const destinations = flattenVisualLayoutDestinations();
  assert.equal(new Set(destinations.map((route) => route.id)).size, destinations.length);
  assert.equal(new Set(destinations.filter((route) => route.path).map((route) => route.path)).size, destinations.filter((route) => route.path).length);
  assert.ok(visualLayoutSections.every((section) => section.hubPath));
  assert.ok(destinations.some((route) => route.path === "/brand/documentation/" && route.kind === "documentation"));
  assert.ok(destinations.some((route) => route.path === "/v1/" && route.kind === "brand-book"));
  assert.ok(destinations.some((route) => route.path === "/v2/foundations/" && route.kind === "brand-book"));
  assert.deepEqual(destinations.filter((route) => route.status === "placeholder").map((route) => route.label), ["Imagine", "World"]);
  assert.ok(destinations.filter((route) => route.status === "placeholder").every((route) => !route.path && route.kind === "placeholder"));
  assert.ok(destinations.filter((route) => route.external).every((route) => route.path.startsWith("https://oss.greenways.ai/")));
  assert.deepEqual(Object.keys(visualLayoutDestinationKinds), ["brand-book", "documentation", "application", "wireframe", "placeholder"]);
});

test("root component renders a minimal data-driven directory and preserves the v2 shell", async () => {
  const source = await readFile(new URL("../src/site/components/GreenwaysV2CatalogueHome.astro", import.meta.url), "utf8");
  const flame = await readFile(new URL("../src/GreenwaysFlame.astro", import.meta.url), "utf8");
  assert.match(source, /visualLayoutSections/);
  assert.match(source, /gw-v2-visual-layout-root/);
  assert.match(source, /showVisualNavigator=\{false\}/);
  assert.match(source, /showRail=\{false\}/);
  assert.match(source, /useFlameMark=\{true\}/);
  assert.match(source, /section\.hubPath/);
  assert.match(source, /gw-v2-directory-card/);
  assert.match(source, /gw-v2-directory-shader/);
  assert.match(source, /gw-v2-directory-host/);
  assert.match(source, /visualLayoutSections\.map/);
  assert.match(flame, /gw-flame-outline/);
  assert.match(flame, /stroke-width/);
  assert.match(flame, /gw-flame-core/);
  const material = await readFile(new URL("../src/v2/catalogue-material.css", import.meta.url), "utf8");
  assert.match(material, /perspective\(/);
  assert.match(material, /transform-style:\s*preserve-3d/);
  assert.match(material, /gw-v2-directory-pet-float/);
});

test("secondary section hubs share a denser title rhythm and atmospheric material", async () => {
  const source = await readFile(new URL("../src/v2/visual-layout-hubs.css", import.meta.url), "utf8");
  assert.match(source, /--gw-hub-atmosphere/);
  assert.match(source, /min-block-size: min\(28rem, 52vh\)/);
  assert.match(source, /gw-v2-section-hub__hero::before/);
  assert.match(source, /backdrop-filter: blur\(22px\)/);
  assert.match(source, /brand-violet\) 17%/);
  assert.match(source, /hub-atmosphere\) 12%/);
});
