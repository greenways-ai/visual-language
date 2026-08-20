import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  GREENWAYS_V2_COMPONENT_CONTRACT_VERSION,
  getGreenwaysV2AstroComponent,
  greenwaysV2AstroComponents,
  greenwaysV2ComponentDefinitions,
  greenwaysV2StateMarkers,
  greenwaysV2WorkbenchRegions,
} from "../src/v2/component-contract.js";
import {
  greenwaysV2Components,
  greenwaysV2WorkflowStates,
} from "../src/v2/component-catalogue.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(await read("package.json"));
const allowedOwners = new Set(["none", "native", "host"]);

test("the reusable adapter derives from the authoritative merged catalogue", () => {
  assert.equal(GREENWAYS_V2_COMPONENT_CONTRACT_VERSION, "1");
  assert.equal(greenwaysV2ComponentDefinitions, greenwaysV2Components);
  assert.equal(greenwaysV2AstroComponents.length, 16);
  assert.equal(new Set(greenwaysV2AstroComponents.map((component) => component.id)).size, 16);
  assert.equal(new Set(greenwaysV2AstroComponents.map((component) => component.exportKey)).size, 16);
  assert.equal(new Set(greenwaysV2AstroComponents.map((component) => component.source)).size, 16);
  assert.ok(Object.isFrozen(greenwaysV2AstroComponents));

  const catalogueIds = new Set(greenwaysV2Components.map((component) => component.id));
  for (const component of greenwaysV2AstroComponents) {
    assert.ok(component.catalogueIds.length > 0, component.id);
    assert.ok(component.catalogueIds.every((id) => catalogueIds.has(id)), `${component.id}: ${component.catalogueIds.join(", ")}`);
    assert.ok(allowedOwners.has(component.behaviourOwner), component.id);
    assert.ok(component.boundary.length > 0, component.id);
    assert.equal(getGreenwaysV2AstroComponent(component.id), component);
    assert.equal(getGreenwaysV2AstroComponent(component.label), component);
  }

  const workbench = getGreenwaysV2AstroComponent("workbench-shell");
  assert.ok(workbench);
  assert.deepEqual(workbench.catalogueIds, greenwaysV2WorkbenchRegions.map((region) => region.id));
});

test("state markers are derived from component and workflow definitions", () => {
  const expected = new Set([
    ...greenwaysV2Components.flatMap((component) => component.states),
    ...greenwaysV2WorkflowStates.map((state) => state.id),
  ]);
  assert.deepEqual(new Set(greenwaysV2StateMarkers), expected);
});

test("every reusable component is an explicit resolvable package export", async () => {
  assert.equal(packageJson.exports["./v2/component-catalogue.js"], "./src/v2/component-catalogue.js");
  assert.equal(packageJson.exports["./v2/component-contract.js"], "./src/v2/component-contract.js");
  assert.equal(packageJson.exports["./v2/components.css"], "./src/v2/components.css");

  for (const component of greenwaysV2AstroComponents) {
    assert.equal(packageJson.exports[component.exportKey], `./${component.source}`, component.id);
    await access(new URL(`../${component.source}`, import.meta.url));
  }
  await access(new URL("../src/v2/component-contract.d.ts", import.meta.url));
});

test("component sources expose stable markers without product behaviour", async () => {
  const forbiddenProductNames = /\b(?:Hara|Hoplite|Historia|Hestia|Hodos|Ignatius|Tahto|Foreman)\b/i;
  for (const component of greenwaysV2AstroComponents) {
    const source = await read(component.source);
    const marker = component.source.split("/").at(-1).replace(/\.astro$/, "");
    assert.match(source, new RegExp(`data-gw-v2-component=["'{]+${marker}`), component.id);
    assert.match(source, /data-gw-v2-state=/, component.id);
    assert.match(source, /components\.css/, component.id);
    assert.doesNotMatch(source, /<script(?:\s|>)/i, component.id);
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i, component.id);
    assert.doesNotMatch(source, forbiddenProductNames, component.id);
    assert.doesNotMatch(source, /(?:fetch\(|localStorage|sessionStorage|indexedDB|WebSocket|github\.com)/i, component.id);
  }
});

test("navigation, controls and selection use explicit native semantics", async () => {
  const [navigation, action, toggle, field, tabs, filters, list] = await Promise.all([
    read("src/v2/astro/Navigation.astro"),
    read("src/v2/astro/Action.astro"),
    read("src/v2/astro/Toggle.astro"),
    read("src/v2/astro/Field.astro"),
    read("src/v2/astro/Tabs.astro"),
    read("src/v2/astro/FilterBar.astro"),
    read("src/v2/astro/List.astro"),
  ]);
  assert.match(navigation, /<nav/);
  assert.match(navigation, /aria-current=/);
  assert.match(navigation, /aria-disabled=/);
  assert.match(action, /<a/);
  assert.match(action, /<button/);
  assert.match(action, /aria-busy=/);
  assert.match(toggle, /type="checkbox"/);
  assert.match(toggle, /role="switch"/);
  assert.match(toggle, /data-requested-state=/);
  assert.match(toggle, /data-actual-state=/);
  assert.match(toggle, /Requested:/);
  assert.match(toggle, /Actual:/);
  assert.match(field, /<label/);
  assert.match(field, /aria-describedby/);
  assert.match(field, /aria-invalid/);
  assert.match(field, /role="alert"/);
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /role="tab"/);
  assert.match(tabs, /aria-selected=/);
  assert.match(filters, /<form/);
  assert.match(filters, /role="search"/);
  assert.match(filters, /aria-live="polite"/);
  assert.match(list, /role="list"/);
  assert.match(list, /data-selected=/);
});

test("content components preserve document and comparison structure", async () => {
  const [card, table, panel, dialog] = await Promise.all([
    read("src/v2/astro/Card.astro"),
    read("src/v2/astro/DataTable.astro"),
    read("src/v2/astro/Panel.astro"),
    read("src/v2/astro/Dialog.astro"),
  ]);
  assert.match(card, /<article/);
  assert.match(card, /aria-labelledby=/);
  assert.match(card, /slot name="actions"/);
  assert.match(table, /<table/);
  assert.match(table, /<caption>/);
  assert.match(table, /scope="col"/);
  assert.match(table, /scope="row"/);
  assert.match(table, /data-label=/);
  assert.match(panel, /<details/);
  assert.match(panel, /<summary>/);
  assert.match(panel, /<section/);
  assert.match(dialog, /<dialog/);
  assert.match(dialog, /aria-labelledby=/);
  assert.match(dialog, /aria-describedby=/);
  assert.match(dialog, /method="dialog"/);
});

test("activity, approval and receipt claims require supplied evidence fields", async () => {
  const [status, activity, approval, receipt] = await Promise.all([
    read("src/v2/astro/Status.astro"),
    read("src/v2/astro/ActivityList.astro"),
    read("src/v2/astro/ApprovalCard.astro"),
    read("src/v2/astro/Receipt.astro"),
  ]);
  assert.match(status, /gw-v2-status__mark/);
  assert.match(status, /aria-live=/);
  assert.match(activity, /<ol>/);
  assert.match(activity, /<time/);
  assert.match(activity, /item\.actor/);
  assert.match(activity, /evidenceHref/);
  assert.match(approval, /data-requested-state=/);
  assert.match(approval, /data-actual-state=/);
  assert.match(approval, /Requested scope/);
  assert.match(approval, /requestedBy/);
  assert.match(receipt, /data-receipt-id=/);
  assert.match(receipt, /Receipt identifier/);
  assert.match(receipt, /<time/);
  assert.match(receipt, /Evidence/);
  assert.match(receipt, /digest/);
});

test("the workbench implementation exposes every declared region", async () => {
  const [shell, css] = await Promise.all([
    read("src/v2/astro/WorkbenchShell.astro"),
    read("src/v2/workbench.css"),
  ]);
  assert.equal(greenwaysV2WorkbenchRegions.length, 6);
  assert.match(shell, /role="toolbar"/);
  assert.match(shell, /slot name="command-bar"/);
  assert.match(shell, /<nav class="gw-v2-workbench__rail"/);
  assert.match(shell, /aria-label="Primary workspace"/);
  assert.match(shell, /<aside class="gw-v2-workbench__inspector"/);
  assert.match(shell, /<aside class="gw-v2-workbench__activity"/);
  assert.match(shell, /<footer class="gw-v2-workbench__status"/);
  assert.match(css, /grid-template-rows:\s*minmax\(0, 1fr\) auto/);
  assert.match(css, /\.gw-v2-workbench__activity/);
  assert.match(css, /@media \(max-width: 44rem\)/);
  assert.match(css, /display:\s*block/);
});

test("component CSS is token-backed, responsive and reduced-motion safe", async () => {
  const css = await read("src/v2/components.css");
  assert.match(css, /^@import "\.\/document\.css";/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.match(css, /var\(--gw-v2-/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-inline-size:\s*0/);
  assert.match(css, /@media \(max-width: 52rem\)/);
  assert.match(css, /@media \(max-width: 36rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /content:\s*attr\(data-label\)/);
});
