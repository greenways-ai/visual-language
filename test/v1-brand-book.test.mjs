import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  GREENWAYS_V1_VERSION,
  greenwaysV1Entries,
  greenwaysV1Identity,
  greenwaysV1TokenFamilies,
} from "../src/v1/contract.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("v1 exposes a complete documentation-first package contract", async () => {
  assert.equal(GREENWAYS_V1_VERSION, "1.0");
  assert.equal(greenwaysV1Identity.shell, "documentation");
  assert.deepEqual(greenwaysV1Identity.typography, {
    display: "--gw-font-display",
    body: "--gw-font-sans",
    code: "--gw-font-mono",
  });
  for (const token of Object.values(greenwaysV1TokenFamilies).flat()) assert.match(token, /^--gw-v1-|^--gw-font-/);
  for (const entry of Object.values(greenwaysV1Entries)) await access(new URL(`../${entry.replace("@greenways-ai/visual-language/", "src/")}`, import.meta.url));
});

test("v1 specimen documents the shared font relationship and documentation shell", async () => {
  const [page, shell, tokens, documentCss] = await Promise.all([
    read("src/pages/v1/index.astro"),
    read("src/v1/DocumentationShell.astro"),
    read("src/v1/tokens.css"),
    read("src/v1/document.css"),
  ]);

  for (const family of ["Marcellus", "Manrope", "IBM Plex Mono"]) {
    assert.match(page + shell + tokens + documentCss, new RegExp(family.replaceAll(" ", "\\s+")));
  }
  for (const selector of [".gw-v1-sidebar", ".gw-v1-main", ".gw-v1-toc", ".gw-v1-card-grid", ".gw-v1-state-grid"]) {
    assert.match(documentCss, new RegExp(selector.replaceAll(".", "\\.")));
  }
  assert.match(page, /data-catalogue-section/);
  assert.match(documentCss, /prefers-reduced-motion/);
  assert.match(documentCss, /max-width: 52rem/);
});
