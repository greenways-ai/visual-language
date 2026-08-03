import { mkdir, writeFile } from "node:fs/promises";

const patterns = {
  greenways: ["0011001100","0111111110","0110000110","1101100111","1101111111","1100000111","0111011110","0011011000","0011111000","0001100000"],
  hoplite: ["0011111100","0111111110","1111111111","1101101011","1111111111","0111111110","0011111100","0110110110","1101101011","1101101011"],
  hestia: ["0001111000","0011111100","0110011110","1100001110","1100111110","0111111100","0011111000","0011011000","0110011000","1100011000"],
  historian: ["0001110000","0011111000","0111111100","1110111110","1111110111","0111111110","0011111100","0011011000","0111111100","1100001110"],
  "visual-language": ["1000000001","0100000010","0010000100","0001001000","0000110000","0000110000","0001001000","0010000100","0100000010","1000000001"]
};
const colors = { greenways: "#33a878", hoplite: "#b49a63", hestia: "#7a2f38", historian: "#415d8a", "visual-language": "#8b6fa8" };
await mkdir(new URL("../assets/favicons/", import.meta.url), { recursive: true });
for (const [project, rows] of Object.entries(patterns)) {
  const cells = rows.flatMap((row, y) => [...row].flatMap((cell, x) => cell === "1" ? [`<rect x="${x}" y="${y}" width="1" height="1"/>`] : []));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" shape-rendering="crispEdges"><rect width="10" height="10" fill="#07100e"/><g fill="${colors[project]}">${cells.join("")}</g></svg>\n`;
  await writeFile(new URL(`../assets/favicons/${project}.svg`, import.meta.url), svg);
}
