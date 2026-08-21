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

const emptyWireframes = [
  "first-run",
  "desktop",
  "applications",
  "side-panel",
  "popup",
  "web",
];

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
if (!overview.includes("Five primary surfaces.")) {
  throw new Error("Greenways OS V2 overview is missing its product-surface model");
}
if (!overview.includes("data-gw2-command-layer")) {
  throw new Error("Greenways OS V2 overview is missing the shared command palette");
}
if (!overview.includes("data-gw2-empty-install")) {
  throw new Error("Greenways OS V2 overview is missing the truthful empty-install study");
}
if (!overview.includes("Continue with no apps")) {
  throw new Error("Greenways OS V2 empty install is missing the no-application completion path");
}
if (!overview.includes('aria-label="0 installed applications"')) {
  throw new Error("Greenways OS V2 empty install does not begin with zero installed applications");
}
if (!overview.includes('aria-label="0 stored objects"')) {
  throw new Error("Greenways OS V2 empty install does not begin with zero stored objects");
}
if (!overview.includes('aria-label="0 ambient grants"')) {
  throw new Error("Greenways OS V2 empty install does not begin with zero ambient grants");
}
if (!overview.includes(">Spaces<") || !overview.includes(">Flow<")) {
  throw new Error("Greenways OS V2 empty install must present Spaces and Flow as optional applications");
}
for (const wireframe of emptyWireframes) {
  if (!overview.includes(`data-gw2-empty-wireframe="${wireframe}"`)) {
    throw new Error(`Greenways OS V2 overview is missing the ${wireframe} empty-install wireframe`);
  }
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

console.log(
  `verified Greenways OS V2 overview, ${emptyWireframes.length} empty-install studies and ${surfaces.length} host-specific interface routes`,
);
