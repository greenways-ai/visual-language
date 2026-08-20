import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  greenwaysV2ComponentGroups,
  greenwaysV2Components,
  greenwaysV2WorkbenchRegions,
  greenwaysV2Workflows,
  greenwaysV2WorkflowStates,
} from "../src/v2/component-catalogue.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the shared component inventory is stable, unique and application-neutral", () => {
  assert.deepEqual(greenwaysV2ComponentGroups, ["navigation", "action", "input", "content", "data", "feedback", "workbench"]);
  assert.equal(greenwaysV2Components.length, 21);
  assert.equal(new Set(greenwaysV2Components.map((component) => component.id)).size, greenwaysV2Components.length);

  for (const required of [
    "primary-navigation", "button", "toggle", "text-field", "tabs", "table", "dialog",
    "status", "activity-item", "approval-card", "receipt-card", "command-bar", "workbench-rail",
    "inspector", "activity-region", "status-line",
  ]) {
    assert.ok(greenwaysV2Components.some((component) => component.id === required), required);
  }

  for (const component of greenwaysV2Components) {
    assert.equal(component.visualOwner, "shared-visual");
    assert.ok(component.element);
    assert.ok(component.purpose);
    assert.ok(component.states.length > 0);
    assert.ok(component.requiredAttributes.length > 0);
    assert.match(component.behaviourOwner, /^Host application owns/);
  }
});

test("workbench regions cover command, navigation, work, inspection, activity and status", () => {
  assert.deepEqual(greenwaysV2WorkbenchRegions, [
    "command-bar", "workbench-rail", "primary-workspace", "inspector", "activity-region", "status-line",
  ]);
});

test("workflow studies keep evidence and application ownership explicit", () => {
  assert.deepEqual(greenwaysV2Workflows.map((workflow) => workflow.id), [
    "search-filter-select-inspect",
    "create-validate-preview-approve-receipt",
    "load-run-observe-recover",
    "connect-authority-reconnect-revoke",
  ]);
  for (const workflow of greenwaysV2Workflows) {
    assert.ok(workflow.steps.length >= 4);
    assert.ok(workflow.evidence);
    assert.match(workflow.applicationBoundary, /application|laboratory/i);
  }
});

test("difficult states include evidence, safe action and non-colour cues", () => {
  const expected = [
    "empty-first-use", "empty-filtered", "loading", "stale", "partial", "offline",
    "recoverable-error", "fatal-error", "waiting-approval", "active", "success",
  ];
  assert.deepEqual(greenwaysV2WorkflowStates.map((state) => state.id), expected);
  for (const state of greenwaysV2WorkflowStates) {
    assert.ok(state.evidence, state.id);
    assert.ok(state.nextAction, state.id);
    assert.ok(state.nonColourCue, state.id);
  }
});

test("component and workflow routes expose executable semantic markers", async () => {
  const [overview, components, workflows] = await Promise.all([
    read("src/pages/v2/library/index.astro"),
    read("src/pages/v2/library/components/index.astro"),
    read("src/pages/v2/library/workflows/index.astro"),
  ]);

  assert.match(overview, /Reusable structures/);
  assert.match(overview, /Visual language is not application behaviour/);
  assert.match(components, /data-gw-v2-component-catalogue/);
  assert.match(components, /data-gw-v2-workbench-study/);
  assert.match(components, /role="switch"/);
  assert.match(components, /aria-busy="true"/);
  assert.match(workflows, /data-gw-v2-workflow-catalogue/);
  assert.match(workflows, /data-gw-v2-state-catalogue/);
  assert.match(workflows, /Desired state ≠ observed state/);
  assert.match(workflows, /Login does not grant issue creation/);

  assert.doesNotMatch(`${overview}\n${components}\n${workflows}`, /Hoplite|Historia|Tahto|Hestia|Hodos|Ignatius/);
});

test("laboratory presentation consumes semantic tokens without structural colour literals", async () => {
  const css = await read("src/v2/library.css");
  assert.match(css, /var\(--gw-v2-canvas\)/);
  assert.match(css, /var\(--gw-v2-surface\)/);
  assert.match(css, /var\(--gw-v2-seam\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width: 44rem/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
});
