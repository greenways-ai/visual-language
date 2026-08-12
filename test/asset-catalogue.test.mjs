import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("catalogue objects use the narrow permanent Git LFS boundary", async () => {
  const attributes = await read(".gitattributes");
  assert.equal(attributes.trim(), "catalogue/objects/** filter=lfs diff=lfs merge=lfs -text");
});

test("reviewed source contract pins all project flowers and Hodos lineage", async () => {
  const contract = JSON.parse(await read("catalogue/bootstrap-sources.json"));
  const status = JSON.parse(await read("catalogue/bootstrap-status.json"));
  assert.equal(contract.protocol, "greenways-asset-bootstrap-sources/0-alpha");
  assert.equal(contract.sources.length, 8);
  assert.equal(contract.sources.filter((source) => source.selected).length, 7);
  assert.equal(contract.sources.filter((source) => source.targetState === "published").length, 1);
  const compact = contract.sources.find((source) => source.key === "hodos-peacock-compact");
  assert.equal(compact.parentKey, "hodos-peacock-tall");
  assert.equal(compact.sha256, "8bd2550a13bc32e8c18c40a76bd05da34ecf19aa919385ff51c658efc72104cd");
  assert.ok(["awaiting-sources", "pending", "complete"].includes(status.state));
  assert.equal(status.expectedSources ?? status.sourceCount, 8);
  assert.equal(status.expectedSelections ?? status.selectedCount, 7);
  assert.equal(status.expectedPublished ?? status.publishedCount, 1);
});

test("one-time bundle and seed staging refuse unreviewed or ordinary Git image data", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const bundle = JSON.parse(await read("catalogue/bootstrap-bundle.json"));
  const bundleStaging = await read("scripts/stage-asset-catalogue-bundle.mjs");
  const seedStaging = await read("scripts/stage-asset-catalogue-seed.mjs");
  const bootstrap = await read(".github/workflows/bootstrap-assets-lfs.yml");
  assert.equal(bundle.protocol, "greenways-asset-bootstrap-bundle/0-alpha");
  assert.equal(bundle.bytes, 16326860);
  assert.equal(bundle.sha256, "c86238609c5a2d094684daa62eddf0ef3bfa429eaad7e61f2e71e1d6b1536818");
  assert.match(packageJson.scripts["stage:catalogue-bundle"], /stage-asset-catalogue-bundle/);
  assert.match(packageJson.scripts["stage:catalogue-seed"], /stage-asset-catalogue-seed/);
  assert.match(bundleStaging, /sha256\(archiveBytes\)/);
  assert.match(bundleStaging, /unzip/);
  assert.match(bundleStaging, /await import\("\.\/stage-asset-catalogue-seed\.mjs"\)/);
  assert.match(seedStaging, /catalogue\/bootstrap-seed\/\*\* filter=lfs/);
  assert.match(seedStaging, /git.*show/);
  assert.match(seedStaging, /was staged as ordinary Git data/);
  assert.match(bootstrap, /lfs: true/);
  assert.match(bootstrap, /git lfs pull --include="catalogue\/bootstrap-seed\/\*\*"/);
  assert.match(bootstrap, /ref: 1dfb41a2edf4c44a6fd87bf6a4165acfc070f344/);
  assert.doesNotMatch(bootstrap, /repository: greenways-ai\/greenways-os[\s\S]*?ref: main/);
  assert.match(bootstrap, /Restore the permanent LFS tracking boundary/);
  assert.match(bootstrap, /git lfs push origin HEAD/);
});

test("catalogue publication is part of the tested site build", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.match(packageJson.scripts.test, /verify:catalogue/);
  assert.match(packageJson.scripts.build, /assets:catalogue/);
  const pages = await read(".github/workflows/pages.yml");
  const ci = await read(".github/workflows/ci.yml");
  assert.match(pages, /lfs: true/);
  assert.match(ci, /lfs: true/);
  assert.match(ci, /GREENWAYS_ASSETS_REQUIRE_HYDRATED: "1"/);
});

test("asset catalogue page exposes identity and publication boundaries", async () => {
  const page = await read("src/content/docs/reference/asset-catalogue.mdx");
  const component = await read("src/site/components/AssetCatalogue.astro");
  const brandAssets = await read("src/content/docs/reference/brand-assets.md");
  assert.match(page, /Git LFS object URLs are never application-facing/);
  assert.match(component, /gw\.asset/);
  assert.match(component, /Publication not released/);
  assert.match(component, /Hodos edit lineage retained/);
  assert.match(brandAssets, /\.\.\/asset-catalogue\//);
});
