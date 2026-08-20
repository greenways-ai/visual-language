import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  FOREMAN_WORKBENCH_VERSION,
  foremanWorkbench,
  getForemanBuildout,
  getForemanBuildoutGroups,
  getForemanExternalEffect,
  getForemanProject,
  getForemanSession,
  getForemanWorkItem,
} from "../src/foreman/workbench.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const ids = (items) => items.map((item) => item.id);
const requiredStates = [
  "first-use",
  "loading",
  "empty-project",
  "empty-filter",
  "active",
  "waiting-for-approval",
  "stale",
  "provider-disconnected",
  "host-unavailable",
  "partial-result",
  "recoverable-failure",
  "fatal-failure",
  "cancelled",
  "completed",
  "externally-verified",
];

const assertReferences = (idsToCheck, values, label) => {
  const available = new Set(values.map((value) => value.id));
  for (const id of idsToCheck) assert.ok(available.has(id), `${label}: ${id}`);
};

test("the Foreman workbench fixture is closed, frozen, versioned, and sufficiently complex", () => {
  assert.equal(FOREMAN_WORKBENCH_VERSION, "foreman-workbench/1");
  assert.equal(foremanWorkbench.meta.version, FOREMAN_WORKBENCH_VERSION);
  assert.equal(foremanWorkbench.meta.toolSurfaceVersion, "1.0");
  assert.ok(Object.isFrozen(foremanWorkbench));
  assert.ok(Object.isFrozen(foremanWorkbench.projects));
  assert.ok(Object.isFrozen(foremanWorkbench.projects[0]));
  assert.equal(foremanWorkbench.projects.length, 3);
  assert.equal(foremanWorkbench.buildouts.length, 8);
  assert.ok(foremanWorkbench.workItems.length >= 10);
  assert.ok(foremanWorkbench.sessions.length >= 7);
  assert.equal(foremanWorkbench.leases.length, 1);
  assert.equal(foremanWorkbench.runs.length, 1);
  assert.ok(foremanWorkbench.approvals.length >= 1);
  assert.ok(foremanWorkbench.artifacts.length >= 5);
});

test("projects, buildouts, work, sessions, execution, approvals, and evidence cross-reference exactly", () => {
  for (const project of foremanWorkbench.projects) {
    assertReferences(project.buildoutIds, foremanWorkbench.buildouts, `${project.id}.buildoutIds`);
    for (const id of project.buildoutIds) assert.equal(getForemanBuildout(id).projectId, project.id, id);
  }

  for (const buildout of foremanWorkbench.buildouts) {
    assert.equal(getForemanProject(buildout.projectId).id, buildout.projectId);
    assertReferences(buildout.workItemIds, foremanWorkbench.workItems, `${buildout.id}.workItemIds`);
    assertReferences(buildout.sessionIds, foremanWorkbench.sessions, `${buildout.id}.sessionIds`);
    assertReferences(buildout.agentIds, foremanWorkbench.agents, `${buildout.id}.agentIds`);
    assertReferences(buildout.approvalIds, foremanWorkbench.approvals, `${buildout.id}.approvalIds`);
    assertReferences(buildout.artifactIds, foremanWorkbench.artifacts, `${buildout.id}.artifactIds`);
    assertReferences(buildout.externalEffectIds, foremanWorkbench.externalEffects, `${buildout.id}.externalEffectIds`);
    assert.ok(buildout.workItemIds.includes(buildout.currentWorkItemId), `${buildout.id}.currentWorkItemId`);
    if (buildout.executionHostId) assertReferences([buildout.executionHostId], foremanWorkbench.executionHosts, `${buildout.id}.executionHostId`);
    if (buildout.leaseId) assertReferences([buildout.leaseId], foremanWorkbench.leases, `${buildout.id}.leaseId`);
    if (buildout.runId) assertReferences([buildout.runId], foremanWorkbench.runs, `${buildout.id}.runId`);
    if (buildout.lastCheckpointId) assertReferences([buildout.lastCheckpointId], foremanWorkbench.checkpoints, `${buildout.id}.lastCheckpointId`);
  }

  for (const item of foremanWorkbench.workItems) {
    assert.equal(getForemanBuildout(item.buildoutId).id, item.buildoutId);
    assertReferences(item.sessionIds, foremanWorkbench.sessions, `${item.id}.sessionIds`);
    assertReferences(item.runIds, foremanWorkbench.runs, `${item.id}.runIds`);
  }
});

test("the specimen covers the required lifecycle and recovery matrix", () => {
  assert.deepEqual(ids(foremanWorkbench.stateMatrix), requiredStates);
  assert.deepEqual(foremanWorkbench.groupOrder, ["needs-attention", "running", "waiting", "completed", "stopped"]);
  assert.deepEqual(getForemanBuildoutGroups().map((group) => group.id), foremanWorkbench.groupOrder);
  assert.deepEqual(new Set(foremanWorkbench.workItems.map((item) => item.state)), new Set(["completed", "active", "waiting-for-approval", "failed", "blocked", "cancelled"]));
  assert.ok(foremanWorkbench.sessions.some((session) => session.state === "disconnected"));
  assert.ok(foremanWorkbench.buildouts.some((buildout) => buildout.lifecycleState === "degraded"));
  assert.ok(foremanWorkbench.buildouts.some((buildout) => buildout.lifecycleState === "completed"));
  assert.ok(foremanWorkbench.buildouts.some((buildout) => buildout.lifecycleState === "cancelled"));
  for (const state of foremanWorkbench.stateMatrix) assert.ok(state.summary && state.evidence, state.id);
});

test("provider session, client, agent, host, lease, and Work-run identities remain distinct", () => {
  const selected = getForemanBuildout(foremanWorkbench.selected.buildoutId);
  const sessions = selected.sessionIds.map(getForemanSession);
  const providers = new Set(sessions.map((session) => session.provider));
  const clients = new Set(sessions.map((session) => session.clientId));
  const agents = new Set(sessions.map((session) => session.agentId));

  assert.ok(providers.size >= 3);
  assert.ok(clients.size >= 2);
  assert.ok(agents.size >= 3);
  assert.equal(new Set(ids(sessions)).size, sessions.length);
  assert.ok(foremanWorkbench.clients.some((client) => client.actionState === "unavailable" && client.observedCapability === "read/fetch"));

  const lease = foremanWorkbench.leases[0];
  const run = foremanWorkbench.runs[0];
  assert.notEqual(lease.id, run.id);
  assert.notEqual(run.originSessionId, run.id);
  assert.notEqual(lease.hostId, run.originSessionId);
  assert.equal(run.leaseId, lease.id);
  assert.equal(lease.runId, run.id);
  assert.match(lease.cleanupEvidence, /returned ready/i);
  for (const excluded of ["browser cookies", "provider credentials", "GitHub push", "merge", "deployment"]) {
    assert.ok(lease.excludedAuthority.includes(excluded), excluded);
  }
});

test("local completion and canonical GitHub delivery are separate claims", () => {
  const run = foremanWorkbench.runs[0];
  const uncertain = getForemanExternalEffect("effect-homepage-followup");
  const verified = getForemanExternalEffect("effect-homepage-baseline");

  assert.equal(run.state, "completed");
  assert.equal(run.cleanupState, "verified");
  assert.equal(uncertain.state, "uncertain");
  assert.equal(uncertain.readBackState, "awaiting");
  assert.equal(uncertain.canonicalUrl, null);
  assert.match(uncertain.truth, /not yet verified/i);
  assert.equal(verified.state, "verified");
  assert.equal(verified.readBackState, "canonical");
  assert.equal(verified.canonicalUrl, "https://github.com/greenways-ai/visual-language/pull/57");
  assert.match(verified.canonicalRevision, /^[0-9a-f]{40}$/);
  assert.deepEqual(foremanWorkbench.statusLine.map((item) => item.id), ["local-work", "cleanup", "github-delivery"]);
  assert.equal(foremanWorkbench.statusLine.at(-1).value, "awaiting read-back");
});

test("the selected workbench exposes three separate evidence lanes", () => {
  assert.deepEqual(Object.keys(foremanWorkbench.laneEvents), ["work", "execution", "external"]);
  assert.ok(foremanWorkbench.laneEvents.work.some((event) => event.kind === "Session"));
  assert.ok(foremanWorkbench.laneEvents.execution.some((event) => event.kind === "Requested host"));
  assert.ok(foremanWorkbench.laneEvents.execution.some((event) => event.kind === "Actual host"));
  assert.ok(foremanWorkbench.laneEvents.execution.some((event) => event.kind === "Sandbox lease"));
  assert.ok(foremanWorkbench.laneEvents.execution.some((event) => event.kind === "Work run"));
  assert.ok(foremanWorkbench.laneEvents.execution.some((event) => event.kind === "Cleanup"));
  assert.ok(foremanWorkbench.laneEvents.external.some((event) => event.state === "uncertain"));
  assert.ok(foremanWorkbench.laneEvents.external.some((event) => event.state === "verified"));
});

test("the executable route contains all three connected views and truthful controls", async () => {
  const page = (await Promise.all([
    read("src/pages/v2/applications/foreman/projects.astro"),
    read("src/foreman/workbench.overview.astro"),
    read("src/foreman/workbench.board.astro"),
    read("src/foreman/workbench.selected.astro"),
  ])).join("\n");

  assert.match(page, /CatalogueShell/);
  assert.match(page, /data-foreman-workbench=/);
  assert.match(page, /data-workbench-view="overview"/);
  assert.match(page, /data-workbench-view="board"/);
  assert.match(page, /data-workbench-view="workbench"/);
  assert.match(page, /data-buildout-board/);
  assert.match(page, /data-state-matrix/);
  assert.match(page, /data-lane="work"/);
  assert.match(page, /data-lane="execution"/);
  assert.match(page, /data-lane="external"/);
  assert.match(page, />Resume</);
  assert.match(page, />Hand off</);
  assert.match(page, />Review approval</);
  assert.match(page, /specimen only\. No work, approval, handoff, host, or external-effect request was sent/);
  assert.match(page, /Observe only · actions unavailable/);
  assert.match(page, /Open canonical GitHub record/);
  assert.match(page, /no canonical URL/);
  assert.doesNotMatch(page, /fetch\(|new WebSocket|EventSource|chrome\.|github\.request/i);
});

test("the visual contract is neutral, responsive, focusable, and 320px safe", async () => {
  const [css, overview, board, selected, responsive] = await Promise.all([
    read("src/v2/foreman-workbench.css"),
    read("src/v2/foreman-workbench-overview.css"),
    read("src/v2/foreman-workbench-board.css"),
    read("src/v2/foreman-workbench-selected.css"),
    read("src/v2/foreman-workbench-responsive.css"),
  ]);
  const styles = [css, overview, board, selected, responsive].join("\n");

  assert.match(css, /@import "\.\/foreman-workbench-overview\.css"/);
  assert.match(css, /@import "\.\/foreman-workbench-board\.css"/);
  assert.match(css, /@import "\.\/foreman-workbench-selected\.css"/);
  assert.match(css, /@import "\.\/foreman-workbench-responsive\.css"/);
  assert.match(styles, /var\(--gw-v2-canvas\)/);
  assert.match(styles, /var\(--gw-v2-surface\)/);
  assert.match(styles, /var\(--gw-v2-state-warning\)/);
  assert.match(styles, /var\(--gw-v2-state-danger\)/);
  assert.match(styles, /var\(--gw-v2-state-success\)/);
  assert.match(styles, /min-inline-size:\s*0/);
  assert.match(styles, /overflow:\s*clip/);
  assert.match(styles, /:focus-visible/);
  assert.match(responsive, /@media \(max-width: 70rem\)/);
  assert.match(responsive, /@media \(max-width: 51\.25rem\)/);
  assert.match(responsive, /@media \(max-width: 40rem\)/);
  assert.match(responsive, /@media \(max-width: 24\.375rem\)/);
  assert.match(responsive, /@media \(max-width: 20rem\)/);
  assert.match(responsive, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /\b(?:rgb|rgba|hsl|hsla)\(/i);
  assert.doesNotMatch(styles, /white-space:\s*nowrap/i);
  assert.doesNotMatch(styles, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/i);
});

test("the adoption note bounds live ownership and the next issue train", async () => {
  const docs = await read("docs/foreman-project-workbench.md");
  for (const heading of ["Outcome", "Closed specimen dataset", "Connected screen family", "Identity laws", "State matrix", "Responsive contract", "Static interaction contract", "Production ownership", "Follow-on work", "Validation"]) {
    assert.ok(docs.includes(`## ${heading}`), heading);
  }
  assert.match(docs, /Local work: completed[\s\S]*Cleanup: verified[\s\S]*GitHub delivery: awaiting read-back/);
  assert.match(docs, /#37/);
  assert.match(docs, /#38/);
  assert.match(docs, /#39/);
  assert.match(docs, /does not implement a live Foreman runtime/i);
});
