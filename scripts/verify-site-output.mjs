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
if (!/lotus · three petals/i.test(home)) throw new Error("home page is missing the lotus identity");
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

const openGate = await readFile("dist/concepts/hoplite/open-gate/index.html", "utf8");
if (!openGate.includes("Open Gate")) throw new Error("Open Gate concept page is missing its title");
if (!openGate.includes("Concept specification")) throw new Error("Open Gate concept page is missing its specification");

console.log(`verified ${required.length} required Astro site outputs and ${ogCards.length} social cards`);
