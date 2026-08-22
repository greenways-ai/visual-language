import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  flattenVisualLayoutDestinations,
  visualLayoutDestinationKinds,
  visualLayoutSections,
} from "../src/v2/visual-layout-manifest.js";

test("visual-layout root covers themes, OS, product and infrastructure", () => {
  assert.deepEqual(visualLayoutSections.map((section) => section.id), [
    "themes",
    "os",
    "product",
    "infra",
  ]);

  const destinations = flattenVisualLayoutDestinations();
  assert.equal(new Set(destinations.map((route) => route.id)).size, destinations.length);
  assert.equal(new Set(destinations.filter((route) => route.path).map((route) => route.path)).size, destinations.filter((route) => route.path).length);
  assert.ok(destinations.some((route) => route.path === "/v1/" && route.kind === "brand-book"));
  assert.ok(destinations.some((route) => route.path === "/v2/foundations/" && route.kind === "brand-book"));
  assert.deepEqual(destinations.filter((route) => route.status === "placeholder").map((route) => route.label), ["Imagine", "World"]);
  assert.ok(destinations.filter((route) => route.status === "placeholder").every((route) => !route.path && route.kind === "placeholder"));
  assert.ok(destinations.filter((route) => route.external).every((route) => route.path.startsWith("https://oss.greenways.ai/")));
  assert.deepEqual(Object.keys(visualLayoutDestinationKinds), ["brand-book", "documentation", "application", "wireframe", "placeholder"]);
});

test("root component renders the data-driven destination map and preserves the v2 shell", async () => {
  const source = await readFile(new URL("../src/site/components/GreenwaysV2CatalogueHome.astro", import.meta.url), "utf8");
  assert.match(source, /visualLayoutSections/);
  assert.match(source, /visualLayoutDestinationKinds/);
  assert.match(source, /gw-v2-visual-layout-root/);
  assert.match(source, /visual-layout-themes/);
  assert.match(source, /route\.path \?/);
  assert.match(source, /gw-v2-visual-layout-destination--placeholder/);
  assert.match(source, /visual-worlds-title/);
  assert.match(source, /visualLayoutSections\.map/);
});
