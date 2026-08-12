import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import {
  assert,
  catalogueRoot,
  inspectPng,
  parseGitLfsPointer,
  readJson,
  sha256,
} from "./asset-catalogue-lib.mjs";

const requireHydrated = process.env.GREENWAYS_ASSETS_REQUIRE_HYDRATED === "1";
const status = await readJson(join(catalogueRoot, "bootstrap-status.json"));
const sourceContract = await readJson(join(catalogueRoot, "bootstrap-sources.json"));
assert(status?.protocol === "greenways-asset-catalogue-bootstrap/0-alpha", "Catalogue bootstrap status is missing or invalid");
assert(sourceContract?.protocol === "greenways-asset-bootstrap-sources/0-alpha", "Catalogue bootstrap source contract is missing or invalid");
assert(sourceContract.sources.length === status.expectedSources || status.state === "complete", "Catalogue source count does not match the bootstrap status");
assert(sourceContract.sources.filter((source) => source.selected).length === (status.expectedSelections ?? status.selectedCount), "Catalogue selection count does not match the bootstrap status");
assert(sourceContract.sources.filter((source) => source.targetState === "published").length === (status.expectedPublished ?? status.publishedCount), "Catalogue publication count does not match the bootstrap status");

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function verifySeed(source) {
  const path = join(catalogueRoot, "bootstrap-seed", source.file);
  const bytes = await readFile(path);
  const image = inspectPng(bytes);
  assert(bytes.byteLength === source.bytes, `${source.file} byte length does not match the source contract`);
  assert(sha256(bytes) === source.sha256, `${source.file} SHA-256 does not match the source contract`);
  assert(image.width === source.width && image.height === source.height, `${source.file} dimensions do not match the source contract`);
}

if (status.state === "awaiting-sources" || status.state === "pending") {
  const seedPath = join(catalogueRoot, "bootstrap-seed");
  if (await pathExists(seedPath)) {
    const seedNames = (await readdir(seedPath)).filter((name) => name.endsWith(".png")).sort();
    const expectedNames = sourceContract.sources.map((source) => source.file).sort();
    assert(JSON.stringify(seedNames) === JSON.stringify(expectedNames), "Bootstrap seed filenames do not match the reviewed source contract");
    await Promise.all(sourceContract.sources.map(verifySeed));
    console.log(`Asset catalogue has ${seedNames.length} reviewed source images staged for one-time import.`);
  } else {
    console.log(`Asset catalogue is awaiting ${status.expectedSources} reviewed source images; no asset is published from this state.`);
  }
  process.exit(0);
}

assert(status.state === "complete", `Unexpected catalogue state ${JSON.stringify(status.state)}`);
const attributes = await readFile(join(catalogueRoot, "..", ".gitattributes"), "utf8");
assert(attributes.split(/\r?\n/).includes("catalogue/objects/** filter=lfs diff=lfs merge=lfs -text"), "catalogue/objects/** is not configured for Git LFS");
assert(!(await pathExists(join(catalogueRoot, "bootstrap-seed"))), "Raw bootstrap seed files must not remain in the completed catalogue");

const heads = (await readdir(join(catalogueRoot, "heads"))).filter((name) => name.endsWith(".json")).sort();
assert(heads.length === status.sourceCount, `Expected ${status.sourceCount} asset heads, found ${heads.length}`);
const records = new Map();
let hydratedCount = 0;
let pointerCount = 0;

for (const headName of heads) {
  const head = await readJson(join(catalogueRoot, "heads", headName));
  assert(head?.protocol === "greenways-asset-head/0-alpha", `${headName} is not a Greenways asset head`);
  const record = await readJson(join(catalogueRoot, head.record));
  assert(record?.protocol === "greenways-asset/0-alpha", `${headName} points to an invalid asset record`);
  assert(record.id === head.assetId && record.revision === head.revision, `${headName} does not match its current record`);
  const manifestPath = join(catalogueRoot, head.manifest);
  assert((await readFile(manifestPath, "utf8")).includes(record.id), `${headName} manifest does not contain its asset ID`);

  const objectPath = join(catalogueRoot, record.content.objectKey);
  const objectBytes = await readFile(objectPath);
  const pointer = parseGitLfsPointer(objectBytes);
  if (pointer) {
    pointerCount += 1;
    assert(pointer.digest === record.content.sha256, `${record.id} LFS pointer digest does not match its record`);
    assert(pointer.size === record.content.bytes, `${record.id} LFS pointer size does not match its record`);
    assert(!requireHydrated, `${record.id} is an unhydrated Git LFS pointer; run git lfs pull`);
  } else {
    hydratedCount += 1;
    assert(objectBytes.byteLength === record.content.bytes, `${record.id} object byte length does not match its record`);
    assert(sha256(objectBytes) === record.content.sha256, `${record.id} object digest does not match its record`);
    const image = inspectPng(objectBytes);
    assert(image.width === record.content.width && image.height === record.content.height, `${record.id} PNG dimensions do not match its record`);
  }

  for (const alias of record.aliases) {
    const segments = alias.split("/");
    const aliasPath = join(catalogueRoot, "aliases", ...segments.slice(0, -1), `${segments.at(-1)}.json`);
    const pointerRecord = await readJson(aliasPath);
    assert(pointerRecord?.assetId === record.id && pointerRecord.alias === alias, `${record.id} alias ${alias} is invalid`);
  }
  records.set(record.id, record);
}

const collection = await readJson(join(catalogueRoot, "collections", "greenways.project-flowers.json"));
assert(collection?.protocol === "greenways-asset-collection/0-alpha", "Project-flower collection is invalid");
assert(collection.members.length === status.selectedCount, "Project-flower collection selection count is invalid");
for (const member of collection.members) {
  const record = records.get(member.assetId);
  assert(record, `Collection member ${member.assetId} does not exist`);
  assert(record.content.sha256 === member.sha256, `Collection member ${member.assetId} digest is not pinned exactly`);
  assert(record.state === member.state, `Collection member ${member.assetId} state is stale`);
}

const release = await readJson(join(catalogueRoot, "releases", "project-flowers", "v1.json"));
assert(release?.protocol === "greenways-asset-release/0-alpha", "Project-flower release is invalid");
assert(release.entries.length === status.selectedCount, "Project-flower release selection count is invalid");
const published = release.entries.filter((entry) => entry.state === "published");
assert(published.length === status.publishedCount, "Project-flower published count is invalid");
for (const entry of release.entries) {
  const record = records.get(entry.assetId);
  assert(record, `Release entry ${entry.assetId} does not exist`);
  assert(record.content.sha256 === entry.sha256, `Release entry ${entry.assetId} digest is not pinned exactly`);
  assert(record.state === entry.state, `Release entry ${entry.assetId} state is stale`);
  if (entry.state === "published") {
    assert(entry.publicPath && entry.renditionId, `Published entry ${entry.assetId} lacks a rendition and public path`);
    const aliasSegments = entry.alias.split("/");
    const resolver = await readJson(join(catalogueRoot, "resolver", ...aliasSegments) + ".json");
    assert(resolver?.assetId === entry.assetId && resolver.sha256 === entry.sha256, `Published resolver for ${entry.alias} is invalid`);
  } else {
    assert(entry.publicPath === null, `Unpublished entry ${entry.assetId} unexpectedly has a public path`);
  }
}

const compactSource = sourceContract.sources.find((source) => source.key === "hodos-peacock-compact");
const tallSource = sourceContract.sources.find((source) => source.key === "hodos-peacock-tall");
const compactRecord = [...records.values()].find((record) => record.aliases.includes(compactSource.alias));
const tallRecord = [...records.values()].find((record) => record.aliases.includes(tallSource.alias));
assert(compactRecord?.lineage?.parent === tallRecord?.id, "Hodos compact asset does not retain its exact parent generation");
assert(compactRecord.lineage.instruction === compactSource.instruction, "Hodos edit instruction is stale");

const siteIndex = await readJson(join(catalogueRoot, "site-index.json"));
assert(siteIndex?.status === "complete", "Catalogue site index is incomplete");
assert(siteIndex.assets.length === status.selectedCount, "Catalogue site index selection count is invalid");
assert(siteIndex.assets.filter((asset) => asset.publicUrl).length === status.publishedCount, "Catalogue site index exposes an unreviewed asset");

console.log(`Verified ${heads.length} assets (${hydratedCount} hydrated, ${pointerCount} LFS pointers), ${collection.members.length} selections, and ${published.length} published rendition.`);
