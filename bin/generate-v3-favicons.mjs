import { mkdir, writeFile } from "node:fs/promises";

const projects = {
  greenways: {
    light: ["#123e34", "#1f6552", "#2c8b69", "#61ad82", "#cfb66a"],
    dark: ["#16483a", "#23705a", "#35a176", "#69ba8a", "#dec477"],
    paths: [
      "M32 7 42 21 32 30 22 21Z",
      "m44 22 13 8-13 9-10-7Z",
      "m44 41 9 12-17-3-2-15Z",
      "m30 35-2 15-17 3 9-12Z",
      "M20 39 7 30l13-8 10 10Z",
    ],
  },
  hara: {
    light: ["#0b4e5d", "#36f1de", "#35a8ff", "#6e74ff", "#a23cff"],
    dark: ["#12394a", "#36f1de", "#35a8ff", "#7b6dff", "#c45cff"],
    ground: { light: "#eef8f7", dark: "#05070e" },
    strokes: [
      "M32 5C18 5 11 14 17 23c5 7 9 9 3 18-7 10-2 18 12 18",
      "M32 5c14 0 21 9 15 18-5 7-9 9-3 18 7 10 2 18-12 18",
      "M16 21c8-8 24-8 32 0",
      "M16 43c8 8 24 8 32 0",
      "M32 13v38",
    ],
  },
  hestia: {
    light: ["#641b27", "#8e2731", "#bd3f3b", "#e66d42", "#ffd08a"],
    dark: ["#6d1b27", "#a52a36", "#dc4b40", "#ff8b4a", "#ffd69a"],
    paths: [
      "M32 5C20 20 15 29 17 43c2 10 8 15 15 17-4-8-3-15 1-22 3 6 7 10 6 17 8-6 11-15 7-26C43 19 36 11 32 5Z",
      "M32 16c-7 10-10 18-8 27 1 7 4 12 8 17-4-8-3-15 1-22Z",
      "M33 38c-4 7-5 15-1 22 5-2 8-7 7-12 0-4-3-8-6-10Z",
    ],
  },
  hoplite: {
    light: ["#596f69", "#748f87", "#967a37", "#b78a22", "#6d5209"],
    dark: ["#466860", "#6d978d", "#b08b33", "#d7b64e", "#f3d988"],
    paths: [
      "M7 19c11-8 23-9 33-4l-8 8c-7-3-15-1-22 4Z",
      "M39 15c8 3 14 2 19-2-2 10-10 15-21 13l-5-3Z",
      "M5 34c14-8 29-8 40-2l-8 7c-9-4-20-3-29 2Z",
      "M45 32c6 3 11 2 15-1-3 8-10 13-19 11l-4-3Z",
      "M12 49c10-5 21-5 30-1l-8 7c-6-3-13-2-19 1Z",
    ],
  },
  historia: {
    light: ["#1b3154", "#2c4e7b", "#426fa6", "#20c7df", "#07121c"],
    dark: ["#243d65", "#39608f", "#5b86b8", "#83e9f4", "#07121c"],
    paths: [
      "M4 32C12 18 21 12 32 12L22 25 14 32Z",
      "M32 12c11 0 21 6 28 20H50l-8-7Z",
      "M4 32h10l8 7 10 13C20 52 11 45 4 32Z",
      "M60 32H50l-8 7-10 13c12 0 21-7 28-20Z",
      "m32 20 11 7 3 5-7 9-7 5-7-5-7-9 3-5Z",
    ],
  },
  hodos: {
    light: ["#11392f", "#1d5e4d", "#2f8569", "#58a983", "#9bd4ad"],
    dark: ["#174b3d", "#25755d", "#38a67c", "#70c99a", "#b4e4bd"],
    paths: [
      "M31 27C22 12 11 10 7 15c2 12 9 20 22 22Z",
      "M33 27c9-15 20-17 24-12-2 12-9 20-22 22Z",
      "M29 36C17 34 10 40 12 48c7 6 13 7 19 3Z",
      "M35 36c12-2 19 4 17 12-7 6-13 7-19 3Z",
      "m32 20 4 10-2 25h-4l-2-25Z",
    ],
  },
};

projects.historian = projects.historia;
projects["visual-language"] = projects.greenways;

await mkdir(new URL("../assets/favicons/", import.meta.url), {
  recursive: true,
});

for (const [name, project] of Object.entries(projects)) {
  const vars = (colors) =>
    colors.map((color, index) => `--c${index + 1}:${color}`).join(";");
  const pattern = `<pattern id="mosaic" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="var(--grout)"/><rect x="1" y="1" width="6" height="6" rx=".7" fill="var(--c1)"/><rect x="9" y="1" width="6" height="6" rx=".7" fill="var(--c2)"/><rect x="1" y="9" width="6" height="6" rx=".7" fill="var(--c3)"/><rect x="9" y="9" width="6" height="6" rx=".7" fill="var(--c5)"/></pattern>`;
  const haraGradient = project.strokes
    ? `<linearGradient id="hara-spectrum" x1="13" y1="7" x2="51" y2="57" gradientUnits="userSpaceOnUse"><stop stop-color="#36f1de"/><stop offset=".48" stop-color="#35a8ff"/><stop offset="1" stop-color="#a23cff"/></linearGradient>`
    : "";
  const artwork = project.strokes
    ? `${project.strokes
        .map(
          (path) =>
            `<path class="cut" d="${path}"/><path class="strand" d="${path}"/>`,
        )
        .join("")}<circle class="node" cx="32" cy="32" r="3.4"/>`
    : project.paths
        .map((path) => `<path class="shape" fill="url(#mosaic)" d="${path}"/>`)
        .join("");
  const groundLight = project.ground?.light ?? "#f7f3e9";
  const groundDark = project.ground?.dark ?? "#0b1410";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>:root{--ground:${groundLight};--grout:#d5d0c5;${vars(project.light)}}@media(prefers-color-scheme:dark){:root{--ground:${groundDark};--grout:#111a16;${vars(project.dark)}}}.shape{stroke:var(--grout);stroke-width:1.5;stroke-linejoin:round}.cut{fill:none;stroke:var(--ground);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}.strand{fill:none;stroke:url(#hara-spectrum);stroke-width:5.25;stroke-linecap:round;stroke-linejoin:round}.node{fill:var(--ground);stroke:var(--c3);stroke-width:2}</style><defs>${pattern}${haraGradient}</defs><rect x="1" y="1" width="62" height="62" rx="11" fill="var(--ground)"/>${artwork}</svg>\n`;

  await writeFile(
    new URL(`../assets/favicons/${name}.svg`, import.meta.url),
    svg,
  );
}

console.log(`generated ${Object.keys(projects).length} adaptive project sigils`);
