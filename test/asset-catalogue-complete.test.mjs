import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const verifier = join(repositoryRoot, "scripts", "verify-asset-catalogue.mjs");
const sourceContract = JSON.parse(
  await readFile(join(repositoryRoot, "catalogue", "bootstrap-sources.json"), "utf8"),
);

async function write(path, source) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, source);
}

async function writeJson(path, value) {
  await write(path, `${JSON.stringify(value, null, 2)}\n`);
}

test("asset catalogue scripts parse before any source transfer", async () => {
  for (const name of [
    "asset-catalogue-lib.mjs",
    "bootstrap-asset-catalogue.mjs",
    "build-asset-catalogue.mjs",
    "stage-asset-catalogue-bundle.mjs",
    "stage-asset-catalogue-seed.mjs",
    "verify-asset-catalogue.mjs",
  ]) {
    const { stderr } = await execFileAsync(
      process.execPath,
      ["--check", join(repositoryRoot, "scripts", name)],
    );
    assert.equal(stderr, "", `${name} emitted parser diagnostics`);
  }
});

test("completed catalogue verification accepts a pointer-only review checkout", async (t) => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "greenways-asset-catalogue-"));
  t.after(async () => rm(fixtureRoot, { recursive: true, force: true }));
  const catalogueRoot = join(fixtureRoot, "catalogue");
  const idByKey = new Map(
    sourceContract.sources.map((source, index) => [
      source.key,
      `gw.asset/00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    ]),
  );
  const records = new Map();

  await write(
    join(fixtureRoot, ".gitattributes"),
    "catalogue/objects/** filter=lfs diff=lfs merge=lfs -text\n",
  );
  await writeJson(join(catalogueRoot, "bootstrap-sources.json"), sourceContract);
  await writeJson(join(catalogueRoot, "bootstrap-status.json"), {
    protocol: "greenways-asset-catalogue-bootstrap/0-alpha",
    state: "complete",
    issue: 16,
    sourceCount: 8,
    selectedCount: 7,
    publishedCount: 1,
    release: "greenways.project-flowers/v1",
  });

  for (const source of sourceContract.sources) {
    const id = idByKey.get(source.key);
    const token = id.slice("gw.asset/".length);
    const recordPath = `records/${token}/00000001.json`;
    const manifestPath = `manifests/${token}/00000001.hal`;
    const objectKey = `objects/sha256/${source.sha256.slice(0, 2)}/${source.sha256}.png`;
    const record = {
      protocol: "greenways-asset/0-alpha",
      id,
      revision: 1,
      state: source.targetState,
      aliases: [source.alias],
      content: {
        sha256: source.sha256,
        bytes: source.bytes,
        mime: "image/png",
        width: source.width,
        height: source.height,
        objectKey,
      },
      ...(source.parentKey ? {
        lineage: {
          parent: idByKey.get(source.parentKey),
          operation: source.operation,
          instruction: source.instruction,
        },
      } : {}),
    };
    records.set(source.key, record);

    await writeJson(join(catalogueRoot, recordPath), record);
    await write(join(catalogueRoot, manifestPath), `{:id ${JSON.stringify(id)} :revision 1}\n`);
    await writeJson(join(catalogueRoot, "heads", `${token}.json`), {
      protocol: "greenways-asset-head/0-alpha",
      assetId: id,
      revision: 1,
      record: recordPath,
      manifest: manifestPath,
    });
    await write(
      join(catalogueRoot, objectKey),
      `version https://git-lfs.github.com/spec/v1\noid sha256:${source.sha256}\nsize ${source.bytes}\n`,
    );
    await writeJson(
      join(catalogueRoot, "aliases", ...source.alias.split("/")) + ".json",
      { protocol: "greenways-asset-alias/0-alpha", alias: source.alias, assetId: id },
    );
  }

  const selected = sourceContract.sources.filter((source) => source.selected);
  await writeJson(join(catalogueRoot, "collections", "greenways.project-flowers.json"), {
    protocol: "greenways-asset-collection/0-alpha",
    id: "greenways.project-flowers",
    members: selected.map((source) => {
      const record = records.get(source.key);
      return {
        role: source.role,
        assetId: record.id,
        alias: source.alias,
        sha256: source.sha256,
        state: source.targetState,
      };
    }),
    retainedSources: sourceContract.sources
      .filter((source) => !source.selected)
      .map((source) => ({ assetId: records.get(source.key).id, alias: source.alias })),
  });

  const publishedSource = sourceContract.sources.find(
    (source) => source.targetState === "published",
  );
  const publishedRecord = records.get(publishedSource.key);
  await writeJson(join(catalogueRoot, "releases", "project-flowers", "v1.json"), {
    protocol: "greenways-asset-release/0-alpha",
    id: "greenways.project-flowers/v1",
    collection: "greenways.project-flowers",
    entries: selected.map((source) => {
      const record = records.get(source.key);
      return {
        role: source.role,
        assetId: record.id,
        alias: source.alias,
        sha256: source.sha256,
        state: source.targetState,
        renditionId: source.targetState === "published"
          ? "greenways.project-flowers/hodos-peacock-source-v1"
          : null,
        publicPath: source.publicPath ?? null,
      };
    }),
  });
  await writeJson(
    join(catalogueRoot, "resolver", ...publishedSource.alias.split("/")) + ".json",
    {
      protocol: "greenways-asset-resolver/0-alpha",
      alias: publishedSource.alias,
      assetId: publishedRecord.id,
      sha256: publishedSource.sha256,
      renditionId: "greenways.project-flowers/hodos-peacock-source-v1",
      publicPath: publishedSource.publicPath,
      publicUrl: `/visual-language/${publishedSource.publicPath}`,
    },
  );
  await writeJson(join(catalogueRoot, "site-index.json"), {
    protocol: "greenways-asset-site-index/0-alpha",
    status: "complete",
    assets: selected.map((source) => ({
      role: source.role,
      assetId: records.get(source.key).id,
      alias: source.alias,
      sha256: source.sha256,
      state: source.targetState,
      publicUrl: source.publicPath ? `/visual-language/${source.publicPath}` : null,
    })),
    lineage: [{
      childAssetId: publishedRecord.id,
      parentAssetId: records.get("hodos-peacock-tall").id,
      operation: publishedRecord.lineage.operation,
      instruction: publishedRecord.lineage.instruction,
    }],
  });

  const { stdout, stderr } = await execFileAsync(process.execPath, [verifier], {
    env: {
      ...process.env,
      GREENWAYS_ASSET_REPOSITORY_ROOT: fixtureRoot,
      GREENWAYS_ASSETS_REQUIRE_HYDRATED: "0",
    },
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(stderr, "");
  assert.match(
    stdout,
    /Verified 8 assets \(0 hydrated, 8 LFS pointers\), 7 selections, and 1 published rendition\./,
  );
});
