import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the Fabric homepage consumes the exact Greenways V2 palette source", async () => {
  const [foundation, entry] = await Promise.all([
    read("src/site/styles/greenways-os-v2-foundation.css"),
    read("src/v2/greenways-platform-homepage.css"),
  ]);

  for (const [token, value] of [
    ["--gw2-bg", "#07100e"],
    ["--gw2-bg-deep", "#030907"],
    ["--gw2-field", "#0b1714"],
    ["--gw2-surface", "#13231e"],
    ["--gw2-signal", "#67c9ff"],
    ["--gw2-green", "#92d5a1"],
    ["--gw2-warm", "#e8c58e"],
    ["--gw2-coral", "#f0a58d"],
    ["--gw2-violet", "#b9a5f7"],
  ]) {
    assert.match(foundation, new RegExp(`${token.replaceAll("-", "\\-")}\\s*:\\s*${value}`, "i"));
  }

  const responsiveImport = entry.indexOf('@import "./greenways-platform-homepage-responsive.css";');
  const colourImport = entry.indexOf('@import "./greenways-platform-homepage-colour.css";');
  assert.ok(responsiveImport >= 0);
  assert.ok(colourImport > responsiveImport, "the colour assignment layer should follow structural and responsive styles");
});

test("the homepage assigns the full emerald, sky, warm, coral and violet range", async () => {
  const css = await read("src/v2/greenways-platform-homepage-colour.css");

  for (const role of [
    "--gw2-green",
    "--gw2-signal",
    "--gw2-warm",
    "--gw2-coral",
    "--gw2-violet",
  ]) {
    assert.match(css, new RegExp(`var\\(${role.replaceAll("-", "\\-")}\\)`));
  }

  const fragments = {
    tabs: "--gw2-signal",
    downloads: "--gw2-warm",
    notes: "--gw2-green",
    account: "--gw2-violet",
    agent: "--gw2-coral",
    receipt: "--gw2-warm",
    source: "--gw2-green",
  };

  for (const [fragment, role] of Object.entries(fragments)) {
    assert.match(
      css,
      new RegExp(`data-gwf-fragment=\\"${fragment}\\"[\\s\\S]*?--gwf-fragment-colour:\\s*var\\(${role.replaceAll("-", "\\-")}\\)`),
    );
  }
});

test("Spaces and Flow colour the same Fabric frame rather than separate product shells", async () => {
  const [css, page] = await Promise.all([
    read("src/v2/greenways-platform-homepage-colour.css"),
    read("src/pages/v2/applications/greenways-platform/homepage.astro"),
  ]);

  assert.match(css, /data-gwf-app=\"spaces\"[\s\S]*?--gwf-colour-active:\s*var\(--gwf-colour-spaces\)/);
  assert.match(css, /data-gwf-app=\"flow\"[\s\S]*?--gwf-colour-active:\s*var\(--gwf-colour-flow\)/);
  assert.match(css, /data-gwf-app-select=\"spaces\"[\s\S]*?--gwf-dock-colour:\s*var\(--gw2-green\)/);
  assert.match(css, /data-gwf-app-select=\"flow\"[\s\S]*?--gwf-dock-colour:\s*var\(--gw2-signal\)/);
  assert.match(css, /data-flow-lane=\"intent\"[\s\S]*?var\(--gw2-violet\)/);
  assert.match(css, /data-flow-lane=\"review\"[\s\S]*?var\(--gw2-warm\)/);

  assert.match(page, /data-gwf-app="spaces"/);
  assert.match(page, /data-gwf-app-select=\{application\.id\}/);
  assert.match(page, /data-gwf-app-panel="spaces"/);
  assert.match(page, /data-gwf-app-panel="flow"/);
});

test("private, selected and hosted planes remain visibly distinct", async () => {
  const css = await read("src/v2/greenways-platform-homepage-colour.css");

  assert.match(css, /\.gwf-private-plane[\s\S]*?var\(--gw2-green\)/);
  assert.match(css, /\.gwf-platform-plane[\s\S]*?var\(--gw2-violet\)/);
  assert.match(css, /\.gwf-selected-projection[\s\S]*?var\(--gw2-warm\)/);
  assert.match(css, /data-gwf-share=\"selected\"[\s\S]*?var\(--gw2-violet\)/);
  assert.match(css, /\.gwf-crossing > span:nth-child\(2\)[\s\S]*?var\(--gw2-signal\)/);
});

test("the homepage colour bridge defines no second literal palette", async () => {
  const css = await read("src/v2/greenways-platform-homepage-colour.css");

  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgb|rgba|hsl|hsla)\s*\(/i);
  assert.match(css, /color-mix\(/);
  assert.match(css, /radial-gradient\(/);
  assert.match(css, /linear-gradient\(/);
});
