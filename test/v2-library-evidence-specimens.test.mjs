import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("component catalogue composes the site-owned evidence laboratory", async () => {
  const [page, specimen] = await Promise.all([
    read("src/pages/v2/library/components/index.astro"),
    read("src/site/components/GreenwaysV2EvidenceSpecimens.astro"),
  ]);

  assert.match(page, /import GreenwaysV2EvidenceSpecimens/);
  assert.match(page, /<GreenwaysV2EvidenceSpecimens \/>/);
  assert.match(specimen, /data-gw-v2-evidence-specimens/);
  assert.match(specimen, /data-gw-v2-approval-specimen/);
  assert.match(specimen, /data-gw-v2-receipt-specimen/);
  assert.match(specimen, /Desired, observed and verified states remain separate/);
  assert.match(specimen, /No external effect sent/);
  assert.match(specimen, /Not yet authorised/);
  assert.match(specimen, /Static review specimen\. These buttons do not request authority/);
  assert.match(specimen, /Example data\. This is not an authoritative delivery receipt/);
  assert.match(specimen, /<time datetime=/);

  for (const state of ["neutral", "info", "success", "warning", "danger"]) {
    assert.match(specimen, new RegExp(`data-gw-v2-state="${state}"`), state);
  }

  assert.doesNotMatch(specimen, /on(?:click|mouse|pointer|touch|key)[a-z]*=/i);
  assert.doesNotMatch(specimen, /<script/i);
  assert.doesNotMatch(specimen, /<div[^>]+role="button"/i);
});

test("evidence presentation is semantic-token-only and responsive", async () => {
  const css = await read("src/site/styles/greenways-v2-evidence-specimens.css");

  for (const selector of [
    ".gw-v2-evidence-grid",
    ".gw-v2-evidence-card",
    ".gw-v2-status-specimen",
    ".gw-v2-activity-specimen",
  ]) {
    assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));
  }

  assert.match(css, /var\(--gw-v2-state-current-soft/);
  assert.match(css, /var\(--gw-v2-state-current/);
  assert.match(css, /grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*22rem\),\s*1fr\)\)/);
  assert.match(css, /@media \(max-width: 44rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\brgba?\(/i);
  assert.doesNotMatch(css, /\bhsla?\(/i);
});

test("the evidence laboratory remains outside the public package contract", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const targets = Object.values(packageJson.exports).map(String);

  assert.ok(targets.every((target) => !target.includes("GreenwaysV2EvidenceSpecimens")));
  assert.ok(targets.every((target) => !target.includes("greenways-v2-evidence-specimens")));
  assert.ok(targets.every((target) => !target.includes("src/site/")));
});
