import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { promisify } from "node:util";
import {
  assert,
  catalogueRoot,
  parseGitLfsPointer,
  readJson,
  repositoryRoot,
  writeText,
} from "./asset-catalogue-lib.mjs";

const execFileAsync = promisify(execFile);
const sourceContract = await readJson(join(catalogueRoot, "bootstrap-sources.json"));
const status = await readJson(join(catalogueRoot, "bootstrap-status.json"));
const seedRoot = join(catalogueRoot, "bootstrap-seed");
const objectRule = "catalogue/objects/** filter=lfs diff=lfs merge=lfs -text";
const seedRule = "catalogue/bootstrap-seed/** filter=lfs diff=lfs merge=lfs -text";

assert(sourceContract?.protocol === "greenways-asset-bootstrap-sources/0-alpha", "Bootstrap source contract is missing or invalid");
assert(status?.state === "awaiting-sources" || status?.state === "pending", "Catalogue source staging is allowed only before bootstrap completion");
assert(sourceContract.sources.length === status.expectedSources, "Bootstrap source count does not match the status contract");

async function run(command, arguments_, options = {}) {
  try {
    return await execFileAsync(command, arguments_, {
      cwd: repositoryRoot,
      maxBuffer: 32 * 1024 * 1024,
      ...options,
    });
  } catch (error) {
    const detail = [error?.stdout, error?.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${arguments_.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
}

await run(process.execPath, [resolve(repositoryRoot, "scripts/verify-asset-catalogue.mjs")]);
await run("git", ["lfs", "version"]);
await run("git", ["lfs", "install", "--local"]);

for (const source of sourceContract.sources) {
  await readFile(join(seedRoot, source.file));
}

await writeText(join(repositoryRoot, ".gitattributes"), `${objectRule}\n${seedRule}\n`);
const seedPaths = sourceContract.sources.map((source) => relative(repositoryRoot, join(seedRoot, source.file)));
await run("git", ["add", ".gitattributes"]);
await run("git", ["add", "-f", "--", ...seedPaths]);

for (const source of sourceContract.sources) {
  const path = relative(repositoryRoot, join(seedRoot, source.file));
  const { stdout } = await run("git", ["show", `:${path}`], { encoding: "buffer" });
  const pointer = parseGitLfsPointer(stdout);
  assert(pointer, `${path} was staged as ordinary Git data rather than a Git LFS pointer`);
  assert(pointer.digest === source.sha256, `${path} staged with an unexpected Git LFS object ID`);
  assert(pointer.size === source.bytes, `${path} staged with an unexpected Git LFS object size`);
}

const { stdout: statusOutput } = await run("git", ["status", "--short"]);
console.log(statusOutput.trim());
console.log(`Staged ${sourceContract.sources.length} reviewed sources as Git LFS pointers.`);
console.log("Review the staged change, then commit and push the branch. The bootstrap workflow will replace the seed pointers with permanent content-addressed object paths.");
