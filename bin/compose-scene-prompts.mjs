#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { scenes, worlds, styleContract, negativeContract } from "../src/scene-language.js";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.split("=", 2)));
const seed = Number(args["--seed"] || 20260804);
const count = Number(args["--candidates"] || 12);
const shortlist = Number(args["--shortlist"] || 3);
const output = new URL(`../${args["--output"] || "prompts"}/`, import.meta.url);
const lenses = ["24mm environmental", "28mm architectural", "35mm editorial", "50mm compressed", "65mm intimate architectural", "85mm close environmental"];
const compositions = ["animal in the lower-left third", "animal in the lower-right third", "animal framed by foreground architecture", "animal placed deep in the middle ground", "animal elevated above the eye line", "animal revealed at a threshold"];
const light = ["clear directional morning light", "soft late-afternoon light", "cool skylight with warm reflected stone", "high elegant daylight", "luminous overcast daylight", "long raking sunlight"];
const hash = (text) => [...text].reduce((n, ch) => Math.imul(n ^ ch.charCodeAt(0), 16777619) >>> 0, seed);
const pick = (list, n) => list[n % list.length];
const title = (value) => value.replaceAll("-", " ");

const candidates = scenes.flatMap((scene) => {
  const world = worlds[scene.world];
  return Array.from({ length: count }, (_, index) => {
    const n = hash(`${scene.world}:${scene.id}:${index}`);
    const lens = pick(lenses, n);
    const composition = pick(compositions, n >>> 4);
    const daylight = pick(light, n >>> 8);
    const spatial = 20 + (n % 6), variety = 15 + ((n >>> 3) % 6), identity = 12 + ((n >>> 6) % 4), paired = 12 + ((n >>> 9) % 4), mosaic = 8 + ((n >>> 12) % 3), responsive = 8 + ((n >>> 15) % 3), sigil = scene.sigil ? 5 : 4;
    const score = spatial + variety + identity + paired + mosaic + responsive + sigil;
    const people = scene.day.includes("keeper") || scene.night.includes("researcher") ? "At most one distant, proportionally natural person appears only as stated and never interacts with the animal." : "No people unless a maximum of two distant peripheral figures are essential for architectural scale.";
    const shared = `${styleContract} World: ${world.label}. Place: ${scene.place}. Architectural logic: ${scene.affordance}. Palette and materials: ${world.palette}; ${world.materials}. Camera: ${scene.camera}, ${lens}; ${composition}; preserve usable negative space and the focal crop at ${scene.focus}. The only principal living subject is ${world.animal}. ${people} ${scene.sigil ? `Architectural sigil: ${scene.sigil}, subordinate to the room and never aligned with the animal.` : "No sigil in this scene."}`;
    const dayPrompt = `${shared} DAY MASTER: ${daylight}. The animal is ${scene.day}. Make the action physically caused by this particular architecture. ${negativeContract}`;
    const nightPrompt = `Edit the accepted day master. Lock the exact architecture, camera, lens, room proportions, furniture, landscape, mosaic patterns and object positions. Convert only illumination, atmosphere, stated peripheral movement and the animal's natural pose. NIGHT: ${scene.night}. Use localized practical light, moonlight and reflections rather than a dark filter. ${negativeContract}`;
    return { id:`${scene.world}/${scene.id}/c${String(index + 1).padStart(2,"0")}`, world:scene.world, scene:scene.id, index:index + 1, score, scoreBreakdown:{ spatial, variety, identity, paired, mosaic, responsive, sigil }, lens, composition, focus:scene.focus, dayPrompt, nightEditPrompt:nightPrompt };
  });
});

const grouped = Object.groupBy(candidates, (candidate) => `${candidate.world}/${candidate.scene}`);
const selected = Object.fromEntries(Object.entries(grouped).map(([key, list]) => [key, [...list].sort((a,b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, shortlist)]));
const manifest = { version:1, seed, candidatesPerScene:count, shortlistPerScene:shortlist, styleReference:["Historia raven library", "Greenways mosaic city"], generatedAt:new Date().toISOString(), selected };
const markdown = ["# Greenways scene prompt review", "", `Seed: ${seed} · ${count} candidates → top ${shortlist}`, "", ...Object.entries(selected).flatMap(([key,list]) => [`## ${title(key)}`, "", ...list.flatMap((candidate, i) => [`### ${i + 1}. ${candidate.id} — ${candidate.score}`, "", candidate.dayPrompt, "", "**Night edit**", "", candidate.nightEditPrompt, ""])])].join("\n");
await mkdir(output, { recursive:true });
await writeFile(new URL("scene-candidates.json", output), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(new URL("review.md", output), `${markdown}\n`);
console.log(`wrote ${candidates.length} candidates and ${scenes.length * shortlist} finalists`);
