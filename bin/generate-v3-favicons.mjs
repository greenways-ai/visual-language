import { mkdir, writeFile } from "node:fs/promises";
import { renderSigil } from "./smalti.mjs";
import { GROUND, SEED, studies } from "./sigil-studies.mjs";

// Canonical project sigils normally adopt a study from the shared exploration
// table (bin/sigil-studies.mjs). Greenways owns a dedicated master geometry:
// a restrained five-petal peacock-tail / lotus hybrid. Marks render on a
// transparent background and are fitted to fill the canvas. Every size retains
// the irregular Voronoi/smalti construction; compact variants use a coarser
// tessellation, never a flat substitute.

const CANVAS = 480, FIT = 24;
const FULL_PITCH = 38, SMALL_PITCH = 68;

const byId = Object.fromEntries(studies.map((s) => [s.id, s]));

// Five tessellated planes converge at one base point. The broad green outer
// petals imply a living landscape, the aquamarine/cyan inner petals imply
// connection, and the sapphire centre gives the master mark its spectral lift.
const GREENWAYS_TAIL_LOTUS = [
  ["M240 410C135 390 65 320 70 235C168 255 222 333 240 410Z", 0],
  ["M240 410C345 390 415 320 410 235C312 255 258 333 240 410Z", 0],
  ["M240 410C165 320 115 205 145 105C225 160 250 290 240 410Z", 1],
  ["M240 410C315 320 365 205 335 105C255 160 230 290 240 410Z", 2],
  ["M240 410C170 275 175 135 240 55C305 135 310 275 240 410Z", 3],
];

// `regions` supplies dedicated master geometry. `study` selects an exploration
// geometry. Palette indexes map directly to `light` and `dark`; GROUND regions
// punch back to the surrounding page.
/** @type {Record<string, { regions?: (string | number)[][], study?: string, light: string[], dark: string[] }>} */
const projects = {
  greenways: {
    regions: GREENWAYS_TAIL_LOTUS,
    light: ["#187A55", "#39BFA6", "#24A9C7", "#1855A3"],
    dark: ["#53D88E", "#7DE1CF", "#65D7ED", "#62A8E8"],
  },
  hestia: { study: "star-eight", light: ["#641b27", "#8e2731", "#bd3f3b", "#e66d42", "#ffd08a"], dark: ["#6d1b27", "#a52a36", "#dc4b40", "#ff8b4a", "#ffd69a"] },
  hoplite: { study: "star-compass", light: ["#0b3a44", "#0f5e6e", "#1595a8", "#20c7df", "#a8ecf7"], dark: ["#0e4a56", "#12798d", "#1bb3c9", "#4fd9ec", "#d4f7fc"] },
  historia: { study: "mountain-pair", light: ["#1b3154", "#2c4e7b", "#426fa6", "#20c7df", "#a8ecf7"], dark: ["#243d65", "#39608f", "#5b86b8", "#83e9f4", "#d4f7fc"] },
  hodos: { study: "ring-double", light: ["#11392f", "#1d5e4d", "#2f8569", "#58a983", "#9bd4ad"], dark: ["#174b3d", "#25755d", "#38a67c", "#70c99a", "#b4e4bd"] },
  tahto: { study: "lattice-four-wing", light: ["#2b102f", "#5a174d", "#8f1d4f", "#c52f5d", "#ef637d"], dark: ["#451849", "#7b2363", "#bc2c63", "#ed4b76", "#ff9aaf"] },
  ignatius: { study: "arch-sealed-blocks", light: ["#090a0b", "#24211a", "#a97800", "#e0b51a", "#ffe36e"], dark: ["#181a1c", "#34322b", "#c69600", "#f0c91e", "#ffe98c"] },
  "visual-language": {
    regions: GREENWAYS_TAIL_LOTUS,
    light: ["#187A55", "#39BFA6", "#24A9C7", "#1855A3"],
    dark: ["#53D88E", "#7DE1CF", "#65D7ED", "#62A8E8"],
  },
};
projects.historian = projects.historia;

await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
let count = 0;
for (const [name, p] of Object.entries(projects)) {
  const regions = p.regions ?? byId[p.study]?.regions;
  if (!regions) throw new Error(`${name}: unknown or missing sigil geometry ${p.study ?? "master"}`);
  const paths = [], light = [], dark = [], flat = [], groundCuts = [];
  for (const [path, color, flag] of regions) {
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
  const base = {
    paths,
    light,
    dark,
    flat,
    groundCuts,
    seed: SEED,
    canvas: CANVAS,
    ground: null,
    fit: FIT,
    pitch: FULL_PITCH,
  };
  const small = { ...base, pitch: SMALL_PITCH };
  const variants = {
    [`${name}.svg`]: renderSigil(base),
    [`${name}-light.svg`]: renderSigil({ ...base, mode: "light" }),
    [`${name}-dark.svg`]: renderSigil({ ...base, mode: "dark" }),
    [`${name}-small.svg`]: renderSigil(small),
    [`${name}-small-light.svg`]: renderSigil({ ...small, mode: "light" }),
    [`${name}-small-dark.svg`]: renderSigil({ ...small, mode: "dark" }),
  };
  for (const [file, svg] of Object.entries(variants)) {
    await writeFile(new URL(`../assets/favicons/${file}`, import.meta.url), svg);
    count++;
  }
}
console.log(`generated ${count} groutless smalti sigil variants (detailed + coarse mosaic, adaptive + light/dark) at ${CANVAS}x${CANVAS}`);
