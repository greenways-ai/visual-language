import { readFile, stat } from "node:fs/promises";

const required = [
  "dist/index.html",
  "dist/foundations/principles/index.html",
  "dist/identity/sigils/index.html",
  "dist/identity/day-night/index.html",
  "dist/adoption/getting-started/index.html",
  "dist/case-studies/index.html",
  "dist/case-studies/statstrade/index.html",
  "dist/case-studies/greenways-world/index.html",
  "dist/concepts/index.html",
  "dist/concepts/hoplite/open-gate/index.html",
  "dist/concepts/www/world-confluence/index.html",
  "dist/concepts/statstrade/feed/index.html",
  "dist/concepts/statstrade/arena/index.html",
  "dist/favicon.svg",
  "dist/favicons/visual-language.svg",
  "dist/sigils/manifest.json",
  "dist/artwork/greenways/peacock-garden-day.webp",
  "dist/statstrade/assets/arena-day-study.svg",
  "dist/statstrade/assets/arena-night-study.svg",
];

for (const path of required) await stat(path);

const home = await readFile("dist/index.html", "utf8");
if (!/lotus · three petals/i.test(home)) throw new Error("home page is missing the lotus identity");
if (!home.includes("Visual Language")) throw new Error("home page is missing its title");
if (!home.includes("One place.")) throw new Error("home page is missing the day/night study");

const conceptIndex = await readFile("dist/concepts/index.html", "utf8");
if (!conceptIndex.includes("One concept.")) throw new Error("concept index is missing its editorial premise");
if (!conceptIndex.includes("Statstrade Feed")) throw new Error("concept index is missing the Statstrade feed");

const openGate = await readFile("dist/concepts/hoplite/open-gate/index.html", "utf8");
if (!openGate.includes("Open Gate")) throw new Error("Open Gate concept page is missing its title");
if (!openGate.includes("Concept specification")) throw new Error("Open Gate concept page is missing its specification");

console.log(`verified ${required.length} required Astro site outputs`);
