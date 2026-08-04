// Shared smalti sigil engine: irregular interlocking Voronoi tesserae with
// one flat opaque color per piece, no grout, adaptive light/dark palettes.

export const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const hexToHsl = (hex) => {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi).map((v) => parseInt(v, 16) / 255);
  const hi = Math.max(r, g, b), lo = Math.min(r, g, b), l = (hi + lo) / 2;
  if (hi === lo) return [0, 0, l];
  const d = hi - lo, s = l > 0.5 ? d / (2 - hi - lo) : d / (hi + lo);
  const h = hi === r ? ((g - b) / d + (g < b ? 6 : 0)) : hi === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};
export const hslToHex = (h, s, l) => {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
};

// Five opaque smalti shades per region base color: subtle hand-mixed
// variation, never a gradient.
export const smaltiShades = (hex, rand) => {
  const [h, s, l] = hexToHsl(hex);
  return [0.10, 0.05, 0, -0.05, -0.10].map((dl) =>
    hslToHex(h + (rand() * 8 - 4), clamp01(s + (rand() * 0.06 - 0.03)), clamp01(l + dl * 0.6 + (rand() * 0.04 - 0.02))));
};

// Walks path commands tracking the current point; collects endpoints and
// control points for an over-approximate bounding box (fine for tile cover).
export const pathBBox = (d) => {
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

// Irregular interlocking tesserae: a jittered-seed Voronoi bed. Pieces touch
// edge to edge — true smalti have no grout. Each polygon is stroked with its
// own fill to hide anti-aliasing hairlines between neighbours.
export const voronoiBed = (rand, canvas = 480, pitch = 38) => {
  const seeds = [];
  for (let y = 0; y < canvas + pitch; y += pitch) {
    for (let x = 0; x < canvas + pitch; x += pitch) {
      seeds.push([x - pitch / 2 + rand() * pitch * 0.8, y - pitch / 2 + rand() * pitch * 0.8]);
    }
  }
  const clip = (poly, a, b) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const side = (pt) => (pt[0] - mx) * dx + (pt[1] - my) * dy;
    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const p = poly[k], q = poly[(k + 1) % poly.length];
      const sp = side(p), sq = side(q);
      if (sp <= 0) out.push(p);
      if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
        const t = sp / (sp - sq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
      }
    }
    return out;
  };
  return seeds.map((a) => {
    let poly = [[-80, -80], [canvas + 80, -80], [canvas + 80, canvas + 80], [-80, canvas + 80]];
    for (const b of seeds) {
      if (b === a) continue;
      poly = clip(poly, a, b);
      if (poly.length === 0) break;
    }
    return { seed: a, poly };
  }).filter((c) => c.poly.length > 2);
};

// Renders a complete adaptive smalti sigil SVG. `paths` are region outlines
// in path coordinates (a string, or { d, rule: "evenodd" } for ring shapes);
// `scale` maps them onto the canvas. Region i takes its base color from
// palettes[i % palettes.length]. `flat` region indexes are drawn as a single
// solid piece (for details smaller than one tessera); `groundCuts` region
// indexes are punched back to the ground color.
export const renderSigil = ({ paths, light, dark, flat = [], groundCuts = [], scale = 1, seed = 1, canvas = 480, pitch = 38, ground = ["#f7f3e9", "#0b1410"], groundRx }) => {
  const rand = mulberry32(seed);
  const regionShades = paths.map((_, i) => ({
    light: smaltiShades(light[i % light.length], rand),
    dark: smaltiShades(dark[i % dark.length], rand),
  }));
  const vars = (mode) => regionShades.map((r, i) => r[mode].map((c, k) => `--g${i}${k}:${c}`).join(";")).join(";");
  const flatSet = new Set(flat);
  const cutSet = new Set(groundCuts);
  const cells = voronoiBed(rand, canvas, pitch);
  const cellShade = cells.map(() => Math.floor(rand() * 5));
  const pathOf = (p) => typeof p === "string" ? { d: p } : p;
  const shape = (p, extra = "") => {
    const { d, rule } = pathOf(p);
    return `<path${rule ? ` fill-rule="${rule}"${rule === "evenodd" ? ' clip-rule="evenodd"' : ""}` : ""} d="${d}"${scale !== 1 ? ` transform="scale(${scale})"` : ""}${extra}/>`;
  };
  const clips = paths.map((p, i) => `<clipPath id="r${i}">${shape(p)}</clipPath>`).join("");
  const regions = paths.map((p, i) => {
    if (cutSet.has(i)) return shape(p, ' fill="var(--ground)"');
    if (flatSet.has(i)) return shape(p, ` fill="var(--g${i}2)"`);
    const pad = 48;
    const [x0, y0, x1, y1] = pathBBox(pathOf(p).d).map((v) => v * scale);
    const pieces = cells.map((c, ci) => {
      if (c.seed[0] < x0 - pad || c.seed[0] > x1 + pad || c.seed[1] < y0 - pad || c.seed[1] > y1 + pad) return "";
      const pts = c.poly.map((pt) => `${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(" ");
      const fill = `var(--g${i}${cellShade[ci]})`;
      return `<polygon points="${pts}" fill="${fill}" stroke="${fill}" stroke-width="1.5" stroke-linejoin="round"/>`;
    }).join("");
    return `<g clip-path="url(#r${i})">${pieces}</g>`;
  }).join("");
  const rx = groundRx ?? Math.round(canvas * 0.17);
  const inset = Math.round(canvas / 60);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}"><style>:root{--ground:${ground[0]};${vars("light")}}@media(prefers-color-scheme:dark){:root{--ground:${ground[1]};${vars("dark")}}}</style><defs>${clips}</defs><rect x="${inset}" y="${inset}" width="${canvas - inset * 2}" height="${canvas - inset * 2}" rx="${rx}" fill="var(--ground)"/>${regions}</svg>\n`;
};
