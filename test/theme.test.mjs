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
  const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../bin/generate-v3-favicons.mjs", import.meta.url), "utf8"));
  assert.match(source, /prefers-color-scheme:dark/);
  assert.match(source, /voronoiBed/);
  assert.doesNotMatch(source, /--grout/);
  assert.match(source, /hodos/);
  assert.match(source, /historia/);
});
