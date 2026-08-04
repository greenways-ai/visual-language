import { mkdir, writeFile } from "node:fs/promises";

// Smalti sigils: each region is a bed of irregular hand-cut glass tesserae,
// one flat color per piece, composed on a 480x480 canvas and shrunk down by
// the renderer. Palettes stay adaptive for light and dark mode.

const SCALE = 7.5, CANVAS = 480, PITCH = 40;
const SEED = 20260804;

const projects = {
  greenways: { light: ["#123e34", "#1f6552", "#2c8b69", "#61ad82", "#cfb66a"], dark: ["#16483a", "#23705a", "#35a176", "#69ba8a", "#dec477"], paths: ["M32 19C25 7 8 10 8 25c0 8 7 14 14 20l10-11Z", "M32 19C39 7 56 10 56 25c0 8-7 14-14 20L32 34Z", "M22 45 32 34v24Z", "m42 45-10-11v24Z", "M20 29c6-9 18-9 24 0-6 10-18 10-24 0Z"] },
  hestia: { light: ["#641b27", "#8e2731", "#bd3f3b", "#e66d42", "#ffd08a"], dark: ["#6d1b27", "#a52a36", "#dc4b40", "#ff8b4a", "#ffd69a"], paths: ["M32 5C20 20 15 29 17 43c2 10 8 15 15 17-4-8-3-15 1-22 3 6 7 10 6 17 8-6 11-15 7-26C43 19 36 11 32 5Z", "M32 16c-7 10-10 18-8 27 1 7 4 12 8 17-4-8-3-15 1-22Z", "M33 38c-4 7-5 15-1 22 5-2 8-7 7-12 0-4-3-8-6-10Z"] },
  hoplite: { light: ["#596f69", "#748f87", "#967a37", "#b78a22", "#6d5209"], dark: ["#466860", "#6d978d", "#b08b33", "#d7b64e", "#f3d988"], paths: ["M7 19c11-8 23-9 33-4l-8 8c-7-3-15-1-22 4Z", "M39 15c8 3 14 2 19-2-2 10-10 15-21 13l-5-3Z", "M5 34c14-8 29-8 40-2l-8 7c-9-4-20-3-29 2Z", "M45 32c6 3 11 2 15-1-3 8-10 13-19 11l-4-3Z", "M12 49c10-5 21-5 30-1l-8 7c-6-3-13-2-19 1Z"] },
  historia: { light: ["#1b3154", "#2c4e7b", "#426fa6", "#20c7df", "#07121c"], dark: ["#243d65", "#39608f", "#5b86b8", "#83e9f4", "#07121c"], paths: ["M4 32C12 18 21 12 32 12L22 25 14 32Z", "M32 12c11 0 21 6 28 20H50l-8-7Z", "M4 32h10l8 7 10 13C20 52 11 45 4 32Z", "M60 32H50l-8 7-10 13c12 0 21-7 28-20Z", "m32 20 11 7 3 5-7 9-7 5-7-5-7-9 3-5Z"] },
  hodos: { light: ["#11392f", "#1d5e4d", "#2f8569", "#58a983", "#9bd4ad"], dark: ["#174b3d", "#25755d", "#38a67c", "#70c99a", "#b4e4bd"], paths: ["M47.8 13.1C36.5 4.4 20.2 6.5 11.5 17.8S4.9 45.4 16.2 54.1c9.8 7.5 23.5 7 32.6-.6l-7.6-9.2c-5 4.1-12.3 4.4-17.6.3-6.2-4.8-7.4-13.7-2.6-20s13.7-7.4 20-2.6c3.1 2.4 5 5.9 5.4 9.7l-5.8 1.1L55 42l6-15.9-3.3 2.1c-1.2-5.9-4.6-11.3-9.9-15.1Z", "M41.4 33.8l4.9-1 .1 3.2-5-2.2Z", "M51 27a1.55 1.55 0 1 0 3.1 0 1.55 1.55 0 1 0-3.1 0"], flat: [1, 2] },
};
projects.historian = projects.historia;
projects["visual-language"] = projects.greenways;

const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const hexToHsl = (hex) => {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi).map((v) => parseInt(v, 16) / 255);
  const hi = Math.max(r, g, b), lo = Math.min(r, g, b), l = (hi + lo) / 2;
  if (hi === lo) return [0, 0, l];
  const d = hi - lo, s = l > 0.5 ? d / (2 - hi - lo) : d / (hi + lo);
  const h = hi === r ? ((g - b) / d + (g < b ? 6 : 0)) : hi === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};
const hslToHex = (h, s, l) => {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
};

// Five opaque smalti shades per region base color: subtle hand-mixed
// variation, never a gradient.
const smaltiShades = (hex, rand) => {
  const [h, s, l] = hexToHsl(hex);
  return [0.10, 0.05, 0, -0.05, -0.10].map((dl) =>
    hslToHex(h + (rand() * 8 - 4), clamp01(s + (rand() * 0.06 - 0.03)), clamp01(l + dl * 0.6 + (rand() * 0.04 - 0.02))));
};

// Walks path commands tracking the current point; collects endpoints and
// control points for an over-approximate bounding box (fine for tile cover).
const bbox = (d) => {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d*\.)?\d+(?:e-?\d+)?/gi);
  const pts = [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = null;
  const num = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    if (C === "Z") { cx = sx; cy = sy; continue; }
    const point = () => { let x = num(), y = num(); if (rel) { x += cx; y += cy; } return [x, y]; };
    if (C === "M") { [cx, cy] = point(); sx = cx; sy = cy; pts.push([cx, cy]); cmd = rel ? "l" : "L"; continue; }
    if (C === "L" || C === "T") { [cx, cy] = point(); pts.push([cx, cy]); continue; }
    if (C === "H") { let x = num(); if (rel) x += cx; cx = x; pts.push([cx, cy]); continue; }
    if (C === "V") { let y = num(); if (rel) y += cy; cy = y; pts.push([cx, cy]); continue; }
    if (C === "C") { for (let k = 0; k < 3; k++) { const p = point(); pts.push(p); if (k === 2) [cx, cy] = p; } continue; }
    if (C === "S" || C === "Q") { for (let k = 0; k < 2; k++) { const p = point(); pts.push(p); if (k === 1) [cx, cy] = p; } continue; }
    if (C === "A") { const rx = num(), ry = num(); num(); num(); num(); const p = point(); pts.push([p[0] - rx, p[1] - ry], [p[0] + rx, p[1] + ry]); [cx, cy] = p; continue; }
    throw new Error(`unsupported path command ${cmd}`);
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

const tesserae = (d, region, rand) => {
  const [x0, y0, x1, y1] = bbox(d).map((v) => v * SCALE);
  const out = [];
  for (let y = Math.floor(y0 / PITCH) * PITCH; y < y1 + PITCH; y += PITCH) {
    for (let x = Math.floor(x0 / PITCH) * PITCH; x < x1 + PITCH; x += PITCH) {
      const cx = x + PITCH / 2 + (rand() * 10 - 5), cy = y + PITCH / 2 + (rand() * 10 - 5);
      const size = 29 + rand() * 7, rot = (rand() * 16 - 8).toFixed(1), rx = (4 + rand() * 3).toFixed(1);
      const shade = Math.floor(rand() * 5);
      out.push(`<rect x="${(cx - size / 2).toFixed(1)}" y="${(cy - size / 2).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" rx="${rx}" fill="var(--g${region}${shade})" transform="rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`);
    }
  }
  return out.join("");
};

await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
for (const [name, p] of Object.entries(projects)) {
  const rand = mulberry32(SEED);
  const regionShades = p.paths.map((_, i) => ({
    light: smaltiShades(p.light[i % p.light.length], rand),
    dark: smaltiShades(p.dark[i % p.dark.length], rand),
  }));
  const vars = (mode) => regionShades.map((r, i) => r[mode].map((c, k) => `--g${i}${k}:${c}`).join(";")).join(";");
  const flat = new Set(p.flat ?? []);
  const clips = p.paths.map((d, i) => `<clipPath id="r${i}"><path d="${d}" transform="scale(${SCALE})"/></clipPath>`).join("");
  const regions = p.paths.map((d, i) => {
    if (flat.has(i)) return `<path fill="var(--g${i}2)" d="${d}" transform="scale(${SCALE})" stroke="var(--grout)" stroke-width="6"/>`;
    return `<path fill="var(--grout)" d="${d}" transform="scale(${SCALE})"/><g clip-path="url(#r${i})">${tesserae(d, i, rand)}</g>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}"><style>:root{--ground:#f7f3e9;--grout:#d5d0c5;${vars("light")}}@media(prefers-color-scheme:dark){:root{--ground:#0b1410;--grout:#111a16;${vars("dark")}}}</style><defs>${clips}</defs><rect x="8" y="8" width="${CANVAS - 16}" height="${CANVAS - 16}" rx="82" fill="var(--ground)"/>${regions}</svg>\n`;
  await writeFile(new URL(`../assets/favicons/${name}.svg`, import.meta.url), svg);
}
console.log(`generated ${Object.keys(projects).length} adaptive smalti sigils at ${CANVAS}x${CANVAS}`);
