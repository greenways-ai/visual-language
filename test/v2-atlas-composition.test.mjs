import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  greenwaysSuiteApplications,
  greenwaysSuiteScreens,
} from "../src/v2/greenways-application-suite.js";
import {
  flattenCatalogueRoutes,
  greenwaysV2Catalogue,
} from "../src/v2/catalogue-manifest.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the active v2 shell uses one compact atlas frame while retaining route truth", async () => {
  const [shell, navigation, header, routeBar, sectionNav, css] = await Promise.all([
    read("src/v2/CatalogueShell.astro"),
    read("src/v2/CatalogueNavigation.astro"),
    read("src/v2/CatalogueHeader.astro"),
    read("src/v2/CatalogueRouteBar.astro"),
    read("src/v2/CatalogueSectionNav.astro"),
    read("src/v2/catalogue-atlas.css"),
  ]);

  assert.match(shell, /catalogue-atlas\.css/);
  assert.match(shell, /data-gw-v2-atlas-frame/);
  assert.match(navigation, /CatalogueHeader/);
  assert.match(navigation, /CatalogueRouteBar/);
  assert.match(navigation, /CatalogueSectionNav/);
  assert.match(header, /data-gw-v2-atlas-index/);
  assert.match(header, /Atlas index/);
  assert.match(header, /Current applications/);
  assert.match(header, /Spaces · Flow/);
  assert.match(routeBar, /data-status=\{context\.item\.status\}/);
  assert.match(routeBar, /data-ownership=\{context\.item\.ownership\}/);
  assert.match(routeBar, /context\.item\.issue/);
  assert.match(sectionNav, /data-gw-v2-section-nav/);
  assert.match(css, /\.gw-v2-catalogue-nav\[open\] > \.gw-v2-catalogue-nav__body/);
  assert.match(css, /\.gw-v2-catalogue-section-nav\s*\{[\s\S]*position:\s*fixed/);
});

test("the v2 front door is a spatial atlas rather than an equal-weight route-card wall", async () => {
  const page = await read("src/pages/v2/index.astro");

  for (const marker of [
    "data-v2-atlas-home",
    "One visual language.",
    "Every surface in its proper form.",
    "The specimen leads.",
    "Two applications.",
    "One Fabric beneath them.",
    "Browse by visual layer",
    "Elegance comes from hierarchy",
  ]) assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(page, /greenwaysV2Catalogue\.map/);
  assert.match(page, /route\.children/);
  assert.match(page, /catalogueStatusLabels/);
  assert.match(page, /catalogueOwnershipLabels/);
  assert.doesNotMatch(page, /One catalogue\.<br \/>Clear ownership\./);
  assert.doesNotMatch(page, /Foreman is the current application laboratory/);

  const typedRouteCount = flattenCatalogueRoutes().length;
  const declaredRouteCount = greenwaysV2Catalogue.reduce(
    (count, group) =>
      count + group.routes.reduce(
        (groupCount, route) => groupCount + 1 + (route.children?.length ?? 0),
        0,
      ),
    0,
  );
  assert.equal(declaredRouteCount, typedRouteCount);
});

test("the current suite adopts the atlas composition without changing its closed product contract", async () => {
  const [suite, editorial, entry] = await Promise.all([
    read("src/v2/GreenwaysApplicationSuite.astro"),
    read("src/v2/greenways-suite/styles/editorial.css"),
    read("src/v2/greenways-application-suite.css"),
  ]);

  assert.deepEqual(
    greenwaysSuiteApplications.map(({ label, verb }) => [label, verb]),
    [["Spaces", "understand"], ["Flow", "coordinate"]],
  );
  assert.deepEqual(
    greenwaysSuiteScreens.map(({ id }) => id),
    ["overview", "desktop", "browser", "companion", "cli", "handoff"],
  );

  for (const marker of [
    "data-suite-hero-atlas",
    "data-current-applications=\"spaces flow\"",
    "data-current-launcher-count=\"2\"",
    "Two applications.",
    "One Fabric.",
    "System surfaces remain subordinate",
    "MosaicLogo",
    "gw-suite-specimen",
  ]) assert.match(suite, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(entry, /styles\/editorial\.css/);
  assert.match(editorial, /\.gw-suite-hero__system/);
  assert.match(editorial, /--gw-suite-current-app:\s*var\(--gw-suite-spaces\)/);
  assert.match(editorial, /--gw-suite-current-app:\s*var\(--gw-suite-flow\)/);
});

test("atlas and suite calibration use semantic colour roles and deliberate responsive composition", async () => {
  const css = [
    await read("src/v2/catalogue-atlas.css"),
    await read("src/v2/greenways-suite/styles/editorial.css"),
  ].join("\n");

  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/i);
  for (const role of [
    "--gw-v2-canvas",
    "--gw-v2-surface",
    "--gw-v2-text",
    "--gw-v2-seam",
    "--gw-v2-signal",
    "--gw-v2-brand-emerald",
    "--gw-v2-brand-sapphire",
  ]) assert.match(css, new RegExp(`var\\(${role.replaceAll("-", "\\-")}\\)`));

  for (const breakpoint of ["78rem", "61.25rem", "52.5rem", "42.5rem", "26.25rem"]) {
    assert.match(css, new RegExp(`@media \\(max-width: ${breakpoint.replace(".", "\\.")}\\)`));
  }
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("the site review records the whole-route decision and protects current ownership", async () => {
  const review = await read("docs/v2-atlas-composition-review.md");

  for (const phrase of [
    "The specimen leads",
    "One bar, one folio, one optional index",
    "Applications retain distinct spatial grammar",
    "Product truth is not visual decoration",
    "Route-family review",
    "Spaces    understand",
    "Flow      coordinate",
    "no Foreman workbench files changed",
  ]) assert.match(review, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(review, /does \*\*not\*\* restore its historical product taxonomy/);
  assert.match(review, /does not:\n\n- add a third current application/);
});
