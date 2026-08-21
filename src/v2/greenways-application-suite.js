// @ts-check

/** @template T @param {T} value @returns {Readonly<T>} */
const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return /** @type {Readonly<T>} */ (value);
};

export const greenwaysSuiteContract = "greenways-application-suite/1";

export const greenwaysSuiteApplications = deepFreeze([
  {
    id: "spaces",
    label: "Spaces",
    code: "SP",
    verb: "understand",
    summary: "Source-backed spaces for questions, maps, evidence, findings, documents, and cited briefs.",
    path: "/v2/applications/greenways-suite/desktop/",
    compatibility: "Research is a migration alias only.",
  },
  {
    id: "flow",
    label: "Flow",
    code: "FL",
    verb: "coordinate",
    summary: "Project-centred coordination for people, agents, work, hosts, handoffs, interventions, and evidence.",
    path: "/v2/applications/greenways-suite/browser/",
    compatibility: "Build is a migration alias; Foreman is the internal engine.",
  },
]);

export const greenwaysSuiteScreens = deepFreeze([
  {
    id: "overview",
    label: "Suite overview",
    path: "/v2/applications/greenways-suite/",
    summary: "The current Spaces and Flow launcher, recents, search, attention, and subordinate system surfaces.",
    application: null,
  },
  {
    id: "desktop",
    label: "Native desktop",
    path: "/v2/applications/greenways-suite/desktop/",
    summary: "A Spaces-first native workbench with exact source identity, evidence review, briefs, and a prepared Flow handoff.",
    application: "spaces",
  },
  {
    id: "browser",
    label: "Browser workspace",
    path: "/v2/applications/greenways-suite/browser/",
    summary: "A Flow project Control Room in a full-page browser workspace with project, work, agents, hosts, and Spaces context.",
    application: "flow",
  },
  {
    id: "companion",
    label: "Browser companion",
    path: "/v2/applications/greenways-suite/companion/",
    summary: "A bounded side panel and compact launcher for capture, inspection, handoff review, activity, and opening the full application.",
    application: "spaces",
  },
  {
    id: "cli",
    label: "CLI companion",
    path: "/v2/applications/greenways-suite/cli/",
    summary: "Current Spaces and Flow commands, stable references, compatibility disclosure, and truthful unavailable states.",
    application: null,
  },
  {
    id: "handoff",
    label: "Spaces ↔ Flow handoff",
    path: "/v2/applications/greenways-suite/handoff/",
    summary: "A traceable question-to-work-to-result loop with included context, excluded authority, lifecycle, and attributable evidence.",
    application: null,
  },
]);

export const greenwaysSuiteRecentObjects = deepFreeze([
  {
    application: "spaces",
    kind: "Space",
    id: "space/open-distribution",
    label: "Open distribution",
    detail: "6 questions · 14 sources · brief review-ready",
    freshness: "Observed 4 min ago",
    authority: "Private · owner",
  },
  {
    application: "spaces",
    kind: "Source",
    id: "source/hara-application-catalogue@rev-18",
    label: "Hara application catalogue",
    detail: "Web source · 4,283 words · exact digest retained",
    freshness: "Captured 12 min ago",
    authority: "Read-only source",
  },
  {
    application: "spaces",
    kind: "Brief",
    id: "brief/open-distribution-04",
    label: "Open distribution brief 04",
    detail: "8 cited findings · 1 unsupported claim",
    freshness: "Edited 21 min ago",
    authority: "Draft · not public",
  },
  {
    application: "flow",
    kind: "Project",
    id: "flow/project/release-24",
    label: "Release 24",
    detail: "9 work items · 4 agents · 3 hosts observed",
    freshness: "Observed now",
    authority: "Project member",
  },
  {
    application: "flow",
    kind: "Work",
    id: "flow/work/claim-evidence",
    label: "Verify campaign evidence",
    detail: "Claim held by Atlas · waiting for one approval",
    freshness: "Progress observed 7 min ago",
    authority: "Coordinate only",
  },
  {
    application: "flow",
    kind: "Artifact",
    id: "flow/artifact/release-preview-04",
    label: "Release preview 04",
    detail: "Reported · not yet selected",
    freshness: "Returned 9 min ago",
    authority: "Project evidence",
  },
]);

export const greenwaysSuiteSearchResults = deepFreeze([
  {
    owner: "Spaces",
    kind: "Question",
    id: "space/open-distribution/question/portable-rights",
    label: "How do rights survive distribution?",
    freshness: "Current root",
    authority: "Private Space",
  },
  {
    owner: "Spaces",
    kind: "Finding",
    id: "space/open-distribution/finding/source-portability",
    label: "Source identity remains portable across destinations",
    freshness: "Reviewed yesterday",
    authority: "Accepted assertion",
  },
  {
    owner: "Flow",
    kind: "Project work",
    id: "flow/project/release-24/work/claim-evidence",
    label: "Verify campaign evidence",
    freshness: "Active claim",
    authority: "Project-scoped",
  },
  {
    owner: "Flow",
    kind: "Handoff",
    id: "flow/project/release-24/handoff/space-brief-04",
    label: "Open distribution brief → Release 24",
    freshness: "Approval required",
    authority: "No inherited Space membership",
  },
]);

export const greenwaysSuiteAttention = deepFreeze([
  {
    application: "spaces",
    state: "review",
    label: "One candidate relation needs evidence review",
    target: "space/open-distribution/map/source-claim-12",
    evidence: "Supporting 2 · conflicting 1 · missing 1",
  },
  {
    application: "flow",
    state: "approval",
    label: "Atlas requests bounded source-read context",
    target: "flow/project/release-24/work/claim-evidence",
    evidence: "Exact brief and citations only · expires after return",
  },
  {
    application: "flow",
    state: "stale",
    label: "One work claim has no observed progress",
    target: "flow/project/release-24/work/channel-export",
    evidence: "Claim age 47 min · host last seen 31 min ago",
  },
]);

export const greenwaysSuiteSystemSurfaces = deepFreeze([
  "Settings",
  "Connections",
  "Identity",
  "Storage",
  "Packages",
  "Activity",
  "Diagnostics",
  "Recovery",
]);

export const greenwaysSuiteHandoff = deepFreeze({
  id: "handoff/space-brief-04-to-release-24",
  source: {
    application: "Spaces",
    root: "space/open-distribution",
    record: "brief/open-distribution-04",
    question: "question/portable-rights",
  },
  target: {
    application: "Flow",
    project: "flow/project/release-24",
    work: "flow/work/claim-evidence",
    optionalGrouping: "milestone/release-candidate-04",
  },
  included: [
    "Selected cited brief revision",
    "Eight exact source anchors",
    "Question and expected deliverable",
    "Return target in the same Space",
  ],
  excluded: [
    "Other Space notes or membership",
    "Standing publish authority",
    "Host credentials or provider sessions",
    "Automatic acceptance as a reviewed finding",
  ],
  lifecycle: [
    ["prepared", "Context assembled; nothing dispatched"],
    ["approval-required", "Human review needed for bounded source read"],
    ["ready", "Approved scope and target project resolved"],
    ["accepted", "Flow accepted the work item; not completed"],
    ["creating", "Project work and claim are being reconciled"],
    ["received", "Artifact reported back; not selected"],
    ["selected", "Human selected one result for return"],
    ["completed", "Reference written back to the same Space"],
  ],
  alternatives: ["partial", "rejected", "cancelled", "incompatible", "stale", "failed"],
});

export const greenwaysSuiteUnactivatedTargets = deepFreeze([
  {
    id: "imagine",
    label: "Future target A",
    state: "unactivated",
    visibleInLauncher: false,
    reason: "No approved application activation gate.",
  },
  {
    id: "world",
    label: "Future target B",
    state: "unactivated",
    visibleInLauncher: false,
    reason: "Internal planning does not imply host support or availability.",
  },
]);

/** @param {string} id */
export function getGreenwaysSuiteScreen(id) {
  return greenwaysSuiteScreens.find((screen) => screen.id === id);
}
