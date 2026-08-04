import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Statstrade exposes feed and world as separate surfaces", async () => {
  const source = await read("../src/statstrade-world.js");
  assert.match(source, /feed:[\s\S]*rendering: "dom"/);
  assert.match(source, /world:[\s\S]*rendering: "gaussian-splat"/);
  assert.match(source, /Arena of Conviction/);
});

test("Statstrade retains the angular red S", async () => {
  for (const file of ["statstrade.svg", "statstrade-small.svg", "statstrade-light.svg", "statstrade-dark.svg"]) {
    const svg = await read(`../assets/favicons/${file}`);
    assert.match(svg, /viewBox="0 0 77 79"/);
    assert.match(svg, /M18\.8177 0\.159851H68\.8281/);
  }
});

test("Statstrade visual contract forbids robot imagery", async () => {
  const spec = await read("../STATSTRADE.md");
  const config = await read("../src/statstrade-world.js");
  assert.match(spec, /No robot imagery/);
  for (const term of ["robots", "androids", "mechs", "AI avatars", "robot gladiators"]) assert.match(config, new RegExp(term));
});

test("Statstrade static concept includes feed, world and splat fallback", async () => {
  const html = await read("../site/statstrade/index.html");
  const manifest = JSON.parse(await read("../site/statstrade/world.json"));
  const poster = await read("../site/statstrade/assets/arena-splat-concept.svg");
  assert.match(html, /data-surface-panel="feed"/);
  assert.match(html, /data-surface-panel="world"/);
  assert.equal(manifest.viewer.implementation, "@playcanvas/supersplat-viewer");
  assert.equal(manifest.viewer.fallback, "poster");
  assert.match(poster, /NO ROBOTS · NO MECHS · NO AI AVATARS/);
});
