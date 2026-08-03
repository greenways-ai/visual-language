import { mkdir, writeFile } from "node:fs/promises";

const patterns = {
  greenways: ["0011100","0100010","1000001","1001111","1000001","0100010","0011100"],
  hoplite: ["0010100","0010100","0011100","0111110","1111110","0111100","0100110"],
  hestia: ["0000110","0001111","1111110","1111010","0100110","0100100","1100110"],
  historia: ["0001000","0011111","0111100","1111110","1111100","0011000","0100100"],
  historian: ["0001000","0011111","0111100","1111110","1111100","0011000","0100100"],
  "visual-language": ["1000001","0100010","0010100","0001000","0010100","0100010","1000001"]
};
const colors = { greenways: "#33a878", hoplite: "#b49a63", hestia: "#7a2f38", historia: "#415d8a", historian: "#415d8a", "visual-language": "#8b6fa8" };
await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
for (const [project, rows] of Object.entries(patterns)) {
  const cells = rows.flatMap((row, y) => [...row].map((cell, x) => `<rect class="${cell === "1" ? "on" : "off"}" x="${x * 10 + 1}" y="${y * 10 + 1}" width="8" height="8" rx=".7"/>`));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70"><style>:root{--grout:#c9c6bb;--stone:#e6e3da;--accent:${colors[project]}}@media(prefers-color-scheme:dark){:root{--grout:#151b18;--stone:#29322e;--accent:${colors[project]}}}.off{fill:var(--stone)}.on{fill:var(--accent)}</style><rect width="70" height="70" fill="var(--grout)"/>${cells.join("")}</svg>\n`;
  await writeFile(new URL(`../assets/favicons/${project}.svg`, import.meta.url), svg);
}
