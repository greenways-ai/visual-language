import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the Fabric homepage emits its responsive contract after route base styles", async () => {
  const [shell, entry, responsive] = await Promise.all([
    read("src/v2/CatalogueShell.astro"),
    read("src/v2/greenways-platform-homepage.css"),
    read("src/v2/greenways-platform-homepage-responsive.css"),
  ]);

  const responsiveImport = entry.indexOf('@import "./greenways-platform-homepage-responsive.css";');
  const firstBaseRule = entry.indexOf(".gwf-review");

  assert.ok(responsiveImport >= 0, "the route entry still owns the responsive module");
  assert.ok(firstBaseRule > responsiveImport, "the historical import order that caused the cascade regression remains detectable");

  assert.match(shell, /greenways-platform-homepage-responsive\.css\?raw/);
  assert.match(shell, /const fabricHomepagePath = "\/v2\/applications\/greenways-platform\/homepage\/"/);
  assert.match(shell, /currentPath === fabricHomepagePath \|\| currentPath\.endsWith\(fabricHomepagePath\)/);
  assert.match(shell, /data-greenways-fabric-responsive-cascade/);
  assert.match(shell, /set:html=\{greenwaysFabricResponsiveCss\}/);

  const themeProvider = shell.indexOf("<GreenwaysThemeProvider />");
  const lateResponsiveStyle = shell.indexOf("data-greenways-fabric-responsive-cascade");
  assert.ok(lateResponsiveStyle > themeProvider, "the late responsive style must follow the route and theme stylesheet links");

  assert.match(responsive, /@media \(max-width: 58rem\)[\s\S]*?\.gwf-review\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(responsive, /@media \(max-width: 42rem\)[\s\S]*?\.gwf-home__header\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(responsive, /@media \(max-width: 42rem\)[\s\S]*?\.gwf-home__hero[\s\S]*?padding-inline:\s*var\(--gw-v2-space-sm\)/);
  assert.match(responsive, /@media \(max-width: 30rem\)[\s\S]*?\.gwf-home__nav\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test("the compact Fabric composition does not preserve desktop-only width constraints", async () => {
  const responsive = await read("src/v2/greenways-platform-homepage-responsive.css");

  assert.match(responsive, /@media \(max-width: 42rem\)[\s\S]*?\.gwf-home__actions\s*\{[\s\S]*?display:\s*grid/);
  assert.match(responsive, /@media \(max-width: 42rem\)[\s\S]*?\.gwf-home__action\s*\{[\s\S]*?inline-size:\s*100%/);
  assert.match(responsive, /@media \(max-width: 42rem\)[\s\S]*?\.gwf-core__pillars li\s*\{[\s\S]*?position:\s*static/);
  assert.match(responsive, /@media \(max-width: 30rem\)[\s\S]*?\.gwf-identity-map > ol\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.doesNotMatch(responsive, /white-space:\s*nowrap/i);
  assert.doesNotMatch(responsive, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/i);
});
