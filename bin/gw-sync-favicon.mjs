#!/usr/bin/env node
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.split("=", 2)));
const project = args["--project"];
const output = resolve(args["--output"] || "public/favicon.svg");
if (!project || !["greenways", "hoplite", "hestia", "historian", "visual-language"].includes(project)) {
  throw new Error("--project must name a canonical Greenways project");
}
await mkdir(dirname(output), { recursive: true });
await copyFile(new URL(`../assets/favicons/${project}.svg`, import.meta.url), output);
console.log(`synced ${project} favicon to ${output}`);
