import test from "node:test";
import assert from "node:assert/strict";
import { parseTheme, readThemeCookie, resolveTheme, themeCookie } from "../src/theme.js";

test("theme preference parsing and resolution", () => {
  assert.equal(parseTheme("sepia"), "auto");
  assert.equal(resolveTheme("auto", false), "light");
  assert.equal(resolveTheme("auto", true), "dark");
  assert.equal(resolveTheme("light", true), "light");
});

test("the shared cookie is scoped only on Greenways production hosts", () => {
  assert.equal(readThemeCookie("other=x; gw-theme=dark"), "dark");
  assert.match(themeCookie("light", "hestia.greenways.ai"), /Domain=greenways\.ai/);
  assert.doesNotMatch(themeCookie("light", "localhost"), /Domain=/);
});

test("project logos delegate to the semantic inline sigil", async () => {
  const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../src/MosaicLogo.astro", import.meta.url), "utf8"));
  assert.match(source, /import Sigil/);
  assert.match(source, /"hodos"/);
  assert.doesNotMatch(source, /sourcePatterns/);
});

test("favicons provide groutless smalti beds and adaptive shaded palettes", async () => {
  const fs = await import("node:fs/promises");
  const engine = await fs.readFile(new URL("../bin/smalti.mjs", import.meta.url), "utf8");
  const source = await fs.readFile(new URL("../bin/generate-v3-favicons.mjs", import.meta.url), "utf8");
  assert.match(engine, /prefers-color-scheme:dark/);
  assert.match(engine, /voronoiBed/);
  assert.match(engine, /mode = "adaptive"/);
  assert.doesNotMatch(engine, /--grout/);
  assert.match(source, /renderSigil/);
  assert.match(source, /hodos/);
  assert.match(source, /historia/);
});

test("the Greenways master mark is a five-petal spectral mosaic", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(new URL("../bin/generate-v3-favicons.mjs", import.meta.url), "utf8");
  const detailed = await fs.readFile(new URL("../assets/favicons/greenways.svg", import.meta.url), "utf8");
  const compact = await fs.readFile(new URL("../assets/favicons/greenways-small.svg", import.meta.url), "utf8");

  assert.match(source, /GREENWAYS_TAIL_LOTUS/);
  assert.match(source, /#2FA56B/);
  assert.match(source, /#7ED8C9/);
  assert.match(source, /#2FB7D6/);
  assert.match(source, /#7B69C7/);
  assert.equal((detailed.match(/<clipPath/g) ?? []).length, 5);
  assert.equal((compact.match(/<clipPath/g) ?? []).length, 5);
  assert.match(detailed, /<polygon/);
  assert.match(compact, /<polygon/);
  assert.doesNotMatch(detailed, /peacock-eye-shield/);
});

test("project sigils ship detailed and compact mosaic variants in light/dark pairs", async () => {
  const fs = await import("node:fs/promises");
  for (const name of ["greenways", "hestia", "hoplite", "historia", "historian", "hodos", "visual-language"]) {
    const detailed = await fs.readFile(new URL(`../assets/favicons/${name}.svg`, import.meta.url), "utf8");
    assert.match(detailed, /prefers-color-scheme:dark/, name);
    assert.match(detailed, /<polygon/, name);
    assert.doesNotMatch(detailed, /<rect/, `${name} should be transparent (no ground tile)`);
    assert.match(detailed, /<g transform="translate/, `${name} should be fitted to fill the canvas`);
    for (const mode of ["light", "dark"]) {
      const fixed = await fs.readFile(new URL(`../assets/favicons/${name}-${mode}.svg`, import.meta.url), "utf8");
      assert.doesNotMatch(fixed, /prefers-color-scheme/, `${name}-${mode}`);
      assert.doesNotMatch(fixed, /<rect/, `${name}-${mode} should be transparent`);
      const small = await fs.readFile(new URL(`../assets/favicons/${name}-small-${mode}.svg`, import.meta.url), "utf8");
      assert.doesNotMatch(small, /prefers-color-scheme/, `${name}-small-${mode}`);
      assert.match(small, /<polygon/, `${name}-small-${mode} should retain Voronoi tesserae`);
      assert.doesNotMatch(small, /<rect/, `${name}-small-${mode} should be transparent`);
    }
    const smallAdaptive = await fs.readFile(new URL(`../assets/favicons/${name}-small.svg`, import.meta.url), "utf8");
    assert.match(smallAdaptive, /prefers-color-scheme:dark/, `${name}-small`);
    assert.match(smallAdaptive, /<polygon/, `${name}-small should retain Voronoi tesserae`);
    assert.doesNotMatch(smallAdaptive, /<rect/, `${name}-small should be transparent`);
  }
});
