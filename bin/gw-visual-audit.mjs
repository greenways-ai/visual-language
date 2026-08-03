#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.split("=", 2)));
const root = resolve(args["--root"] || ".");
const project = args["--project"] || "greenways";
const favicon = resolve(root, args["--favicon"] || "public/favicon.svg");
const failures = [];
const expected = await readFile(new URL(`../assets/favicons/${project}.svg`, import.meta.url), "utf8");
const actual = await readFile(favicon, "utf8").catch(() => "");
if (actual.trim() !== expected.trim()) failures.push(`${favicon} is not the canonical ${project} 7x7 adaptive favicon`);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return (await Promise.all(entries.filter((entry) => !["node_modules", ".git", "dist"].includes(entry.name)).map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }))).flat();
}

for (const file of await walk(root)) {
  if (!/\.(astro|css|html|js|mjs|svg)$/.test(file)) continue;
  const source = await readFile(file, "utf8");
  if (/repeat\((?:10|20)\s*,\s*1fr\)|viewBox=["']0 0 (?:10|20) (?:10|20)["']|(?:ten|twenty) by (?:ten|twenty)|(?:10|20)×(?:10|20)/.test(source)) failures.push(`${file} contains a forbidden legacy visual mark`);
}

if (failures.length) {
  console.error(failures.map((failure) => `visual-integrity: ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`visual-integrity: ${project} uses the canonical 7x7 adaptive mark`);
