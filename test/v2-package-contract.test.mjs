import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  greenwaysV2ColourRoles,
  greenwaysV2Entries,
  greenwaysV2Identity,
  greenwaysV2TokenFamilies,
} from "../src/v2/contract.js";
import { legacyPackageExports, v2PackageContracts } from "../migration/v2-inventory.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(await read("package.json"));

function themeSources(css) {
  const lightMarker = `:root,\n:root[data-theme="light"] {`;
  const darkMarker = ':root[data-theme="dark"] {';
  const autoMarker = "@media (prefers-color-scheme: dark)";
  const shared = css.slice(0, css.indexOf(lightMarker));
  const light = css.slice(css.indexOf(lightMarker), css.indexOf(darkMarker));
  const dark = css.slice(css.indexOf(darkMarker), css.indexOf(autoMarker));
  return { shared, light, dark };
}

function declarations(source) {
  return new Map(
    [...source.matchAll(/(--gw-v2-[a-z0-9-]+):\s*([^;]+);/gi)]
      .map((match) => [match[1], match[2].trim()]),
  );
}

function colourTriples(value) {
  const triples = [];
  for (const match of value.matchAll(/#([0-9a-f]{6})\b/gi)) {
    triples.push([
      Number.parseInt(match[1].slice(0, 2), 16),
      Number.parseInt(match[1].slice(2, 4), 16),
      Number.parseInt(match[1].slice(4, 6), 16),
    ]);
  }
  for (const match of value.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
    triples.push(match.slice(1, 4).map(Number));
  }
  return triples;
}

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
    "@greenways-ai/visual-language/v2/components.css",
    "@greenways-ai/visual-language/v2/contract.js",
    "@greenways-ai/visual-language/v2/component-contract.js",
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
    assert.doesNotMatch(target, /library\/components\/index\.astro/);
  }
});

test("light and dark themes define every semantic token family", async () => {
  const css = await read("src/v2/tokens.css");
  const { shared, light, dark } = themeSources(css);

  assert.ok(light.length > 0);
  assert.ok(dark.length > 0);

  for (const [name, definition] of Object.entries(greenwaysV2TokenFamilies)) {
    for (const token of definition.tokens) {
      const declaration = `${token}:`;
      const blocks = definition.scope === "theme" ? [light, dark] : [shared];
      for (const source of blocks) {
        assert.ok(source.includes(declaration), `${name} is missing ${token}`);
      }
    }
  }
});

test("structural colour remains neutral and cannot alias peacock, signal, focus or state roles", async () => {
  const css = await read("src/v2/tokens.css");
  const { light, dark } = themeSources(css);
  const structuralTokens = [
    ...greenwaysV2TokenFamilies.canvas.tokens,
    ...greenwaysV2TokenFamilies.surface.tokens,
    ...greenwaysV2TokenFamilies.seam.tokens,
    ...greenwaysV2TokenFamilies.elevation.tokens,
  ];

  assert.equal(greenwaysV2ColourRoles.structure.character, "neutral");
  assert.equal(greenwaysV2Identity.structuralBase, "neutral");

  for (const [theme, source] of Object.entries({ light, dark })) {
    const map = declarations(source);
    for (const token of structuralTokens) {
      const value = map.get(token);
      assert.ok(value, `${theme} is missing ${token}`);
      assert.doesNotMatch(
        value,
        /var\(--gw-v2-(?:brand|signal|state|focus)/,
        `${theme} ${token} aliases a coloured role`,
      );
      for (const channels of colourTriples(value)) {
        const spread = Math.max(...channels) - Math.min(...channels);
        assert.ok(spread <= 14, `${theme} ${token} is hue-biased: ${value}`);
      }
    }
  }
});

test("peacock identity, interaction signal and semantic state remain separate", async () => {
  const css = await read("src/v2/tokens.css");
  const { light, dark } = themeSources(css);

  assert.deepEqual(greenwaysV2Identity.colourAnchors, ["emerald", "aqua", "sapphire", "violet"]);
  assert.equal(greenwaysV2ColourRoles.brand.character, "peacock-spectrum");
  assert.equal(greenwaysV2ColourRoles.signal.character, "restrained-interaction");
  assert.equal(greenwaysV2ColourRoles.state.character, "semantic");

  for (const [theme, source] of Object.entries({ light, dark })) {
    const map = declarations(source);
    assert.equal(map.get("--gw-v2-signal"), "var(--gw-v2-brand-sapphire)", `${theme} signal`);
    assert.equal(map.get("--gw-v2-focus-ring"), "var(--gw-v2-brand-aqua)", `${theme} focus`);
    assert.equal(map.get("--gw-v2-text-link"), "var(--gw-v2-signal)", `${theme} link`);
    assert.notEqual(map.get("--gw-v2-brand-emerald"), map.get("--gw-v2-state-success"), `${theme} success`);
    assert.notEqual(map.get("--gw-v2-brand-sapphire"), map.get("--gw-v2-state-info"), `${theme} info`);
    assert.notEqual(map.get("--gw-v2-signal"), "var(--gw-v2-state-success)", `${theme} signal is success`);
  }
});

test("document, workbench and component layers share one colour-free semantic foundation", async () => {
  const [documentCss, workbenchCss, componentsCss] = await Promise.all([
    read("src/v2/document.css"),
    read("src/v2/workbench.css"),
    read("src/v2/components.css"),
  ]);
  assert.match(documentCss, /@import "\.\.\/theme\.css";/);
  assert.match(documentCss, /@import "\.\/tokens\.css";/);
  assert.match(workbenchCss, /^@import "\.\/document\.css";/);
  assert.match(componentsCss, /^@import "\.\/document\.css";/);
  assert.doesNotMatch(documentCss, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(workbenchCss, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(componentsCss, /#[0-9a-f]{3,8}\b/i);
  assert.match(documentCss, /prefers-reduced-motion/);
  assert.match(componentsCss, /prefers-reduced-motion/);
  assert.match(workbenchCss, /minmax\(0, 1fr\)/);
});

test("the protected Greenways identity remains mosaic, peacock, material and typographic", async () => {
  const [logo, sigil, typography, tokens, documentCss, workbenchCss, componentsCss] = await Promise.all([
    read("src/MosaicLogo.astro"),
    read("src/Sigil.astro"),
    read("src/typography.css"),
    read("src/v2/tokens.css"),
    read("src/v2/document.css"),
    read("src/v2/workbench.css"),
    read("src/v2/components.css"),
  ]);

  assert.equal(greenwaysV2Identity.mark, "mosaic");
  assert.deepEqual(greenwaysV2Identity.material, ["mosaic", "smalti", "paper", "stone"]);
  assert.match(logo, /import Sigil/);
  assert.match(logo, /project = "greenways"/);
  assert.match(sigil, /greenways/);
  assert.match(sigil, /-light\.svg/);
  assert.match(sigil, /-dark\.svg/);
  for (const token of ["--gw-font-display", "--gw-font-sans", "--gw-font-mono"]) assert.match(typography, new RegExp(token));
  for (const token of greenwaysV2TokenFamilies.brand.tokens) assert.match(tokens, new RegExp(token));
  assert.doesNotMatch(`${tokens}\n${documentCss}\n${workbenchCss}\n${componentsCss}`, /hara/i);
});
