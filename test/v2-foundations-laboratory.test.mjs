import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("foundations laboratory is a neutral structure specimen", async () => {
  const source = await readFile("src/pages/v2/foundations/index.astro", "utf8");
  assert.match(source, /Neutral structure\. Peacock identity\./);
  assert.match(source, /Issue #33/);
});
