import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const applicationIds = [
  "today",
  "workrooms",
  "studio",
  "campaigns",
  "packages",
  "keyring",
  "receipts",
];

const surfaceIds = [
  "desktop",
  "extension-desktop",
  "extension-panel",
  "extension-popup",
  "web",
];

test("the shared shell mounts a native app launcher with a dedicated keyboard shortcut", async () => {
  const shell = await read("src/site/layouts/GreenwaysOsV2Shell.astro");

  assert.match(shell, /import GreenwaysOsV2AppLauncher/);
  assert.match(shell, /<GreenwaysOsV2AppLauncher \/>/);
  assert.match(shell, /data-gw2-app-launcher/);
  assert.match(shell, /event\.shiftKey && event\.key\.toLowerCase\(\) === "a"/);
  assert.match(shell, /greenways-os-v2-last-app/);
  assert.match(shell, /closeAppLauncher\(\)/);
});

test("the launcher derives all seven applications from the earlier product-screen model", async () => {
  const launcher = await read("src/site/components/GreenwaysOsV2AppLauncher.astro");

  assert.match(launcher, /greenwaysProductScreens/);
  assert.match(launcher, /greenwaysOsV2Applications/);
  assert.match(launcher, /data-gw2-app-launcher-panel/);
  assert.match(launcher, /data-gw2-launcher-resume/);
  assert.match(launcher, /Earlier Greenways product screens/);
  assert.match(launcher, /concepts\/greenways-v2\//);
  assert.match(launcher, /concepts\/greenways\//);

  for (const id of applicationIds) {
    assert.match(launcher, new RegExp(`${id}: "(?:desktop|extension-desktop|web)"`));
  }
});

test("the continuity layer carries earlier product strengths into every host surface", async () => {
  const continuity = await read("src/site/components/GreenwaysOsV2ApplicationContinuity.astro");

  assert.match(continuity, /greenwaysProductScreens/);
  assert.match(continuity, /data-gw2-application-continuity/);
  assert.match(continuity, /data-gw2-earlier-feature/);
  assert.match(continuity, /Earlier product strengths, fitted to this host/);

  for (const id of applicationIds) {
    assert.match(continuity, new RegExp(`\\n  (?:"${id}"|${id}): \\{`));
    assert.match(continuity, new RegExp(`id === "${id}"`));
  }

  for (const id of surfaceIds) {
    assert.match(continuity, new RegExp(`(?:"${id}"|${id}): \\[`));
  }

  for (const marker of [
    "Approve release candidate",
    "Write, ask an agent or attach evidence",
    "Receipt ready",
    "Verified reach",
    "visual.canvas",
    "Atlas campaign grant",
    "Human approval",
  ]) {
    assert.match(continuity, new RegExp(marker));
  }
});

test("every atlas surface renders the application continuity layer after its host frame", async () => {
  const surface = await read("src/site/components/GreenwaysOsV2Surface.astro");

  assert.match(surface, /import GreenwaysOsV2ApplicationContinuity/);
  assert.match(surface, /<GreenwaysOsV2ApplicationContinuity surfaceId=\{surface\.id\} \/>/);

  const hostIndex = surface.indexOf('surface.id === "desktop"');
  const continuityIndex = surface.indexOf("<GreenwaysOsV2ApplicationContinuity");
  const footerIndex = surface.indexOf('<footer class="gw2-surface-next">');
  assert.ok(hostIndex >= 0 && hostIndex < continuityIndex);
  assert.ok(continuityIndex < footerIndex);
});

test("launcher and carried-forward features use the protected v2 colour roles without a local palette", async () => {
  const [entry, css] = await Promise.all([
    read("src/site/styles/greenways-os-v2.css"),
    read("src/site/styles/greenways-os-v2-applications.css"),
  ]);

  const imports = [...entry.matchAll(/@import\s+"([^"]+)";/g)].map((match) => match[1]);
  assert.ok(imports.includes("./greenways-os-v2-applications.css"));
  assert.equal(imports.at(-1), "../../v2/greenways-os-neutral.css");
  assert.ok(
    imports.indexOf("./greenways-os-v2-applications.css")
      < imports.indexOf("../../v2/greenways-os-neutral.css"),
  );

  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgb|hsl)a?\(/i);
  assert.match(css, /var\(--gw2-surface\)/);
  assert.match(css, /var\(--gw2-signal\)/);
  assert.match(css, /var\(--gw-v2-state-success\)/);
  assert.match(css, /var\(--gw-v2-state-warning\)/);
  assert.match(css, /@media \(max-width: 480px\)/);
});

test("the launcher remains a navigation aid rather than a false execution surface", async () => {
  const [launcher, continuity] = await Promise.all([
    read("src/site/components/GreenwaysOsV2AppLauncher.astro"),
    read("src/site/components/GreenwaysOsV2ApplicationContinuity.astro"),
  ]);

  assert.doesNotMatch(launcher, /\b(?:installed|published|authorised|completed successfully)\b/i);
  assert.doesNotMatch(continuity, /data-gw2-approval/);
  assert.match(launcher, /Apps open through the host best suited to their current task/);
  assert.match(continuity, /No publication authority/);
});

test("the application-layer decision is recorded for later atlas and runtime work", async () => {
  const document = await read("docs/greenways-os-atlas-applications.md");

  assert.match(document, /Application launcher/);
  assert.match(document, /Earlier Greenways product screens are feature sources/);
  assert.match(document, /five host surfaces/);
  assert.match(document, /does not claim that a runtime action occurred/);
});
