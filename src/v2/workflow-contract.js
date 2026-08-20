// @ts-check

/** @typedef {"neutral" | "info" | "success" | "warning" | "danger"} GreenwaysV2WorkflowTone */
/** @typedef {"shared" | "host"} GreenwaysV2WorkflowOwner */
/**
 * @typedef {object} GreenwaysV2WorkflowState
 * @property {string} id
 * @property {string} label
 * @property {GreenwaysV2WorkflowTone} tone
 * @property {boolean} terminal
 * @property {string} nonColourCue
 * @property {string} evidence
 * @property {string} recovery
 */
/**
 * @typedef {object} GreenwaysV2WorkflowStep
 * @property {string} id
 * @property {string} label
 * @property {GreenwaysV2WorkflowOwner} owner
 * @property {string} responsibility
 */
/**
 * @typedef {object} GreenwaysV2WorkflowStudy
 * @property {"search-inspect" | "create-approve" | "session-recovery" | "connection-authority"} id
 * @property {string} label
 * @property {string} summary
 * @property {readonly GreenwaysV2WorkflowStep[]} steps
 * @property {readonly string[]} states
 * @property {readonly string[]} sharedSemantics
 * @property {readonly string[]} hostResponsibilities
 * @property {readonly string[]} evidence
 */

/**
 * @template T
 * @param {T} value
 * @returns {Readonly<T>}
 */
const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return /** @type {Readonly<T>} */ (value);
};

export const GREENWAYS_V2_WORKFLOW_CONTRACT_VERSION = "1";

/** @type {readonly GreenwaysV2WorkflowState[]} */
export const greenwaysV2WorkflowStates = deepFreeze([
  {
    id: "initial",
    label: "Initial",
    tone: "neutral",
    terminal: false,
    nonColourCue: "A named starting point with no completion language.",
    evidence: "The current input or absence of input is visible.",
    recovery: "Begin the first bounded action.",
  },
  {
    id: "first-use",
    label: "Empty · first use",
    tone: "neutral",
    terminal: false,
    nonColourCue: "First-use heading, explanation and one primary next step.",
    evidence: "No records exist in the supplied collection.",
    recovery: "Create or connect the first source through the host.",
  },
  {
    id: "empty-filtered",
    label: "Empty · filtered",
    tone: "neutral",
    terminal: false,
    nonColourCue: "The active query and filter count remain visible.",
    evidence: "The supplied result count is zero while unfiltered data may exist.",
    recovery: "Clear or change the query without deleting source data.",
  },
  {
    id: "loading",
    label: "Loading",
    tone: "info",
    terminal: false,
    nonColourCue: "Busy text, progress form and disabled duplicate action.",
    evidence: "The request start and requested resource are visible.",
    recovery: "Cancel or continue waiting through a host-owned command.",
  },
  {
    id: "active",
    label: "Active",
    tone: "info",
    terminal: false,
    nonColourCue: "Current item, actor and elapsed or last-updated text.",
    evidence: "At least one supplied activity or result record exists.",
    recovery: "Continue, pause or inspect through the host.",
  },
  {
    id: "waiting-approval",
    label: "Waiting for approval",
    tone: "warning",
    terminal: false,
    nonColourCue: "Requested scope, requester, actual state and expiry are adjacent.",
    evidence: "An approval request exists; no grant or effect receipt exists yet.",
    recovery: "A person approves, denies or lets the request expire.",
  },
  {
    id: "stale",
    label: "Stale",
    tone: "warning",
    terminal: false,
    nonColourCue: "Last-confirmed timestamp and stale label.",
    evidence: "The displayed revision differs from or cannot be confirmed against the source.",
    recovery: "Refresh or compare before acting.",
  },
  {
    id: "partial",
    label: "Partial",
    tone: "warning",
    terminal: false,
    nonColourCue: "Completed count, missing count and known limitations are written out.",
    evidence: "Some requested outputs or events exist and missing parts are enumerated.",
    recovery: "Retry only the missing portion or accept the bounded partial result.",
  },
  {
    id: "offline",
    label: "Offline",
    tone: "warning",
    terminal: false,
    nonColourCue: "Disconnected text, last-confirmed time and unavailable actions.",
    evidence: "No current source response is represented.",
    recovery: "Reconnect explicitly; never infer connection from a requested toggle.",
  },
  {
    id: "recoverable-error",
    label: "Recoverable error",
    tone: "warning",
    terminal: false,
    nonColourCue: "Error summary, retained input and bounded retry action.",
    evidence: "A supplied error record identifies the failed boundary.",
    recovery: "Correct input, retry the failed step or choose a safe alternative.",
  },
  {
    id: "fatal-error",
    label: "Fatal error",
    tone: "danger",
    terminal: true,
    nonColourCue: "Failure heading, stopped state and preserved diagnostic reference.",
    evidence: "A terminal failure record identifies what stopped and what was preserved.",
    recovery: "Start a new attempt from preserved evidence; do not show a retry that cannot work.",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    tone: "neutral",
    terminal: true,
    nonColourCue: "Cancelled text, actor and timestamp.",
    evidence: "A cancellation record identifies the request or work item that stopped.",
    recovery: "Create a new bounded request if the work is still required.",
  },
  {
    id: "success",
    label: "Success",
    tone: "success",
    terminal: true,
    nonColourCue: "Completed text, completed time and adjacent evidence link.",
    evidence: "A supplied result or receipt identifies the completed boundary.",
    recovery: "Inspect evidence, continue to the next step or close the workflow.",
  },
]);

const sharedSemantics = deepFreeze([
  "State is named in text and never depends on colour alone.",
  "Requested state and actual state are distinct fields.",
  "Actors, timestamps, identifiers and evidence stay adjacent to claims.",
  "Loading, stale, partial, offline and failure states keep a bounded next step.",
  "A control expresses intent; only supplied state or evidence reports an outcome.",
]);

const hostResponsibilities = deepFreeze([
  "Own data loading, mutation, commands and cancellation.",
  "Evaluate authority and record human decisions.",
  "Connect providers, persist state and create evidence.",
  "Normalize failures and determine whether recovery is possible.",
]);

/** @type {readonly GreenwaysV2WorkflowStudy[]} */
export const greenwaysV2WorkflowStudies = deepFreeze([
  {
    id: "search-inspect",
    label: "Search, filter, select, inspect",
    summary: "Move from an unknown collection to one inspected record while preserving query, result and staleness truth.",
    steps: [
      { id: "search", label: "Search", owner: "shared", responsibility: "Expose a labelled query and supplied result summary." },
      { id: "filter", label: "Filter", owner: "host", responsibility: "Apply filters and provide the resulting collection." },
      { id: "select", label: "Select", owner: "host", responsibility: "Own selected identity and update history where required." },
      { id: "inspect", label: "Inspect", owner: "shared", responsibility: "Present the selected record, status and evidence region." },
    ],
    states: ["first-use", "loading", "active", "empty-filtered", "stale", "partial"],
    sharedSemantics,
    hostResponsibilities,
    evidence: ["active query", "result count", "selected identifier", "last-confirmed time"],
  },
  {
    id: "create-approve",
    label: "Create, validate, preview, approve, receipt",
    summary: "Prepare a bounded change, expose validation, request human authority and show success only beside evidence.",
    steps: [
      { id: "create", label: "Create", owner: "host", responsibility: "Own draft data and unsaved-change state." },
      { id: "validate", label: "Validate", owner: "shared", responsibility: "Associate errors and hints with the exact controls." },
      { id: "preview", label: "Preview", owner: "shared", responsibility: "Present proposed output without calling it delivered." },
      { id: "approve", label: "Approve", owner: "host", responsibility: "Evaluate scope and record the human decision." },
      { id: "receipt", label: "Receipt", owner: "shared", responsibility: "Present supplied identifiers and evidence after the effect." },
    ],
    states: ["initial", "recoverable-error", "active", "waiting-approval", "success", "fatal-error"],
    sharedSemantics,
    hostResponsibilities,
    evidence: ["draft identifier", "validation summary", "requested scope", "decision record", "effect receipt"],
  },
  {
    id: "session-recovery",
    label: "Load session, run, observe, recover",
    summary: "Track a session from loading through active work and recover without erasing partial output or failure evidence.",
    steps: [
      { id: "load", label: "Load session", owner: "host", responsibility: "Resolve the session identity and current source state." },
      { id: "run", label: "Run", owner: "host", responsibility: "Start and cancel work through explicit commands." },
      { id: "observe", label: "Observe", owner: "shared", responsibility: "Present supplied progress, events, partial results and diagnostics." },
      { id: "recover", label: "Recover", owner: "host", responsibility: "Reconnect or retry the failed boundary without duplicating completed work." },
    ],
    states: ["loading", "active", "partial", "offline", "recoverable-error", "success", "fatal-error"],
    sharedSemantics,
    hostResponsibilities,
    evidence: ["session identifier", "run identifier", "event sequence", "partial artifact list", "recovery record"],
  },
  {
    id: "connection-authority",
    label: "Connect, request authority, reconnect, revoke",
    summary: "Keep provider availability, requested authority, actual grants and revocation independently legible.",
    steps: [
      { id: "connect", label: "Connect", owner: "host", responsibility: "Establish and verify provider availability." },
      { id: "request", label: "Request authority", owner: "shared", responsibility: "Present exact scope, requester, limits and expiry." },
      { id: "reconnect", label: "Reconnect", owner: "host", responsibility: "Restore availability without silently restoring revoked authority." },
      { id: "revoke", label: "Revoke", owner: "host", responsibility: "Remove the grant and record the actual revocation." },
    ],
    states: ["initial", "loading", "waiting-approval", "active", "offline", "stale", "cancelled", "success"],
    sharedSemantics,
    hostResponsibilities,
    evidence: ["provider identity", "availability state", "requested scope", "actual grant", "revocation record"],
  },
]);

export const greenwaysV2WorkflowOwnership = deepFreeze({
  shared: sharedSemantics,
  host: hostResponsibilities,
  rule: "The visual-language package presents supplied state and evidence; it never performs or infers an application effect.",
});

/** @param {string} id */
export function getGreenwaysV2WorkflowState(id) {
  return greenwaysV2WorkflowStates.find((state) => state.id === id);
}

/** @param {string} id */
export function getGreenwaysV2WorkflowStudy(id) {
  return greenwaysV2WorkflowStudies.find((study) => study.id === id);
}
