import { readFile, stat } from "node:fs/promises";

const required = [
  "dist/index.html",
  "dist/foundations/principles/index.html",
  "dist/identity/sigils/index.html",
  "dist/adoption/getting-started/index.html",
  "dist/case-studies/statstrade/index.html",
  "dist/favicon.svg",
  "dist/favicons/visual-language.svg",
  "dist/sigils/manifest.json",
  "dist/artwork/greenways/peacock-garden-day.webp",
];

for (const path of required) await stat(path);

const home = await readFile("dist/index.html", "utf8");
if (!home.includes("Lotus · three petals")) throw new Error("home page is missing the lotus identity");
if (!home.includes("Visual Language")) throw new Error("home page is missing its title");

console.log(`verified ${required.length} required Astro site outputs`);
