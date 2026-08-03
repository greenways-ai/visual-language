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

test("all five logo patterns remain exact ten by ten grids", async () => {
  const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../src/MosaicLogo.astro", import.meta.url), "utf8"));
  for (const project of ["greenways", "hoplite", "hestia", "historian", "visual-language"]) {
    const match = source.match(new RegExp(`[\"']?${project}[\"']?: \\[([^\\]]*)\\]`));
    const rows = match?.[1].match(/[01]{10}/g) || [];
    assert.equal(rows.length, 10, `${project} must have ten authored rows`);
    assert.equal(rows.join("").length, 100, `${project} must have exactly 100 tesserae`);
  }
  assert.doesNotMatch(source, /doubled|flatMap/);
});
