import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  FOREMAN_TOOL_SURFACE_VERSION,
  foremanArchitectureLayers,
  foremanClientProfiles,
  foremanExecutionHosts,
  foremanLeaseSpecimen,
  foremanRecoveryStates,
  foremanRunTimeline,
  foremanToolClasses,
  foremanTools,
  foremanToolsForProfile,
  foremanTrustLaws,
} from "../src/foreman/tool-surface.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const ids = (items) => items.map((item) => item.id);

test("Foreman publishes one closed, versioned tool catalogue", () => {
  assert.equal(FOREMAN_TOOL_SURFACE_VERSION, "1.0");
  assert.deepEqual(ids(foremanToolClasses), ["observe", "act", "external-effect"]);
  assert.equal(new Set(ids(foremanTools)).size, foremanTools.length);
  assert.equal(new Set(foremanTools.map((tool) => tool.name)).size, foremanTools.length);
  const classIds = new Set(ids(foremanToolClasses));
  for (const tool of foremanTools) {
    assert.match(tool.name, /^foreman\.[a-z][a-z.-]+$/);
    assert.ok(classIds.has(tool.classId), tool.name);
    for (const field of ["label", "purpose", "fabricService", "approval", "resultEvidence"]) assert.ok(tool[field], `${tool.name}.${field}`);
  }
});

test("the Observe profile is useful without implying action authority", () => {
  const profile = foremanClientProfiles.find((candidate) => candidate.id === "read-only-mcp");
  assert.deepEqual(profile.toolClasses, ["observe"]);
  assert.equal(profile.actionState, "unavailable");
  assert.match(profile.truth, /cannot be presented as having durable action authority/i);
  const tools = foremanToolsForProfile(profile.id);
  assert.ok(tools.length >= 10);
  assert.ok(tools.every((tool) => tool.classId === "observe"));
  for (const name of [
    "foreman.buildout.get",
    "foreman.sessions.list",
    "foreman.approvals.list",
    "foreman.execution.hosts.list",
    "foreman.execution.run.get",
    "foreman.activity.list",
    "foreman.artifact.get",
  ]) assert.ok(tools.some((tool) => tool.name === name), name);
  for (const name of ["foreman.work.submit", "foreman.execution.lease.request", "foreman.approval.decide", "foreman.external-effect.request"]) {
    assert.ok(!tools.some((tool) => tool.name === name), name);
  }
});

test("action-capable profiles still preserve Greenways and human gates", () => {
  for (const id of ["full-action-mcp", "direct-foreman-host"]) {
    const profile = foremanClientProfiles.find((candidate) => candidate.id === id);
    assert.equal(profile.actionState, "gated");
    assert.deepEqual(profile.toolClasses, ["observe", "act", "external-effect"]);
    assert.match(profile.truth, /Greenways grants|selected Fabric authority/i);
    const tools = foremanToolsForProfile(id);
    assert.ok(tools.some((tool) => tool.name === "foreman.execution.lease.request"));
    assert.ok(tools.some((tool) => tool.name === "foreman.external-effect.request"));
  }
  const approval = foremanTools.find((tool) => tool.name === "foreman.approval.decide");
  assert.equal(approval.approval, "human");
  const effect = foremanTools.find((tool) => tool.name === "foreman.external-effect.request");
  assert.match(effect.resultEvidence, /canonical read-back/i);
});

test("Foreman exposes semantic operations rather than infrastructure escape hatches", () => {
  const names = foremanTools.map((tool) => tool.name).join("\n");
  assert.doesNotMatch(names, /\b(shell|docker|podman|ssh|database|filesystem|native|eval)\b/i);
  const laws = new Map(foremanTrustLaws.map((law) => [law.id, law.statement]));
  assert.match(laws.get("no-generic-shell"), /never exposes an unrestricted shell/i);
  assert.match(laws.get("no-token-passthrough"), /never passed through/i);
  assert.match(laws.get("external-effect-separate"), /authoritative read-back/i);
});

test("execution hosts, leases, browser control, and Work runs remain distinct", () => {
  assert.deepEqual(ids(foremanExecutionHosts), ["mac-studio", "cloud-worker", "laptop"]);
  assert.deepEqual(foremanExecutionHosts.map((host) => host.state), ["ready", "approval-required", "degraded"]);
  assert.equal(foremanLeaseSpecimen.state, "approval-required");
  assert.notEqual(foremanLeaseSpecimen.originContext, foremanLeaseSpecimen.requestedBy);
  assert.notEqual(foremanLeaseSpecimen.controlPlane, foremanLeaseSpecimen.dataPlane);
  for (const excluded of ["browser cookies", "provider credentials", "GitHub push", "merge", "deployment"]) {
    assert.ok(foremanLeaseSpecimen.excludedAuthority.includes(excluded), excluded);
  }
  assert.deepEqual(ids(foremanRunTimeline), ["requested", "approval-required", "granted", "allocating", "running", "checkpointed", "completed", "cleaned"]);
  assert.deepEqual(ids(foremanRecoveryStates), ["host-unavailable", "partial", "failed", "cancelled", "orphaned"]);
});

test("the architecture separates client, gateway, application, Fabric, control plane, and data plane", () => {
  assert.deepEqual(ids(foremanArchitectureLayers), ["client", "mcp-gateway", "foreman", "fabric", "browser-control", "execution-data"]);
  const gateway = foremanArchitectureLayers.find((layer) => layer.id === "mcp-gateway");
  const app = foremanArchitectureLayers.find((layer) => layer.id === "foreman");
  const control = foremanArchitectureLayers.find((layer) => layer.id === "browser-control");
  const data = foremanArchitectureLayers.find((layer) => layer.id === "execution-data");
  assert.match(gateway.mustNotOwn, /projects, buildouts, durable Work/i);
  assert.match(app.owns, /product operations, projects, buildouts/i);
  assert.match(control.owns, /human consent/i);
  assert.match(data.owns, /isolated workspace materialisation/i);
  assert.match(control.mustNotOwn, /sandbox execution/i);
  assert.match(data.mustNotOwn, /MCP credentials|browser cookies/i);
});

test("the catalogue route and static laboratory expose the architecture truthfully", async () => {
  const [manifest, page, css, markdown, model] = await Promise.all([
    read("src/v2/catalogue-manifest.js"),
    read("src/pages/v2/applications/foreman/tools.astro"),
    read("src/v2/foreman-tools.css"),
    read("FOREMAN-PRODUCT-MODEL.md"),
    read("src/foreman/product-model.js"),
  ]);
  assert.match(manifest, /id: "foreman-tools"/);
  assert.match(manifest, /path: "\/v2\/applications\/foreman\/tools\/"/);
  assert.match(manifest, /issue: 50/);
  for (const marker of [
    "data-foreman-tool-surface",
    "data-foreman-client-profiles",
    "data-foreman-control-plane",
    "data-foreman-data-plane",
    "data-foreman-lease-specimen",
    "data-foreman-execution-hosts",
    "data-foreman-run-timeline",
    "data-foreman-trust-laws",
    "data-foreman-compact-companion",
  ]) assert.ok(page.includes(marker), marker);
  assert.match(page, /Static architecture specimen/);
  assert.match(page, /Actions unavailable in this client/);
  assert.match(page, /No token passthrough/);
  assert.doesNotMatch(page, /fetch\(|chrome\.|github\.request|new WebSocket|EventSource/i);
  assert.match(css, /@media \(max-width: 52rem\)/);
  assert.match(css, /@media \(max-width: 30rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(markdown, /## Foreman application tool surface/);
  assert.match(markdown, /greenways-ai\/greenways-os#56/);
  assert.match(markdown, /greenways-ai\/greenways-os#155/);
  assert.match(model, /FOREMAN_MODEL_VERSION = "1\.1"/);
  assert.match(model, /greenways-os#56/);
  assert.match(model, /greenways-os#155/);
});
