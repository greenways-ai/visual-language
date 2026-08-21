import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("foundations laboratory is a neutral structure specimen", async () => {
  const source = await readFile("src/pages/v2/foundations/index.astro", "utf8");
  assert.match(source, /Neutral structure\.<br \/>Peacock identity\./);
  assert.match(source, /Issue #33/);
  assert.match(source, /brand-book\.css/);
  assert.match(source, /catalogue-material\.css\?raw/);
  assert.match(source, /data-gw-v2-atlas-frame/);
  assert.match(source, /data-gw-v2-material="delicate"/);
  assert.match(source, /foundation-typography/);
  assert.match(source, /foundation-roles/);
});
