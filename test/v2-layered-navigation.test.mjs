import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  findCatalogueLocation,
  getCatalogueRouteContext,
  getCatalogueRouteSequence,
} from "../src/v2/catalogue-navigation.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("deep routes derive parent, family and breadcrumbs from one manifest", () => {
  const context = getCatalogueRouteContext(
    "/visual-language/v2/library/components/",
    "/visual-language/",
  );

  assert.ok(context);
  assert.equal(context.group.id, "library");
  assert.equal(context.item.id, "component-laboratory");
  assert.equal(context.parent?.id, "library-home");
  assert.equal(context.parentTarget.path, "/v2/library/");
  assert.equal(context.familyLabel, "Library overview");
  assert.deepEqual(context.siblings.map((route) => route.path), [
    "/v2/library/",
    "/v2/library/components/",
    "/v2/library/workflows/",
  ]);
  assert.deepEqual(context.breadcrumbs.map((crumb) => crumb.label), [
    "Catalogue",
    "Library",
    "Library overview",
    "Components",
  ]);
  assert.equal(context.breadcrumbs.at(-1)?.current, true);
  assert.equal(context.previous?.path, "/v2/library/");
  assert.equal(context.next?.path, "/v2/library/workflows/");
});

test("Foreman routes retain a distinct product family and deterministic neighbours", () => {
  const context = getCatalogueRouteContext("/v2/applications/foreman/model/");
  assert.ok(context);
  assert.equal(context.group.id, "applications");
  assert.equal(context.parent?.path, "/v2/applications/foreman/");
  assert.deepEqual(context.siblings.map((route) => route.id), [
    "foreman",
    "foreman-model",
    "foreman-tools",
    "foreman-projects",
    "foreman-handoffs",
    "foreman-surfaces",
  ]);
  assert.equal(context.previous?.id, "foreman");
  assert.equal(context.next?.id, "foreman-tools");
  assert.equal(context.ownershipLabel, "Product laboratory");
});

test("the route sequence is unique, current and excludes historical explorations", () => {
  const sequence = getCatalogueRouteSequence();
  assert.ok(sequence.length >= 9);
  assert.equal(new Set(sequence.map((route) => route.path)).size, sequence.length);
  assert.ok(sequence.every((route) => route.path.startsWith("/v2/")));
  assert.ok(sequence.every((route) => route.primary !== false));
  assert.ok(sequence.every((route) => route.status !== "exploration"));
  assert.equal(findCatalogueLocation("/concepts/greenways-v2/")?.item.id, "greenways-os-exploration");
  assert.equal(getCatalogueRouteContext("/concepts/greenways-v2/"), undefined);
});

test("the route bar exposes parent, breadcrumb, peer and status semantics", async () => {
  const source = await read("src/v2/CatalogueRouteBar.astro");
  assert.match(source, /getCatalogueRouteContext/);
  assert.match(source, /aria-label="Breadcrumb"/);
  assert.match(source, /aria-current="page"/);
  assert.match(source, /context\.siblings\.map/);
  assert.match(source, /context\.statusLabel/);
  assert.match(source, /context\.ownershipLabel/);
  assert.match(source, /context\.parentTarget\.path/);
  assert.doesNotMatch(source, /greenways-os-v2|Today|Workrooms|Keyring/);
});

test("section navigation progressively enhances meaningful page sections", async () => {
  const source = await read("src/v2/CatalogueSectionNav.astro");
  assert.match(source, /hidden\n\s+data-gw-v2-section-nav/);
  assert.match(source, /data-catalogue-section/);
  assert.match(source, /sections\.length < 2/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /aria-current", "location"/);
  assert.match(source, /event\.key !== "Escape"/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /astro:page-load/);
});

test("previous and next navigation is manifest-derived and server-rendered", async () => {
  const source = await read("src/v2/CataloguePageFooter.astro");
  assert.match(source, /getCatalogueRouteContext/);
  assert.match(source, /rel="prev"/);
  assert.match(source, /rel="next"/);
  assert.match(source, /context\.previous/);
  assert.match(source, /context\.next/);
  assert.match(source, /<footer class="gw-v2-catalogue-page-footer"/);
  assert.doesNotMatch(source, /<template|cloneNode|DOMContentLoaded|astro:page-load/);
});

test("the shared shell composes global, route, section and footer navigation", async () => {
  const [navigation, shell] = await Promise.all([
    read("src/v2/CatalogueNavigation.astro"),
    read("src/v2/CatalogueShell.astro"),
  ]);
  for (const component of [
    "CatalogueHeader",
    "CatalogueRouteBar",
    "CatalogueSectionNav",
  ]) assert.match(navigation, new RegExp(component));
  assert.match(shell, /CatalogueNavigation/);
  assert.match(shell, /CataloguePageFooter/);
  assert.match(shell, /id="gw-v2-main"/);
  assert.match(shell, /sectionNavigation/);
  assert.doesNotMatch(navigation, /<nav[^>]+on(?:mouse|pointer|touch)/i);
});

test("custom catalogue pages use the same layered navigation contract", async () => {
  const paths = [
    "src/pages/v2/foundations/index.astro",
    "src/pages/v2/library/index.astro",
    "src/pages/v2/library/components/index.astro",
    "src/pages/v2/library/workflows/index.astro",
    "src/pages/v2/applications/foreman/model.astro",
  ];

  for (const path of paths) {
    const source = await read(path);
    assert.match(source, /CatalogueNavigation/, path);
    assert.match(source, /CataloguePageFooter/, path);
    assert.match(source, /gw-v2-catalogue/, path);
    assert.match(source, /id="gw-v2-main"/, path);
    assert.match(source, /data-catalogue-section/, path);
  }
});

test("navigation styling is neutral, keyboard-visible and compact at 320px", async () => {
  const css = await read("src/v2/catalogue-navigation.css");
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /aria-current="page"/);
  assert.match(css, /aria-current="location"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 52\.5rem\)/);
  assert.match(css, /@media \(max-width: 42\.5rem\)/);
  assert.match(css, /@media \(max-width: 24\.375rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/);
});
