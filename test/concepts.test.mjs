import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { scenes } from "../src/scene-language.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("all sixty-four environment concepts have a generated route", async () => {
  const route = await read("src/pages/concepts/[world]/[scene].astro");
  assert.equal(scenes.length, 64);
  assert.match(route, /export function getStaticPaths/);
  assert.match(route, /sceneEntries\.map/);
  assert.match(route, /concepts\/\$\{previous\.world\}\/\$\{previous\.id\}/);
  assert.match(route, /Concept specification/);
  assert.match(route, /DayNightExplorer/);
});

test("the concept catalogue links every artwork card to its own page", async () => {
  const [catalogue, index, header, config] = await Promise.all([
    read("src/site/components/ArtworkCatalogue.astro"),
    read("src/pages/concepts/index.astro"),
    read("src/site/components/SharedSiteHeader.astro"),
    read("astro.config.mjs"),
  ]);
  assert.match(catalogue, /concepts\/\$\{world\}\/\$\{scene\}/);
  assert.match(catalogue, /Open concept/);
  assert.match(index, /Object\.entries\(catalog\)/);
  assert.match(index, /66 dedicated pages/);
  assert.match(header, /label: "Concepts"/);
  assert.match(config, /Concept pages ↗/);
});

test("Statstrade feed and arena concepts have separate art pages", async () => {
  const [feed, arena, study, caseStudy] = await Promise.all([
    read("src/pages/concepts/statstrade/feed.astro"),
    read("src/pages/concepts/statstrade/arena.astro"),
    read("src/site/components/StatstradeSurfaceStudy.astro"),
    read("src/content/docs/case-studies/statstrade.mdx"),
  ]);
  assert.match(feed, /StatstradeFeedArt/);
  assert.match(feed, /Community feed/);
  assert.match(arena, /arena-day-study\.svg/);
  assert.match(arena, /Gaussian-splat environment/);
  assert.match(study, /concepts\/statstrade\/feed/);
  assert.match(study, /concepts\/statstrade\/arena/);
  assert.match(caseStudy, /Open arena concept/);
});

test("Greenways world studies expose their dedicated concept pages", async () => {
  const [districts, page, home] = await Promise.all([
    read("src/site/components/WorldDistrictGrid.astro"),
    read("src/content/docs/case-studies/greenways-world.mdx"),
    read("src/site/components/HomeDayNight.astro"),
  ]);
  assert.match(districts, /concepts\/www\/\$\{district\.scene\}/);
  assert.match(page, /concepts\/www\/world-confluence/);
  assert.match(home, /concepts\/www\/world-confluence/);
});

test("concept pages use the shared lotus shell and direct master links", async () => {
  const [shell, css, route, verify] = await Promise.all([
    read("src/site/layouts/ConceptShell.astro"),
    read("src/site/styles/concept-page.css"),
    read("src/pages/concepts/[world]/[scene].astro"),
    read("scripts/verify-site-output.mjs"),
  ]);
  assert.match(shell, /DocumentationHeader/);
  assert.match(shell, /GreenwaysThemeProvider/);
  assert.match(shell, /logoAssetBase/);
  assert.match(css, /concept-master-links/);
  assert.match(route, /Day master/);
  assert.match(route, /Night master/);
  assert.match(verify, /dist\/concepts\/hoplite\/open-gate\/index\.html/);
  assert.match(verify, /dist\/concepts\/statstrade\/feed\/index\.html/);
});
