import { mkdir, writeFile } from "node:fs/promises";
import { renderSigil } from "./smalti.mjs";

// Canonical project sigils: flat smalti tesserae composed on a 480x480
// canvas from 64-grid region outlines. Each project ships a variant set:
// `<name>.svg` detailed Voronoi adaptive (media query), `<name>-light.svg` /
// `<name>-dark.svg` detailed fixed-mode for page pairing, `<name>-small.svg`
// flat adaptive for tab favicons, and `<name>-small-light.svg` /
// `<name>-small-dark.svg` flat fixed-mode for header brand and other <=48px
// uses where a fine Voronoi bed turns to mush.

const SCALE = 7.5, CANVAS = 480;
const SEED = 20260804;

const projects = {
  greenways: { light: ["#123e34", "#1f6552", "#2c8b69", "#61ad82", "#20c7df"], dark: ["#16483a", "#23705a", "#35a176", "#69ba8a", "#83e9f4"], paths: ["M32 19C25 7 8 10 8 25c0 8 7 14 14 20l10-11Z", "M32 19C39 7 56 10 56 25c0 8-7 14-14 20L32 34Z", "M22 45 32 34v24Z", "m42 45-10-11v24Z", "M23 29.8c4.5-6.8 13.5-6.8 18 0-4.5 7.5-13.5 7.5-18 0Z"] },
  hestia: { light: ["#641b27", "#8e2731", "#bd3f3b", "#e66d42", "#ffd08a"], dark: ["#6d1b27", "#a52a36", "#dc4b40", "#ff8b4a", "#ffd69a"], paths: ["M32 5C20 20 15 29 17 43c2 10 8 15 15 17-4-8-3-15 1-22 3 6 7 10 6 17 8-6 11-15 7-26C43 19 36 11 32 5Z", "M32 16c-7 10-10 18-8 27 1 7 4 12 8 17-4-8-3-15 1-22Z", "M33 38c-4 7-5 15-1 22 5-2 8-7 7-12 0-4-3-8-6-10Z"] },
  hoplite: { light: ["#596f69", "#748f87", "#967a37", "#b78a22", "#6d5209"], dark: ["#466860", "#6d978d", "#b08b33", "#d7b64e", "#f3d988"], paths: ["M7 19c11-8 23-9 33-4l-8 8c-7-3-15-1-22 4Z", "M39 15c8 3 14 2 19-2-2 10-10 15-21 13l-5-3Z", "M5 34c14-8 29-8 40-2l-8 7c-9-4-20-3-29 2Z", "M45 32c6 3 11 2 15-1-3 8-10 13-19 11l-4-3Z", "M12 49c10-5 21-5 30-1l-8 7c-6-3-13-2-19 1Z"] },
  historia: { light: ["#1b3154", "#2c4e7b", "#426fa6", "#20c7df", "#07121c"], dark: ["#243d65", "#39608f", "#5b86b8", "#83e9f4", "#07121c"], paths: ["M4 32C12 18 21 12 32 12L22 25 14 32Z", "M32 12c11 0 21 6 28 20H50l-8-7Z", "M4 32h10l8 7 10 13C20 52 11 45 4 32Z", "M60 32H50l-8 7-10 13c12 0 21-7 28-20Z", "m32 20 11 7 3 5-7 9-7 5-7-5-7-9 3-5Z"] },
  hodos: { light: ["#11392f", "#1d5e4d", "#2f8569", "#58a983", "#9bd4ad"], dark: ["#174b3d", "#25755d", "#38a67c", "#70c99a", "#b4e4bd"], paths: ["M47.8 13.1C36.5 4.4 20.2 6.5 11.5 17.8S4.9 45.4 16.2 54.1c9.8 7.5 23.5 7 32.6-.6l-7.6-9.2c-5 4.1-12.3 4.4-17.6.3-6.2-4.8-7.4-13.7-2.6-20s13.7-7.4 20-2.6c3.1 2.4 5 5.9 5.4 9.7l-5.8 1.1L55 42l6-15.9-3.3 2.1c-1.2-5.9-4.6-11.3-9.9-15.1Z", "M41.4 33.8l4.9-1 .1 3.2-5-2.2Z", "M51 27a1.55 1.55 0 1 0 3.1 0 1.55 1.55 0 1 0-3.1 0"], flat: [1, 2] },
};
projects.historian = projects.historia;
projects["visual-language"] = projects.greenways;

await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
let count = 0;
for (const [name, p] of Object.entries(projects)) {
  const base = { paths: p.paths, light: p.light, dark: p.dark, flat: p.flat, scale: SCALE, seed: SEED, canvas: CANVAS };
  const allFlat = p.paths.map((_, i) => i);
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
