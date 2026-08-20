import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  catalogueHref,
  flattenCatalogueRoutes,
  getCatalogueGroup,
  getCatalogueRoute,
  getCatalogueStaticRoutes,
  greenwaysV2Catalogue,
  greenwaysV2CatalogueHome,
  isCatalogueRouteActive,
  isCatalogueRouteCurrent,
  normaliseCataloguePath,
} from "../src/v2/catalogue-manifest.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const routes = flattenCatalogueRoutes();
const allowedStatuses = new Set(["ready", "in-progress", "planned", "exploration"]);
const allowedOwnership = new Set(["shared-contract", "product-laboratory", "historical-exploration"]);

test("the typed manifest has the required groups and unique routes", () => {
  assert.deepEqual(greenwaysV2Catalogue.map((group) => group.id), ["foundations", "library", "applications"]);
  assert.equal(greenwaysV2CatalogueHome.path, "/v2/");
  assert.equal(greenwaysV2CatalogueHome.status, "ready");

  assert.equal(new Set(routes.map((route) => route.id)).size, routes.length);
  assert.equal(new Set(routes.map((route) => route.path)).size, routes.length);

  for (const route of routes) {
    assert.ok(route.id.length > 0, route.path);
    assert.ok(route.label.length > 0, route.path);
    assert.ok(route.summary.length > 0, route.path);
    assert.ok(route.path.startsWith("/"), route.path);
    assert.ok(route.path.endsWith("/"), route.path);
    assert.ok(allowedStatuses.has(route.status), route.path);
    assert.ok(allowedOwnership.has(route.ownership), route.path);
  }
});

test("Foreman owns the primary application route family", () => {
  const applications = greenwaysV2Catalogue.find((group) => group.id === "applications");
  const foreman = applications?.routes.find((route) => route.id === "foreman");
  assert.ok(foreman);
  assert.equal(foreman.ownership, "product-laboratory");
  assert.equal(foreman.primary, true);
  assert.deepEqual(foreman.children?.map((route) => route.id), [
    "foreman-model",
    "foreman-projects",
    "foreman-handoffs",
    "foreman-surfaces",
  ]);
  assert.deepEqual(foreman.children?.map((route) => route.issue), [35, 36, 37, 38]);
});

test("historical Greenways routes remain reachable but secondary", () => {
  const historical = routes.filter((route) => route.ownership === "historical-exploration");
  assert.ok(historical.length >= 15);
  for (const route of historical) {
    assert.equal(route.status, "exploration", route.id);
    assert.equal(route.primary, false, route.id);
    assert.match(route.path, /^\/concepts\/greenways(?:-v2)?\//, route.id);
  }

  assert.equal(getCatalogueRoute("/concepts/greenways-v2/")?.id, "greenways-os-exploration");
  assert.equal(getCatalogueRoute("/concepts/greenways/keyring/")?.id, "greenways-product-keyring");
});

test("static generation covers every declared v2 route and no historical route", () => {
  const expected = routes.filter((route) => route.path.startsWith("/v2/") && route.path !== "/v2/");
  assert.deepEqual(getCatalogueStaticRoutes().map((route) => route.id), expected.map((route) => route.id));
  assert.ok(getCatalogueStaticRoutes().every((route) => route.status !== "exploration"));
});

test("path helpers preserve the Astro base and exact current state", () => {
  assert.equal(catalogueHref("/v2/", "/visual-language/"), "/visual-language/v2/");
  assert.equal(catalogueHref("/concepts/greenways-v2/", "/visual-language"), "/visual-language/concepts/greenways-v2/");
  assert.equal(normaliseCataloguePath("/visual-language/v2/library?mode=dark", "/visual-language"), "/v2/library/");
  assert.equal(isCatalogueRouteCurrent("/v2/library/", "/visual-language/v2/library/", "/visual-language"), true);
  assert.equal(isCatalogueRouteCurrent("/v2/library/", "/visual-language/v2/library/components/", "/visual-language"), false);
  assert.equal(isCatalogueRouteActive("/v2/library/", "/visual-language/v2/library/components/", "/visual-language"), true);
  assert.equal(getCatalogueGroup("/v2/applications/foreman/handoffs/")?.id, "applications");
});

test("the shared header derives one semantic disclosure tree from the manifest", async () => {
  const source = await read("src/v2/CatalogueHeader.astro");
  assert.match(source, /greenwaysV2Catalogue\.map/);
  assert.match(source, /route\.children\.map/);
  assert.match(source, /<nav aria-label="Greenways v2 catalogue">/);
  assert.match(source, /<details class="gw-v2-catalogue-nav"/);
  assert.match(source, /<summary>/);
  assert.match(source, /aria-current=/);
  assert.doesNotMatch(source, /on(?:mouse|pointer|touch)/i);
  assert.doesNotMatch(source, /<script/);
});

test("catalogue home and planned pages are generated from the same manifest", async () => {
  const [home, route, shell] = await Promise.all([
    read("src/pages/v2/index.astro"),
    read("src/pages/v2/[...route].astro"),
    read("src/v2/CatalogueShell.astro"),
  ]);
  assert.match(home, /greenwaysV2Catalogue\.map/);
  assert.match(home, /route\.children\.map/);
  assert.match(route, /getCatalogueStaticRoutes\(\)\.map/);
  assert.match(route, /getStaticPaths/);
  assert.match(route, /Declared now\. Detailed later\./);
  assert.match(shell, /CatalogueHeader/);
  assert.match(shell, /class="gw-v2 gw-v2-document gw-v2-catalogue"/);
});

test("navigation remains compact and prevents document overflow at 320px", async () => {
  const css = await read("src/v2/catalogue.css");
  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /min-inline-size:\s*0/);
  assert.match(css, /minmax\(min\(100%,\s*18rem\),\s*1fr\)/);
  assert.match(css, /@media \(min-width: 48rem\)/);
  assert.match(css, /\.gw-v2-catalogue-nav > summary/);
  assert.match(css, /\.gw-v2-catalogue-nav\[open\]/);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/);
  assert.doesNotMatch(css, /white-space:\s*nowrap/);
});
