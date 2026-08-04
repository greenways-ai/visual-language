import { mkdir, writeFile } from "node:fs/promises";
import { renderSigil, hexToHsl, hslToHex } from "./smalti.mjs";
import { PAL, GROUND, SEED, studies } from "./sigil-studies.mjs";

// Sigil exploration lab: renders the sixty shared studies as adaptive
// Voronoi smalti SVGs plus fixed light/dark pairs under site/sigils/.

const darkOf = (hex) => {
  const [h, s, l] = hexToHsl(hex);
  if (l > 0.8) return hex;
  return hslToHex(h, Math.min(1, s + 0.06), Math.min(0.88, l + 0.1));
};

await mkdir(new URL("../site/sigils/", import.meta.url), { recursive: true });
const manifest = [];
for (const [index, study] of studies.entries()) {
  const palette = PAL[study.palette];
  const paths = [], light = [], dark = [], flat = [], groundCuts = [];
  for (const [path, color, flag] of study.regions) {
    const i = paths.length;
    paths.push(path);
    if (color === GROUND) {
      groundCuts.push(i);
      light.push("#f7f3e9");
      dark.push("#0b1410");
    } else {
      light.push(palette[color % palette.length]);
      dark.push(darkOf(palette[color % palette.length]));
    }
    if (flag === "flat") flat.push(i);
  }
  const base = { paths, light, dark, flat, groundCuts, seed: SEED + index * 7919, pitch: study.pitch ?? 38 };
  await writeFile(new URL(`../site/sigils/${study.id}.svg`, import.meta.url), renderSigil(base));
  await writeFile(new URL(`../site/sigils/${study.id}-light.svg`, import.meta.url), renderSigil({ ...base, mode: "light" }));
  await writeFile(new URL(`../site/sigils/${study.id}-dark.svg`, import.meta.url), renderSigil({ ...base, mode: "dark" }));
  manifest.push({ id: study.id, label: study.label });
}
await writeFile(new URL("../site/sigils/manifest.json", import.meta.url), JSON.stringify(manifest, null, 2) + "\n");
console.log(`generated ${manifest.length} sigil studies`);
