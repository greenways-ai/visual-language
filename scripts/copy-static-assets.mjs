import { cp, copyFile, mkdir, stat } from "node:fs/promises";

const exists = async (path) => {
  try { await stat(path); return true; } catch { return false; }
};

const copies = [
  ["assets/favicons", "dist/favicons"],
  ["site/artwork", "dist/artwork"],
  ["site/assets", "dist/assets"],
  ["site/sigils", "dist/sigils"],
  ["site/statstrade/assets", "dist/statstrade/assets"],
];

for (const [source, destination] of copies) {
  if (!await exists(source)) continue;
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true, force: true });
}

if (await exists("site/statstrade/world.json")) {
  await mkdir("dist/statstrade", { recursive: true });
  await copyFile("site/statstrade/world.json", "dist/statstrade/world.json");
}

console.log("copied generated favicons, artwork, sigils, social assets, and Statstrade world assets");
