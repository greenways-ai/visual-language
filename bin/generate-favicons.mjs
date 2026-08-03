import { mkdir, writeFile } from "node:fs/promises";

const patterns = {
  greenways: ["001101100","011111110","010000010","110110111","110111111","110000111","011101110","001111100","000110000"],
  hoplite: ["001111100","011111110","111111111","110101011","111111111","011111110","001111100","010101010","110101011"],
  hestia: ["000111100","001111110","011001110","110000110","110011110","011111100","001111000","001011000","110011000"],
  historian: ["000111000","001111100","011111110","110111110","111110111","011111110","001111100","001011000","110000110"],
  "visual-language": ["100000001","010000010","001000100","000101000","000010000","000101000","001000100","010000010","100000001"]
};
const colors = { greenways: "#33a878", hoplite: "#b49a63", hestia: "#7a2f38", historian: "#415d8a", "visual-language": "#8b6fa8" };
await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
for (const [project, rows] of Object.entries(patterns)) {
  const cells = rows.flatMap((row, y) => [...row].flatMap((cell, x) => cell === "1" ? [`<rect x="${x}" y="${y}" width="1" height="1"/>`] : []));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" shape-rendering="crispEdges"><rect width="9" height="9" fill="#07100e"/><g fill="${colors[project]}">${cells.join("")}</g></svg>\n`;
  await writeFile(new URL(`../assets/favicons/${project}.svg`, import.meta.url), svg);
}
