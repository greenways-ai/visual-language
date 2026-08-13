import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("source bootstrap workflow follows recoverable branch names", async () => {
  const bootstrap = await read(".github/workflows/bootstrap-assets-lfs.yml");
  assert.match(bootstrap, /agent\/project-flower-source-bootstrap-\*/);
  assert.doesNotMatch(bootstrap, /branches: \[agent\/git-lfs-asset-catalogue-16\]/);
  assert.match(bootstrap, /bootstrap-project-flower-assets-\$\{\{ github\.ref \}\}/);
  assert.match(bootstrap, /git lfs push origin HEAD/);
});

test("source bootstrap pull requests stay red until the real catalogue exists", async () => {
  const ci = await read(".github/workflows/ci.yml");
  const gate = await read("scripts/verify-asset-catalogue-bootstrap-merge.mjs");

  assert.match(ci, /startsWith\(github\.head_ref, 'agent\/project-flower-source-bootstrap-'\)/);
  assert.match(ci, /verify-asset-catalogue-bootstrap-merge\.mjs/);
  assert.match(gate, /status\.state === "complete"/);
  assert.match(gate, /publicPngs\.length === 1/);
  assert.match(gate, /publishedSource\.sha256/);
});

test("incomplete source bootstraps are returned to draft without executing head code", async () => {
  const lock = await read(".github/workflows/asset-catalogue-draft-lock.yml");

  assert.match(lock, /pull_request_target/);
  assert.match(lock, /actions\/github-script@v7/);
  assert.match(lock, /github\.rest\.repos\.getContent/);
  assert.match(lock, /ref: pullRequest\.head\.sha/);
  assert.match(lock, /convertPullRequestToDraft/);
  assert.doesNotMatch(lock, /actions\/checkout/);
});
