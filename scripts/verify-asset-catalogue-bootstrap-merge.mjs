import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import {
  assert,
  catalogueRoot,
  publicCatalogueRoot,
  readJson,
  sha256,
} from "./asset-catalogue-lib.mjs";

const status = await readJson(join(catalogueRoot, "bootstrap-status.json"));
const sourceContract = await readJson(join(catalogueRoot, "bootstrap-sources.json"));
const branch = process.env.GREENWAYS_ASSET_BOOTSTRAP_BRANCH ?? null;

assert(
  status?.protocol === "greenways-asset-catalogue-bootstrap/0-alpha",
  "Catalogue bootstrap status is missing or invalid",
);
assert(
  sourceContract?.protocol === "greenways-asset-bootstrap-sources/0-alpha",
  "Catalogue bootstrap source contract is missing or invalid",
);

if (branch && status.sourceBranch) {
  assert(
    status.sourceBranch === branch,
    `Bootstrap status targets ${status.sourceBranch}, but the pull request branch is ${branch}`,
  );
}

assert(
  status.state === "complete",
  `Project-flower source bootstrap is ${JSON.stringify(status.state)}. Keep this pull request in draft until the exact Git LFS sources have been imported and the generated catalogue commit passes CI.`,
);
assert(status.sourceCount === sourceContract.sources.length, "Completed bootstrap source count is invalid");
assert(
  status.selectedCount === sourceContract.sources.filter((source) => source.selected).length,
  "Completed bootstrap selection count is invalid",
);
assert(
  status.publishedCount === sourceContract.sources.filter((source) => source.targetState === "published").length,
  "Completed bootstrap publication count is invalid",
);
assert(status.release === "greenways.project-flowers/v1", "Completed bootstrap release ID is invalid");

const publicIndex = await readJson(join(publicCatalogueRoot, "index.json"));
assert(publicIndex?.protocol === "greenways-asset-public-index/0-alpha", "Public catalogue index is missing or invalid");
assert(publicIndex.status === "published", "Public catalogue index is not published");
assert(publicIndex.release === status.release, "Public catalogue release does not match bootstrap status");
assert(publicIndex.assets.length === status.publishedCount, "Public catalogue exposes an unexpected number of assets");

const publishedSource = sourceContract.sources.find((source) => source.targetState === "published");
const publicAsset = publicIndex.assets[0];
assert(publicAsset.alias === publishedSource.alias, "Public catalogue exposes the wrong alias");
assert(publicAsset.sha256 === publishedSource.sha256, "Public catalogue exposes the wrong source digest");
assert(publicAsset.path === publishedSource.publicPath, "Public catalogue exposes the wrong output path");
assert(
  publicAsset.path.startsWith("assets/catalogue/"),
  "Public catalogue output escapes the reviewed catalogue path",
);

const publicRelativePath = publicAsset.path.slice("assets/catalogue/".length);
const publicPath = join(publicCatalogueRoot, publicRelativePath);
const publicBytes = await readFile(publicPath);
assert(publicBytes.byteLength === publishedSource.bytes, "Published Hodos rendition has the wrong byte length");
assert(sha256(publicBytes) === publishedSource.sha256, "Published Hodos rendition has the wrong digest");

async function listPngs(root) {
  const matches = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) matches.push(...await listPngs(path));
    else if (entry.isFile() && entry.name.endsWith(".png")) matches.push(path);
  }
  return matches;
}

const publicPngs = await listPngs(publicCatalogueRoot);
assert(publicPngs.length === 1, `Expected one public PNG, found ${publicPngs.length}`);
assert(
  relative(publicCatalogueRoot, publicPngs[0]) === publicRelativePath,
  "The sole public PNG is not the reviewed compact Hodos rendition",
);

console.log(
  `Merge gate verified ${status.sourceCount} exact sources, ${status.selectedCount} selected crests, and the sole published Hodos rendition.`,
);
