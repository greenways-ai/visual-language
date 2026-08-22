import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { greenwaysSuiteApplications } from "../src/v2/greenways-application-suite.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("CatalogueShell emits one late material calibration while the Fabric homepage owns a standalone experience", async () => {
  const [shell, homepage] = await Promise.all([
    read("src/v2/CatalogueShell.astro"),
    read("src/pages/v2/applications/greenways-platform/homepage.astro"),
  ]);

  assert.match(shell, /catalogue-material\.css\?raw/);
  assert.match(shell, /data-greenways-v2-delicate-material/);
  assert.match(shell, /data-gw-v2-material="delicate"/);
  assert.doesNotMatch(shell, /data-greenways-fabric-editorial-calibration/);

  assert.match(homepage, /<!doctype html>/);
  assert.match(homepage, /greenways-platform-homepage\.css/);
  assert.match(homepage, /class="gw2-body gwf-experience-body"/);
  assert.doesNotMatch(homepage, /CatalogueShell/);
});

test("the compact direct menu and complete Atlas index coexist", async () => {
  const header = await read("src/v2/CatalogueHeader.astro");

  assert.match(header, /data-gw-v2-catalogue-rail/);
  assert.match(header, /visualLayoutSections\.map/);
  assert.match(header, /data-gw-v2-rail-toggle/);
  assert.match(header, /aria-label="Visual language sections"/);

  assert.match(header, /<details class="gw-v2-catalogue-nav"/);
  assert.match(header, /data-gw-v2-atlas-index/);
  assert.match(header, /greenwaysV2Catalogue\.map/);
  assert.match(header, /route\.children\.map/);
  assert.match(header, /Current applications/);
  assert.match(header, /Spaces · Flow/);
  assert.doesNotMatch(header, /<script/);
});

test("the material scale is smaller, rounded and deliberately fine", async () => {
  const css = await read("src/v2/catalogue-material.css");

  assert.match(css, /--gw-v2-type-xs:\s*0\.6875rem/);
  assert.match(css, /--gw-v2-type-md:\s*0\.9375rem/);
  assert.match(css, /--gw-v2-material-control-radius:\s*0\.5rem/);
  assert.match(css, /--gw-v2-material-card-radius:\s*0\.75rem/);
  assert.match(css, /--gw-v2-material-frame-radius:\s*0\.875rem/);
  assert.match(css, /--gw-v2-material-menu-radius:\s*0\.875rem/);
  assert.match(css, /body\.gw-suite-catalogue-body\.gw-v2-catalogue\[data-gw-v2-material="delicate"\]/);
  assert.match(css, /--gw-v2-material-card-radius:\s*1rem/);
  assert.match(css, /border:\s*1px solid var\(--gw-v2-seam\)/);
  assert.match(css, /box-shadow:\s*none/);
  assert.match(css, /font-size:\s*0\.64rem/);
});

test("neutral patterning and bounded peacock threads cover the active route families", async () => {
  const css = await read("src/v2/catalogue-material.css");

  for (const marker of [
    "--gw-v2-material-grid",
    "--gw-v2-material-paper",
    "--gw-v2-material-thread: var(--gw-v2-brand-spectrum)",
    ".gw-v2-layered-navigation::before",
    ".gw-v2-catalogue-quick-nav",
    ".gw-v2-catalogue-rail",
    ".gw-v2-atlas-system-map",
    ".gw-suite-hero__system",
    "[class*=\"fm__panel\"]",
    ".gwf-core__field",
  ]) assert.match(css, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(css, /background-image:\s*var\(--gw-v2-material-grid\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/i);
});

test("the current product contract stays closed while the visual treatment changes", () => {
  assert.deepEqual(
    greenwaysSuiteApplications.map(({ id, label, verb }) => ({ id, label, verb })),
    [
      { id: "spaces", label: "Spaces", verb: "understand" },
      { id: "flow", label: "Flow", verb: "coordinate" },
    ],
  );
});

test("the calibration covers desktop through 320px and respects reduced motion", async () => {
  const css = await read("src/v2/catalogue-material.css");

  for (const breakpoint of ["78rem", "61.25rem", "52.5rem", "42.5rem", "26.25rem", "20rem"]) {
    assert.match(css, new RegExp(`@media \\(max-width: ${breakpoint.replace(".", "\\.")}\\)`));
  }

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /transition-duration:\s*0ms/);
  assert.match(css, /animation-duration:\s*0ms/);
  assert.match(css, /inline-size:\s*calc\(100vw - 0\.7rem\)/);
});

test("the decision record keeps Hara as a density reference and Greenways as the identity", async () => {
  const [review, packageJson] = await Promise.all([
    read("docs/v2-delicate-material-calibration.md"),
    read("package.json"),
  ]);

  for (const phrase of [
    "smaller editorial and interface typography",
    "rounded cards, frames, controls and menus",
    "hara-lang/visual-language",
    "Spaces    understand",
    "Flow      coordinate",
    "site-only calibration",
    "Peacock colour is reserved",
    "Runtime boundary",
  ]) assert.match(review, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  const packageContract = JSON.parse(packageJson);
  assert.equal(packageContract.exports["./v2/catalogue-material.css"], undefined);
  assert.ok(packageContract.exports["./v2/tokens.css"]);
  assert.ok(packageContract.exports["./v2/document.css"]);
  assert.ok(packageContract.exports["./v2/workbench.css"]);
});
