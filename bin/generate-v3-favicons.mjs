import { mkdir, writeFile } from "node:fs/promises";
import { renderSigil } from "./smalti.mjs";
import { GROUND, SEED, studies } from "./sigil-studies.mjs";

// Canonical project sigils: each project adopts one study from the shared
// exploration table (bin/sigil-studies.mjs) and re-colors it with the
// project's own palette. Marks render on a transparent background (no ground
// tile) and are fitted to fill the canvas. Each project ships a variant set:
// `<name>.svg` detailed Voronoi adaptive (media query), `<name>-light.svg` /
// `<name>-dark.svg` detailed fixed-mode for page pairing, `<name>-small.svg`
// flat adaptive for tab favicons, and `<name>-small-light.svg` /
// `<name>-small-dark.svg` flat fixed-mode for header brand and other <=48px
// uses where a fine Voronoi bed turns to mush.

const CANVAS = 480, FIT = 24;

const byId = Object.fromEntries(studies.map((s) => [s.id, s]));

// study: exploration geometry id; light/dark: project palette (region
// indexes map directly onto it; GROUND regions punch back to the ground).
const projects = {
  greenways: { study: "peacock-eye-shield", light: ["#123e34", "#1f6552", "#2c8b69", "#61ad82", "#20c7df"], dark: ["#16483a", "#23705a", "#35a176", "#69ba8a", "#83e9f4"] },
  hestia: { study: "star-eight", light: ["#641b27", "#8e2731", "#bd3f3b", "#e66d42", "#ffd08a"], dark: ["#6d1b27", "#a52a36", "#dc4b40", "#ff8b4a", "#ffd69a"] },
  hoplite: { study: "star-compass", light: ["#0b3a44", "#0f5e6e", "#1595a8", "#20c7df", "#a8ecf7"], dark: ["#0e4a56", "#12798d", "#1bb3c9", "#4fd9ec", "#d4f7fc"] },
  historia: { study: "mountain-pair", light: ["#1b3154", "#2c4e7b", "#426fa6", "#20c7df", "#a8ecf7"], dark: ["#243d65", "#39608f", "#5b86b8", "#83e9f4", "#d4f7fc"] },
  hodos: { study: "ring-double", light: ["#11392f", "#1d5e4d", "#2f8569", "#58a983", "#9bd4ad"], dark: ["#174b3d", "#25755d", "#38a67c", "#70c99a", "#b4e4bd"] },
  "visual-language": { study: "lotus-three", light: ["#123e34", "#1f6552", "#2c8b69", "#8b6fa8", "#cfb6e0"], dark: ["#16483a", "#23705a", "#35a176", "#b493cf", "#e1d1ee"] },
};
projects.historian = projects.historia;

await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
let count = 0;
for (const [name, p] of Object.entries(projects)) {
  const study = byId[p.study];
  if (!study) throw new Error(`${name}: unknown study ${p.study}`);
  const paths = [], light = [], dark = [], flat = [], groundCuts = [];
  for (const [path, color, flag] of study.regions) {
    const i = paths.length;
    paths.push(path);
    if (color === GROUND) {
      groundCuts.push(i);
      light.push("#f7f3e9");
      dark.push("#0b1410");
    } else {
      light.push(p.light[color % p.light.length]);
      dark.push(p.dark[color % p.dark.length]);
    }
    if (flag === "flat") flat.push(i);
  }
  const base = { paths, light, dark, flat, groundCuts, seed: SEED, canvas: CANVAS, ground: null, fit: FIT };
  const allFlat = paths.map((_, i) => i);
  const variants = {
    [`${name}.svg`]: renderSigil(base),
    [`${name}-light.svg`]: renderSigil({ ...base, mode: "light" }),
    [`${name}-dark.svg`]: renderSigil({ ...base, mode: "dark" }),
    [`${name}-small.svg`]: renderSigil({ ...base, flat: allFlat }),
    [`${name}-small-light.svg`]: renderSigil({ ...base, flat: allFlat, mode: "light" }),
    [`${name}-small-dark.svg`]: renderSigil({ ...base, flat: allFlat, mode: "dark" }),
  };
  for (const [file, svg] of Object.entries(variants)) {
    await writeFile(new URL(`../assets/favicons/${file}`, import.meta.url), svg);
    count++;
  }
}
console.log(`generated ${count} groutless smalti sigil variants (detailed + small, adaptive + light/dark) at ${CANVAS}x${CANVAS}`);
