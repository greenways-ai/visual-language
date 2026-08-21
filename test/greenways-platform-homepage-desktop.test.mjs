import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the Fabric homepage emits its desktop editorial calibration after the mobile contract", async () => {
  const shell = await read("src/v2/CatalogueShell.astro");

  assert.match(shell, /greenways-platform-homepage-editorial\.css\?raw/);
  assert.match(shell, /data-greenways-fabric-editorial-calibration/);
  assert.match(shell, /set:html=\{greenwaysFabricEditorialCss\}/);

  const responsiveStyle = shell.indexOf("data-greenways-fabric-responsive-cascade");
  const editorialStyle = shell.indexOf("data-greenways-fabric-editorial-calibration");
  assert.ok(responsiveStyle >= 0, "the established mobile cascade remains present");
  assert.ok(editorialStyle > responsiveStyle, "desktop calibration must follow the responsive contract");
});

test("desktop typography is restrained and repeated content uses equal grid units", async () => {
  const css = await read("src/v2/greenways-platform-homepage-editorial.css");

  assert.match(css, /@media \(min-width: 58\.01rem\)/);
  assert.match(css, /\.gwf-home__hero h2\s*\{[\s\S]*?font-size:\s*clamp\(3rem,\s*4\.4vw,\s*4\.75rem\)/);
  assert.match(css, /\.gwf-section__heading\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-capability-grid,[\s\S]*?grid-auto-rows:\s*1fr/);
  assert.match(css, /\.gwf-storage-plate > ol\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-identity-map > ol\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-agent-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-surface-track\s*\{[\s\S]*?grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-boundary\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.gwf-application-grid article\s*\{[\s\S]*?min-block-size:\s*14\.5rem/);
  assert.match(css, /box-shadow:\s*none/);
  assert.match(css, /border-radius:\s*0/);
  assert.doesNotMatch(css, /#[\da-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgb|rgba|hsl|hsla)\(/i);
  assert.doesNotMatch(css, /!important/);
  assert.doesNotMatch(css, /white-space:\s*nowrap/i);
});

test("the fashion and systems references stay visual rather than becoming public brand copy", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");
  const css = await read("src/v2/greenways-platform-homepage-editorial.css");
  assert.doesNotMatch(`${page}\n${css}`, /\b(?:IBM|Dior)\b/i);
});
