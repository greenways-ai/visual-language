import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  GREENWAYS_FABRIC_HOMEPAGE_VERSION,
  GREENWAYS_PLATFORM_HOMEPAGE_VERSION,
  greenwaysFabricHomepage,
  greenwaysPlatformHomepage,
} from "../src/v2/greenways-platform-homepage.js";
import {
  getCatalogueGroup,
  getCatalogueRoute,
} from "../src/v2/catalogue-manifest.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const homepage = greenwaysFabricHomepage;
const stylePaths = [
  "src/v2/greenways-platform-homepage.css",
  "src/v2/greenways-platform-homepage-publication.css",
  "src/v2/greenways-platform-homepage-workspace.css",
  "src/v2/greenways-platform-homepage-editorial.css",
  "src/v2/greenways-platform-homepage-responsive.css",
];
const readStyles = async () => (await Promise.all(stylePaths.map(read))).join("\n");

const walkStrings = (value) => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(walkStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(walkStrings);
  return [];
};

test("the homepage contract is closed, current, sparse, and backwards compatible", () => {
  assert.equal(GREENWAYS_FABRIC_HOMEPAGE_VERSION, "greenways-fabric-homepage/3");
  assert.equal(GREENWAYS_PLATFORM_HOMEPAGE_VERSION, GREENWAYS_FABRIC_HOMEPAGE_VERSION);
  assert.equal(greenwaysPlatformHomepage, greenwaysFabricHomepage);
  assert.ok(Object.isFrozen(homepage));
  assert.ok(Object.isFrozen(homepage.workspace));
  assert.equal(homepage.hero.headline, "Everything settles into place.");
  assert.equal(homepage.hero.introduction, "Your work. Your identity. Clear roles.");
  assert.deepEqual(homepage.modes.map((mode) => mode.id), ["scatter", "fabric"]);
  assert.equal(homepage.fragments.length, 8);
});

test("Spaces and Flow are the only current applications in the public model", () => {
  assert.deepEqual(homepage.applications.items.map((application) => application.id), ["spaces", "flow"]);
  assert.deepEqual(homepage.applications.items.map((application) => application.label), ["Spaces", "Flow"]);
  assert.deepEqual(homepage.applications.items.map((application) => application.verb), ["Understand", "Coordinate"]);
  assert.deepEqual(homepage.agents.map((agent) => agent.application), ["Spaces", "Flow"]);

  const publicModel = walkStrings(homepage).join(" ");
  assert.doesNotMatch(publicModel, /\b(?:Build|Research|Imagine|World|Studio|Socials|Foreman)\b/);
  assert.doesNotMatch(publicModel, /\b(?:Hara|Hestia|Tahto|Hoplite|Historia|Hodos|Ignatius|MCP|database|filesystem API|Docker)\b/i);
  assert.doesNotMatch(publicModel, /\b(?:AI-native|all-in-one|supercharge|seamless|revolutionary|decentralised)\b/i);
});

test("the experience demonstrates decluttering rather than explaining it through feature sections", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /<!doctype html>/);
  assert.match(page, /class="gw2-body gwf-experience-body"/);
  assert.match(page, /data-gwf-mode="scatter"/);
  assert.match(page, /data-gwf-app="spaces"/);
  assert.match(page, /data-gwf-share="private"/);
  assert.match(page, /class="gwf-fragment-field"/);
  assert.match(page, /class="gwf-workspace"/);
  assert.match(page, /class="[^"]*gwf-spaces-view/);
  assert.match(page, /class="[^"]*gwf-flow-view/);
  assert.match(page, /class="gwf-boundary-plane"/);
  assert.match(page, /Replay declutter/);
  assert.match(page, /Share selected piece/);
  assert.doesNotMatch(page, /CatalogueShell/);
  assert.doesNotMatch(page, /gwf-capability-grid|gwf-storage-plate|gwf-identity-map|gwf-agent-grid|gwf-application-grid/);
  assert.doesNotMatch(page, /\b(?:Build|Research|Imagine|World|Studio|Socials)\b/);
});

test("all visual controls are local, named, and keyboard-native", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /data-gwf-mode-select/);
  assert.match(page, /data-gwf-app-select/);
  assert.match(page, /data-gwf-share-toggle/);
  assert.match(page, /data-gwf-theme-toggle/);
  assert.match(page, /role="tablist"/);
  assert.match(page, /role="tabpanel"/);
  assert.match(page, /aria-pressed=/);
  assert.match(page, /aria-selected=/);
  assert.match(page, /homepage\.meta\.truthfulnessNote/);
  assert.doesNotMatch(page, /href=["']\/(?:login|signup|install|publish|connect)/i);
  assert.doesNotMatch(page, /fetch\(|XMLHttpRequest|WebSocket|EventSource|localStorage\.setItem\(["'](?:token|key|account)/i);
});

test("the interaction script settles, replays, switches views, and crosses one selected projection", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /const setMode = \(mode\) =>/);
  assert.match(page, /window\.setTimeout\(\(\) => setMode\("fabric"\)/);
  assert.match(page, /const setApp = \(app\) =>/);
  assert.match(page, /panel\.hidden = panel\.getAttribute\("data-gwf-app-panel"\) !== app/);
  assert.match(page, /body\.dataset\.gwfShare = selected \? "private" : "selected"/);
  assert.match(page, /prefers-reduced-motion:\s*reduce/);
});

test("the visual language comes from the Greenways V2 atmosphere and restrained interface scale", async () => {
  const css = await readStyles();

  assert.match(css, /greenways-os-v2-foundation\.css/);
  assert.match(css, /var\(--gw2-bg\)/);
  assert.match(css, /var\(--gw2-field\)/);
  assert.match(css, /var\(--gw2-overlay\)/);
  assert.match(css, /var\(--gw2-green\)/);
  assert.match(css, /var\(--gw2-signal\)/);
  assert.match(css, /backdrop-filter:\s*blur/);
  assert.match(css, /radial-gradient/);
  assert.match(css, /\.gwf-fragment/);
  assert.match(css, /\[data-gwf-mode="fabric"\] \.gwf-fragment/);
  assert.match(css, /\.gwf-workspace/);
  assert.match(css, /\[data-gwf-share="selected"\] \.gwf-selected-projection/);
  assert.doesNotMatch(css, /#[\da-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgb|rgba|hsl|hsla)\(/i);
});

test("the v2 catalogue keeps the stable homepage route", () => {
  const family = getCatalogueRoute("/v2/applications/greenways-platform/");
  const route = getCatalogueRoute("/v2/applications/greenways-platform/homepage/");

  assert.ok(family);
  assert.equal(family.label, "Greenways Fabric");
  assert.equal(family.issue, 54);
  assert.ok(route);
  assert.equal(route.label, "www.greenways.ai homepage");
  assert.equal(route.issue, 54);
  assert.equal(route.primary, true);
  assert.equal(getCatalogueGroup(route.path)?.id, "applications");
});

test("the adoption note records interface-first ownership and the standalone shell", async () => {
  const docs = await read("docs/greenways-platform-homepage.md");
  const shell = await read("src/v2/CatalogueShell.astro");

  assert.match(docs, /interface experience, not an explanatory catalogue/i);
  assert.match(docs, /Scattered[\s\S]*Fabric[\s\S]*Applications as views[\s\S]*Explicit boundary/);
  assert.match(docs, /Spaces[\s\S]*Flow/);
  assert.match(docs, /No storage, identity, agent, application, account, upload, sync, collaboration, publication, or hosted operation is connected/i);
  assert.doesNotMatch(shell, /greenways-platform-homepage-(?:responsive|editorial)\.css\?raw/);
  assert.doesNotMatch(shell, /data-greenways-fabric-(?:responsive-cascade|editorial-calibration)/);
});
