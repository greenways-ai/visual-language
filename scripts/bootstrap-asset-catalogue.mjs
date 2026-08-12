import { execFile } from "node:child_process";
import { access, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import {
  assert,
  catalogueRoot,
  inspectPng,
  publicUrl,
  readJson,
  sha256,
  writeHal,
  writeJson,
} from "./asset-catalogue-lib.mjs";

const execFileAsync = promisify(execFile);
const seedRoot = join(catalogueRoot, "bootstrap-seed");
const statusPath = join(catalogueRoot, "bootstrap-status.json");
const cli = resolve(".bootstrap/greenways-os/services/assets/bin/greenways-assets.mjs");
const collectionId = "greenways.project-flowers";
const createdAt = "2026-08-12T00:00:00.000Z";

const sourceContract = await readJson(join(catalogueRoot, "bootstrap-sources.json"));
assert(sourceContract?.protocol === "greenways-asset-bootstrap-sources/0-alpha", "Bootstrap source contract is missing or invalid");
const sources = sourceContract.sources.map((source) => ({
  ...source,
  expected: {
    sha256: source.sha256,
    bytes: source.bytes,
    width: source.width,
    height: source.height,
  },
}));

async function runCli(...arguments_) {
  const { stdout, stderr } = await execFileAsync(process.execPath, [cli, ...arguments_], {
    cwd: resolve("."),
    maxBuffer: 4 * 1024 * 1024,
  });
  if (stderr.trim()) process.stderr.write(stderr);
  return JSON.parse(stdout);
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function verifySeed(source) {
  const path = join(seedRoot, source.file);
  await access(path);
  const bytes = await readFile(path);
  const image = inspectPng(bytes);
  assert(sha256(bytes) === source.expected.sha256, `${source.file} SHA-256 does not match the reviewed source`);
  assert(bytes.byteLength === source.expected.bytes, `${source.file} byte length does not match the reviewed source`);
  assert(image.width === source.expected.width && image.height === source.expected.height, `${source.file} dimensions do not match the reviewed source`);
}

async function cleanGeneratedCatalogue() {
  for (const path of [
    "objects", "heads", "records", "manifests", "indexes", "aliases", "locks",
    "collections", "renditions", "releases", "resolver",
  ]) {
    await rm(join(catalogueRoot, path), { recursive: true, force: true });
  }
  await rm(join(catalogueRoot, "site-index.json"), { force: true });
}

async function main() {
  const status = await readJson(statusPath);
  assert(status?.protocol === "greenways-asset-catalogue-bootstrap/0-alpha", "Catalogue bootstrap status is missing or invalid");
  if (status.state === "complete") {
    console.log("Asset catalogue is already complete; no bootstrap work is required.");
    return;
  }
  assert(
    status.state === "awaiting-sources" || status.state === "pending",
    `Unexpected catalogue bootstrap state ${JSON.stringify(status.state)}`,
  );
  assert(sources.length === status.expectedSources, "Bootstrap source count does not match the status contract");
  assert(sources.filter((source) => source.selected).length === status.expectedSelections, "Bootstrap selection count does not match the status contract");
  assert(sources.filter((source) => source.targetState === "published").length === status.expectedPublished, "Bootstrap publication count does not match the status contract");
  if (!(await pathExists(seedRoot))) {
    console.log(`Asset catalogue is awaiting ${status.expectedSources} reviewed source images.`);
    return;
  }
  await access(cli);
  await Promise.all(sources.map(verifySeed));
  await cleanGeneratedCatalogue();

  const imported = new Map();
  for (const source of sources) {
    const arguments_ = [
      "import",
      join(seedRoot, source.file),
      "--root", catalogueRoot,
      "--title", source.title,
      "--project", source.project,
      "--collection", collectionId,
      "--alias", source.alias,
      "--source-kind", "ai-generation",
      "--provider", "openai-image",
    ];
    for (const tag of source.tags) arguments_.push("--tag", tag);
    if (source.generationId) arguments_.push("--generation-id", source.generationId);
    if (source.parentKey) {
      const parent = imported.get(source.parentKey);
      assert(parent, `Parent ${source.parentKey} must be imported before ${source.key}`);
      arguments_.push("--parent", parent.id, "--operation", source.operation, "--instruction", source.instruction);
    }
    const result = await runCli(...arguments_);
    assert(result.created === true, `${source.key} was not created as a distinct logical asset`);
    assert(result.asset.content.sha256 === source.expected.sha256, `${source.key} imported with an unexpected digest`);
    assert(result.asset.content.bytes === source.expected.bytes, `${source.key} imported with an unexpected byte length`);
    assert(result.asset.content.width === source.expected.width && result.asset.content.height === source.expected.height, `${source.key} imported with unexpected dimensions`);

    if (source.targetState === "curated") {
      await runCli("curate", source.alias, "--root", catalogueRoot, "--note", "Retained as reviewed parent-generation evidence");
    } else if (source.targetState === "approved") {
      await runCli("approve", source.alias, "--root", catalogueRoot, "--note", "Selected for the Greenways project-flower collection");
    } else if (source.targetState === "published") {
      await runCli("approve", source.alias, "--root", catalogueRoot, "--note", "Selected for the Greenways project-flower collection");
      await runCli("publish", source.alias, "--root", catalogueRoot, "--note", "First public project-flower rendition");
    }
    const finalRecord = await runCli("show", source.alias, "--root", catalogueRoot);
    imported.set(source.key, finalRecord);
  }

  const selectedSources = sources.filter((source) => source.selected);
  const members = selectedSources.map((source) => {
    const record = imported.get(source.key);
    return {
      role: source.role,
      assetId: record.id,
      alias: source.alias,
      sha256: record.content.sha256,
      state: record.state,
      width: record.content.width,
      height: record.content.height,
    };
  });
  const retainedSources = sources.filter((source) => !source.selected).map((source) => {
    const record = imported.get(source.key);
    return { role: source.role, assetId: record.id, alias: source.alias, sha256: record.content.sha256, state: record.state };
  });
  const collection = {
    protocol: "greenways-asset-collection/0-alpha",
    id: collectionId,
    title: "Greenways project flowers",
    createdAt,
    members,
    retainedSources,
  };
  await writeJson(join(catalogueRoot, "collections", `${collectionId}.json`), collection);
  await writeHal(join(catalogueRoot, "collections", `${collectionId}.hal`), collection);

  const publicSource = sources.find((source) => source.targetState === "published");
  const publicRecord = imported.get(publicSource.key);
  const rendition = {
    protocol: "greenways-asset-rendition/0-alpha",
    id: "greenways.project-flowers/hodos-peacock-source-v1",
    assetId: publicRecord.id,
    sourceSha256: publicRecord.content.sha256,
    recipe: "greenways.rendition/identity-png-v1",
    outputSha256: publicRecord.content.sha256,
    outputBytes: publicRecord.content.bytes,
    mime: publicRecord.content.mime,
    width: publicRecord.content.width,
    height: publicRecord.content.height,
    objectKey: publicRecord.content.objectKey,
    publicPath: publicSource.publicPath,
  };
  await writeJson(join(catalogueRoot, "renditions", "hodos", "peacock-rosette-source-v1.json"), rendition);
  await writeHal(join(catalogueRoot, "renditions", "hodos", "peacock-rosette-source-v1.hal"), rendition);

  const release = {
    protocol: "greenways-asset-release/0-alpha",
    id: "greenways.project-flowers/v1",
    collection: collectionId,
    createdAt,
    entries: selectedSources.map((source) => {
      const record = imported.get(source.key);
      return {
        role: source.role,
        assetId: record.id,
        alias: source.alias,
        sha256: record.content.sha256,
        state: record.state,
        renditionId: source.targetState === "published" ? rendition.id : null,
        publicPath: source.publicPath ?? null,
      };
    }),
  };
  await writeJson(join(catalogueRoot, "releases", "project-flowers", "v1.json"), release);
  await writeHal(join(catalogueRoot, "releases", "project-flowers", "v1.hal"), release);

  const resolver = {
    protocol: "greenways-asset-resolver/0-alpha",
    alias: publicSource.alias,
    assetId: publicRecord.id,
    sha256: publicRecord.content.sha256,
    renditionId: rendition.id,
    publicPath: rendition.publicPath,
    publicUrl: publicUrl(rendition.publicPath),
  };
  await writeJson(join(catalogueRoot, "resolver", ...publicSource.alias.split("/")) + ".json", resolver);
  await writeHal(join(catalogueRoot, "resolver", ...publicSource.alias.split("/")) + ".hal", resolver);

  const siteIndex = {
    protocol: "greenways-asset-site-index/0-alpha",
    title: "Greenways project flowers",
    release: release.id,
    status: "complete",
    assets: selectedSources.map((source) => {
      const record = imported.get(source.key);
      return {
        role: source.role,
        title: source.title,
        assetId: record.id,
        alias: source.alias,
        sha256: record.content.sha256,
        state: record.state,
        width: record.content.width,
        height: record.content.height,
        publicUrl: source.publicPath ? publicUrl(source.publicPath) : null,
      };
    }),
    lineage: [{
      childAssetId: publicRecord.id,
      parentAssetId: imported.get("hodos-peacock-tall").id,
      operation: publicRecord.lineage.operation,
      instruction: publicRecord.lineage.instruction,
    }],
  };
  await writeJson(join(catalogueRoot, "site-index.json"), siteIndex);

  await writeJson(statusPath, {
    protocol: "greenways-asset-catalogue-bootstrap/0-alpha",
    state: "complete",
    issue: 16,
    completedAt: createdAt,
    sourceCount: sources.length,
    selectedCount: members.length,
    publishedCount: release.entries.filter((entry) => entry.state === "published").length,
    release: release.id,
  });

  await rm(seedRoot, { recursive: true, force: true });
  console.log(`Bootstrapped ${sources.length} exact sources, ${members.length} selected crests, and one published rendition.`);
}

await main();
