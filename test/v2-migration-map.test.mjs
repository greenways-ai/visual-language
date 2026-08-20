import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import {
  conceptRouteSources,
  generatedAssetSources,
  greenwaysV2MigrationInventory,
  legacyPackageExports,
  migrationTreatments,
  siteOnlySources,
  v2PackageContracts,
} from "../migration/v2-inventory.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function walk(path) {
  const root = new URL(`../${path}/`, import.meta.url);
  const files = [];
  async function visit(url, prefix = "") {
    const entries = await readdir(url, { withFileTypes: true });
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await visit(new URL(`${entry.name}/`, url), relative);
      else files.push(`${path}/${relative}`);
    }
  }
  await visit(root);
  return files.sort();
}

const pathsWithPrefix = (records, prefix) => records.map((item) => item.path).filter((path) => path.startsWith(prefix)).sort();

test("the migration inventory classifies every governed source", () => {
  const allowed = new Set(migrationTreatments);
  const identities = new Set();
  for (const item of greenwaysV2MigrationInventory) {
    assert.ok(allowed.has(item.treatment), item.path);
    assert.ok(item.owner, item.path);
    assert.ok(item.note, item.path);
    const identity = `${item.exportKey ?? "source"}:${item.path}`;
    assert.ok(!identities.has(identity), identity);
    identities.add(identity);
  }
});

test("the export inventory is exact", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const expected = [...legacyPackageExports, ...v2PackageContracts]
    .map((item) => item.exportKey)
    .sort();
  assert.deepEqual(Object.keys(packageJson.exports).sort(), expected);
});

test("site-only components, layouts, styles, assets and data cannot drift unclassified", async () => {
  for (const directory of [
    "src/site/components",
    "src/site/layouts",
    "src/site/styles",
    "src/site/assets",
  ]) {
    assert.deepEqual(await walk(directory), pathsWithPrefix(siteOnlySources, `${directory}/`));
  }

  for (const path of [
    "src/artwork-catalog.js",
    "src/content.config.ts",
    "src/greenways-os-v2-surfaces.ts",
    "src/greenways-product-screens.ts",
    "src/scene-language.js",
  ]) {
    assert.ok(siteOnlySources.some((item) => item.path === path), path);
  }
});

test("every current concept route source is classified", async () => {
  assert.deepEqual(await walk("src/pages/concepts"), conceptRouteSources.map((item) => item.path).sort());
});

test("every generated-asset and output-verification source is classified", async () => {
  assert.deepEqual(await walk("bin"), pathsWithPrefix(generatedAssetSources, "bin/"));
  assert.deepEqual(await walk("scripts"), pathsWithPrefix(generatedAssetSources, "scripts/"));
});

test("the human migration map names every executable inventory record", async () => {
  const markdown = await read("V2-MIGRATION.md");
  for (const item of greenwaysV2MigrationInventory) {
    assert.ok(markdown.includes(`\`${item.path}\``), item.path);
  }
  for (const item of [...legacyPackageExports, ...v2PackageContracts]) {
    assert.ok(markdown.includes(`\`${item.exportKey}\``), item.exportKey);
  }
});
