import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the visual language exports one canonical typography contract", async () => {
  const [pkg, typography, build, lab] = await Promise.all([
    source("package.json"),
    source("src/typography.css"),
    source("bin/build-site.mjs"),
    source("site/lab.html"),
  ]);

  assert.match(pkg, /"\.\/typography\.css": "\.\/src\/typography\.css"/);
  assert.match(typography, /--gw-font-display: "Bodoni Moda"/);
  assert.match(typography, /--gw-font-sans: "Manrope"/);
  assert.match(typography, /--gw-font-mono: "IBM Plex Mono"/);
  assert.match(build, /src\/typography\.css/);
  assert.match(lab, /assets\/typography\.css/);
  assert.match(lab, /typography-overrides\.css/);
});
