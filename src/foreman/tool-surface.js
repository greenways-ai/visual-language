const frozen = (value) => Object.freeze(value);
const list = (values) => frozen(values.map((value) => frozen(value)));

export const FOREMAN_TOOL_SURFACE_VERSION = "1.0";

export const foremanToolClasses = list([
  {
    id: "observe",
    label: "Observe",
    effect: "read",
    purpose: "Read current Foreman projections and exact evidence without creating durable work or an external effect.",
    evidence: "freshness, provenance, requested-versus-observed state, bounds, and canonical references",
  },
  {
    id: "act",
    label: "Act",
    effect: "application-transition",
    purpose: "Request one bounded Foreman transition through the current Fabric authority.",
    evidence: "request identity, grant or approval, idempotency, transition result, and retained activity",
  },
  {
    id: "external-effect",
    label: "External effect",
    effect: "external-mutation",
    purpose: "Request one separately authorised mutation in GitHub or another external authority.",
    evidence: "exact arguments, permission, uncertain outcome, returned identity, and authoritative read-back",
  },
]);

const tool = (id, name, classId, label, purpose, fabricService, approval, resultEvidence) => frozen({
  id,
  name,
  classId,
  label,
  purpose,
  fabricService,
  approval,
  resultEvidence,
});

export const foremanTools = list([
  tool("projects-list", "foreman.projects.list", "observe", "List projects", "List bounded project summaries visible to the current actor.", "content", "none", "projection freshness and project identity"),
  tool("project-get", "foreman.project.get", "observe", "Inspect project", "Read one project, its exact external links, attention, and current buildouts.", "content", "none", "project revision and canonical external references"),
  tool("buildouts-list", "foreman.buildouts.list", "observe", "List buildouts", "List project outcomes and their requested-versus-observed state.", "work", "none", "projection freshness and evidence summary"),
  tool("buildout-get", "foreman.buildout.get", "observe", "Inspect buildout", "Read work, sessions, approvals, runs, artifacts, activity, and external evidence for one outcome.", "work", "none", "buildout revision and causal evidence"),
  tool("work-get", "foreman.work.get", "observe", "Inspect work item", "Read one bounded task, dependencies, expected output, owner, and current attempts.", "work", "none", "work revision and run references"),
  tool("sessions-list", "foreman.sessions.list", "observe", "List sessions", "List distinct provider, browser, CLI, and process contexts without merging their identities.", "connections", "none", "last observation and native reference"),
  tool("session-get", "foreman.session.get", "observe", "Inspect session", "Read one live or resumable context and its actual advertised capabilities.", "connections", "none", "last heartbeat and provider evidence"),
  tool("approvals-list", "foreman.approvals.list", "observe", "List approvals", "List exact consequential requests awaiting or retaining a human decision.", "access", "none", "scope, expiry, decision, and authority evidence"),
  tool("approval-get", "foreman.approval.get", "observe", "Inspect approval", "Read one approval, its requester, scope, consequences, exclusions, and decision.", "access", "none", "decision record and affected transition"),
  tool("execution-hosts-list", "foreman.execution.hosts.list", "observe", "List execution choices", "Read enrolled hosts in consumer language with availability, bounds, and capability freshness.", "connections", "none", "host generation and advertised capability manifest"),
  tool("execution-run-get", "foreman.execution.run.get", "observe", "Inspect execution run", "Read one sandbox/Work run, checkpoints, logs, artifacts, cleanup, and failure state.", "work", "none", "run generation, checkpoint chain, and cleanup evidence"),
  tool("activity-list", "foreman.activity.list", "observe", "Read activity", "Read attributable events and their causal/evidence links.", "activity", "none", "event identity, actor, source, and observation time"),
  tool("artifact-get", "foreman.artifact.get", "observe", "Read artifact", "Read bounded artifact metadata or an authorised result reference with producer and ancestry.", "content", "none", "digest, producer run, availability, and retention state"),
  tool("buildout-create", "foreman.buildout.create", "act", "Create buildout", "Create one intended project outcome with an exact initial scope.", "work", "standing-or-human", "created buildout identity and accepted revision"),
  tool("work-submit", "foreman.work.submit", "act", "Submit work", "Submit one bounded work item to the canonical Work path.", "work", "policy-dependent", "accepted request, run identity, and durable activity"),
  tool("work-cancel", "foreman.work.cancel", "act", "Cancel work", "Request cancellation of one current Work run without erasing retained evidence.", "work", "policy-dependent", "cancellation owner, time, and downstream state"),
  tool("session-attach", "foreman.session.attach", "act", "Attach session", "Bind one exact visible provider/browser/CLI session to one Foreman run.", "connections", "human-for-browser-context", "session/run binding and lease expiry"),
  tool("execution-lease-request", "foreman.execution.lease.request", "act", "Request sandbox lease", "Request one host, sandbox profile, capability set, network policy, and expiry.", "work", "standing-or-human", "lease identity, grant intersection, host generation, and expiry"),
  tool("execution-lease-revoke", "foreman.execution.lease.revoke", "act", "Revoke sandbox lease", "Prevent new effects under one request-bound execution lease.", "access", "policy-dependent", "revocation actor, time, and affected run state"),
  tool("execution-run-cancel", "foreman.execution.run.cancel", "act", "Cancel execution run", "Request bounded cancellation and cleanup for one sandbox run.", "work", "policy-dependent", "cancel result, retained checkpoints, and cleanup status"),
  tool("approval-decide", "foreman.approval.decide", "act", "Decide approval", "Approve or deny one exact request without broadening its scope.", "access", "human", "decision record, actor, exact scope, and expiry"),
  tool("output-capture", "foreman.output.capture", "act", "Capture selected output", "Store one explicitly selected response or candidate artifact with digest and run provenance.", "content", "human-for-private-provider-output", "artifact identity, digest, and source completeness"),
  tool("external-effect-request", "foreman.external-effect.request", "external-effect", "Request external effect", "Request one exact GitHub or provider mutation under a separate permission and idempotency key.", "activity", "human-or-standing-external", "submitted or uncertain state plus eventual canonical read-back"),
  tool("external-effect-get", "foreman.external-effect.get", "external-effect", "Inspect external effect", "Read request, response, uncertainty, and current authoritative external observation.", "activity", "none", "external identity, last read-back, and verification state"),
]);

export const foremanClientProfiles = list([
  {
    id: "read-only-mcp",
    label: "ChatGPT Pro custom MCP",
    kind: "remote-mcp-client",
    observedCapability: "read/fetch",
    toolClasses: frozen(["observe"]),
    actionState: "unavailable",
    truth: "The client may inspect Foreman but cannot be presented as having durable action authority.",
    referenceDate: "2026-08-21",
  },
  {
    id: "full-action-mcp",
    label: "Full-action MCP workspace",
    kind: "remote-mcp-client",
    observedCapability: "read and action",
    toolClasses: frozen(["observe", "act", "external-effect"]),
    actionState: "gated",
    truth: "Client support does not bypass Greenways grants, human approval, or external read-back.",
    referenceDate: "2026-08-21",
  },
  {
    id: "direct-foreman-host",
    label: "Foreman Desktop, CLI, or browser companion",
    kind: "enrolled-application-host",
    observedCapability: "application operations",
    toolClasses: frozen(["observe", "act", "external-effect"]),
    actionState: "gated",
    truth: "The directly enrolled surface uses the same Foreman operations through the selected Fabric authority.",
    referenceDate: "2026-08-21",
  },
]);

export const foremanExecutionHosts = list([
  {
    id: "mac-studio",
    label: "Mac Studio",
    summary: "Isolated project sandbox",
    state: "ready",
    observedAt: "2026-08-21T07:46:00+10:00",
    trust: "Enrolled personal host",
    capabilities: frozen(["exact repository checkout", "bounded candidate evaluation", "Hara/Rust/JVM/Node tests", "artifact return", "cleanup"]),
    bounds: frozen(["8 vCPU", "12 GiB memory", "45 minute lease"]),
    network: "GitHub and locked package mirrors",
    expandedImplementation: "container provider",
  },
  {
    id: "cloud-worker",
    label: "Cloud worker",
    summary: "Ephemeral clean-room runner",
    state: "approval-required",
    observedAt: "2026-08-21T07:45:00+10:00",
    trust: "Project-approved remote host",
    capabilities: frozen(["exact repository checkout", "bounded candidate evaluation", "test execution", "artifact return"]),
    bounds: frozen(["4 vCPU", "8 GiB memory", "30 minute lease"]),
    network: "No network after setup",
    expandedImplementation: "remote sandbox provider",
  },
  {
    id: "laptop",
    label: "MacBook",
    summary: "Local development host",
    state: "degraded",
    observedAt: "2026-08-21T07:41:00+10:00",
    trust: "Enrolled personal host",
    capabilities: frozen(["repository inspection", "bounded test execution"]),
    bounds: frozen(["battery policy active", "no new long runs"]),
    network: "GitHub only",
    expandedImplementation: "local process provider",
  },
]);

export const foremanLeaseSpecimen = frozen({
  id: "lease/foreman-mcp-sandbox-50",
  state: "approval-required",
  originContext: "Attached ChatGPT Pro session",
  requestedBy: "Chris through Foreman companion",
  project: "Hara",
  buildout: "#838 · direct callable catalogue",
  workItem: "Cross-runtime conformance",
  host: "Mac Studio",
  capabilities: frozen(["exact checkout", "apply candidate patch in sandbox", "run bounded tests", "return logs and artifacts", "clean workspace"]),
  network: "GitHub and locked package mirrors",
  expiry: "45 minutes",
  excludedAuthority: frozen(["host home directory", "browser cookies", "provider credentials", "SSH agent", "GitHub push", "merge", "deployment", "publication"]),
  controlPlane: "Foreman browser companion",
  dataPlane: "Greenways Fabric ↔ enrolled execution host",
});

export const foremanRunTimeline = list([
  ["requested", "Requested", "Foreman recorded the exact work, host profile, inputs, limits, and idempotency key."],
  ["approval-required", "Approval required", "The browser companion shows shared data, capability scope, network policy, exclusions, and expiry."],
  ["granted", "Lease granted", "The Fabric recorded the authority intersection and one request-bound host generation."],
  ["allocating", "Allocating", "The host is materialising an exact repository revision into an isolated workspace."],
  ["running", "Running", "Canonical Work is executing through the selected host/store/executor path."],
  ["checkpointed", "Checkpointed", "Bounded progress, logs, and artifact references are durable without claiming completion."],
  ["completed", "Completed", "The declared sandbox outcome has exact result evidence; no external GitHub effect is implied."],
  ["cleaned", "Cleaned", "The host returned attributable cleanup evidence for the leased workspace."],
].map(([id, label, evidence]) => ({ id, label, evidence })));

export const foremanRecoveryStates = list([
  ["host-unavailable", "Host unavailable", "Keep the selected host and last observation visible; do not silently reroute."],
  ["partial", "Partial result", "Retain completed checkpoints and name missing output."],
  ["failed", "Run failed", "Show failure stage, retained evidence, and whether cleanup is complete."],
  ["cancelled", "Cancelled", "Show actor, cancellation time, retained output, and cleanup state."],
  ["orphaned", "Cleanup uncertain", "The host disappeared before cleanup evidence; keep recovery action explicit."],
].map(([id, label, evidence]) => ({ id, label, evidence })));

export const foremanArchitectureLayers = list([
  {
    id: "client",
    label: "ChatGPT or MCP client",
    owns: "prompt context and its own observed tool capability",
    mustNotOwn: "Foreman state, Fabric authority, browser credentials, or host credentials",
  },
  {
    id: "mcp-gateway",
    label: "mcp.greenways.ai",
    owns: "MCP discovery, OAuth termination, connection selection, versioned tool advertisement, bounded relay, and revocation",
    mustNotOwn: "projects, buildouts, durable Work, application migrations, sandbox execution, or independent external-effect authority",
  },
  {
    id: "foreman",
    label: "Foreman application",
    owns: "product operations, projects, buildouts, work, sessions, approvals, artifacts, activity, and truthful state laws",
    mustNotOwn: "root keys, provider credentials, database handles, a generic shell, or a second Work runtime",
  },
  {
    id: "fabric",
    label: "Greenways Fabric",
    owns: "identity, authority, application dispatch, host selection, leases, durable Work, connections, evidence, and recovery",
    mustNotOwn: "provider-specific product meaning or another Foreman schema",
  },
  {
    id: "browser-control",
    label: "Browser companion · control plane",
    owns: "visible-tab binding, human consent, host choice, lease inspection/revocation, selected-output capture, and compact progress",
    mustNotOwn: "primary durable state, unrestricted page authority, sandbox execution, or bulk log relay",
  },
  {
    id: "execution-data",
    label: "Execution host · data plane",
    owns: "isolated workspace materialisation, bounded execution, progress, artifacts, cancellation, and cleanup",
    mustNotOwn: "Foreman semantics, MCP credentials, browser cookies, ambient host secrets, or independent GitHub mutation authority",
  },
]);

export const foremanTrustLaws = list([
  { id: "application-owned-tools", statement: "The installed Foreman package owns tool names and schemas; MCP only transports and advertises them." },
  { id: "observed-capability", statement: "Tool availability comes from actual client and Fabric grants, never a subscription label, provider login, or online route." },
  { id: "no-token-passthrough", statement: "MCP, browser, provider, and execution-host credentials terminate at their own boundaries and are never passed through." },
  { id: "no-generic-shell", statement: "Foreman requests semantic work operations and never exposes an unrestricted shell, Docker API, filesystem root, database, or native handle." },
  { id: "control-data-separation", statement: "The browser companion is the consent and revocation control plane; the Fabric may establish a direct bounded data plane to the host." },
  { id: "exact-lease", statement: "A sandbox lease is bound to one actor, app, project, buildout, work item, run, capability set, host generation, and expiry." },
  { id: "no-ambient-secrets", statement: "Sandboxes start without unrelated host files, browser cookies, provider credentials, keychains, SSH agents, or ambient cloud credentials." },
  { id: "external-effect-separate", statement: "A completed sandbox run or local commit does not prove a GitHub or deployment effect; authoritative read-back remains required." },
  { id: "offline-local", statement: "Desktop, CLI, browser, and local sandbox operation remain useful when hosted MCP is unavailable." },
]);

export const foremanToolsForProfile = (profileId) => {
  const profile = foremanClientProfiles.find((candidate) => candidate.id === profileId);
  if (!profile) return frozen([]);
  return frozen(foremanTools.filter((candidate) => profile.toolClasses.includes(candidate.classId)));
};
