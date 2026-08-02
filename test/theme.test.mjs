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

test("all four logo patterns remain fixed seven by seven grids", async () => {
  const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../src/MosaicLogo.astro", import.meta.url), "utf8"));
  for (const project of ["greenways", "hoplite", "hestia", "historian"]) {
    const match = source.match(new RegExp(`${project}: \\[(.*?)\\]`));
    const rows = match?.[1].match(/[01]{7}/g) || [];
    assert.equal(rows.length, 7, `${project} must have seven rows`);
    assert.equal(rows.join("").length, 49, `${project} must have 49 cells`);
  }
});
