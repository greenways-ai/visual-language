import { foremanStateFamilies } from "./states.js";

const frozen = (value) => Object.freeze(value);
const list = (values) => frozen(values.map((value) => frozen(value)));
const fields = (normal, expanded, diagnostics) => ({
  normalFields: frozen(normal), expandedFields: frozen(expanded), diagnosticsFields: frozen(diagnostics),
});
const entity = (id, label, owner, visibility, purpose, parents, lifecycle, fieldSets) => frozen({
  id, label, pluralLabel: label === "Person" ? "People" : label === "Activity entry" ? "Activity" : `${label}s`,
  owner, visibility, purpose, parents: frozen(parents), lifecycle: frozen(lifecycle), ...fieldSets,
});

export const foremanEntityDefinitions = list([
  entity("project", "Project", "Foreman application", "primary",
    "The stable home for one software effort, its people, connections, repository links, and buildouts.", [],
    ["first-use", "active", "paused", "degraded", "completed"],
    fields(["name", "summary", "human owner", "active buildouts", "attention required", "repository link"], ["project identifier", "timestamps", "connection references", "membership"], ["storage root", "synchronisation head", "migration revision"])),
  entity("buildout", "Buildout", "Foreman application", "primary",
    "One intended project outcome spanning multiple work items, sessions, connections, approvals, and artifacts.", ["project"],
    foremanStateFamilies.buildout,
    fields(["goal", "state", "human attention", "work progress", "sessions", "artifacts", "GitHub state"], ["identifier", "provider attribution", "causal activity", "expected evidence"], ["projection revision", "synchronisation state", "transition errors"])),
  entity("work-item", "Work item", "Foreman application", "primary",
    "A bounded unit of work with dependencies, an owner, expected output, and explicit completion evidence.", ["buildout"],
    foremanStateFamilies.workItem,
    fields(["title", "state", "owner", "dependencies", "expected output", "next action"], ["identifier", "session and run references", "handoffs", "artifact ancestry"], ["checkpoints", "retry history", "normalised errors"])),
  entity("person", "Person", "Human actor", "primary",
    "A human actor who owns projects, operates sessions, and makes consequential decisions.", [], ["active", "paused"],
    fields(["name", "project role", "attention assigned", "available actions"], ["person reference", "devices", "standing permissions"], ["identity revision", "recovery status", "authority evaluation"])),
  entity("agent", "Agent", "Person or project", "primary",
    "A named bounded profile with a mandate; it is not a provider account or a live session.", ["person", "project"], ["active", "paused", "degraded"],
    fields(["name", "purpose", "project scope", "current sessions", "attention required"], ["agent reference", "mandate summary", "allowed connection classes", "expiry"], ["policy revision", "authority trace", "revocation record"])),
  entity("provider", "Provider", "External service or local tool", "expanded",
    "The external product or tool behind a connection, shown only when attribution or diagnosis requires it.", [], ["active", "degraded", "disconnected"],
    fields(["provider name"], ["provider name", "surface type", "native account reference"], ["adapter revision", "advertised capabilities", "last error"])),
  entity("connection", "Connection", "Person or project", "primary",
    "A configured relationship to a provider or tool, including login and observed availability without implying authority.", ["provider"], foremanStateFamilies.connection,
    fields(["name", "state", "last observed", "affected work", "safe action"], ["provider", "account or tool reference", "advertised capabilities", "scope"], ["adapter", "transport", "retry state", "raw provider error"])),
  entity("session", "Session", "Person or agent on one connection", "primary",
    "One live or resumable working context on a specific surface; sessions never merge across providers.", ["agent", "connection", "buildout"], foremanStateFamilies.session,
    fields(["name", "person or agent", "connection", "state", "current work item", "last activity"], ["session identifier", "surface", "native conversation or process reference", "available actions"], ["client instance", "heartbeat", "adapter state", "reconnect log"])),
  entity("run", "Run", "Foreman application", "contextual",
    "One attempt to progress a work item inside one session, with checkpoints and attributable output.", ["work-item", "session"], ["queued", "running", "completed", "failed", "cancelled", "timed-out"],
    fields(["attempt", "state", "session", "started time", "output summary"], ["run identifier", "checkpoint chain", "causal message", "resources"], ["executor reference", "retry generation", "normalised error"])),
  entity("approval", "Approval", "Person", "primary",
    "One exact human decision covering a consequential request, its scope, expiry, and visible consequences.", ["project", "buildout", "work-item"], foremanStateFamilies.approval,
    fields(["request", "requesting actor", "scope", "consequence", "expiry", "decision"], ["approval identifier", "standing permission", "linked handoff or effect"], ["authority evaluation", "policy revision", "decision record"])),
  entity("handoff", "Handoff", "Foreman application", "contextual",
    "A durable bounded request from one attributable session to another, with a distinct return path.", ["buildout", "work-item", "session", "agent"], foremanStateFamilies.handoff,
    fields(["purpose", "origin", "target", "state", "expected deliverable", "attention required"], ["correlation identifier", "included context", "requested capabilities", "deadline", "artifacts"], ["idempotency key", "delivery attempts", "transport observations", "collision record"])),
  entity("artifact", "Artifact", "Producing work or external authority", "contextual",
    "A referenced output with exact ancestry, producer, and availability state.", ["work-item", "run", "handoff"], foremanStateFamilies.artifact,
    fields(["name", "type", "producer", "state", "open or download action"], ["identifier", "source ancestry", "external reference", "digest"], ["storage locator", "media metadata", "validation failure"])),
  entity("github-projection", "GitHub record", "GitHub", "contextual",
    "A rebuildable Foreman view of an exact GitHub issue, branch, commit, pull request, review, or check.", ["project", "buildout", "work-item"], foremanStateFamilies.externalEffect,
    fields(["record type", "number or revision", "state", "canonical link", "last verified"], ["repository", "owner", "head and base", "commit SHA", "observation evidence"], ["request arguments", "idempotency key", "provider response", "read-back record"])),
  entity("activity-entry", "Activity entry", "Observed actor or authority", "primary",
    "An attributable event linking the actor, affected object, causal predecessor, and evidence.", ["project", "buildout"], ["active", "waiting-for-approval", "completed", "failed", "cancelled"],
    fields(["time", "actor", "plain-language event", "affected object", "evidence link"], ["identifier", "causal predecessor", "source surface", "external reference"], ["event type", "projection revision", "raw source reference"])),
]);

export const foremanRelationships = list([
  ["project", "buildout", "one-to-many", "A buildout belongs to one project outcome context."],
  ["buildout", "work-item", "one-to-many", "Work items retain explicit dependencies and completion evidence."],
  ["buildout", "session", "many-to-many", "One buildout may span several sessions and providers; sessions remain distinct."],
  ["person", "agent", "one-to-many", "An agent is a bounded profile, not a copy of the person."],
  ["connection", "session", "one-to-many", "A connection may host several sessions without granting identical authority."],
  ["work-item", "run", "one-to-many", "Retries and resumptions create attributable attempts rather than overwrite history."],
  ["handoff", "session", "two-ended", "Origin and target sessions are separately identified and never collapsed."],
  ["approval", "handoff", "optional-one-to-many", "Approval covers only exact requested scope and does not imply completion."],
  ["approval", "github-projection", "optional-one-to-many", "External mutation permission is distinct from general code or agent access."],
  ["run", "artifact", "one-to-many", "Artifacts preserve producer and ancestry."],
  ["github-projection", "activity-entry", "one-to-many", "Verified external state requires authoritative observation evidence."],
].map(([from, to, cardinality, rule]) => ({ from, to, cardinality, rule })));
