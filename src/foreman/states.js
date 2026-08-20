const frozen = (value) => Object.freeze(value);
const list = (values) => frozen(values.map((value) => frozen(value)));

export const foremanExperienceStates = list([
  ["first-use", "First use", "Nothing is configured yet.", "Show an honest setup checklist and no invented activity."],
  ["active", "Active", "Work is progressing.", "Show a current run, session, or verified transition."],
  ["paused", "Paused", "Progress deliberately stopped.", "Show actor, reason, and pause time."],
  ["waiting-for-approval", "Waiting for approval", "Consequential work cannot continue.", "Show exact request, scope, recipient, and expiry."],
  ["degraded", "Degraded", "The view is partly useful.", "Name the unavailable portion and last successful observation."],
  ["disconnected", "Disconnected", "A required surface is unreachable.", "Keep desired and last observed connection states distinct."],
  ["completed", "Completed", "The declared outcome has evidence.", "Place artifacts or authoritative read-back beside the claim."],
  ["failed", "Failed", "The declared outcome was not reached.", "Show failure stage, retained work, and a safe next action."],
  ["cancelled", "Cancelled", "An authorised actor stopped the operation.", "Show actor, time, and downstream consequences."],
].map(([id, label, meaning, evidence]) => ({ id, label, meaning, evidence })));

export const foremanStateFamilies = frozen({
  buildout: frozen(["planned", "active", "paused", "waiting-for-approval", "degraded", "completed", "failed", "cancelled"]),
  workItem: frozen(["proposed", "ready", "active", "blocked", "waiting-for-approval", "completed", "failed", "cancelled"]),
  connection: frozen(["login-required", "connecting", "ready", "degraded", "disconnected", "revoked"]),
  session: frozen(["available", "connecting", "active", "idle", "disconnected", "ended", "failed"]),
  handoff: frozen(["draft", "requested", "waiting-for-approval", "authorised", "queued", "accepted", "running", "returning", "completed", "denied", "expired", "cancelled", "disconnected", "partial", "failed"]),
  approval: frozen(["pending", "approved", "denied", "expired", "revoked"]),
  artifact: frozen(["expected", "producing", "available", "stale", "missing", "invalid"]),
  externalEffect: frozen(["requested", "waiting-for-approval", "authorised", "submitted", "uncertain", "verified", "failed", "cancelled"]),
});

export const foremanTruthfulnessRules = list([
  { id: "request-not-acceptance", statement: "A requested or sent handoff is not accepted work." },
  { id: "acceptance-not-completion", statement: "Accepted or running work is not completed work." },
  { id: "login-not-authority", statement: "A ready connection or provider login does not imply permission to read, write, publish, spend, review, or merge." },
  { id: "local-not-external", statement: "A local branch, commit, patch, or command exit does not prove a GitHub mutation occurred." },
  { id: "read-back-required", statement: "An external mutation becomes verified only after canonical read-back from the external authority." },
  { id: "desired-not-actual", statement: "Desired, requested, and observed states remain visibly distinct." },
  { id: "identities-distinct", statement: "Person, agent profile, connection, client, and live session identities remain distinct." },
  { id: "partial-remains-partial", statement: "Unavailable, stale, uncertain, and partial outcomes cannot be collapsed into success." },
]);
