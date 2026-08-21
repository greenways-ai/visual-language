import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const surfaceIds = [
  "desktop",
  "extension-desktop",
  "extension-panel",
  "extension-popup",
  "web",
];

test("the V2 model defines five host-specific execution surfaces and five product surfaces", async () => {
  const source = await read("src/greenways-os-v2-surfaces.ts");
  const surfaceSection = source.slice(
    source.indexOf("export const greenwaysOsV2Surfaces"),
    source.indexOf("export type GreenwaysOsV2SurfaceId"),
  );
  const definitions = [...surfaceSection.matchAll(/^\s{4}id: "([a-z-]+)",$/gm)].map((match) => match[1]);

  assert.deepEqual(definitions, surfaceIds);
  assert.match(source, /Native desktop/);
  assert.match(source, /Full-page Chrome workspace/);
  assert.match(source, /Persistent page companion/);
  assert.match(source, /Launcher and health display/);
  assert.match(source, /Public publishing \+ remote workspace/);
  assert.match(source, /No workspace editing; launch and status only/);
  assert.match(source, /optional greenwaysd/);

  for (const product of ["fabric", "search", "timeline", "cowork", "spaces"]) {
    assert.match(source, new RegExp(`id: "${product}"`));
  }
  assert.match(source, /greenwaysOsProductSurfaces/);
  assert.match(source, /greenwaysOsExecutionEnvironments/);
  assert.match(source, /greenwaysOsAbstractionOwners/);
});

test("the V2 overview explains one portable workspace, an honest empty install and every manifestation", async () => {
  const source = await read("src/pages/concepts/greenways-v2/index.astro");

  assert.match(source, /data-gw2-system-map/);
  assert.match(source, /data-gw2-architecture/);
  assert.match(source, /One workspace\./);
  assert.match(source, /The shell changes\.<br \/>The work does not/);
  assert.match(source, /Five primary surfaces/);
  assert.match(source, /Tahto and Hestia build the feature\s+abstractions with Hara/);
  assert.match(source, /Hoplite and Ignatius are the execution\s+environments/);
  assert.match(source, /Hodos materialises approved client packages/);

  assert.match(source, /data-gw2-empty-install/);
  assert.match(source, /Before the workspace fills up/);
  assert.match(source, /not a sixth host surface/);
  assert.match(source, /Continue with no apps/);
  assert.match(source, /aria-label="0 installed applications"/);
  assert.match(source, /aria-label="0 stored objects"/);
  assert.match(source, /aria-label="0 ambient grants"/);
  assert.match(source, /<h5>Spaces<\/h5>/);
  assert.match(source, /<h5>Flow<\/h5>/);
  assert.match(source, /Populated reference atlas/);

  for (const wireframe of ["first-run", "desktop", "applications", "side-panel", "popup", "web"]) {
    assert.match(source, new RegExp(`data-gw2-empty-wireframe="${wireframe}"`));
  }

  for (const surface of surfaceIds) {
    assert.match(source, new RegExp(`surfaceHref\\("${surface}"\\)`));
  }
});

test("the dynamic V2 route statically expands every surface", async () => {
  const source = await read("src/pages/concepts/greenways-v2/[surface].astro");

  assert.match(source, /export function getStaticPaths\(\)/);
  assert.match(source, /greenwaysOsV2Surfaces\.map\(\(surface, position\)/);
  assert.match(source, /params: \{ surface: surface\.id \}/);
  assert.match(source, /surfaceId=\{surface\.id\}/);
  assert.match(source, /<GreenwaysOsV2Surface surface=\{surface\} position=\{position\} \/>/);
});

test("the V2 shell owns shared navigation, commands, theme and lightweight interactions", async () => {
  const source = await read("src/site/layouts/GreenwaysOsV2Shell.astro");

  assert.match(source, /data-greenways-os-version="2"/);
  assert.match(source, /data-gw2-route/);
  assert.match(source, /data-gw2-surface-menu/);
  assert.match(source, /data-gw2-command-layer/);
  assert.match(source, /Named commands request capabilities/);
  assert.match(source, /greenways-os-v2-theme/);
  assert.match(source, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(source, /data-gw2-inspector-toggle/);
  assert.match(source, /data-gw2-approval/);
  assert.match(source, /receipt written/);
  assert.match(source, /gw2-skip-link/);
});

test("each surface is a distinct, complete interface rather than one responsive reskin", async () => {
  const componentPaths = [
    "GreenwaysOsV2Surface.astro",
    "GreenwaysOsV2NativeDesktop.astro",
    "GreenwaysOsV2ExtensionDesktop.astro",
    "GreenwaysOsV2SidePanel.astro",
    "GreenwaysOsV2Popup.astro",
    "GreenwaysOsV2Web.astro",
  ];
  const source = (await Promise.all(
    componentPaths.map((name) => read(`src/site/components/${name}`)),
  )).join("\n");

  for (const surface of surfaceIds) {
    assert.match(source, new RegExp(`surface\\.id === "${surface}"`));
  }

  assert.match(source, /data-gw2-native-desktop/);
  assert.match(source, /greenwaysd/);
  assert.match(source, /Local custody/);
  assert.match(source, /Buffers/);
  assert.match(source, /Inspector/);
  assert.match(source, /Native capabilities/);

  assert.match(source, /data-gw2-extension-desktop/);
  assert.match(source, /Browser context/);
  assert.match(source, /MV3 broker/);
  assert.match(source, /Durable workspace/);
  assert.match(source, /Hara sandbox/);

  assert.match(source, /data-gw2-side-panel/);
  assert.match(source, /Save to Greenways/);
  assert.match(source, /Add to workroom/);
  assert.match(source, /Ask an agent/);
  assert.match(source, /Approval required/);
  assert.match(source, /Recent receipt/);

  assert.match(source, /data-gw2-popup/);
  assert.match(source, />Connected</);
  assert.match(source, /Open side panel/);
  assert.match(source, /Open desktop/);
  assert.match(source, /Save this page/);

  assert.match(source, /data-gw2-web/);
  assert.match(source, /Make a place/);
  assert.match(source, /Signed-in workspace/);
  assert.match(source, /No native authority/);
});


test("the merged V1 desktop links forward to the V2 interface atlas", async () => {
  const source = await read("src/pages/concepts/greenways/index.astro");

  assert.match(source, /const v2Href =/);
  assert.match(source, /Explore V2 interfaces/);
  assert.match(source, /concepts\/greenways-v2\//);
});

test("the production verifier requires the overview, empty install study and all five V2 routes", async () => {
  const [source, packageSource] = await Promise.all([
    read("scripts/verify-greenways-os-v2-output.mjs"),
    read("package.json"),
  ]);

  for (const surface of surfaceIds) {
    assert.match(source, new RegExp(`"${surface}"`));
  }
  assert.match(source, /greenways-v2\/\$\{surface\}\/index\.html/);
  assert.match(source, /data-greenways-os-v2-surface/);
  assert.match(source, /data-gw2-command-layer/);
  assert.match(source, /data-gw2-empty-install/);
  assert.match(source, /data-gw2-empty-wireframe/);
  assert.match(source, /Continue with no apps/);
  assert.match(packageSource, /verify-greenways-os-v2-output\.mjs/);
});

test("V2 styling covers all five viewports, the empty install studies, themes and reduced motion", async () => {
  const modules = [
    "greenways-os-v2.css",
    "greenways-os-v2-foundation.css",
    "greenways-os-v2-workbench-native.css",
    "greenways-os-v2-workbench-browser.css",
    "greenways-os-v2-side-panel.css",
    "greenways-os-v2-popup.css",
    "greenways-os-v2-web.css",
    "greenways-os-v2-overview.css",
    "greenways-os-v2-responsive.css",
  ];
  const sources = await Promise.all(modules.map((name) => read(`src/site/styles/${name}`)));
  const [entry] = sources;
  const source = sources.join("\n");

  for (const module of modules.slice(1)) {
    assert.match(entry, new RegExp(module.replaceAll(".", "\\.")));
  }

  for (const selector of [
    ".gw2-native-titlebar",
    ".gw2-frame--extension",
    ".gw2-browser-and-panel",
    ".gw2-popup-stage",
    ".gw2-device--web",
    ".gw2-command-palette",
    ".gw2-product-surfaces",
    ".gw2-product-card",
    ".gw2-surface-atlas",
    ".gw2-empty-install",
    ".gw2-empty-desktop",
    ".gw2-empty-library",
    ".gw2-empty-browser",
    ".gw2-empty-popup",
    ".gw2-empty-web",
    ".gw2-architecture",
  ]) {
    assert.match(source, new RegExp(selector.replaceAll(".", "\\.")));
  }

  assert.match(source, /html\[data-theme="light"\]/);
  assert.match(source, /@media \(max-width: 1180px\)/);
  assert.match(source, /@media \(max-width: 980px\)/);
  assert.match(source, /@media \(max-width: 760px\)/);
  assert.match(source, /@media \(max-width: 480px\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
