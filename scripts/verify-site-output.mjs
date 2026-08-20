import { readFile, stat } from "node:fs/promises";
import sharp from "sharp";

const ogCards = [
  "greenways",
  "hestia",
  "historia",
  "hodos",
  "hoplite",
  "tahto",
  "ignatius",
  "visual-language",
];
const greenwaysScreens = [
  "today",
  "workrooms",
  "studio",
  "campaigns",
  "packages",
  "keyring",
  "receipts",
];
const required = [
  "dist/index.html",
  "dist/foundations/principles/index.html",
  "dist/identity/sigils/index.html",
  "dist/identity/3d-marks/index.html",
  "dist/identity/3d-mark-lab/index.html",
  "dist/identity/day-night/index.html",
  "dist/adoption/getting-started/index.html",
  "dist/case-studies/index.html",
  "dist/case-studies/statstrade/index.html",
  "dist/case-studies/greenways-world/index.html",
  "dist/concepts/index.html",
  "dist/concepts/greenways/index.html",
  ...greenwaysScreens.map((screen) => `dist/concepts/greenways/${screen}/index.html`),
  "dist/concepts/hoplite/open-gate/index.html",
  "dist/concepts/tahto/paired-observatories/index.html",
  "dist/concepts/ignatius/commitment-crossing/index.html",
  "dist/concepts/www/world-confluence/index.html",
  "dist/concepts/statstrade/feed/index.html",
  "dist/concepts/statstrade/arena/index.html",
  "dist/favicon.svg",
  "dist/favicons/visual-language.svg",
  "dist/sigils/manifest.json",
  "dist/artwork/greenways/peacock-garden-day.webp",
  "dist/artwork/greenways/peacock-garden-night.webp",
  "dist/artwork/tahto/paired-observatories-day.webp",
  "dist/artwork/ignatius/commitment-crossing-day.webp",
  "dist/statstrade/assets/arena-day-study.svg",
  "dist/statstrade/assets/arena-night-study.svg",
  ...ogCards.flatMap((name) => [
    `dist/assets/og-${name}.png`,
    `dist/assets/og-${name}.jpg`,
  ]),
];

for (const path of required) await stat(path);

for (const name of ogCards) {
  const path = `dist/assets/og-${name}.jpg`;
  const [file, metadata] = await Promise.all([stat(path), sharp(path).metadata()]);
  if (metadata.format !== "jpeg") throw new Error(`${path} must be a JPEG`);
  if (metadata.width !== 1200 || metadata.height !== 630) {
    throw new Error(`${path} must be 1200x630`);
  }
  if (file.size > 350_000) {
    throw new Error(`${path} is ${file.size} bytes; expected at most 350000`);
  }
}

const home = await readFile("dist/index.html", "utf8");
if (!/peacock · feather/i.test(home)) throw new Error("home page is missing the peacock-feather identity");
if (/lotus · three petals/i.test(home)) throw new Error("home page still advertises the retired lotus identity");
if (!home.includes("Visual Language")) throw new Error("home page is missing its title");
if (!home.includes("One place.")) throw new Error("home page is missing the day/night study");
if (!home.includes("https://oss.greenways.ai/visual-language/assets/og-visual-language.jpg")) {
  throw new Error("home page is missing the optimized social preview");
}
if (home.includes("og-visual-language.png")) {
  throw new Error("home page still advertises the oversized PNG social preview");
}

const markLab = await readFile("dist/identity/3d-mark-lab/index.html", "utf8");
if (!markLab.includes("3D Mark Lab")) throw new Error("3D Mark Lab is missing its title");
if (!markLab.includes("data-mark-lab")) throw new Error("3D Mark Lab is missing its interactive renderer");
if (!markLab.includes("WebGL2")) throw new Error("3D Mark Lab is missing its WebGL fallback guidance");

const conceptIndex = await readFile("dist/concepts/index.html", "utf8");
if (!conceptIndex.includes("One concept.")) throw new Error("concept index is missing its editorial premise");
if (!conceptIndex.includes("Statstrade Feed")) throw new Error("concept index is missing the Statstrade feed");

const greenwaysIndex = await readFile("dist/concepts/greenways/index.html", "utf8");
if (!greenwaysIndex.includes("These seven screens form the product spine")) {
  throw new Error("Greenways desktop is missing its connected-application premise");
}
if (!greenwaysIndex.includes('data-greenways-environment="os"')) {
  throw new Error("Greenways desktop is missing the operating-environment contract");
}
if (!greenwaysIndex.includes("data-greenways-os-shell")) {
  throw new Error("Greenways desktop is missing its system shell");
}
if (!greenwaysIndex.includes("data-os-desktop-home")) {
  throw new Error("Greenways overview is not rendering as the desktop home");
}
if (!greenwaysIndex.includes("gw-os-dock")) {
  throw new Error("Greenways desktop is missing its application dock");
}
if (!greenwaysIndex.includes("data-command-layer")) {
  throw new Error("Greenways desktop is missing its command palette");
}
if (!greenwaysIndex.includes("https://oss.greenways.ai/visual-language/concepts/greenways/")) {
  throw new Error("Greenways desktop is missing its canonical deployment URL");
}

for (const screen of greenwaysScreens) {
  const path = `dist/concepts/greenways/${screen}/index.html`;
  const page = await readFile(path, "utf8");
  if (!page.includes(`data-greenways-screen="${screen}"`)) {
    throw new Error(`${path} does not render the ${screen} product workflow`);
  }
  if (!page.includes(`data-greenways-surface="${screen}"`)) {
    throw new Error(`${path} is missing the shared Greenways surface contract`);
  }
  if (!page.includes('data-greenways-environment="os"')) {
    throw new Error(`${path} is not wrapped in the Greenways operating environment`);
  }
  if (!page.includes("data-os-window")) {
    throw new Error(`${path} does not open inside an application window`);
  }
  if (!page.includes("data-window-minimise") || !page.includes("data-window-maximise")) {
    throw new Error(`${path} is missing application window controls`);
  }
  if (!page.includes("gw-os-dock")) {
    throw new Error(`${path} is missing the persistent application dock`);
  }
  if (page.includes('class="gw-sidebar"')) {
    throw new Error(`${path} has regressed to the retired website sidebar`);
  }
}

const openGate = await readFile("dist/concepts/hoplite/open-gate/index.html", "utf8");
if (!openGate.includes("Open Gate")) throw new Error("Open Gate concept page is missing its title");
if (!openGate.includes("Concept specification")) throw new Error("Open Gate concept page is missing its specification");

console.log(
  `verified ${required.length} required Astro site outputs, ${greenwaysScreens.length} Greenways OS applications and ${ogCards.length} social cards`,
);
