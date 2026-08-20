import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  FOREMAN_MODEL_VERSION,
  foremanCoreJourney,
  foremanDetailLayers,
  foremanEntityDefinitions,
  foremanExperienceStates,
  foremanForbiddenPrimaryTerms,
  foremanPrimaryNavigation,
  foremanRelationships,
  foremanRouteInventory,
  foremanSourceMappings,
  foremanStateFamilies,
  foremanTruthfulnessRules,
} from "../src/foreman/product-model.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const ids = (items) => items.map((item) => item.id);

const entityIds = ["project", "buildout", "work-item", "person", "agent", "provider", "connection", "session", "run", "approval", "handoff", "artifact", "github-projection", "activity-entry"];
const experienceIds = ["first-use", "active", "paused", "waiting-for-approval", "degraded", "disconnected", "completed", "failed", "cancelled"];
const navIds = ["overview", "projects", "buildouts", "work-items", "sessions", "people-agents", "connections", "approvals", "activity"];

test("Foreman defines one closed, versioned entity model", () => {
  assert.equal(FOREMAN_MODEL_VERSION, "1.1");
  assert.deepEqual(ids(foremanEntityDefinitions), entityIds);
  assert.equal(new Set(ids(foremanEntityDefinitions)).size, entityIds.length);
  for (const entity of foremanEntityDefinitions) {
    for (const field of ["label", "owner", "visibility", "purpose"]) assert.ok(entity[field], `${entity.id}.${field}`);
    for (const field of ["lifecycle", "normalFields", "expandedFields", "diagnosticsFields"]) assert.ok(entity[field].length, `${entity.id}.${field}`);
  }
});

test("primary navigation uses Foreman language", () => {
  assert.deepEqual(ids(foremanPrimaryNavigation), navIds);
  const copy = foremanPrimaryNavigation.flatMap((item) => [item.label, item.purpose]).join("\n");
  for (const term of [...foremanForbiddenPrimaryTerms, "Today", "Workrooms", "Studio", "Campaigns", "Packages", "Keyring", "Receipts"]) {
    assert.doesNotMatch(copy, new RegExp(`\\b${term}\\b`, "i"), term);
  }
  for (const item of foremanPrimaryNavigation) assert.match(item.route, /^\/foreman\//);
});

test("all required high-level states have evidence", () => {
  assert.deepEqual(ids(foremanExperienceStates), experienceIds);
  for (const state of foremanExperienceStates) assert.ok(state.meaning && state.evidence, state.id);
});

test("buildouts span distinct sessions and identities", () => {
  const find = (id) => foremanEntityDefinitions.find((entity) => entity.id === id);
  const relation = foremanRelationships.find((item) => item.from === "buildout" && item.to === "session");
  assert.match(find("buildout").purpose, /multiple work items, sessions, connections/i);
  assert.match(find("session").purpose, /never merge across providers/i);
  assert.match(find("agent").purpose, /not a provider account or a live session/i);
  assert.equal(relation.cardinality, "many-to-many");
  assert.match(relation.rule, /sessions remain distinct/i);
});

test("handoff and external-effect lifecycles preserve actual state", () => {
  for (const state of ["requested", "waiting-for-approval", "authorised", "queued", "accepted", "running", "returning", "completed", "denied", "expired", "cancelled", "disconnected", "partial", "failed"]) assert.ok(foremanStateFamilies.handoff.includes(state), state);
  for (const state of ["requested", "submitted", "uncertain", "verified", "failed"]) assert.ok(foremanStateFamilies.externalEffect.includes(state), state);
  const rules = new Map(foremanTruthfulnessRules.map((rule) => [rule.id, rule.statement]));
  assert.match(rules.get("request-not-acceptance"), /not accepted/i);
  assert.match(rules.get("acceptance-not-completion"), /not completed/i);
  assert.match(rules.get("login-not-authority"), /does not imply permission/i);
  assert.match(rules.get("read-back-required"), /canonical read-back/i);
  assert.match(rules.get("partial-remains-partial"), /cannot be collapsed into success/i);
});

test("normal, expanded, and diagnostic layers are bounded", () => {
  assert.deepEqual(ids(foremanDetailLayers), ["normal", "expanded", "diagnostics"]);
  const [normal, expanded, diagnostics] = foremanDetailLayers;
  assert.ok(normal.includes.includes("adjacent evidence"));
  assert.ok(normal.excludes.includes("transport"));
  assert.ok(expanded.includes.includes("requested versus actual state"));
  assert.ok(expanded.excludes.includes("credentials"));
  assert.ok(diagnostics.includes.includes("authority trace"));
  assert.ok(diagnostics.excludes.includes("secret material"));
});

test("desktop, browser companion, and CLI own distinct routes", () => {
  assert.deepEqual(Object.keys(foremanRouteInventory), ["desktop", "browserCompanion", "cli"]);
  const desktop = ids(foremanRouteInventory.desktop);
  for (const id of ["projects", "buildouts", "people-agents", "connections", "approvals", "activity", "diagnostics"]) assert.ok(desktop.includes(id), id);
  assert.deepEqual(ids(foremanRouteInventory.browserCompanion), ["current-context", "handoff", "approval", "activity"]);
  assert.deepEqual(ids(foremanRouteInventory.cli), ["status", "project", "buildout", "session", "handoff", "approval", "activity"]);
  for (const route of foremanRouteInventory.desktop) assert.match(route.pattern, /^\/foreman\//);
  for (const route of foremanRouteInventory.browserCompanion) assert.match(route.pattern, /^\/companion\//);
  for (const route of foremanRouteInventory.cli) assert.match(route.pattern, /^foreman /);
});

test("the primary journey does not skip intervention or evidence", () => {
  assert.deepEqual(foremanCoreJourney.map((item) => item.step), [1, 2, 3, 4, 5]);
  assert.deepEqual(foremanCoreJourney.map((item) => item.label), ["Choose project", "Inspect buildout", "Open work or session", "Approve or hand off", "Inspect activity and evidence"]);
  assert.match(foremanCoreJourney.at(-1).outcome, /authoritative external observation/i);
});

test("source ownership maps to Foreman, MCP, and sandbox runtime issues", () => {
  assert.deepEqual(foremanSourceMappings.map((item) => item.source), ["greenways-os#146", "greenways-os#147", "greenways-os#148", "greenways-os#149", "greenways-os#56", "greenways-os#155"]);
  assert.ok(foremanSourceMappings[1].owns.includes("durable handoff lifecycle"));
  assert.ok(foremanSourceMappings[2].owns.includes("canonical read-back"));
  assert.ok(foremanSourceMappings[3].owns.includes("restart recovery"));
  assert.ok(foremanSourceMappings[4].owns.includes("application-scoped MCP discovery"));
  assert.ok(foremanSourceMappings[5].owns.includes("sandbox leases"));
});

test("documentation and low-fidelity route expose the executable contract", async () => {
  const [markdown, page] = await Promise.all([read("FOREMAN-PRODUCT-MODEL.md"), read("src/pages/v2/applications/foreman/model.astro")]);
  for (const source of ["greenways-ai/greenways-os#49", "greenways-ai/greenways-os#146", "greenways-ai/greenways-os#147", "greenways-ai/greenways-os#148", "greenways-ai/greenways-os#149", "greenways-ai/greenways-os#56", "greenways-ai/greenways-os#155"]) assert.ok(markdown.includes(source), source);
  for (const heading of ["Product proposition", "Product laws", "Primary navigation", "Required experience states", "Truthfulness contract", "Detail layers", "Delivery surfaces", "Foreman application tool surface", "MCP and host architecture", "Execution hosts and sandbox leases", "Source mapping"]) assert.ok(markdown.includes(`## ${heading}`), heading);
  assert.match(page, /\.\.\/\.\.\/\.\.\/\.\.\/foreman\/product-model\.js/);
  assert.match(page, /\.\.\/\.\.\/\.\.\/\.\.\/v2\/document\.css/);
  for (const marker of ["data-foreman-model-version", "data-foreman-primary-navigation", "data-foreman-core-journey", "data-foreman-entities", "data-foreman-experience-states", "data-foreman-truthfulness", "data-foreman-relationships", "data-foreman-detail-layers", "data-foreman-surface-inventory"]) assert.ok(page.includes(marker), marker);
  assert.match(page, /@media\(max-width:36rem\)/);
  assert.match(page, /@media\(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(page, /data-foreman-runtime|fetch\(|chrome\.|github\.request/i);
});
