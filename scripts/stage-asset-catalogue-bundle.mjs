import { execFile } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { promisify } from "node:util";
import {
  assert,
  catalogueRoot,
  inspectPng,
  readJson,
  repositoryRoot,
  sha256,
} from "./asset-catalogue-lib.mjs";

const execFileAsync = promisify(execFile);
const archiveArgument = process.argv[2];
assert(
  archiveArgument && process.argv.length === 3,
  "Usage: npm run stage:catalogue-bundle -- /path/to/greenways-project-flower-lfs-seed.zip",
);

const archivePath = resolve(archiveArgument);
const bundle = await readJson(join(catalogueRoot, "bootstrap-bundle.json"));
const sourceContract = await readJson(join(catalogueRoot, "bootstrap-sources.json"));
assert(bundle?.protocol === "greenways-asset-bootstrap-bundle/0-alpha", "Bootstrap bundle contract is missing or invalid");
assert(sourceContract?.protocol === "greenways-asset-bootstrap-sources/0-alpha", "Bootstrap source contract is missing or invalid");
assert(bundle.sourceManifest === "catalogue/bootstrap-sources.json", "Bootstrap bundle points to an unexpected source manifest");
assert(bundle.sourceCount === sourceContract.sources.length, "Bootstrap bundle source count does not match the source contract");
assert(typeof bundle.seedPrefix === "string" && bundle.seedPrefix.endsWith("/"), "Bootstrap bundle seed prefix is invalid");

const seedRoot = resolve(repositoryRoot, bundle.seedPrefix);
assert(seedRoot === resolve(catalogueRoot, "bootstrap-seed"), "Bootstrap bundle seed prefix escapes the catalogue boundary");

async function run(command, arguments_, options = {}) {
  try {
    return await execFileAsync(command, arguments_, {
      cwd: repositoryRoot,
      maxBuffer: 8 * 1024 * 1024,
      ...options,
    });
  } catch (error) {
    const detail = [error?.stdout, error?.stderr]
      .filter(Boolean)
      .map((value) => Buffer.isBuffer(value) ? value.toString("utf8") : value)
      .join("\n")
      .trim();
    throw new Error(`${command} ${arguments_.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
}

await access(archivePath);
const archiveBytes = await readFile(archivePath);
assert(archiveBytes.byteLength === bundle.bytes, `${basename(archivePath)} byte length does not match bootstrap-bundle.json`);
assert(sha256(archiveBytes) === bundle.sha256, `${basename(archivePath)} SHA-256 does not match bootstrap-bundle.json`);

const { stdout: listingSource } = await run("unzip", ["-Z1", archivePath], { encoding: "utf8" });
const entries = listingSource.split(/\r?\n/).filter(Boolean);
const expectedSeedEntries = sourceContract.sources
  .map((source) => {
    assert(source.file === basename(source.file), `Bootstrap source filename ${JSON.stringify(source.file)} is unsafe`);
    return `${bundle.seedPrefix}${source.file}`;
  })
  .sort();
const actualSeedEntries = entries
  .filter((entry) => entry.startsWith(bundle.seedPrefix) && !entry.endsWith("/"))
  .sort();
assert(
  JSON.stringify(actualSeedEntries) === JSON.stringify(expectedSeedEntries),
  "Bootstrap archive seed entries do not match the reviewed source contract",
);

await rm(seedRoot, { recursive: true, force: true });
await mkdir(seedRoot, { recursive: true });
for (const source of sourceContract.sources) {
  const entry = `${bundle.seedPrefix}${source.file}`;
  const { stdout } = await run("unzip", ["-p", archivePath, entry], {
    encoding: "buffer",
    maxBuffer: Math.max(4 * 1024 * 1024, source.bytes + 1024),
  });
  const bytes = Buffer.isBuffer(stdout) ? stdout : Buffer.from(stdout);
  const image = inspectPng(bytes);
  assert(bytes.byteLength === source.bytes, `${source.file} byte length does not match the reviewed source contract`);
  assert(sha256(bytes) === source.sha256, `${source.file} SHA-256 does not match the reviewed source contract`);
  assert(image.width === source.width && image.height === source.height, `${source.file} dimensions do not match the reviewed source contract`);
  await writeFile(join(seedRoot, source.file), bytes, { flag: "wx" });
}

console.log(
  `Verified ${basename(archivePath)} (${archiveBytes.byteLength} bytes, sha256:${bundle.sha256}) and extracted ${sourceContract.sources.length} reviewed PNG sources.`,
);
await import("./stage-asset-catalogue-seed.mjs");
