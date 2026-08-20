// @ts-check

import { foremanExperienceStates, foremanStateFamilies } from "./states.js";

/** @typedef {{ id: string, label: string, kind: string, detail: string }} ForemanActor */
/** @typedef {{ label: string, number: number, url: string }} ForemanIssue */
/** @typedef {{ completed: number, total: number, label: string }} ForemanProgress */
/** @typedef {{ id: string, label: string, provider: string, surface: string, desiredState: string, actualState: string, state: string, observedAt: string, authority: string }} ForemanConnection */
/** @typedef {{ id: string, label: string, state: string, stateLabel: string, owner: ForemanActor, expectedOutput: string, evidence: string, nextAction: string }} ForemanWorkItem */
/** @typedef {{ id: string, label: string, provider: string, surface: string, agent: ForemanActor, connectionId: string, state: string, desiredState: string, actualState: string, currentWorkItem: string, lastActivity: string, evidence: string }} ForemanSession */
/** @typedef {{ id: string, label: string, state: string, requestingActor: ForemanActor, decisionOwner: ForemanActor, scope: string, consequence: string, excludes: string, expiresAt: string }} ForemanApproval */
/** @typedef {{ id: string, label: string, type: string, producer: ForemanActor, state: string, ancestry: string, evidence: string }} ForemanArtifact */
/** @typedef {{ issue: ForemanIssue, requestedEffect: string, actualState: string, verification: string, state: string }} ForemanGitHubProjection */
/** @typedef {{ id: string, time: string, actor: ForemanActor, state: string, event: string, affectedObject: string, evidence: string }} ForemanActivity */
/**
 * @typedef {object} ForemanBuildout
 * @property {string} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {string} goal
 * @property {string} state
 * @property {string} stateLabel
 * @property {ForemanProgress} progress
 * @property {string} currentStep
 * @property {string | null} attention
 * @property {string} updatedAt
 * @property {readonly string[]} providers
 * @property {ForemanIssue | null} issue
 * @property {readonly ForemanWorkItem[]} workItems
 * @property {readonly ForemanSession[]} sessions
 * @property {readonly ForemanApproval[]} approvals
 * @property {readonly ForemanArtifact[]} artifacts
 * @property {ForemanGitHubProjection | null} github
 * @property {readonly ForemanActivity[]} activity
 */
/**
 * @typedef {object} ForemanProject
 * @property {string} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {string} summary
 * @property {string} state
 * @property {ForemanActor} owner
 * @property {{ label: string, url: string }} repository
 * @property {string} issueTracker
 * @property {string} updatedAt
 * @property {number} attentionCount
 * @property {number} activeCount
 * @property {number} completedCount
 * @property {readonly ForemanBuildout[]} buildouts
 * @property {readonly ForemanConnection[]} connections
 */
/** @typedef {{ id: string, label: string, meaning: string, evidence: string }} ForemanStateSpecimen */


/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
};

export const FOREMAN_PROJECT_LAB_VERSION = "1.0";
export const FOREMAN_SELECTED_PROJECT_ID = "greenways-visual-language";
export const FOREMAN_SELECTED_BUILDOUT_ID = "foreman-project-workbench";

/** @param {number} number @param {string} label @returns {Readonly<ForemanIssue>} */
const issue = (number, label) => deepFreeze({
  label,
  number,
  url: `https://github.com/greenways-ai/visual-language/issues/${number}`,
});

/** @param {string} id @param {string} label @param {string} kind @param {string} detail @returns {Readonly<ForemanActor>} */
const actor = (id, label, kind, detail) => deepFreeze({ id, label, kind, detail });

export const foremanActors = deepFreeze({
  chris: actor("person-chris", "Chris", "person", "Project owner and final authority"),
  builder: actor("agent-builder", "Builder", "agent", "Bounded implementation agent for issue-scoped work"),
  reviewer: actor("agent-reviewer", "Reviewer", "agent", "Checks evidence and release boundaries"),
  github: actor("authority-github", "GitHub", "external authority", "Canonical issue, branch, pull-request, and check state"),
});

/** @type {readonly ForemanConnection[]} */
const connections = deepFreeze([
  {
    id: "connection-kimi-cli",
    label: "Kimi CLI",
    provider: "Kimi CLI",
    surface: "Local terminal",
    desiredState: "active",
    actualState: "ready",
    state: "ready",
    observedAt: "2026-08-21T07:26:00+10:00",
    authority: "May prepare project-scoped code. External writes remain separately approved.",
  },
  {
    id: "connection-chatgpt-web",
    label: "ChatGPT Web",
    provider: "ChatGPT Web",
    surface: "Browser session",
    desiredState: "available",
    actualState: "idle",
    state: "ready",
    observedAt: "2026-08-21T07:24:00+10:00",
    authority: "May review supplied context. No repository authority is implied.",
  },
  {
    id: "connection-github",
    label: "GitHub repository",
    provider: "GitHub",
    surface: "Repository",
    desiredState: "ready",
    actualState: "ready",
    state: "ready",
    observedAt: "2026-08-21T07:27:00+10:00",
    authority: "Issue and pull-request state may be read. Mutations require exact approval and canonical read-back.",
  },
]);

/** @type {Readonly<ForemanBuildout>} */
const selectedBuildout = deepFreeze({
  id: FOREMAN_SELECTED_BUILDOUT_ID,
  label: "Foreman project workbench",
  shortLabel: "Project workbench",
  goal: "Ship the first high-fidelity Foreman project, buildout board, and selected-buildout workbench without inventing runtime behaviour.",
  state: "active",
  stateLabel: "Active",
  progress: { completed: 3, total: 7, label: "3 of 7 work items have adjacent evidence" },
  currentStep: "Compose the selected-buildout workbench and responsive inspector.",
  attention: "Review the exact publication scope before a branch or pull request is represented as external state.",
  updatedAt: "2026-08-21T07:27:00+10:00",
  providers: ["Kimi CLI", "ChatGPT Web", "GitHub"],
  issue: issue(36, "Project and buildout workbench laboratory"),
  workItems: [
    {
      id: "work-item-domain-fixture",
      label: "Create attributable specimen data",
      state: "completed",
      stateLabel: "Completed",
      owner: foremanActors.builder,
      expectedOutput: "Frozen project, buildout, work-item, session, approval, artifact, and activity records.",
      evidence: "Fixture contract exposes distinct identities and state families.",
      nextAction: "Inspect the generated views.",
    },
    {
      id: "work-item-project-index",
      label: "Design the project index",
      state: "completed",
      stateLabel: "Completed",
      owner: foremanActors.builder,
      expectedOutput: "A project chooser with active work, attention, repository context, and recent movement.",
      evidence: "The project route identifies owner, active buildouts, attention, and repository before navigation.",
      nextAction: "Review narrow-screen hierarchy.",
    },
    {
      id: "work-item-buildout-board",
      label: "Design the buildout board",
      state: "active",
      stateLabel: "Active",
      owner: foremanActors.builder,
      expectedOutput: "Lifecycle columns with provider and session attribution and no colour-only state.",
      evidence: "Current specimen shows active, waiting, degraded, failed, cancelled, and completed work.",
      nextAction: "Finish responsive collapse.",
    },
    {
      id: "work-item-selected-workbench",
      label: "Compose selected-buildout workbench",
      state: "active",
      stateLabel: "Active",
      owner: foremanActors.builder,
      expectedOutput: "One view containing goal, work, sessions, approvals, artifacts, GitHub projection, activity, and inspector.",
      evidence: "The workbench uses shared v2 workbench regions and semantic tokens.",
      nextAction: "Review evidence adjacency.",
    },
    {
      id: "work-item-responsive-audit",
      label: "Audit compact layouts",
      state: "blocked",
      stateLabel: "Blocked",
      owner: foremanActors.reviewer,
      expectedOutput: "Keyboard and 1120, 820, 640, 390, and 320 pixel review evidence.",
      evidence: "Structural rules are present; screenshot evidence is not represented in this static fixture.",
      nextAction: "Run the final screenshot review.",
    },
    {
      id: "work-item-publication",
      label: "Publish the implementation branch",
      state: "waiting-for-approval",
      stateLabel: "Waiting for approval",
      owner: foremanActors.chris,
      expectedOutput: "One exact branch and one draft pull request for issue #36.",
      evidence: "No external mutation is claimed by this specimen.",
      nextAction: "Review the approval scope.",
    },
    {
      id: "work-item-close-issue",
      label: "Close issue after verified merge",
      state: "proposed",
      stateLabel: "Proposed",
      owner: foremanActors.reviewer,
      expectedOutput: "Issue #36 closed only after merged code and validation are read back from GitHub.",
      evidence: "Issue remains open in the specimen.",
      nextAction: "Wait for merge evidence.",
    },
  ],
  sessions: [
    {
      id: "session-kimi-foreman-36",
      label: "Kimi CLI · Foreman #36",
      provider: "Kimi CLI",
      surface: "Local terminal",
      agent: foremanActors.builder,
      connectionId: "connection-kimi-cli",
      state: "active",
      desiredState: "active",
      actualState: "active",
      currentWorkItem: "Compose selected-buildout workbench",
      lastActivity: "2026-08-21T07:27:00+10:00",
      evidence: "Specimen heartbeat only; no live process is connected from this page.",
    },
    {
      id: "session-chatgpt-review-36",
      label: "ChatGPT Web · design review",
      provider: "ChatGPT Web",
      surface: "Browser session",
      agent: foremanActors.reviewer,
      connectionId: "connection-chatgpt-web",
      state: "idle",
      desiredState: "available",
      actualState: "idle",
      currentWorkItem: "Review evidence adjacency",
      lastActivity: "2026-08-21T07:18:00+10:00",
      evidence: "The session is separately identified and is not merged with the CLI context.",
    },
    {
      id: "session-github-projection-36",
      label: "GitHub · issue projection",
      provider: "GitHub",
      surface: "Repository",
      agent: foremanActors.github,
      connectionId: "connection-github",
      state: "available",
      desiredState: "ready",
      actualState: "ready",
      currentWorkItem: "Observe issue #36",
      lastActivity: "2026-08-21T07:27:00+10:00",
      evidence: "Only the issue URL is represented as authoritative external state.",
    },
  ],
  approvals: [
    {
      id: "approval-publish-foreman-36",
      label: "Publish one issue-scoped branch",
      state: "pending",
      requestingActor: foremanActors.builder,
      decisionOwner: foremanActors.chris,
      scope: "Write one branch for issue #36 and open one draft pull request targeting main.",
      consequence: "Repository collaborators can inspect the proposed Foreman screens and tests.",
      excludes: "Merge, release, deployment, credential changes, and unrelated repository writes.",
      expiresAt: "2026-08-21T18:00:00+10:00",
    },
  ],
  artifacts: [
    {
      id: "artifact-project-fixture",
      label: "Project laboratory fixture",
      type: "JavaScript contract",
      producer: foremanActors.builder,
      state: "available",
      ancestry: "Issue #36 → fixture model",
      evidence: "Static source artifact; not a runtime record.",
    },
    {
      id: "artifact-workbench-route",
      label: "Selected buildout route",
      type: "Astro page",
      producer: foremanActors.builder,
      state: "producing",
      ancestry: "Issue #36 → workbench composition",
      evidence: "Available only after the branch source is inspected.",
    },
    {
      id: "artifact-responsive-review",
      label: "Responsive screenshot set",
      type: "Review evidence",
      producer: foremanActors.reviewer,
      state: "expected",
      ancestry: "Issue #36 → final validation",
      evidence: "Not yet represented as completed evidence.",
    },
  ],
  github: {
    issue: issue(36, "Project and buildout workbench laboratory"),
    requestedEffect: "Publish an issue-scoped branch and draft pull request",
    actualState: "Issue observed; no publication result is asserted by the specimen",
    verification: "Canonical branch and pull-request read-back is required before showing verified publication.",
    state: "waiting-for-approval",
  },
  activity: [
    {
      id: "activity-fixture-composed",
      time: "2026-08-21T07:12:00+10:00",
      actor: foremanActors.builder,
      state: "completed",
      event: "Composed distinct project, buildout, session, approval, artifact, and activity records.",
      affectedObject: "Foreman project workbench",
      evidence: "Fixture contract",
    },
    {
      id: "activity-shared-contract-reviewed",
      time: "2026-08-21T07:18:00+10:00",
      actor: foremanActors.reviewer,
      state: "completed",
      event: "Confirmed the design consumes shared v2 tokens and workbench regions.",
      affectedObject: "Visual contract",
      evidence: "Component and workflow catalogue",
    },
    {
      id: "activity-workbench-active",
      time: "2026-08-21T07:27:00+10:00",
      actor: foremanActors.builder,
      state: "active",
      event: "Continued the selected-buildout composition and compact inspector layout.",
      affectedObject: "Selected buildout route",
      evidence: "Current specimen source",
    },
    {
      id: "activity-publication-waiting",
      time: "2026-08-21T07:27:00+10:00",
      actor: foremanActors.chris,
      state: "waiting-for-approval",
      event: "Publication remains a separate human decision with an exact scope.",
      affectedObject: "GitHub publication request",
      evidence: "Pending approval record",
    },
  ],
});

/**
 * @param {string} id
 * @param {string} label
 * @param {string} goal
 * @param {string} state
 * @param {string} stateLabel
 * @param {readonly string[]} providers
 * @param {string} evidence
 * @param {string | null} [attention]
 * @returns {Readonly<ForemanBuildout>}
 */
const buildout = (id, label, goal, state, stateLabel, providers, evidence, attention = null) => deepFreeze({
  id,
  label,
  shortLabel: label,
  goal,
  state,
  stateLabel,
  providers,
  evidence,
  attention,
  updatedAt: "2026-08-21T07:20:00+10:00",
  progress: { completed: state === "completed" ? 4 : 1, total: 4, label: state === "completed" ? "4 of 4 evidenced" : "1 of 4 evidenced" },
  currentStep: attention || evidence,
  issue: null,
  workItems: [],
  sessions: [],
  approvals: [],
  artifacts: [],
  github: null,
  activity: [],
});

/** @type {readonly ForemanBuildout[]} */
const visualLanguageBuildouts = deepFreeze([
  selectedBuildout,
  buildout(
    "catalogue-evidence",
    "Catalogue evidence specimens",
    "Add truthful status, approval, activity, and receipt specimens to the shared component catalogue.",
    "completed",
    "Completed",
    ["GitHub"],
    "Pull request #49 was merged and read back from GitHub.",
  ),
  buildout(
    "neutral-interface-atlas",
    "Neutral interface atlas",
    "Align Greenways OS host surfaces with neutral v2 structural colour roles.",
    "completed",
    "Completed",
    ["GitHub"],
    "Pull request #47 was merged with successful repository validation.",
  ),
  buildout(
    "responsive-catalogue-review",
    "Responsive catalogue review",
    "Capture light and dark evidence across desktop, tablet, phone, and 320 pixel layouts.",
    "degraded",
    "Degraded",
    ["Local browser"],
    "Desktop and tablet structure is represented; the final 320 pixel capture is still missing.",
    "Complete the compact screenshot review.",
  ),
  buildout(
    "authorised-handoff-study",
    "Authorised handoff study",
    "Design the bounded cross-provider handoff flow tracked by issue #37.",
    "waiting-for-approval",
    "Waiting for approval",
    ["Kimi CLI", "ChatGPT Web"],
    "The route is planned and no transport or authority has been granted.",
    "Review the exact context and capability request.",
  ),
  buildout(
    "legacy-taxonomy-import",
    "Legacy taxonomy import",
    "Import superseded Greenways OS navigation directly into Foreman.",
    "failed",
    "Failed",
    ["Local terminal"],
    "The approach failed product-language review and retained no external side effect.",
    "Use the approved Foreman project model instead.",
  ),
  buildout(
    "duplicate-component-library",
    "Duplicate component library",
    "Create a second component taxonomy after the shared catalogue had already merged.",
    "cancelled",
    "Cancelled",
    ["GitHub"],
    "The duplicate branch was cancelled in favour of the authoritative merged catalogue.",
  ),
]);

/** @type {readonly ForemanProject[]} */
export const foremanProjects = deepFreeze([
  {
    id: FOREMAN_SELECTED_PROJECT_ID,
    label: "Greenways Visual Language",
    shortLabel: "Visual Language",
    summary: "The shared identity, component, workflow-state, and product laboratory for Greenways interfaces.",
    state: "active",
    owner: foremanActors.chris,
    repository: {
      label: "greenways-ai/visual-language",
      url: "https://github.com/greenways-ai/visual-language",
    },
    issueTracker: "GitHub issues",
    updatedAt: "2026-08-21T07:27:00+10:00",
    attentionCount: 3,
    activeCount: visualLanguageBuildouts.filter((entry) => entry.state === "active").length,
    completedCount: visualLanguageBuildouts.filter((entry) => entry.state === "completed").length,
    buildouts: visualLanguageBuildouts,
    connections,
  },
  {
    id: "greenways-desktop",
    label: "Greenways Desktop",
    shortLabel: "Desktop",
    summary: "The user-facing desktop and browser workspace for projects, publishing, and agent work.",
    state: "active",
    owner: foremanActors.chris,
    repository: {
      label: "greenways-ai/greenways-os",
      url: "https://github.com/greenways-ai/greenways-os",
    },
    issueTracker: "GitHub issues",
    updatedAt: "2026-08-21T06:54:00+10:00",
    attentionCount: 1,
    activeCount: 2,
    completedCount: 5,
    connections: connections.slice(0, 2),
    buildouts: deepFreeze([
      buildout("desktop-control-repl", "Desktop control REPL", "Expose supported desktop commands through an isolated developer workflow.", "active", "Active", ["Local terminal", "GitHub"], "Implementation work is active; no release claim is represented."),
      buildout("keyring-first-use", "Keyring first-use flow", "Make local key custody understandable without infrastructure vocabulary.", "paused", "Paused", ["Local desktop"], "Paused by the project owner pending product review."),
    ]),
  },
  {
    id: "world-authoring",
    label: "World Authoring",
    shortLabel: "Worlds",
    summary: "Tools and publishing flows for building visual worlds, books, documents, and interactive scenes.",
    state: "paused",
    owner: foremanActors.chris,
    repository: {
      label: "greenways-ai/alumbra",
      url: "https://github.com/greenways-ai/alumbra",
    },
    issueTracker: "GitHub issues",
    updatedAt: "2026-08-20T22:40:00+10:00",
    attentionCount: 0,
    activeCount: 0,
    completedCount: 2,
    connections: connections.slice(1),
    buildouts: deepFreeze([
      buildout("peacock-ballroom-mobile", "Peacock Ballroom mobile navigation", "Keep the scene legible and navigable on phone-sized screens.", "paused", "Paused", ["Local browser"], "The work is retained but deliberately paused."),
    ]),
  },
]);

/** @type {readonly ForemanStateSpecimen[]} */
export const foremanProjectStateSpecimens = deepFreeze([
  ...foremanExperienceStates,
  {
    id: "loading",
    label: "Loading",
    meaning: "The requested project view has not been observed yet.",
    evidence: "Show the named operation and last-known project context without inventing rows.",
  },
  {
    id: "empty-filtered",
    label: "No filtered results",
    meaning: "Buildouts exist, but none match the current filters.",
    evidence: "Keep active filters and the unfiltered total visible beside a reset action.",
  },
]);

export const foremanProjectStateIds = deepFreeze(foremanProjectStateSpecimens.map((entry) => entry.id));

/** @param {string} id @returns {ForemanProject | undefined} */
export function getForemanProject(id) {
  return foremanProjects.find((project) => project.id === id);
}

/** @param {string} projectId @param {string} buildoutId @returns {ForemanBuildout | undefined} */
export function getForemanBuildout(projectId, buildoutId) {
  return getForemanProject(projectId)?.buildouts.find((buildout) => buildout.id === buildoutId);
}

/** @param {string} projectId @param {string} buildoutId @param {string} [base] */
export function getForemanBuildoutHref(projectId, buildoutId, base = "") {
  const cleanBase = String(base).replace(/\/+$/, "");
  return `${cleanBase}/v2/applications/foreman/projects/${projectId}/buildouts/${buildoutId}/`;
}

export function validateForemanProjectLaboratory() {
  const projectIds = new Set(foremanProjects.map((project) => project.id));
  const buildoutIds = new Set();
  const representedBuildoutStates = new Set();

  for (const project of foremanProjects) {
    if (!project.id || !project.label || !project.repository?.url) return false;
    for (const buildoutEntry of project.buildouts) {
      const identity = `${project.id}:${buildoutEntry.id}`;
      if (buildoutIds.has(identity)) return false;
      buildoutIds.add(identity);
      representedBuildoutStates.add(buildoutEntry.state);
    }
  }

  /** @type {readonly string[]} */
  const requiredStates = foremanStateFamilies.buildout;
  return projectIds.size === foremanProjects.length
    && requiredStates.every((state) => representedBuildoutStates.has(state) || state === "planned");
}
