#!/usr/bin/env node
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const cards = [
  "greenways",
  "hestia",
  "historia",
  "hodos",
  "hoplite",
  "tahto",
  "ignatius",
  "visual-language",
];
const cardsArgument = process.argv.find((argument) => argument.startsWith("--cards="));
const selectedCards = cardsArgument
  ? new Set(cardsArgument.slice("--cards=".length).split(",").filter(Boolean))
  : null;
const cardNames = selectedCards ? cards.filter((name) => selectedCards.has(name)) : cards;

if (selectedCards && cardNames.length === 0) {
  throw new Error(`No cards matched --cards=${[...selectedCards].join(",")}`);
}
const width = 1200;
const height = 630;
const maxBytes = 350_000;

for (const name of cardNames) {
  const source = `${root}/site/assets/og-${name}.png`;
  const target = `${root}/site/assets/og-${name}.jpg`;

  await stat(source);
  const info = await sharp(source)
    .jpeg({
      quality: 82,
      progressive: true,
      chromaSubsampling: "4:2:0",
      mozjpeg: true,
    })
    .toFile(target);

  if (info.width !== width || info.height !== height) {
    throw new Error(
      `og-${name}.jpg must be ${width}x${height}; rendered ${info.width}x${info.height}`,
    );
  }
  if (info.size > maxBytes) {
    throw new Error(
      `og-${name}.jpg is ${info.size} bytes; expected at most ${maxBytes}`,
    );
  }

  console.log(`optimized og-${name}.jpg (${info.size} bytes)`);
}
