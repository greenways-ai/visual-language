#!/usr/bin/env node
import { mkdir, writeFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

// og:image cards (1200x630) per project: signature scene artwork full-bleed,
// dark veil, the project's light-mode smalti sigil, wordmark and tagline.
// Rendered in headless Chrome and screenshotted to site/assets/og-<name>.png.

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const cards = {
  greenways: { scene: "greenways/peacock-garden", label: "Greenways", tagline: "A living mosaic world" },
  hestia: { scene: "hestia/sovereign-hearth", label: "Hestia", tagline: "The protected household" },
  hoplite: { scene: "hoplite/rabbit-courtyard", label: "Hoplite", tagline: "A lightweight Nginx application container" },
  historia: { scene: "historia/raven-library", label: "Historia", tagline: "Evidence, indexed and illuminated" },
  hodos: { scene: "hodos/moth-theatre", label: "Hodos", tagline: "Passages, mirrors and veils" },
  tahto: { scene: "tahto/paired-observatories", label: "Tahto", tagline: "Meaning held across divergence" },
  ignatius: { scene: "ignatius/commitment-crossing", label: "Ignatius", tagline: "Signed work, ordered and committed" },
  "visual-language": { scene: "greenways/peacock-garden", label: "Greenways Visual Language", tagline: "One language. Eight worlds." },
};
const cardsArgument = process.argv.find((argument) => argument.startsWith("--cards="));
const selectedCards = cardsArgument
  ? new Set(cardsArgument.slice("--cards=".length).split(",").filter(Boolean))
  : null;
const cardEntries = Object.entries(cards).filter(([name]) => !selectedCards || selectedCards.has(name));

if (selectedCards && cardEntries.length === 0) {
  throw new Error(`No cards matched --cards=${[...selectedCards].join(",")}`);
}

const page = (name, { scene, label, tagline }) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative;
    font-family: Manrope, system-ui, sans-serif; color: #f7f5ef; }
  .art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .veil { position: absolute; inset: 0;
    background: linear-gradient(100deg, rgba(5,10,8,.88) 0%, rgba(5,10,8,.55) 45%, rgba(5,10,8,.12) 100%); }
  .panel { position: absolute; left: 72px; bottom: 64px; display: flex; align-items: center; gap: 28px; }
  .panel img { width: 132px; height: 132px; }
  h1 { font: 400 64px/1 Georgia, serif; letter-spacing: -0.02em; }
  p { margin-top: 10px; font: 700 15px ui-monospace, monospace; letter-spacing: 0.14em;
    text-transform: uppercase; color: #9be0d2; }
  .brand { position: absolute; top: 40px; left: 72px; font: 700 13px ui-monospace, monospace;
    letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.85; }
</style></head><body>
  <img class="art" src="../../artwork/${scene}-day.webp" alt="">
  <div class="veil"></div>
  <div class="brand">${name === "greenways" ? "GREENWAYS" : name === "visual-language" ? "GREENWAYS / VISUAL LANGUAGE" : `GREENWAYS / ${label.toUpperCase()}`}</div>
  <div class="panel"><img src="../../../assets/favicons/${name}-light.svg" alt=""><div><h1>${label}</h1><p>${tagline}</p></div></div>
</body></html>`;

const staging = `${root}/site/assets/og-staging`;
await mkdir(staging, { recursive: true });
for (const [name, card] of cardEntries) {
  const html = `${staging}/${name}.html`;
  const png = `${root}/site/assets/og-${name}.png`;
  await writeFile(html, page(name, card));
  await run(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=8000",
    `--screenshot=${png}`, "--window-size=1200,630", "--hide-scrollbars",
    `file://${html}`]);
  console.log(`rendered og-${name}.png`);
}
await rm(staging, { recursive: true, force: true });
