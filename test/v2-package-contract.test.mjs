import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  greenwaysV2Entries,
  greenwaysV2Identity,
  greenwaysV2TokenFamilies,
} from "../src/v2/contract.js";
import { legacyPackageExports, v2PackageContracts } from "../migration/v2-inventory.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(await read("package.json"));

test("v2 package entry points are additive and resolvable", async () => {
  for (const item of legacyPackageExports) {
    assert.equal(packageJson.exports[item.exportKey], `./${item.path}`, item.exportKey);
  }
  for (const item of v2PackageContracts) {
    assert.equal(packageJson.exports[item.exportKey], `./${item.path}`, item.exportKey);
  }

  assert.deepEqual(Object.values(greenwaysV2Entries), [
    "@greenways-ai/visual-language/v2/tokens.css",
    "@greenways-ai/visual-language/v2/document.css",
    "@greenways-ai/visual-language/v2/workbench.css",
    "@greenways-ai/visual-language/v2/contract.js",
  ]);

  for (const target of Object.values(packageJson.exports)) {
    await access(new URL(`../${target.replace(/^\.\//, "")}`, import.meta.url));
  }

  assert.ok(packageJson.files.includes("V2-PACKAGE.md"));
  assert.ok(packageJson.files.includes("V2-MIGRATION.md"));
  assert.equal(Object.keys(packageJson.exports).length, legacyPackageExports.length + v2PackageContracts.length);
});

test("laboratory and product-specific sources are not accidentally exported", () => {
  for (const target of Object.values(packageJson.exports)) {
    assert.doesNotMatch(target, /src\/(?:site|pages)\//);
    assert.doesNotMatch(target, /Foreman/i);
    assert.doesNotMatch(target, /greenways-(?:os-v2-surfaces|product-screens)/);
  }
});

test("light and dark themes define every semantic token family", async () => {
  const css = await read("src/v2/tokens.css");
  const lightMarker = `:root,\n:root[data-theme="light"] {`;
  const darkMarker = ':root[data-theme="dark"] {';
  const autoMarker = "@media (prefers-color-scheme: dark)";
  const shared = css.slice(0, css.indexOf(lightMarker));
  const light = css.slice(css.indexOf(lightMarker), css.indexOf(darkMarker));
  const dark = css.slice(css.indexOf(darkMarker), css.indexOf(autoMarker));

  assert.ok(light.length > 0);
  assert.ok(dark.length > 0);

  for (const [name, definition] of Object.entries(greenwaysV2TokenFamilies)) {
    for (const token of definition.tokens) {
      const declaration = `${token}:`;
      const block = definition.scope === "theme" ? [light, dark] : [shared];
      for (const source of block) {
        assert.ok(source.includes(declaration), `${name} is missing ${token}`);
      }
    }
  }
});

test("document and workbench layers share one colour-free semantic foundation", async () => {
  const [documentCss, workbenchCss] = await Promise.all([
    read("src/v2/document.css"),
    read("src/v2/workbench.css"),
  ]);
  assert.match(documentCss, /@import "\.\.\/theme\.css";/);
  assert.match(documentCss, /@import "\.\/tokens\.css";/);
  assert.match(workbenchCss, /^@import "\.\/document\.css";/);
  assert.doesNotMatch(documentCss, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(workbenchCss, /#[0-9a-f]{3,8}\b/i);
  assert.match(documentCss, /prefers-reduced-motion/);
  assert.match(workbenchCss, /minmax\(0, 1fr\)/);
});

test("the protected Greenways identity remains mosaic, material and typographic", async () => {
  const [logo, sigil, typography, theme, tokens, documentCss, workbenchCss] = await Promise.all([
    read("src/MosaicLogo.astro"),
    read("src/Sigil.astro"),
    read("src/typography.css"),
    read("src/theme.css"),
    read("src/v2/tokens.css"),
    read("src/v2/document.css"),
    read("src/v2/workbench.css"),
  ]);

  assert.equal(greenwaysV2Identity.mark, "mosaic");
  assert.deepEqual(greenwaysV2Identity.material, ["mosaic", "smalti", "paper", "stone"]);
  assert.deepEqual(greenwaysV2Identity.colourAnchors, ["verdigris", "gold", "terracotta", "silver"]);
  assert.match(logo, /import Sigil/);
  assert.match(logo, /project = "greenways"/);
  assert.match(sigil, /greenways/);
  assert.match(sigil, /-light\.svg/);
  assert.match(sigil, /-dark\.svg/);
  for (const token of ["--gw-font-display", "--gw-font-sans", "--gw-font-mono"]) assert.match(typography, new RegExp(token));
  for (const token of ["--gw-verdigris", "--gw-gold", "--gw-terracotta", "--gw-silver"]) assert.match(theme, new RegExp(token));
  assert.doesNotMatch(`${tokens}\n${documentCss}\n${workbenchCss}`, /hara/i);
});
