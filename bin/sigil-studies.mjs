// Shared smalti sigil geometry: path helpers, palettes and the sixty-study
// exploration table at 480x480. Consumed by generate-sigil-explorations.mjs
// (lab studies) and generate-v3-favicons.mjs (canonical project sigils).

// ---------- path helpers (480 canvas, center 240) ----------
export const SEED = 20260804;

const f = (n) => Math.round(n * 10) / 10;
const ellipse = (cx, cy, rx, ry) =>
  `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`;
const ring = (cx, cy, rO, rI) => ({ d: ellipse(cx, cy, rO, rO) + ellipse(cx, cy, rI, rI), rule: "evenodd" });
const star = (cx, cy, rO, rI, n, rot = -Math.PI / 2) => {
  const pts = [];
  for (let i = 0; i < 2 * n; i++) {
    const r = i % 2 === 0 ? rO : rI, a = rot + (i * Math.PI) / n;
    pts.push(`${i === 0 ? "M" : "L"}${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`);
  }
  return pts.join("") + "Z";
};
// canonical heart in 64-grid coords, scaled/translated to canvas coords
const heart = (k = 7.5, dx = 0, dy = 0) => {
  const X = (x) => f(240 + dx + (x - 32) * k), Y = (y) => f(250 + dy + (y - 32) * k);
  return `M${X(32)} ${Y(19)}C${X(25)} ${Y(7)} ${X(8)} ${Y(10)} ${X(8)} ${Y(25)}c0 ${f(8 * k)} ${f(7 * k)} ${f(14 * k)} ${f(14 * k)} ${f(20 * k)}L${X(32)} ${Y(58)} ${X(42)} ${Y(45)}c${f(7 * k)} ${f(-6 * k)} ${f(14 * k)} ${f(-12 * k)} ${f(14 * k)} ${f(-20 * k)}C${X(56)} ${Y(10)} ${X(39)} ${Y(7)} ${X(32)} ${Y(19)}Z`;
};
const almond = (cx, cy, w, h, pinch = 0.55) =>
  `M${f(cx)} ${f(cy - h / 2)}C${f(cx + w * pinch)} ${f(cy - h * 0.22)} ${f(cx + w * pinch)} ${f(cy + h * 0.22)} ${f(cx)} ${f(cy + h / 2)}C${f(cx - w * pinch)} ${f(cy + h * 0.22)} ${f(cx - w * pinch)} ${f(cy - h * 0.22)} ${f(cx)} ${f(cy - h / 2)}Z`;
const ribbon = (y, amp, th) =>
  `M-20 ${f(y)}C100 ${f(y - amp)} 200 ${f(y + amp)} 320 ${f(y - amp)}S480 ${f(y + amp * 0.4)} 500 ${f(y - amp * 0.4)}L500 ${f(y + th)}C430 ${f(y + th + amp * 0.6)} 300 ${f(y + th - amp)} 170 ${f(y + th + amp * 0.4)}S30 ${f(y + th - amp * 0.6)} -20 ${f(y + th)}Z`;
const flame = (k = 7.5, dx = 0, dy = 0) => {
  const X = (x) => f(240 + dx + (x - 32) * k), Y = (y) => f(250 + dy + (y - 33) * k);
  return `M${X(32)} ${Y(5)}C${X(20)} ${Y(20)} ${X(15)} ${Y(29)} ${X(17)} ${Y(43)}c${f(2 * k)} ${f(10 * k)} ${f(8 * k)} ${f(15 * k)} ${f(15 * k)} ${f(17 * k)}-${f(4 * k)} ${f(8 * k)}-${f(3 * k)} ${f(15 * k)} ${f(1 * k)} ${f(22 * k)} ${f(3 * k)} ${f(6 * k)} ${f(7 * k)} ${f(10 * k)} ${f(6 * k)} ${f(17 * k)} ${f(8 * k)}-${f(6 * k)} ${f(11 * k)}-${f(15 * k)} ${f(7 * k)}-${f(26 * k)}C${X(43)} ${Y(19)} ${X(36)} ${Y(11)} ${X(32)} ${Y(5)}Z`;
};

// ---------- palettes ----------
export const PAL = {
  emerald: ["#123e34", "#1f6552", "#2c8b69", "#61ad82", "#cfb66a"],
  garnet: ["#641b27", "#8e2731", "#bd3f3b", "#e66d42", "#ffd08a"],
  saffron: ["#596f69", "#967a37", "#b78a22", "#d7b64e", "#f3d988"],
  lapis: ["#1b3154", "#2c4e7b", "#426fa6", "#20c7df", "#07121c"],
  malachite: ["#11392f", "#1d5e4d", "#2f8569", "#58a983", "#9bd4ad"],
  amethyst: ["#3b2452", "#57357a", "#7a4fa3", "#a97fd0", "#d9c2ee"],
  coral: ["#7a2c22", "#a8442f", "#cf6242", "#e88f63", "#f7c9a8"],
  lagoon: ["#0c3f46", "#12616a", "#1d8a8f", "#38b6ae", "#9be0d2"],
  bronze: ["#4a3521", "#6d5230", "#967646", "#c09c60", "#e3c98f"],
  midnight: ["#101827", "#243d65", "#39608f", "#5b86b8", "#dce9f5"],
  peacock: ["#123e34", "#1f6552", "#cfb66a", "#20c7df", "#0f2c4f"],
  slate: ["#2c313a", "#454c58", "#5f6a77", "#8b97a3", "#c3ccd4"],
};
export const GROUND = "GROUND";

// ---------- studies ----------
// regions: [path, paletteIndex | GROUND, flat?]
const S = (id, label, palette, regions, opts = {}) => ({ id, label, palette, regions, ...opts });
export const studies = [
  // hearts
  S("heart-plain", "Heart · plain emerald", "emerald", [[heart(), 0]]),
  S("heart-eye-cyan", "Heart · cyan eye", "emerald", [[heart(), 0], [almond(240, 255, 130, 86), 3]]),
  S("heart-eye-gold", "Heart · gold eye", "emerald", [[heart(), 0], [almond(240, 255, 130, 86), 4]]),
  S("heart-eye-peacock", "Heart · peacock eye", "peacock", [[heart(), 0], [almond(240, 255, 140, 96), 2], [almond(240, 255, 84, 56), 3], [almond(240, 255, 40, 28), 4]]),
  S("heart-split", "Heart · split halves", "emerald", [[`M240 145C190 55 62 77 62 190c0 62 53 108 108 155l70 90V258Z`, 0], [`M240 145C290 55 418 77 418 190c0 62-53 108-108 155l-70 90V258Z`, 2]]),
  S("heart-ring", "Heart · open outline", "lagoon", [[{ d: heart() + heart(4.2, 0, 42), rule: "evenodd" }, 2]]),
  S("heart-twin", "Heart · intertwined", "garnet", [[heart(6.2, -58, -10), 1], [heart(6.2, 58, 10), 3]]),
  // peacock feather eyes
  S("peacock-eye-vertical", "Peacock eye · vertical", "peacock", [[almond(240, 260, 260, 340, 0.62), 0], [almond(240, 260, 190, 250, 0.62), 2], [almond(240, 260, 122, 165, 0.62), 3], [almond(240, 260, 58, 84, 0.62), 4]]),
  S("peacock-eye-horizontal", "Peacock eye · horizontal", "peacock", [[almond(240, 250, 340, 220, 0.72), 0], [almond(240, 250, 250, 158, 0.72), 2], [almond(240, 250, 165, 102, 0.72), 3], [almond(240, 250, 84, 52, 0.72), 4]]),
  S("peacock-eye-round", "Peacock eye · medallion", "peacock", [[ellipse(240, 250, 170, 170), 0], [ellipse(240, 250, 122, 122), 2], [ellipse(240, 250, 76, 76), 3], [ellipse(240, 250, 38, 38), 4]]),
  S("peacock-eye-shield", "Peacock eye · shield", "lapis", [[almond(240, 255, 250, 330, 0.62), 0], [almond(240, 255, 176, 240, 0.62), 2], [almond(240, 255, 110, 155, 0.62), 3], [almond(240, 255, 52, 76, 0.62), 4]]),
  S("peacock-eye-amethyst", "Peacock eye · amethyst", "amethyst", [[almond(240, 260, 260, 340, 0.62), 0], [almond(240, 260, 190, 250, 0.62), 2], [almond(240, 260, 122, 165, 0.62), 3], [almond(240, 260, 58, 84, 0.62), 1]]),
  S("peacock-feather", "Peacock feather · with stem", "peacock", [[almond(240, 235, 240, 300, 0.62), 0], [almond(240, 235, 168, 218, 0.62), 2], [almond(240, 235, 106, 142, 0.62), 3], [almond(240, 235, 50, 72, 0.62), 4], [`M234 380 246 380 243 452 237 452Z`, 1, "flat"]]),
  // flames
  S("flame-single", "Flame · single", "garnet", [[flame(), 1]]),
  S("flame-double", "Flame · inner light", "garnet", [[flame(), 0], [flame(5.2, 0, 42), 2]]),
  S("flame-triple", "Flame · triple core", "coral", [[flame(), 0], [flame(5.4, 0, 40), 2], [flame(3.4, 4, 92), 3]]),
  // eyes
  S("eye-cyan", "Eye · cyan iris", "lapis", [[almond(240, 250, 360, 230, 0.78), 1], [ellipse(240, 250, 88, 88), 3], [ellipse(240, 250, 40, 40), 4, "flat"]]),
  S("eye-gold", "Eye · gold iris", "midnight", [[almond(240, 250, 360, 230, 0.78), 1], [ellipse(240, 250, 88, 88), 3], [ellipse(240, 250, 40, 40), 4, "flat"]]),
  S("eye-vertical-pupil", "Eye · vertical pupil", "amethyst", [[almond(240, 250, 360, 230, 0.78), 1], [ellipse(240, 250, 92, 92), 2], [almond(240, 250, 34, 110, 0.9), 0, "flat"]]),
  S("eye-rings", "Eye · concentric rings", "lagoon", [[almond(240, 250, 360, 230, 0.78), 0], [ring(240, 250, 96, 62), 2], [ellipse(240, 250, 34, 34), 3, "flat"]]),
  // rings and ouroboros
  S("ring-open", "Ring · open", "malachite", [[ring(240, 250, 165, 96), 1], [`M380 130 430 170 372 210 340 172Z`, GROUND]]),
  S("ring-closed", "Ring · closed", "bronze", [[ring(240, 250, 165, 96), 2]]),
  S("ring-ouroboros", "Ring · ouroboros", "malachite", [[ring(240, 250, 165, 96), 1], [`M372 128c40 10 62 44 58 78l-56-16-34 34-8-62Z`, 2], [ellipse(396, 168, 13, 13), 4, "flat"]]),
  S("ring-double", "Ring · double", "lagoon", [[ring(240, 250, 175, 142), 1], [ring(240, 250, 100, 66), 3]]),
  S("ring-keyhole", "Ring · keyhole gap", "midnight", [[ring(240, 250, 165, 96), 1], [`M222 60 258 60 246 160 234 160Z`, GROUND]]),
  // ribbons and waves
  S("ribbons-three", "Ribbons · three", "saffron", [[ribbon(120, 42, 54), 0], [ribbon(240, 48, 54), 2], [ribbon(360, 42, 54), 1]]),
  S("ribbons-two", "Ribbons · two", "malachite", [[ribbon(160, 52, 62), 1], [ribbon(320, 58, 62), 3]]),
  S("ribbons-cross", "Ribbons · crossing", "emerald", [[ribbon(150, 60, 58), 1], [`M-20 330C100 390 240 200 500 330L500 392C300 272 140 400 -20 392Z`, 3]]),
  S("wave-single", "Wave · single", "lagoon", [[ribbon(220, 66, 84), 2]]),
  // crescents
  S("crescent", "Crescent · malachite", "malachite", [[{ d: ellipse(228, 250, 165, 165) + ellipse(282, 222, 138, 138), rule: "evenodd" }, 2]]),
  S("crescent-star", "Crescent · with star", "midnight", [[{ d: ellipse(228, 250, 160, 160) + ellipse(278, 224, 132, 132), rule: "evenodd" }, 1], [star(318, 168, 44, 18, 5), 4, "flat"]]),
  // stars
  S("star-five", "Star · five point", "saffron", [[star(240, 255, 175, 72, 5), 2]]),
  S("star-six", "Star · six point", "lagoon", [[star(240, 255, 175, 98, 6), 2]]),
  S("star-eight", "Star · eight point", "garnet", [[star(240, 255, 175, 96, 8, -Math.PI / 2), 1], [ellipse(240, 255, 52, 52), 4]]),
  S("star-compass", "Star · compass", "slate", [[star(240, 255, 185, 42, 4), 2], [ellipse(240, 255, 44, 44), 4]]),
  // drops
  S("drop-lagoon", "Drop · lagoon", "lagoon", [[almond(240, 260, 220, 320, 0.85), 2]]),
  S("drop-core", "Drop · inner core", "lapis", [[almond(240, 260, 220, 320, 0.85), 1], [almond(240, 300, 120, 175, 0.85), 3]]),
  // mountains
  S("mountain-pair", "Mountain · pair", "emerald", [[`M60 380 190 150 320 380Z`, 1], [`M220 380 330 210 440 380Z`, 2]]),
  S("mountain-sun", "Mountain · with sun", "midnight", [[ellipse(330, 150, 62, 62), 4], [`M50 390 180 160 310 390Z`, 1], [`M210 390 320 220 430 390Z`, 2]]),
  // commas and spirals
  S("comma", "Comma · tomoe", "malachite", [[ellipse(240, 250, 165, 165), 1], [ellipse(290, 200, 105, 105), GROUND], [ellipse(215, 285, 52, 52), 3]]),
  S("comma-twin", "Comma · twin", "amethyst", [[ellipse(240, 250, 165, 165), 1], [ellipse(290, 200, 105, 105), GROUND], [ellipse(215, 285, 52, 52), 3], [ellipse(305, 320, 30, 30), 4, "flat"]]),
  S("spiral-ring", "Spiral · ring and dot", "coral", [[ring(240, 250, 165, 110), 1], [ellipse(240, 250, 62, 62), 3]]),
  // keys
  S("key", "Key · bronze", "bronze", [[ring(180, 190, 82, 40), 2], [`M228 235 396 362 372 396 204 268Z`, 2], [`M348 330 396 292 414 316 372 352Z`, 3], [`M300 296 338 266 354 286 320 314Z`, 3]]),
  S("key-gilt", "Key · gilt", "saffron", [[ring(180, 190, 82, 40), 3], [`M228 235 396 362 372 396 204 268Z`, 3], [`M348 330 396 292 414 316 372 352Z`, 4], [`M300 296 338 266 354 286 320 314Z`, 4]]),
  // gates
  S("gate-arch", "Gate · arch", "garnet", [[{ d: `M110 420V230C110 140 170 90 240 90s130 50 130 140v190Z` + `M180 420V250c0-52 28-78 60-78s60 26 60 78v170Z`, rule: "evenodd" }, 1]]),
  S("gate-twin", "Gate · twin arches", "lapis", [[{ d: `M70 420V240C70 160 120 115 175 115s105 45 105 125v180Z` + `M120 420V265c0-40 22-60 45-60s45 20 45 60v155Z`, rule: "evenodd" }, 1], [{ d: `M235 420V240c0-80 50-125 105-125s105 45 105 125v180Z` + `M285 420V265c0-40 22-60 45-60s45 20 45 60v155Z`, rule: "evenodd" }, 2]]),
  S("gate-emerald", "Gate · emerald", "emerald", [[{ d: `M110 420V230C110 140 170 90 240 90s130 50 130 140v190Z` + `M180 420V250c0-52 28-78 60-78s60 26 60 78v170Z`, rule: "evenodd" }, 1]]),
  // leaves and trees
  S("leaf", "Leaf · single", "emerald", [[almond(240, 240, 190, 300, 0.8), 2], [`M236 300 244 300 241 420 237 420Z`, 1, "flat"]]),
  S("leaf-pair", "Leaf · pair", "malachite", [[almond(190, 250, 150, 260, 0.8), 1], [almond(300, 250, 150, 260, 0.8), 3]]),
  S("tree-pine", "Tree · pine", "emerald", [[`M240 90 340 280 290 280 360 400 120 400 190 280 140 280Z`, 1], [`M226 400 254 400 254 445 226 445Z`, 4, "flat"]]),
  S("tree-round", "Tree · round", "bronze", [[ellipse(240, 210, 120, 105), 2], [`M226 290 254 290 250 420 230 420Z`, 1]]),
  // gems
  S("gem-diamond", "Gem · diamond", "lapis", [[`M240 100 360 210 240 400 120 210Z`, 2], [`M240 100 300 210 240 400 180 210Z`, 3]]),
  S("gem-emerald-cut", "Gem · emerald cut", "lagoon", [[{ d: `M150 130 330 130 390 250 330 390 150 390 90 250Z` + `M185 165 315 165 350 250 315 355 185 355 130 250Z`, rule: "evenodd" }, 2]]),
  // suns and moons
  S("sun-rays", "Sun · eight rays", "saffron", [[ellipse(240, 250, 92, 92), 3], [star(240, 250, 180, 118, 8, -Math.PI / 2), 2]]),
  S("sun-horizon", "Sun · horizon", "coral", [[`M100 300a140 140 0 0 1 280 0Z`, 2], [`M60 330 420 330 420 372 60 372Z`, 4], [star(240, 210, 220, 178, 12, -Math.PI / 2), 3]]),
  // lotus
  S("lotus-three", "Lotus · three petals", "amethyst", [[almond(240, 270, 120, 240, 0.7), 2], [`M240 380C170 350 130 280 140 200c50 30 80 80 100 180Z`, 1], [`M240 380C310 350 350 280 340 200c-50 30-80 80-100 180Z`, 3]]),
  S("lotus-coral", "Lotus · coral", "coral", [[almond(240, 270, 120, 240, 0.7), 2], [`M240 380C170 350 130 280 140 200c50 30 80 80 100 180Z`, 1], [`M240 380C310 350 350 280 340 200c-50 30-80 80-100 180Z`, 3]]),
  // architecture
  S("bridge-arch", "Bridge · arch", "slate", [[`M60 300 420 300 420 340 60 340Z`, 1], [{ d: `M100 340 380 340 380 400 100 400Z` + `M150 400a90 60 0 0 1 180 0Z`, rule: "evenodd" }, 2]]),
  S("tower-beam", "Tower · beacon", "midnight", [[`M200 420 215 180 265 180 280 420Z`, 1], [`M190 130 290 130 290 180 190 180Z`, 3], [`M120 90 180 120 172 148 108 118Z`, 4, "flat"], [`M360 90 300 120 308 148 372 118Z`, 4, "flat"]]),
  S("shell-fan", "Shell · scallop fan", "coral", [[`M240 400 90 220a190 190 0 0 1 300 0Z`, 1], [`M240 400 150 190 178 170 262 400Z`, 2], [`M240 400 330 190 302 170 218 400Z`, 3]]),
];

if (studies.length !== 60) throw new Error(`expected 60 studies, have ${studies.length}`);
