import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  FOREMAN_PROJECT_EXECUTION_VERSION,
  foremanProjectExecution,
  getForemanProjectExecution,
  validateForemanProjectExecution,
} from "../src/foreman/projects-execution.js";
import {
  foremanClientProfiles,
  foremanExecutionHosts,
  foremanRunTimeline,
} from "../src/foreman/tool-surface.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const byId = (values, id) => values.find((entry) => entry.id === id);

test("the selected-buildout execution fixture is closed, frozen, versioned, and bound to the merged #36 route", () => {
  assert.equal(FOREMAN_PROJECT_EXECUTION_VERSION, "foreman-project-execution/1");
  assert.equal(foremanProjectExecution.meta.version, FOREMAN_PROJECT_EXECUTION_VERSION);
  assert.equal(foremanProjectExecution.meta.toolSurfaceVersion, "1.0");
  assert.equal(foremanProjectExecution.selected.projectId, "greenways-visual-language");
  assert.equal(foremanProjectExecution.selected.buildoutId, "foreman-project-workbench");
  assert.equal(getForemanProjectExecution("greenways-visual-language", "foreman-project-workbench"), foremanProjectExecution);
  assert.equal(getForemanProjectExecution("other", "foreman-project-workbench"), undefined);
  assert.equal(validateForemanProjectExecution(), true);
  assert.ok(Object.isFrozen(foremanProjectExecution));
  assert.ok(Object.isFrozen(foremanProjectExecution.clients));
  assert.ok(Object.isFrozen(foremanProjectExecution.clients[0]));
});

test("client capability comes from the source-owned #50 profiles and remains separate from provider sessions", () => {
  const observe = byId(foremanProjectExecution.clients, "client-chatgpt-review-36");
  const action = byId(foremanProjectExecution.clients, "client-foreman-desktop-36");
  assert.ok(observe);
  assert.ok(action);
  assert.equal(observe.profile, byId(foremanClientProfiles, "read-only-mcp"));
  assert.equal(action.profile, byId(foremanClientProfiles, "direct-foreman-host"));
  assert.equal(observe.actionState, "unavailable");
  assert.equal(observe.observedCapability, "read/fetch");
  assert.equal(action.actionState, "gated");
  assert.notEqual(observe.id, observe.sessionId);
  assert.notEqual(action.id, action.sessionId);
  assert.notEqual(observe.sessionId, action.sessionId);
  assert.ok(observe.advertisedTools.every((tool) => tool.classId === "observe"));
  assert.ok(action.advertisedTools.some((tool) => tool.classId === "act"));
  assert.ok(action.advertisedTools.some((tool) => tool.classId === "external-effect"));
});

test("requested host, actual advertisement, approval, lease, Work run, checkpoint, and artifacts are distinct exact identities", () => {
  const host = foremanProjectExecution.hostAdvertisements[0];
  const approval = foremanProjectExecution.approvals[0];
  const lease = foremanProjectExecution.leases[0];
  const run = foremanProjectExecution.runs[0];
  const checkpoint = foremanProjectExecution.checkpoints[0];

  assert.equal(host.hostId, byId(foremanExecutionHosts, "mac-studio").id);
  assert.notEqual(host.id, host.hostId);
  assert.notEqual(lease.id, run.id);
  assert.notEqual(run.originSessionId, run.clientId);
  assert.notEqual(run.clientId, run.actualHostAdvertisementId);
  assert.equal(lease.approvalId, approval.id);
  assert.equal(lease.actualHostAdvertisementId, host.id);
  assert.equal(lease.runId, run.id);
  assert.equal(run.leaseId, lease.id);
  assert.equal(checkpoint.runId, run.id);
  assert.deepEqual(run.checkpointIds, [checkpoint.id]);
  assert.deepEqual(new Set(run.artifactIds), new Set(foremanProjectExecution.artifacts.map((entry) => entry.id)));
  assert.equal(lease.cleanupState, "verified");
  assert.match(lease.cleanupEvidence, /workspace was removed/i);
  for (const excluded of ["browser cookies", "provider credentials", "GitHub push", "pull-request creation", "merge", "deployment", "publication"]) {
    assert.ok(lease.excludedAuthority.includes(excluded), excluded);
  }
});

test("the execution lane consumes every source-owned #50 run state without inventing a second vocabulary", () => {
  assert.deepEqual(foremanProjectExecution.laneOrder, ["work", "execution", "external"]);
  assert.deepEqual(
    foremanProjectExecution.laneEvents.execution.map((entry) => entry.state),
    foremanRunTimeline.map((entry) => entry.id),
  );
  assert.equal(foremanProjectExecution.runVocabulary, foremanRunTimeline);
  assert.ok(foremanProjectExecution.laneEvents.work.some((entry) => entry.kind === "Provider session"));
  assert.ok(foremanProjectExecution.laneEvents.execution.some((entry) => entry.title.includes("host generation 044")));
  assert.ok(foremanProjectExecution.laneEvents.execution.some((entry) => entry.kind === "Checkpointed"));
  assert.ok(foremanProjectExecution.laneEvents.execution.some((entry) => entry.kind === "Cleaned"));
  assert.ok(foremanProjectExecution.laneEvents.external.some((entry) => entry.state === "uncertain"));
  assert.ok(foremanProjectExecution.laneEvents.external.some((entry) => entry.state === "verified"));
});

test("local completion, cleanup, uncertain GitHub delivery, and canonical read-back remain separate claims", () => {
  const run = foremanProjectExecution.runs[0];
  const lease = foremanProjectExecution.leases[0];
  const current = byId(foremanProjectExecution.externalEffects, foremanProjectExecution.selected.currentExternalEffectId);
  const verified = byId(foremanProjectExecution.externalEffects, foremanProjectExecution.selected.verifiedExternalEffectId);

  assert.equal(run.state, "completed");
  assert.equal(lease.cleanupState, "verified");
  assert.equal(current.state, "uncertain");
  assert.equal(current.readBackState, "awaiting");
  assert.equal(current.canonicalUrl, null);
  assert.equal(current.canonicalRevision, null);
  assert.match(current.truth, /remains unverified/i);
  assert.equal(verified.state, "verified");
  assert.equal(verified.readBackState, "canonical");
  assert.equal(verified.canonicalUrl, "https://github.com/greenways-ai/visual-language/pull/63");
  assert.equal(verified.canonicalRevision, "d9db7f74fd50c229da1abfe817d63671a783564d");
  assert.deepEqual(foremanProjectExecution.statusLine.map((entry) => entry.id), ["local-work", "cleanup", "github-delivery"]);
  assert.equal(foremanProjectExecution.statusLine.at(-1).value, "awaiting read-back");
});

test("the real Foreman shell composes the execution lanes, inspector, and truthful status line only for workbench routes", async () => {
  const [shell, evidence, inspector] = await Promise.all([
    read("src/foreman/ForemanShell.astro"),
    read("src/foreman/ForemanExecutionEvidence.astro"),
    read("src/foreman/ForemanExecutionInspector.astro"),
  ]);
  const source = `${shell}\n${evidence}\n${inspector}`;

  assert.match(shell, /getForemanProjectExecution/);
  assert.match(shell, /layout === "workbench"/);
  assert.match(shell, /<ForemanExecutionEvidence execution=\{execution\}/);
  assert.match(shell, /<ForemanExecutionInspector execution=\{execution\}/);
  assert.match(shell, /execution\?\.statusLine\.map/);
  assert.match(evidence, /data-foreman-execution-workbench=/);
  assert.match(evidence, /data-lane=\{laneId\}/);
  assert.match(evidence, /Requested host/);
  assert.match(evidence, /Actual host advertisement/);
  assert.match(evidence, /External-effect truth comparison/);
  assert.match(evidence, /Open canonical GitHub record/);
  assert.match(inspector, /Context does not become authority/);
  assert.match(inspector, /Requested and actual execution/);
  assert.match(inspector, /Excluded authority/);
  assert.match(inspector, /Canonical URL/);
  assert.doesNotMatch(source, /fetch\(|new WebSocket|EventSource|chrome\.|github\.request/i);
  assert.doesNotMatch(source, /on(?:click|mouse|pointer|touch|key)[a-z]*=/i);
  assert.doesNotMatch(source, /tabindex="[1-9]\d*"/i);
});

test("execution styling preserves semantic tokens and designed 1120, 640, 480, and 320 pixel behaviour", async () => {
  const css = await read("src/foreman/projects/execution.css");
  for (const token of ["surface", "seam", "signal", "state-info", "state-warning", "state-success"]) {
    assert.match(css, new RegExp(`var\\(--gw-v2-${token}`), token);
  }
  assert.match(css, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media \(max-width: 72rem\)/);
  assert.match(css, /@media \(max-width: 44rem\)/);
  assert.match(css, /@media \(max-width: 30rem\)/);
  assert.match(css, /@media \(max-width: 20rem\)/);
  assert.match(css, /min-inline-size:\s*0/);
  assert.match(css, /max-inline-size:\s*100%/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\brgba?\(/i);
  assert.doesNotMatch(css, /\bhsla?\(/i);
  assert.doesNotMatch(css, /--gw-v2-[a-z0-9-]+\s*:/i);
  assert.doesNotMatch(css, /white-space:\s*nowrap/i);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/i);
});

test("the adoption note records source ownership, identity boundaries, static limits, and validation", async () => {
  const docs = await read("docs/foreman-project-execution.md");
  for (const heading of ["Scope and lineage", "Contract", "Identity laws", "Three evidence lanes", "Closed specimen dataset", "Truthful completion", "Responsive behaviour", "Static boundary", "Production adoption", "Validation"]) {
    assert.ok(docs.includes(`## ${heading}`), heading);
  }
  assert.match(docs, /pull request #63/i);
  assert.match(docs, /issue #50/i);
  assert.match(docs, /Local work · completed[\s\S]*Cleanup · verified[\s\S]*GitHub delivery · awaiting read-back/);
  assert.match(docs, /performs no fetch, WebSocket, MCP invocation/i);
  assert.match(docs, /320px \/ 20rem/);
});
