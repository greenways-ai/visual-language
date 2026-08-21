// @ts-check

import {
  FOREMAN_SELECTED_BUILDOUT_ID,
  FOREMAN_SELECTED_PROJECT_ID,
} from "./projects-laboratory.js";
import {
  FOREMAN_TOOL_SURFACE_VERSION,
  foremanClientProfiles,
  foremanExecutionHosts,
  foremanRunTimeline,
  foremanToolsForProfile,
} from "./tool-surface.js";

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

/**
 * @template {{ id: string }} T
 * @param {readonly T[]} values
 * @param {string} id
 * @param {string} label
 * @returns {T}
 */
const requireById = (values, id, label) => {
  const value = values.find((entry) => entry.id === id);
  if (!value) throw new Error(`Unknown Foreman ${label}: ${id}`);
  return value;
};

const observeProfile = requireById(foremanClientProfiles, "read-only-mcp", "client profile");
const directProfile = requireById(foremanClientProfiles, "direct-foreman-host", "client profile");
const selectedHost = requireById(foremanExecutionHosts, "mac-studio", "execution host");

/** @param {string} profileId */
const toolSummary = (profileId) => foremanToolsForProfile(profileId)
  .map(({ id, name, classId }) => ({ id, name, classId }));

export const FOREMAN_PROJECT_EXECUTION_VERSION = "foreman-project-execution/1";

const clients = [
  {
    id: "client-chatgpt-review-36",
    profileId: observeProfile.id,
    profile: observeProfile,
    label: "ChatGPT Pro · design review",
    state: "connected",
    sessionId: "session-chatgpt-review-36",
    observedCapability: observeProfile.observedCapability,
    actionState: observeProfile.actionState,
    advertisedTools: toolSummary(observeProfile.id),
    truth: "This browser client may inspect the selected buildout and evidence. It cannot resume work, approve a lease, or request a GitHub mutation.",
  },
  {
    id: "client-foreman-desktop-36",
    profileId: directProfile.id,
    profile: directProfile,
    label: "Foreman Desktop · project context",
    state: "connected",
    sessionId: "session-kimi-foreman-36",
    observedCapability: directProfile.observedCapability,
    actionState: directProfile.actionState,
    advertisedTools: toolSummary(directProfile.id),
    truth: "Application operations remain gated by the selected Fabric authority, exact approval, lease scope, and external-effect read-back.",
  },
];

const hostAdvertisements = [
  {
    id: "host-advertisement-mac-studio-044",
    hostId: selectedHost.id,
    label: selectedHost.label,
    summary: selectedHost.summary,
    state: selectedHost.state,
    observedAt: selectedHost.observedAt,
    trust: selectedHost.trust,
    capabilities: selectedHost.capabilities,
    bounds: selectedHost.bounds,
    network: selectedHost.network,
    expandedImplementation: selectedHost.expandedImplementation,
    generation: "host-gen/044",
    freshness: "fresh for the specimen lease decision",
  },
];

const requestedCapabilities = [
  "exact repository checkout",
  "apply the issue-scoped candidate patch",
  "run bounded Node, TypeScript, Astro-source, and CSS checks",
  "return checkpoint and artifact evidence",
  "clean the isolated workspace",
];

const excludedAuthority = [
  "host home directory",
  "browser cookies",
  "provider credentials",
  "SSH agent",
  "GitHub push",
  "pull-request creation",
  "merge",
  "deployment",
  "publication",
];

const approvals = [
  {
    id: "approval-execution-foreman-36",
    label: "Issue-scoped execution lease",
    state: "granted",
    projectId: FOREMAN_SELECTED_PROJECT_ID,
    buildoutId: FOREMAN_SELECTED_BUILDOUT_ID,
    workItemId: "work-item-selected-workbench",
    requestedBy: "agent-builder",
    decisionOwner: "person-chris",
    operation: "Lease the enrolled Mac Studio for one exact Foreman execution-evidence integration and validation run.",
    requestedCapabilities,
    consequence: "The exact repository revision and issue-scoped source are materialised on one enrolled execution host for a bounded run.",
    excludedAuthority,
    decidedAt: "2026-08-21T09:40:00+10:00",
    expiresAt: "2026-08-21T10:25:00+10:00",
  },
];

const leases = [
  {
    id: "lease-foreman-036-008",
    state: "released",
    projectId: FOREMAN_SELECTED_PROJECT_ID,
    buildoutId: FOREMAN_SELECTED_BUILDOUT_ID,
    workItemId: "work-item-selected-workbench",
    approvalId: "approval-execution-foreman-36",
    clientId: "client-foreman-desktop-36",
    originSessionId: "session-kimi-foreman-36",
    requestedHostId: selectedHost.id,
    actualHostAdvertisementId: "host-advertisement-mac-studio-044",
    runId: "run-foreman-036-008",
    requestedAt: "2026-08-21T09:38:00+10:00",
    grantedAt: "2026-08-21T09:41:00+10:00",
    expiresAt: "2026-08-21T10:26:00+10:00",
    releasedAt: "2026-08-21T10:08:00+10:00",
    requestedCapabilities,
    actualCapabilities: requestedCapabilities,
    excludedAuthority,
    cleanupState: "verified",
    cleanupEvidence: "The isolated workspace was removed and host generation 044 returned ready without retaining the released lease.",
  },
];

const checkpoints = [
  {
    id: "checkpoint-foreman-036-08",
    runId: "run-foreman-036-008",
    label: "Checkpoint 08",
    state: "completed",
    recordedAt: "2026-08-21T10:03:00+10:00",
    summary: "The source-owned #50 vocabulary is bound to the selected buildout; focused contract, source, and responsive checks pass.",
    artifactIds: ["artifact-foreman-execution-source", "artifact-foreman-execution-validation"],
  },
];

const artifacts = [
  {
    id: "artifact-foreman-execution-source",
    label: "Foreman execution-evidence source set",
    type: "source bundle",
    state: "retained",
    producerRunId: "run-foreman-036-008",
    digest: "specimen-sha256:9fa2…6e18",
    ancestry: "main@d9db7f7 → isolated workspace → run-foreman-036-008",
    evidence: "The fixture, workbench composition, inspector, styles, test, and adoption note are retained together.",
  },
  {
    id: "artifact-foreman-execution-validation",
    label: "Focused execution-workbench validation",
    type: "test log",
    state: "retained",
    producerRunId: "run-foreman-036-008",
    digest: "specimen-sha256:5c71…b302",
    ancestry: "run-foreman-036-008 → checkpoint-foreman-036-08",
    evidence: "The closed data contract, lane separation, external-effect truth, source integration, and responsive rules are checked.",
  },
];

const externalEffects = [
  {
    id: "effect-foreman-execution-followup",
    label: "Publish the execution-evidence follow-up",
    projectId: FOREMAN_SELECTED_PROJECT_ID,
    buildoutId: FOREMAN_SELECTED_BUILDOUT_ID,
    state: "uncertain",
    requestedAt: "2026-08-21T10:09:00+10:00",
    submittedAt: "2026-08-21T10:10:00+10:00",
    provider: "GitHub",
    providerState: "submission returned without an authoritative branch or pull-request observation",
    readBackState: "awaiting",
    canonicalUrl: null,
    canonicalRevision: null,
    idempotencyKey: "external/foreman/36/execution/01",
    truth: "The local Work run and cleanup are complete. GitHub delivery remains unverified until canonical state is read back.",
  },
  {
    id: "effect-foreman-project-workbench-63",
    label: "Baseline Foreman project workbench",
    projectId: FOREMAN_SELECTED_PROJECT_ID,
    buildoutId: FOREMAN_SELECTED_BUILDOUT_ID,
    state: "verified",
    requestedAt: "2026-08-20T23:06:33Z",
    submittedAt: "2026-08-20T23:32:58Z",
    provider: "GitHub",
    providerState: "merged",
    readBackState: "canonical",
    canonicalUrl: "https://github.com/greenways-ai/visual-language/pull/63",
    canonicalRevision: "d9db7f74fd50c229da1abfe817d63671a783564d",
    idempotencyKey: "github:pull/63",
    truth: "GitHub returned the canonical pull request, merged state, and merge revision for the baseline workbench.",
  },
];

const run = {
  id: "run-foreman-036-008",
  label: "Work run 008",
  state: "completed",
  projectId: FOREMAN_SELECTED_PROJECT_ID,
  buildoutId: FOREMAN_SELECTED_BUILDOUT_ID,
  workItemId: "work-item-selected-workbench",
  originSessionId: "session-kimi-foreman-36",
  clientId: "client-foreman-desktop-36",
  approvalId: "approval-execution-foreman-36",
  leaseId: "lease-foreman-036-008",
  requestedHostId: selectedHost.id,
  actualHostAdvertisementId: "host-advertisement-mac-studio-044",
  startedAt: "2026-08-21T09:42:00+10:00",
  completedAt: "2026-08-21T10:06:00+10:00",
  checkpointIds: checkpoints.map((entry) => entry.id),
  artifactIds: artifacts.map((entry) => entry.id),
  cleanupState: leases[0].cleanupState,
  localOutcome: "The selected buildout now consumes the #50 client, host, lease, Work-run, checkpoint, cleanup, and external-effect vocabulary inside its real workbench.",
  externalEffectId: "effect-foreman-execution-followup",
};

/** @type {Record<string, { time: string, title: string, detail: string, identity: string }>} */
const executionDetails = {
  requested: {
    time: "09:38",
    title: "Mac Studio requested for the exact work item",
    detail: "The request names the project, buildout, work item, host profile, capabilities, network policy, expiry, and idempotency boundary.",
    identity: "host request · mac-studio",
  },
  "approval-required": {
    time: "09:39",
    title: "Exact capability and exclusion scope is reviewed",
    detail: "The human decision covers the lease only; GitHub push, pull-request creation, merge, deployment, and publication remain excluded.",
    identity: "approval-execution-foreman-36",
  },
  granted: {
    time: "09:41",
    title: "Lease granted to host generation 044",
    detail: "Requested capability, actual host advertisement, granted authority, and expiry remain separately visible.",
    identity: "lease-foreman-036-008",
  },
  allocating: {
    time: "09:41",
    title: "Exact main revision is materialised",
    detail: "The selected host creates an isolated workspace from main@d9db7f7 without ambient host files or credentials.",
    identity: "host-advertisement-mac-studio-044",
  },
  running: {
    time: "09:42",
    title: "Canonical Work run 008 executes",
    detail: "The run applies the bounded source integration and performs the declared focused validation through the selected executor path.",
    identity: "run-foreman-036-008",
  },
  checkpointed: {
    time: "10:03",
    title: "Checkpoint 08 retains progress and artifacts",
    detail: "Source and validation evidence are durable without claiming external publication.",
    identity: "checkpoint-foreman-036-08",
  },
  completed: {
    time: "10:06",
    title: "Declared local result completes",
    detail: "The workbench integration and focused checks are complete inside the leased workspace.",
    identity: "run-foreman-036-008",
  },
  cleaned: {
    time: "10:08",
    title: "Workspace cleanup is verified",
    detail: "The lease is released, the workspace is removed, and host generation 044 returns ready.",
    identity: "lease-foreman-036-008",
  },
};

const executionEvents = foremanRunTimeline.map((state) => {
  const detail = executionDetails[state.id];
  if (!detail) throw new Error(`Missing execution detail for ${state.id}`);
  return {
    id: `execution-${state.id}`,
    time: detail.time,
    state: state.id,
    kind: state.label,
    title: detail.title,
    detail: detail.detail,
    identity: detail.identity,
    evidence: state.evidence,
  };
});

const laneEvents = {
  work: [
    {
      id: "work-intent",
      time: "09:35",
      state: "active",
      kind: "Work item",
      title: "Complete the #36 execution addendum",
      detail: "The merged project overview and board remain authoritative; this slice binds the missing execution vocabulary to the selected buildout.",
      identity: "work-item-selected-workbench",
      evidence: "Issue #36 · PR #63 follow-up boundary",
    },
    {
      id: "work-observe-session",
      time: "09:36",
      state: "observed",
      kind: "Provider session",
      title: "ChatGPT browser review remains Observe-only",
      detail: "The provider session, browser client, bounded agent, and current work item are adjacent but remain different identities.",
      identity: "session-chatgpt-review-36",
      evidence: "client-chatgpt-review-36 · read/fetch only",
    },
    {
      id: "work-implementation-session",
      time: "09:42",
      state: "running",
      kind: "Provider session",
      title: "Builder starts one canonical Work run",
      detail: "Kimi CLI is the origin session; the Foreman Desktop client, execution host, sandbox lease, and Work run are not collapsed into that session.",
      identity: "session-kimi-foreman-36",
      evidence: "run-foreman-036-008",
    },
    {
      id: "work-local-complete",
      time: "10:06",
      state: "completed",
      kind: "Local outcome",
      title: "Issue-scoped integration completes locally",
      detail: "Completion means the declared local result has evidence. It does not imply a branch, pull request, merge, or deployment.",
      identity: "run-foreman-036-008",
      evidence: "checkpoint-foreman-036-08 · 2 retained artifacts",
    },
  ],
  execution: executionEvents,
  external: [
    {
      id: "external-requested",
      time: "10:09",
      state: "requested",
      kind: "External-effect request",
      title: "Publish one execution-evidence follow-up",
      detail: "Repository, base, branch, expected revision, operation, permission, and idempotency key are recorded outside the Work run.",
      identity: "effect-foreman-execution-followup",
      evidence: "external/foreman/36/execution/01",
    },
    {
      id: "external-uncertain",
      time: "10:10",
      state: "uncertain",
      kind: "Provider outcome",
      title: "GitHub delivery is awaiting read-back",
      detail: "No canonical branch or pull-request observation is available, so the interface keeps the outcome uncertain.",
      identity: "GitHub provider",
      evidence: "canonical URL · absent",
    },
    {
      id: "external-verified-comparison",
      time: "09:33",
      state: "verified",
      kind: "Authoritative read-back",
      title: "Baseline PR #63 is externally verified",
      detail: "GitHub returned the canonical pull request, merged state, and merge revision d9db7f7 for the project workbench baseline.",
      identity: "github:pull/63",
      evidence: "canonical URL and 40-character revision",
    },
  ],
};

const statusLine = [
  {
    id: "local-work",
    label: "Local work",
    state: "completed",
    value: "completed",
    detail: "Run 008 has a completed checkpoint and retained source and validation artifacts.",
  },
  {
    id: "cleanup",
    label: "Cleanup",
    state: "verified",
    value: "verified",
    detail: "Lease 008 is released and host generation 044 returned ready.",
  },
  {
    id: "github-delivery",
    label: "GitHub delivery",
    state: "uncertain",
    value: "awaiting read-back",
    detail: "The current requested effect has no canonical branch or pull-request observation.",
  },
];

export const foremanProjectExecution = deepFreeze({
  meta: {
    version: FOREMAN_PROJECT_EXECUTION_VERSION,
    toolSurfaceVersion: FOREMAN_TOOL_SURFACE_VERSION,
    title: "Selected buildout execution evidence",
    description: "The source-owned #50 client, host, lease, Work-run, checkpoint, cleanup, and external-effect vocabulary composed inside the real #36 workbench.",
    specimenLabel: "Static execution specimen",
    truth: "No client, provider, host, approval, lease, Work run, or GitHub mutation is connected from this route. The records demonstrate truthful composition only.",
  },
  selected: {
    projectId: FOREMAN_SELECTED_PROJECT_ID,
    buildoutId: FOREMAN_SELECTED_BUILDOUT_ID,
    workItemId: "work-item-selected-workbench",
    originSessionId: "session-kimi-foreman-36",
    observeSessionId: "session-chatgpt-review-36",
    currentExternalEffectId: "effect-foreman-execution-followup",
    verifiedExternalEffectId: "effect-foreman-project-workbench-63",
  },
  clients,
  hostAdvertisements,
  approvals,
  leases,
  runs: [run],
  checkpoints,
  artifacts,
  externalEffects,
  laneOrder: ["work", "execution", "external"],
  laneLabels: {
    work: "Work",
    execution: "Execution",
    external: "External effects",
  },
  laneSummaries: {
    work: "Intent, work items, provider sessions, decisions, and local outcome.",
    execution: "Requested host, actual advertisement, approval, lease, Work run, checkpoint, artifact, and cleanup.",
    external: "Separately authorised provider mutation, uncertain outcome, and canonical read-back.",
  },
  laneEvents,
  runVocabulary: foremanRunTimeline,
  statusLine,
});

/**
 * @param {string} projectId
 * @param {string} buildoutId
 */
export function getForemanProjectExecution(projectId, buildoutId) {
  return projectId === foremanProjectExecution.selected.projectId
    && buildoutId === foremanProjectExecution.selected.buildoutId
    ? foremanProjectExecution
    : undefined;
}

export function validateForemanProjectExecution() {
  const clientIds = new Set(foremanProjectExecution.clients.map((entry) => entry.id));
  const hostIds = new Set(foremanProjectExecution.hostAdvertisements.map((entry) => entry.id));
  const approvalIds = new Set(foremanProjectExecution.approvals.map((entry) => entry.id));
  const leaseIds = new Set(foremanProjectExecution.leases.map((entry) => entry.id));
  const runIds = new Set(foremanProjectExecution.runs.map((entry) => entry.id));
  const checkpointIds = new Set(foremanProjectExecution.checkpoints.map((entry) => entry.id));
  const artifactIds = new Set(foremanProjectExecution.artifacts.map((entry) => entry.id));
  const effectIds = new Set(foremanProjectExecution.externalEffects.map((entry) => entry.id));

  for (const lease of foremanProjectExecution.leases) {
    if (!clientIds.has(lease.clientId)
      || !hostIds.has(lease.actualHostAdvertisementId)
      || !approvalIds.has(lease.approvalId)
      || !runIds.has(lease.runId)) return false;
  }

  for (const currentRun of foremanProjectExecution.runs) {
    if (!leaseIds.has(currentRun.leaseId)
      || !clientIds.has(currentRun.clientId)
      || !approvalIds.has(currentRun.approvalId)
      || !hostIds.has(currentRun.actualHostAdvertisementId)
      || !effectIds.has(currentRun.externalEffectId)
      || !currentRun.checkpointIds.every((id) => checkpointIds.has(id))
      || !currentRun.artifactIds.every((id) => artifactIds.has(id))) return false;
  }

  const executionStates = foremanProjectExecution.laneEvents.execution.map((entry) => entry.state);
  const vocabularyStates = foremanRunTimeline.map((entry) => entry.id);
  const currentEffect = requireById(
    foremanProjectExecution.externalEffects,
    foremanProjectExecution.selected.currentExternalEffectId,
    "external effect",
  );
  const verifiedEffect = requireById(
    foremanProjectExecution.externalEffects,
    foremanProjectExecution.selected.verifiedExternalEffectId,
    "external effect",
  );

  return executionStates.every((id) => vocabularyStates.includes(id))
    && vocabularyStates.every((id) => executionStates.includes(id))
    && currentEffect.state === "uncertain"
    && currentEffect.canonicalUrl === null
    && verifiedEffect.state === "verified"
    && typeof verifiedEffect.canonicalUrl === "string"
    && /^[0-9a-f]{40}$/.test(verifiedEffect.canonicalRevision ?? "");
}
