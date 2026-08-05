import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

test("v3 exports shared interface components", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));
  for (const name of [
    "./SharedHeader.astro",
    "./DocumentationHeader.astro",
    "./DocumentationSearch.astro",
    "./ProjectSwitcher.astro",
    "./CodePanel.astro",
    "./DocumentationCard.astro",
    "./ThemeMenu.astro",
    "./Sigil.astro",
    "./ThemedArtwork.astro",
  ]) assert.ok(pkg.exports[name], name);
});

test("documentation components encode the shared interaction contracts", async () => {
  const search = await readFile(new URL("../src/DocumentationSearch.astro", import.meta.url), "utf8");
  assert.match(search, /inset: 50% auto auto 50%/);
  assert.match(search, /translate\(-50%, -50%\)/);
  assert.match(search, /pagefind\/pagefind\.js/);

  const header = await readFile(new URL("../src/DocumentationHeader.astro", import.meta.url), "utf8");
  assert.match(header, /ProjectSwitcher/);
  assert.match(header, /docsLabel = "Docs"/);
  assert.doesNotMatch(header, /GitHub/);

  const panel = await readFile(new URL("../src/CodePanel.astro", import.meta.url), "utf8");
  assert.match(panel, /astro:components/);
  assert.match(panel, /github-dark/);
  assert.match(panel, /"not-content"/);
  assert.match(panel, /\.line span/);
  assert.match(panel, /text-decoration: none !important/);

  const card = await readFile(new URL("../src/DocumentationCard.astro", import.meta.url), "utf8");
  assert.match(card, /Why it matters/);
  assert.match(card, /CodePanel/);
});

test("project switcher uses canonical OSS order and project sigils", async () => {
  const { projectLinks, ossProjectLinks } = await import("../src/projects.js");
  for (const project of ["greenways", "hestia", "hoplite", "historia", "hodos", "visual-language", "statstrade"]) {
    assert.ok(projectLinks.some((item) => item.project === project), project);
  }
  assert.deepEqual(
    ossProjectLinks.map((item) => item.project),
    ["hestia", "hoplite", "historia", "hodos"],
  );
  const source = await readFile(new URL("../src/ProjectSwitcher.astro", import.meta.url), "utf8");
  assert.match(source, /data-gw-project-switcher/);
  assert.match(source, /Back to OSS/);
  assert.match(source, /ossProjectLinks\.map/);
  assert.match(source, /<Sigil project=/);
  assert.doesNotMatch(source, /Statstrade/);
  assert.doesNotMatch(source, /Visual Language/);
});

test("six worlds have eight responsive raster day and night scenes", async () => {
  for (const project of ["greenways", "hestia", "hoplite", "historia", "hodos", "www"]) {
    const files = (await readdir(new URL(`../site/artwork/${project}/`, import.meta.url))).filter((file) => file.endsWith(".webp"));
    assert.equal(files.length, 32, project);
    assert.equal(files.filter((file) => file.includes("-mobile.webp")).length, 16, project);
  }
});

test("scene language assigns space-led behavior and sparse sigils", async () => {
  const { scenes } = await import("../src/scene-language.js");
  assert.equal(scenes.length, 48);
  assert.equal(scenes.filter((scene) => scene.sigil).length, 6);
  for (const scene of scenes) {
    assert.ok(scene.affordance);
    assert.ok(scene.day);
    assert.ok(scene.night);
    assert.ok(["left", "center", "right"].includes(scene.focus));
  }
});

test("canonical sigils adopt the named project motifs", async () => {
  const gen = await readFile(new URL("../bin/generate-v3-favicons.mjs", import.meta.url), "utf8");
  for (const [project, study] of [
    ["greenways", "peacock-eye-shield"],
    ["hestia", "star-eight"],
    ["hoplite", "star-compass"],
    ["historia", "mountain-pair"],
    ["hodos", "ring-double"],
    ["visual-language", "lotus-three"],
  ]) {
    const key = project.includes("-") ? `"${project}"` : project;
    assert.ok(gen.includes(`${key}: { study: "${study}"`), project);
  }
  assert.match(gen, /#20c7df/);
  assert.match(gen, /SMALL_PITCH/);
  assert.doesNotMatch(gen, /allFlat/);
  assert.doesNotMatch(gen, /#b78a22|#d7b64e/);

  const { projects } = await import("../src/projects.js");
  assert.equal(projects.historia.motif, "Mountains");
  assert.equal(projects["visual-language"].motif, "Lotus · three petals");

  const sigil = await readFile(new URL("../src/Sigil.astro", import.meta.url), "utf8");
  assert.match(sigil, /visual-language\/favicons/);
  assert.match(sigil, /\$\{resolved\}-light\.svg/);
  assert.match(sigil, /\$\{resolved\}-dark\.svg/);
  assert.match(sigil, /gw-sigil__asset/);
  const css = await readFile(new URL("../src/theme.css", import.meta.url), "utf8");
  assert.match(css, /data-project="hoplite"\]\{--gw-accent-1:#0b3a44/);
});

test("small favicon variants retain the Voronoi mosaic", async () => {
  for (const project of ["greenways", "hestia", "hoplite", "historia", "hodos", "visual-language"]) {
    const svg = await readFile(new URL(`../assets/favicons/${project}-small-light.svg`, import.meta.url), "utf8");
    const polygons = svg.match(/<polygon\b/g) ?? [];
    assert.ok(polygons.length >= 4, `${project}: expected mosaic tesserae, found ${polygons.length}`);
  }
});

test("og image cards exist at 1200x630", async () => {
  for (const name of ["greenways", "hestia", "hoplite", "historia", "hodos", "visual-language"]) {
    const buffer = await readFile(new URL(`../site/assets/og-${name}.png`, import.meta.url));
    assert.equal(buffer[0], 0x89, `${name} png magic`);
    assert.equal(buffer.readUInt32BE(16), 1200, `${name} width`);
    assert.equal(buffer.readUInt32BE(20), 630, `${name} height`);
  }
});

test("semantic controls and project palettes are present", async () => {
  const css = await readFile(new URL("../src/theme.css", import.meta.url), "utf8");
  for (const project of ["hestia", "hoplite", "historia", "hodos"]) assert.match(css, new RegExp(`data-project=["']${project}`));
  for (const token of ["--gw-control-bg", "--gw-control-text", "--gw-control-hover", "--gw-art-veil", "--gw-sigil-ground", "--gw-sigil-grout"]) assert.match(css, new RegExp(token));
});

const luminance = (hex) => {
  const components = hex.match(/[\da-f]{2}/gi)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * components[0] + .7152 * components[1] + .0722 * components[2];
};
const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + .05) / (low + .05);
};

test("essential foreground and background pairs meet WCAG AA", () => {
  for (const [foreground, background] of [
    ["#101612", "#f4f2ec"],
    ["#101612", "#fbfaf6"],
    ["#58615c", "#fbfaf6"],
    ["#f7f5ef", "#050a08"],
    ["#f7f5ef", "#0b1410"],
    ["#adb5af", "#0b1410"],
  ]) assert.ok(contrast(foreground, background) >= 4.5, `${foreground} on ${background}`);
});

test("sigil exploration lab publishes sixty adaptive smalti studies with light/dark pairs", async () => {
  const manifest = JSON.parse(await readFile(new URL("../site/sigils/manifest.json", import.meta.url)));
  assert.equal(manifest.length, 60);
  for (const entry of manifest) {
    const svg = await readFile(new URL(`../site/sigils/${entry.id}.svg`, import.meta.url), "utf8");
    assert.match(svg, /viewBox="0 0 480 480"/, entry.id);
    assert.match(svg, /prefers-color-scheme:dark/, entry.id);
    for (const mode of ["light", "dark"]) {
      const fixed = await readFile(new URL(`../site/sigils/${entry.id}-${mode}.svg`, import.meta.url), "utf8");
      assert.match(fixed, /viewBox="0 0 480 480"/, `${entry.id}-${mode}`);
      assert.doesNotMatch(fixed, /prefers-color-scheme/, `${entry.id}-${mode}`);
    }
  }
});
