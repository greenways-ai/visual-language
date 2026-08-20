import { readFile, stat } from "node:fs/promises";

const surfaces = [
  "desktop",
  "extension-desktop",
  "extension-panel",
  "extension-popup",
  "web",
];

const markers = {
  desktop: "data-gw2-native-desktop",
  "extension-desktop": "data-gw2-extension-desktop",
  "extension-panel": "data-gw2-side-panel",
  "extension-popup": "data-gw2-popup",
  web: "data-gw2-web",
};

const overviewPath = "dist/concepts/greenways-v2/index.html";
const routes = surfaces.map((surface) => `dist/concepts/greenways-v2/${surface}/index.html`);

for (const path of [overviewPath, ...routes]) await stat(path);

const overview = await readFile(overviewPath, "utf8");
if (!overview.includes('data-greenways-os-version="2"')) {
  throw new Error("Greenways OS V2 overview is missing its version contract");
}
if (!overview.includes("data-gw2-system-map")) {
  throw new Error("Greenways OS V2 overview is missing the system map");
}
if (!overview.includes("data-gw2-architecture")) {
  throw new Error("Greenways OS V2 overview is missing the portable-core architecture");
}
if (!overview.includes("One workspace.")) {
  throw new Error("Greenways OS V2 overview is missing its shared-workspace premise");
}
if (!overview.includes("data-gw2-command-layer")) {
  throw new Error("Greenways OS V2 overview is missing the shared command palette");
}

for (const surface of surfaces) {
  const path = `dist/concepts/greenways-v2/${surface}/index.html`;
  const page = await readFile(path, "utf8");

  if (!page.includes(`data-greenways-os-v2-surface="${surface}"`)) {
    throw new Error(`${path} does not render the ${surface} V2 interface`);
  }
  if (!page.includes(`data-gw2-route="${surface}"`)) {
    throw new Error(`${path} is missing its host-surface route contract`);
  }
  if (!page.includes(markers[surface])) {
    throw new Error(`${path} is missing its purpose-built ${surface} interface marker`);
  }
  if (!page.includes("data-gw2-command-layer")) {
    throw new Error(`${path} is missing the shared command palette`);
  }
  if (!page.includes("Authority boundary")) {
    throw new Error(`${path} does not explain its capability boundary`);
  }
}

const runtimeRoot = "dist/greenways-os-v2";
const runtimePages = [
  "index.html",
  "desktop.html",
  "web.html",
  "popup.html",
  "sidepanel.html",
  "options.html",
  "approval.html",
  "sandbox.html",
];
const runtimeScripts = [
  "service-worker.js",
  "sandbox.js",
  "assets/model.js",
  "assets/core.js",
  "assets/desktop.js",
  "assets/web.js",
  "assets/popup.js",
  "assets/sidepanel.js",
  "assets/options.js",
  "assets/approval.js",
];

for (const file of [...runtimePages, ...runtimeScripts, "manifest.json", "assets/greenways-os-v2.css", "README.md"]) {
  await stat(`${runtimeRoot}/${file}`);
}
for (const size of [16, 32, 48, 128]) await stat(`${runtimeRoot}/assets/icon-${size}.png`);

const manifest = JSON.parse(await readFile(`${runtimeRoot}/manifest.json`, "utf8"));
if (manifest.manifest_version !== 3) {
  throw new Error("Greenways OS V2 runtime is not a Manifest V3 extension");
}
if (manifest.chrome_url_overrides || manifest.host_permissions) {
  throw new Error("Greenways OS V2 runtime must not override New Tab or request host permissions");
}

const desktop = await readFile(`${runtimeRoot}/desktop.html`, "utf8");
for (const marker of ["frame-bar", "workspace-switcher", "buffer-strip", "pane-layout", "inspector-pane", "status-line"]) {
  if (!desktop.includes(marker)) throw new Error(`Greenways OS V2 runtime desktop is missing ${marker}`);
}

console.log(
  `verified Greenways OS V2 overview, ${surfaces.length} host-specific interface routes and the runnable extension/web runtime`,
);
