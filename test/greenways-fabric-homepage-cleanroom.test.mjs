import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const routePath = "src/pages/v2/applications/greenways-platform/homepage-cleanroom.astro";
const cssPath = "src/v2/greenways-fabric-homepage-cleanroom.css";

test("the clean-room Fabric homepage is a separate additive route", async () => {
  const route = await read(routePath);

  assert.match(route, /homepage-cleanroom\//);
  assert.match(route, /New route · current page unchanged/);
  assert.match(route, /One place for the things you keep, make, and delegate\./);
  assert.match(route, /The Fabric is the OS\./);
  assert.match(route, /Applications are views\./);
  assert.match(route, /Private by default\. Hosted by choice\./);
  assert.match(route, /Static specimen · no storage, identity, agent, application, or hosted action is connected\./);
});

test("the clean-room public composition exposes only current Spaces and Flow applications", async () => {
  const route = await read(routePath);
  const currentApplications = [...route.matchAll(/data-current-application=\{application\.id\}/g)];

  assert.equal(currentApplications.length, 1, "applications are rendered from one closed current list");
  assert.match(route, /id: "spaces"[\s\S]*?name: "Spaces"[\s\S]*?verb: "Understand"/);
  assert.match(route, /id: "flow"[\s\S]*?name: "Flow"[\s\S]*?verb: "Coordinate"/);
  assert.doesNotMatch(route, /id: "(?:build|studio|socials|imagine|world)"/i);
});

test("the new visual system uses restrained type and equal modular grids", async () => {
  const css = await read(cssPath);

  assert.match(css, /--gwn-display:\s*clamp\(2\.75rem, 4vw, 3\.75rem\)/);
  assert.match(css, /--gwn-body:\s*0\.9375rem/);
  assert.match(css, /\.gwn-grid--four\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.gwn-grid--three\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.gwn-grid--two\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.gwn-continuity\s*\{[\s\S]*?grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.gwn-cell\s*\{[\s\S]*?grid-template-rows:\s*auto auto 1fr auto/);
  assert.doesNotMatch(css, /box-shadow\s*:/i);
  assert.doesNotMatch(css, /border-radius\s*:/i);
  assert.doesNotMatch(css, /(?:linear|radial)-gradient\s*\(/i);
});

test("the clean-room page has deliberate tablet and phone compositions", async () => {
  const css = await read(cssPath);

  assert.match(css, /@media \(max-width: 56rem\)[\s\S]*?\.gwn-hero\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 56rem\)[\s\S]*?\.gwn-grid--three\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 36rem\)[\s\S]*?\.gwn-grid--four,[\s\S]*?\.gwn-grid--two,[\s\S]*?\.gwn-continuity\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 36rem\)[\s\S]*?\.gwn-action\s*\{[\s\S]*?inline-size:\s*100%/);
  assert.doesNotMatch(css, /white-space:\s*nowrap/i);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/i);
});

test("the clean-room stylesheet consumes shared roles without a local colour palette", async () => {
  const css = await read(cssPath);

  assert.match(css, /var\(--gw-v2-canvas\)/);
  assert.match(css, /var\(--gw-v2-surface\)/);
  assert.match(css, /var\(--gw-v2-seam\)/);
  assert.match(css, /var\(--gw-v2-signal\)/);
  assert.match(css, /var\(--gw-v2-brand-emerald\)/);
  assert.match(css, /var\(--gw-v2-brand-sapphire\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgb|rgba|hsl|hsla)\s*\(/i);
});
