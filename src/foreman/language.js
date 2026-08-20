const frozen = (value) => Object.freeze(value);
const list = (values) => frozen(values.map((value) => frozen(value)));

export const foremanForbiddenPrimaryTerms = frozen([
  "Hoplite", "Historia", "Tahto", "Hestia", "Hodos", "Ignatius", "daemon", "keychain", "kernel",
]);

export const foremanPrimaryNavigation = list([
  ["overview", "Overview", "/foreman/", "Human attention, active work, and recent verified movement."],
  ["projects", "Projects", "/foreman/projects/", "Choose the software effort and its exact external links."],
  ["buildouts", "Buildouts", "/foreman/buildouts/", "Follow one outcome across work items, sessions, and providers."],
  ["work-items", "Work items", "/foreman/work-items/", "Inspect bounded tasks, dependencies, owners, and expected outputs."],
  ["sessions", "Sessions", "/foreman/sessions/", "See working contexts without conflating them with agents."],
  ["people-agents", "People and agents", "/foreman/people-agents/", "Understand human responsibility and bounded agent profiles."],
  ["connections", "Connections", "/foreman/connections/", "See provider and tool availability without implied authority."],
  ["approvals", "Approvals", "/foreman/approvals/", "Review consequential requests and their exact consequences."],
  ["activity", "Activity", "/foreman/activity/", "Read attributable events, evidence, and verified external outcomes."],
].map(([id, label, route, purpose]) => ({ id, label, route, purpose })));

export const foremanCoreJourney = list([
  [1, "Choose project", "/foreman/projects/", "The exact project and repository context are visible."],
  [2, "Inspect buildout", "/foreman/buildouts/:buildoutId/", "Goal, work, sessions, attention, and evidence share one view."],
  [3, "Open work or session", "/foreman/work-items/:workItemId/", "The bounded task and live context remain distinct."],
  [4, "Approve or hand off", "/foreman/approvals/", "Consequential scope and human intervention are explicit."],
  [5, "Inspect activity and evidence", "/foreman/activity/", "Claims link to artifacts or authoritative external observation."],
].map(([step, label, route, outcome]) => ({ step, label, route, outcome })));

export const foremanDetailLayers = list([
  {
    id: "normal", label: "Normal UI",
    purpose: "Help a person choose work, understand attention, and take the next safe action.",
    includes: ["plain-language state", "owner", "next action", "human attention", "adjacent evidence"],
    excludes: ["transport", "storage roots", "policy traces", "raw provider errors"],
  },
  {
    id: "expanded", label: "Expanded details",
    purpose: "Support attribution and precise inspection without dominating the task view.",
    includes: ["provider name", "session and correlation identifiers", "timestamps", "canonical URLs", "artifact ancestry", "requested versus actual state"],
    excludes: ["credentials", "private unrelated context", "native handles"],
  },
  {
    id: "diagnostics", label: "Diagnostics",
    purpose: "Explain adapters, storage, synchronisation, retries, policy evaluation, and low-level failure.",
    includes: ["adapter revision", "transport", "retry generation", "raw normalised error", "authority trace"],
    excludes: ["credentials", "secret material", "unredacted private content"],
  },
]);
