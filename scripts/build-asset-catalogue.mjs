import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  assert,
  catalogueRoot,
  parseGitLfsPointer,
  publicCatalogueRoot,
  readJson,
  sha256,
  writeJson,
} from "./asset-catalogue-lib.mjs";

await rm(publicCatalogueRoot, { recursive: true, force: true });
await mkdir(publicCatalogueRoot, { recursive: true });
const status = await readJson(join(catalogueRoot, "bootstrap-status.json"));

if (status?.state !== "complete") {
  await writeJson(join(publicCatalogueRoot, "index.json"), {
    protocol: "greenways-asset-public-index/0-alpha",
    status: "pending",
    assets: [],
  });
  console.log("Asset catalogue is pending; emitted an empty public index.");
  process.exit(0);
}

const release = await readJson(join(catalogueRoot, "releases", "project-flowers", "v1.json"));
assert(release?.protocol === "greenways-asset-release/0-alpha", "Cannot build an invalid asset release");
const publicAssets = [];
for (const entry of release.entries.filter((candidate) => candidate.state === "published")) {
  const headToken = entry.assetId.slice("gw.asset/".length);
  const head = await readJson(join(catalogueRoot, "heads", `${headToken}.json`));
  const record = await readJson(join(catalogueRoot, head.record));
  assert(record.content.sha256 === entry.sha256, `${entry.alias} release digest does not match its record`);
  const sourcePath = join(catalogueRoot, record.content.objectKey);
  const bytes = await readFile(sourcePath);
  assert(!parseGitLfsPointer(bytes), `${entry.alias} is not hydrated; run git lfs pull before building`);
  assert(sha256(bytes) === entry.sha256, `${entry.alias} source digest failed before publication`);
  const relativePublicPath = entry.publicPath.replace(/^assets\/catalogue\//, "");
  const destination = join(publicCatalogueRoot, relativePublicPath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(sourcePath, destination);
  const aliasSegments = entry.alias.split("/");
  const resolver = await readJson(join(catalogueRoot, "resolver", ...aliasSegments) + ".json");
  const publicRecord = {
    alias: entry.alias,
    assetId: entry.assetId,
    sha256: entry.sha256,
    renditionId: entry.renditionId,
    path: entry.publicPath,
    url: resolver.publicUrl,
    bytes: record.content.bytes,
    mime: record.content.mime,
    width: record.content.width,
    height: record.content.height,
  };
  publicAssets.push(publicRecord);
  await writeJson(join(publicCatalogueRoot, "aliases", ...aliasSegments) + ".json", publicRecord);
}

await writeJson(join(publicCatalogueRoot, "index.json"), {
  protocol: "greenways-asset-public-index/0-alpha",
  status: "published",
  release: release.id,
  assets: publicAssets,
});
console.log(`Published ${publicAssets.length} reviewed asset rendition to the static site output.`);
