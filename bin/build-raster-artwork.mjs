#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { scenes } from "../src/scene-language.js";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const cropX = { left: 0, center: 384, right: 768 };

for (const scene of scenes) {
  const destination = `${root}/site/artwork/${scene.world}`;
  await mkdir(destination, { recursive: true });
  for (const mode of ["day", "night"]) {
    const stem = `${scene.id}-${mode}`;
    const source = `${root}/artwork/masters/${scene.world}/${stem}.png`;
    await run("cwebp", ["-quiet", "-q", "90", "-m", "6", "-mt", source, "-o", `${destination}/${stem}.webp`]);
    await run("cwebp", ["-quiet", "-q", "88", "-m", "6", "-mt", "-crop", String(cropX[scene.focus]), "0", "768", "1024", "-resize", "720", "960", source, "-o", `${destination}/${stem}-mobile.webp`]);
  }
}

console.log(`Built ${scenes.length * 4} responsive WebP files from ${scenes.length * 2} native masters.`);
