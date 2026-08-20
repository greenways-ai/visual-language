import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  GREENWAYS_V2_COMPONENT_CONTRACT_VERSION,
  getGreenwaysV2Component,
  greenwaysV2Components,
  greenwaysV2StateMarkers,
  greenwaysV2WorkbenchRegions,
} from "../src/v2/component-contract.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(await read("package.json"));
const expectedCategories = [
  "navigation",
  "button",
  "toggle",
  "field",
  "tabs",
  "filters",
  "list",
  "card",
  "table",
  "panel",
  "dialog",
  "status",
  "activity",
  "approval",
  "receipt",
  "workbench",
];
const allowedBehaviourOwners = new Set(["none", "native", "host"]);
const stateMarkers = new Set(greenwaysV2StateMarkers);

test("the component contract is complete, unique, immutable and exported", async () => {
  assert.equal(GREENWAYS_V2_COMPONENT_CONTRACT_VERSION, "1");
  assert.deepEqual(greenwaysV2Components.map((component) => component.id), expectedCategories);
  assert.equal(new Set(greenwaysV2Components.map((component) => component.name)).size, greenwaysV2Components.length);
  assert.equal(new Set(greenwaysV2Components.map((component) => component.exportKey)).size, greenwaysV2Components.length);
  assert.equal(new Set(greenwaysV2Components.map((component) => component.source)).size, greenwaysV2Components.length);
  assert.ok(Object.isFrozen(greenwaysV2Components));
  assert.ok(Object.isFrozen(greenwaysV2WorkbenchRegions));

  for (const component of greenwaysV2Components) {
    assert.equal(packageJson.exports[component.exportKey], `./${component.source}`, component.name);
    await access(new URL(`../${component.source}`, import.meta.url));
    assert.ok(component.semanticRoot.length > 0, component.name);
    assert.ok(component.dataMarker.length > 0, component.name);
    assert.ok(component.states.length > 0, component.name);
    assert.ok(component.states.every((state) => stateMarkers.has(state)), component.name);
    assert.ok(component.accessibility.length > 0, component.name);
    assert.ok(allowedBehaviourOwners.has(component.behaviourOwner), component.name);
    assert.ok(component.boundary.length > 0, component.name);
    assert.equal(getGreenwaysV2Component(component.id), component);
    assert.equal(getGreenwaysV2Component(component.name), component);
  }

  assert.equal(packageJson.exports["./v2/components.css"], "./src/v2/components.css");
  assert.equal(packageJson.exports["./v2/component-contract.js"], "./src/v2/component-contract.js");
  await access(new URL("../src/v2/component-contract.d.ts", import.meta.url));
});

test("every shared component declares its marker and contains no product implementation", async () => {
  const forbiddenProductNames = /\b(?:Hara|Hoplite|Historia|Hestia|Hodos|Ignatius|Tahto|Foreman)\b/i;
  for (const component of greenwaysV2Components) {
    const source = await read(component.source);
    assert.match(source, new RegExp(`data-gw-v2-component=["'{]+${component.dataMarker}`), component.name);
    assert.match(source, /data-gw-v2-state=/, component.name);
    assert.match(source, /components\.css/, component.name);
    assert.doesNotMatch(source, /<script(?:\s|>)/i, component.name);
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i, component.name);
    assert.doesNotMatch(source, forbiddenProductNames, component.name);
    assert.doesNotMatch(source, /(?:fetch\(|localStorage|sessionStorage|indexedDB|WebSocket|github\.com)/i, component.name);
  }
});

test("navigation, controls and selection primitives use explicit semantics", async () => {
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
  assert.match(tabs, /aria-controls=/);
  assert.match(filters, /<form/);
  assert.match(filters, /role="search"/);
  assert.match(filters, /aria-live="polite"/);
  assert.match(list, /<section/);
  assert.match(list, /<ul role="list">/);
  assert.match(list, /data-selected=/);
});

test("content primitives preserve native document structure", async () => {
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

test("state, authority and evidence primitives keep claims separate", async () => {
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

test("the workbench exposes six named regions and a compact reading order", async () => {
  assert.deepEqual(greenwaysV2WorkbenchRegions.map((region) => region.id), [
    "command-bar",
    "navigation",
    "workspace",
    "inspector",
    "activity",
    "status",
  ]);
  assert.deepEqual(greenwaysV2WorkbenchRegions.map((region) => region.collapse), [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "last",
  ]);

  const [shell, css] = await Promise.all([
    read("src/v2/astro/WorkbenchShell.astro"),
    read("src/v2/workbench.css"),
  ]);
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

test("component CSS is token-backed, responsive, focus-visible and reduced-motion safe", async () => {
  const css = await read("src/v2/components.css");
  assert.match(css, /^@import "\.\/document\.css";/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.match(css, /var\(--gw-v2-/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-inline-size:\s*0/);
  assert.match(css, /@media \(max-width: 52rem\)/);
  assert.match(css, /@media \(max-width: 36rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /gw-v2-status__mark/);
  assert.match(css, /content:\s*attr\(data-label\)/);
});

test("the executable catalogue covers every primitive without becoming a package export", async () => {
  const route = await read("src/pages/v2/library/components/index.astro");
  for (const component of greenwaysV2Components) {
    assert.match(route, new RegExp(`\\b${component.name}\\b`), component.name);
  }
  assert.match(route, /data-component-catalogue/);
  assert.match(route, /data-shared-contract/);
  assert.match(route, /data-product-behaviour="host-owned"/);
  assert.match(route, /Specimen data/);
  assert.match(route, /No live behaviour/);
  assert.match(route, /Workflow-state compositions remain a separate review/);
  assert.doesNotMatch(route, /<script(?:\s|>)/i);
  assert.doesNotMatch(route, /#[0-9a-f]{3,8}\b/i);
  assert.ok(!Object.values(packageJson.exports).includes("./src/pages/v2/library/components/index.astro"));
});
