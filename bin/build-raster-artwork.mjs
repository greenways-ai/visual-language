#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { scenes } from "../src/scene-language.js";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const position = { left: 0, center: 0.5, right: 1 };

async function dimensions(source) {
  const { stdout } = await run("sips", ["-g", "pixelWidth", "-g", "pixelHeight", source]);
  const width = Number(stdout.match(/pixelWidth: (\d+)/)?.[1]);
  const height = Number(stdout.match(/pixelHeight: (\d+)/)?.[1]);
  if (!width || !height) throw new Error(`Could not read dimensions for ${source}`);
  return { width, height };
}

function portraitCrop({ width, height }, focus) {
  const targetRatio = 3 / 4;
  const cropWidth = Math.min(width, Math.floor(height * targetRatio));
  const cropHeight = Math.min(height, Math.floor(width / targetRatio));
  const x = Math.round((width - cropWidth) * position[focus]);
  const y = Math.round((height - cropHeight) / 2);
  return [String(x), String(y), String(cropWidth), String(cropHeight)];
}

for (const scene of scenes) {
  const destination = `${root}/site/artwork/${scene.world}`;
  await mkdir(destination, { recursive: true });
  for (const mode of ["day", "night"]) {
    const stem = `${scene.id}-${mode}`;
    const source = `${root}/artwork/masters/${scene.world}/${stem}.png`;
    const crop = portraitCrop(await dimensions(source), scene.focus);
    await run("cwebp", ["-quiet", "-q", "90", "-m", "6", "-mt", source, "-o", `${destination}/${stem}.webp`]);
    await run("cwebp", ["-quiet", "-q", "88", "-m", "6", "-mt", "-crop", ...crop, "-resize", "720", "960", source, "-o", `${destination}/${stem}-mobile.webp`]);
  }
}

console.log(`Built ${scenes.length * 4} responsive WebP files from ${scenes.length * 2} native masters.`);
