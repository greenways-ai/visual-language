import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  getGreenwaysSuiteScreen,
  greenwaysSuiteApplications,
  greenwaysSuiteAttention,
  greenwaysSuiteContract,
  greenwaysSuiteHandoff,
  greenwaysSuiteRecentObjects,
  greenwaysSuiteScreens,
  greenwaysSuiteSearchResults,
  greenwaysSuiteSystemSurfaces,
  greenwaysSuiteUnactivatedTargets,
} from "../src/v2/greenways-application-suite.js";
import {
  getCatalogueRoute,
  greenwaysV2Catalogue,
} from "../src/v2/catalogue-manifest.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const currentOnly = (value) => String(value).toLowerCase();

test("the current suite is a closed two-application contract", () => {
  assert.equal(greenwaysSuiteContract, "greenways-application-suite/1");
  assert.ok(Object.isFrozen(greenwaysSuiteApplications));
  assert.deepEqual(greenwaysSuiteApplications.map(({ id, label, verb }) => ({ id, label, verb })), [
    { id: "spaces", label: "Spaces", verb: "understand" },
    { id: "flow", label: "Flow", verb: "coordinate" },
  ]);

  const launcherCopy = currentOnly(greenwaysSuiteApplications.map((item) => `${item.id} ${item.label}`).join(" "));
  for (const forbidden of [
    "today", "workrooms", "studio", "campaigns", "packages", "keyring", "receipts",
    "research", "build", "imagine", "world", "socials",
  ]) assert.doesNotMatch(launcherCopy, new RegExp(`\\b${forbidden}\\b`));
});

test("the screen family covers overview, desktop, browser, compact, CLI, and handoff views", () => {
  assert.deepEqual(greenwaysSuiteScreens.map((screen) => screen.id), [
    "overview",
    "desktop",
    "browser",
    "companion",
    "cli",
    "handoff",
  ]);
  assert.equal(new Set(greenwaysSuiteScreens.map((screen) => screen.path)).size, greenwaysSuiteScreens.length);
  for (const screen of greenwaysSuiteScreens) {
    assert.equal(getGreenwaysSuiteScreen(screen.id), screen);
    assert.match(screen.path, /^\/v2\/applications\/greenways-suite\//);
  }
});

test("recents, search, and attention retain owner, stable identity, freshness, authority, and evidence", () => {
  assert.ok(Object.isFrozen(greenwaysSuiteRecentObjects));
  assert.ok(Object.isFrozen(greenwaysSuiteSearchResults));
  assert.ok(Object.isFrozen(greenwaysSuiteAttention));

  for (const recent of greenwaysSuiteRecentObjects) {
    assert.ok(["spaces", "flow"].includes(recent.application));
    for (const key of ["kind", "id", "label", "freshness", "authority"]) assert.ok(recent[key], `${recent.id}:${key}`);
  }
  for (const result of greenwaysSuiteSearchResults) {
    assert.ok(["Spaces", "Flow"].includes(result.owner));
    for (const key of ["kind", "id", "label", "freshness", "authority"]) assert.ok(result[key], `${result.id}:${key}`);
  }
  for (const item of greenwaysSuiteAttention) {
    assert.ok(["spaces", "flow"].includes(item.application));
    assert.ok(item.target.includes("/"));
    assert.ok(item.evidence.length > 0);
  }
});

test("the handoff preserves exact roots, included context, excluded authority, and truthful lifecycle", () => {
  assert.ok(Object.isFrozen(greenwaysSuiteHandoff));
  assert.equal(greenwaysSuiteHandoff.source.application, "Spaces");
  assert.equal(greenwaysSuiteHandoff.source.root, "space/open-distribution");
  assert.equal(greenwaysSuiteHandoff.target.application, "Flow");
  assert.equal(greenwaysSuiteHandoff.target.project, "flow/project/release-24");
  assert.equal(greenwaysSuiteHandoff.target.work, "flow/work/claim-evidence");
  assert.ok(greenwaysSuiteHandoff.target.optionalGrouping.startsWith("milestone/"));

  assert.deepEqual(greenwaysSuiteHandoff.lifecycle.map(([state]) => state), [
    "prepared",
    "approval-required",
    "ready",
    "accepted",
    "creating",
    "received",
    "selected",
    "completed",
  ]);
  assert.deepEqual(greenwaysSuiteHandoff.alternatives, [
    "partial", "rejected", "cancelled", "incompatible", "stale", "failed",
  ]);
  assert.ok(greenwaysSuiteHandoff.included.some((item) => /source anchors/i.test(item)));
  assert.ok(greenwaysSuiteHandoff.excluded.some((item) => /membership/i.test(item)));
  assert.ok(greenwaysSuiteHandoff.excluded.some((item) => /credentials/i.test(item)));
  assert.ok(greenwaysSuiteHandoff.excluded.some((item) => /automatic acceptance/i.test(item)));
});

test("future targets are hidden, unactivated, and not promoted into current surfaces", () => {
  assert.equal(greenwaysSuiteUnactivatedTargets.length, 2);
  for (const target of greenwaysSuiteUnactivatedTargets) {
    assert.equal(target.state, "unactivated");
    assert.equal(target.visibleInLauncher, false);
    assert.ok(target.reason.length > 0);
  }

  const currentProjection = JSON.stringify({
    applications: greenwaysSuiteApplications,
    recents: greenwaysSuiteRecentObjects,
    search: greenwaysSuiteSearchResults,
  }).toLowerCase();
  assert.doesNotMatch(currentProjection, /"id":"(?:imagine|world)"/);
});

test("the executable screens keep host boundaries, static actions, and technical disclosure truthful", async () => {
  const componentPaths = [
    "src/v2/GreenwaysApplicationSuite.astro",
    "src/v2/greenways-suite/OverviewScreen.astro",
    "src/v2/greenways-suite/DesktopScreen.astro",
    "src/v2/greenways-suite/BrowserScreen.astro",
    "src/v2/greenways-suite/CompanionScreen.astro",
    "src/v2/greenways-suite/CliScreen.astro",
    "src/v2/greenways-suite/HandoffScreen.astro",
  ];
  const [componentSources, indexRoute, screenRoute] = await Promise.all([
    Promise.all(componentPaths.map(read)),
    read("src/pages/v2/applications/greenways-suite/index.astro"),
    read("src/pages/v2/applications/greenways-suite/[screen].astro"),
  ]);
  const component = componentSources.join("\n");

  for (const marker of [
    "data-greenways-suite",
    "data-current-applications=\"spaces flow\"",
    "data-current-launcher-count=\"2\"",
    "data-host=\"native\"",
    "data-selected-application=\"spaces\"",
    "data-future-products-hidden",
  ]) assert.match(component, new RegExp(marker));

  for (const screen of greenwaysSuiteScreens.map((item) => item.id)) {
    assert.match(componentSources[0], new RegExp(`screen\\.id === "${screen}"`));
  }

  assert.match(component, /Current Greenways applications/);
  assert.match(component, /System surfaces/);
  assert.match(component, /Foreman appears only under technical disclosure/);
  assert.match(component, /disabled>Decision specimen · no handoff connected/);
  assert.match(component, /No editing here/);
  assert.doesNotMatch(component, /data-gw2-app-open|Opened .* buffer/);

  assert.match(indexRoute, /GreenwaysApplicationSuite/);
  assert.match(indexRoute, /screenId=\{screen\.id\}/);
  assert.match(screenRoute, /export function getStaticPaths\(\)/);
  assert.match(screenRoute, /greenwaysSuiteScreens/);
  assert.match(screenRoute, /CatalogueShell/);
});

test("the typed catalogue registers the current suite and all five host or handoff children", () => {
  const applications = greenwaysV2Catalogue.find((group) => group.id === "applications");
  const suite = applications?.routes.find((route) => route.id === "greenways-suite");
  assert.ok(suite);
  assert.equal(suite.label, "Current Greenways suite");
  assert.equal(suite.issue, 58);
  assert.equal(suite.status, "in-progress");
  assert.equal(suite.ownership, "product-laboratory");
  assert.deepEqual(suite.children?.map((route) => route.id), [
    "greenways-suite-desktop",
    "greenways-suite-browser",
    "greenways-suite-companion",
    "greenways-suite-cli",
    "greenways-suite-handoff",
  ]);
  assert.equal(getCatalogueRoute("/v2/applications/greenways-suite/desktop/")?.issue, 59);
  assert.equal(getCatalogueRoute("/v2/applications/greenways-suite/browser/")?.issue, 36);
});

test("the screen stylesheet uses shared semantic roles and collapses deliberately through 320px", async () => {
  const cssPaths = [
    "src/v2/greenways-application-suite.css",
    "src/v2/greenways-suite/styles/base.css",
    "src/v2/greenways-suite/styles/shared-screens.css",
    "src/v2/greenways-suite/styles/flow-desktop.css",
    "src/v2/greenways-suite/styles/browser.css",
    "src/v2/greenways-suite/styles/companion.css",
    "src/v2/greenways-suite/styles/cli-handoff.css",
    "src/v2/greenways-suite/styles/responsive.css",
  ];
  const cssSources = await Promise.all(cssPaths.map(read));
  const css = cssSources.join("\n");
  for (const module of cssPaths.slice(1)) {
    assert.match(cssSources[0], new RegExp(module.replace("src/v2/", "./").replaceAll(".", "\\.")));
  }
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/i);
  assert.match(css, /var\(--gw-v2-canvas\)/);
  assert.match(css, /var\(--gw-v2-signal\)/);
  assert.match(css, /--gw-suite-spaces:/);
  assert.match(css, /--gw-suite-flow:/);
  assert.match(css, /\.gw-suite-browser-frame[\s\S]*border-radius:\s*var\(--gw-v2-material-frame-radius\)/);
  assert.match(css, /\.gw-suite-browser-context nav[\s\S]*border-radius:\s*var\(--gw-v2-radius-pill\)/);
  assert.match(css, /@media \(max-width: 78rem\)/);
  assert.match(css, /@media \(max-width: 61\.25rem\)/);
  assert.match(css, /@media \(max-width: 42\.5rem\)/);
  assert.match(css, /@media \(max-width: 26\.25rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/);
});

test("the decision record names current ownership, historical continuity, and static runtime limits", async () => {
  const docs = await read("docs/greenways-application-suite.md");
  for (const phrase of [
    "Spaces    understand",
    "Flow      coordinate",
    "Suite overview",
    "Native desktop",
    "Browser workspace",
    "Browser companion",
    "CLI companion",
    "Spaces ↔ Flow handoff",
    "Earlier idea",
    "static Visual Language laboratory",
  ]) assert.match(docs, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const surface of greenwaysSuiteSystemSurfaces) assert.match(docs, new RegExp(surface));
});
