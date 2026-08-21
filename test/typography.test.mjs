import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the package and Astro site use one explicit typography hierarchy", async () => {
  const [pkg, typography, config, custom] = await Promise.all([
    source("package.json"),
    source("src/typography.css"),
    source("astro.config.mjs"),
    source("src/site/styles/custom.css"),
  ]);

  assert.match(pkg, /"\.\/typography\.css": "\.\/src\/typography\.css"/);
  assert.match(typography, /--gw-font-display: "Marcellus"/);
  assert.match(typography, /--gw-font-sans: "Manrope"/);
  assert.match(typography, /--gw-font-mono: "IBM Plex Mono"/);
  assert.match(config, /@astrojs\/starlight/);
  assert.match(custom, /@fontsource\/marcellus/);
  assert.match(custom, /@fontsource\/manrope/);
  assert.match(custom, /@fontsource\/ibm-plex-mono/);
  assert.match(custom, /font-family: "Marcellus"/);
});
