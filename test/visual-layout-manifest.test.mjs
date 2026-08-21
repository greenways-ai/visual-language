import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  flattenVisualLayoutDestinations,
  visualLayoutDestinationKinds,
  visualLayoutSections,
} from "../src/v2/visual-layout-manifest.js";

test("visual-layout root covers brand books, sibling docs, applications, and wireframes", () => {
  assert.deepEqual(visualLayoutSections.map((section) => section.id), [
    "brand-systems",
    "documentation-styles",
    "application-styles",
    "wireframes",
  ]);

  const destinations = flattenVisualLayoutDestinations();
  assert.equal(new Set(destinations.map((route) => route.id)).size, destinations.length);
  assert.equal(new Set(destinations.map((route) => route.path)).size, destinations.length);
  assert.ok(destinations.some((route) => route.path === "/v1/" && route.kind === "brand-book"));
  assert.ok(destinations.some((route) => route.path === "/v2/foundations/" && route.kind === "brand-book"));
  assert.ok(destinations.filter((route) => route.kind === "documentation").every((route) => route.external));
  assert.ok(destinations.filter((route) => route.kind !== "documentation").every((route) => route.path.startsWith("/") || route.external));
  assert.deepEqual(Object.keys(visualLayoutDestinationKinds), ["brand-book", "documentation", "application", "wireframe"]);
});

test("root component renders the data-driven destination map and preserves the v2 shell", async () => {
  const source = await readFile(new URL("../src/site/components/GreenwaysV2CatalogueHome.astro", import.meta.url), "utf8");
  assert.match(source, /visualLayoutSections/);
  assert.match(source, /visualLayoutDestinationKinds/);
  assert.match(source, /gw-v2-visual-layout-map/);
  assert.match(source, /route\.external \? route\.path : href\(route\.path\)/);
  assert.match(source, /greenwaysV2Catalogue\.map/);
});
