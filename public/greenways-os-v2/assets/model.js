export const SURFACES = [
  { id: "desktop", label: "Desktop", detail: "Frames, buffers and panes" },
  { id: "browser", label: "Browser", detail: "Capture, inspect and approve" },
  { id: "web", label: "Web", detail: "Read, publish and discover" },
];

export const APPS = [
  {
    id: "today",
    code: "TD",
    label: "Today",
    tone: "sage",
    eyebrow: "Personal command centre",
    summary: "The decisions, movement and signals that need attention now.",
  },
  {
    id: "workrooms",
    code: "WR",
    label: "Workrooms",
    tone: "clay",
    eyebrow: "People and agent rooms",
    summary: "Persistent rooms where sources, conversation, work and authority stay together.",
  },
  {
    id: "studio",
    code: "ST",
    label: "Studio",
    tone: "sky",
    eyebrow: "Compose and publish",
    summary: "A split-pane environment for turning source material into a portable release.",
  },
  {
    id: "campaigns",
    code: "CP",
    label: "Campaigns",
    tone: "gold",
    eyebrow: "Coordinate distribution",
    summary: "Channels, collaborators, rights, milestones and outcomes around one brief.",
  },
  {
    id: "packages",
    code: "PK",
    label: "Packages",
    tone: "violet",
    eyebrow: "Install capabilities",
    summary: "A provenance-first registry for Hara packages, formats and providers.",
  },
  {
    id: "keyring",
    code: "KY",
    label: "Keyring",
    tone: "coral",
    eyebrow: "Identity and authority",
    summary: "Human-readable custody, scoped grants, agent identities and recovery.",
  },
  {
    id: "receipts",
    code: "RC",
    label: "Receipts",
    tone: "ink",
    eyebrow: "Verifiable action trail",
    summary: "Meaningful approvals and effects, without turning work into surveillance.",
  },
];

export const COMMANDS = [
  ...APPS.map((app, index) => ({
    id: `open-${app.id}`,
    label: `Open ${app.label}`,
    detail: app.eyebrow,
    shortcut: `⌘${index + 1}`,
    app: app.id,
  })),
  { id: "capture-page", label: "Save current page", detail: "Create source and receipt", shortcut: "⌥S", action: "capture-page" },
  { id: "open-approvals", label: "Review requested actions", detail: "Three human decisions waiting", shortcut: "⌘⇧A", action: "open-approvals" },
  { id: "toggle-inspector", label: "Toggle inspector", detail: "Authority, provenance and activity", shortcut: "⌘I", action: "toggle-inspector" },
  { id: "switch-theme", label: "Switch colour theme", detail: "Use the paired day/night surface", shortcut: "⌘⇧L", action: "switch-theme" },
];

export const DEFAULT_STATE = {
  version: 2,
  profile: {
    id: "profile/chris-zheng",
    name: "Chris Zheng",
    initials: "CZ",
    custody: "browser",
  },
  activeWorkspace: "workspace/publishing",
  workspaces: [
    { id: "workspace/publishing", code: "01", label: "Publishing", unread: 3 },
    { id: "workspace/research", code: "02", label: "Research", unread: 1 },
    { id: "workspace/systems", code: "03", label: "Systems", unread: 0 },
  ],
  activeApp: "studio",
  buffers: [
    { id: "buffer/release", label: "Release draft", kind: "document", dirty: false },
    { id: "buffer/campaign", label: "Autumn campaign", kind: "campaign", dirty: false },
    { id: "buffer/package", label: "world.scene", kind: "package", dirty: false },
    { id: "buffer/receipt", label: "Receipt trace", kind: "receipt", dirty: false },
  ],
  activeBuffer: "buffer/release",
  providers: [
    { id: "provider/browser", label: "Browser", status: "connected", detail: "Capture · identity · downloads" },
    { id: "provider/hestia", label: "Hestia", status: "connected", detail: "Documents · receipts · sync" },
    { id: "provider/greenwaysd", label: "greenwaysd", status: "optional", detail: "Native keys · files · jobs" },
  ],
  approvals: [
    {
      id: "approval/publish-atlas",
      actor: "Agent / release-editor",
      operation: "keyring/sign",
      scope: "release/atlas-of-quiet-machines@0.8.0",
      grant: "grant/publish-release",
      risk: "medium",
      status: "waiting",
    },
    {
      id: "approval/add-github-source",
      actor: "Agent / source-curator",
      operation: "browser/capture",
      scope: "github.com/greenways-ai/visual-language",
      grant: "grant/capture-current-page",
      risk: "low",
      status: "waiting",
    },
    {
      id: "approval/campaign-export",
      actor: "Agent / campaign-operator",
      operation: "filesystem/write",
      scope: "campaigns/autumn/manifest.json",
      grant: "grant/workroom-source",
      risk: "medium",
      status: "waiting",
    },
  ],
  agents: [
    { id: "agent/release-editor", label: "Release editor", state: "working", task: "Checking derived formats" },
    { id: "agent/source-curator", label: "Source curator", state: "idle", task: "Awaiting page capture" },
    { id: "agent/campaign-operator", label: "Campaign operator", state: "blocked", task: "Approval required" },
  ],
  settings: {
    theme: "dark",
    receiptEveryEffect: true,
    confirmMediumRisk: true,
    confirmHighRisk: true,
    browserCustody: true,
    nativeCustody: false,
    syncWorkspace: true,
  },
  receipts: [
    {
      id: "rcpt_01J5W6D81R9D",
      at: "2026-08-20T18:42:00.000Z",
      actor: "Chris Zheng",
      operation: "document/save",
      object: "Release draft",
      outcome: "completed",
      evidence: 4,
    },
    {
      id: "rcpt_01J5W69ZK2TT",
      at: "2026-08-20T18:31:00.000Z",
      actor: "Agent / release-editor",
      operation: "package/inspect",
      object: "world.scene@2.4.1",
      outcome: "completed",
      evidence: 7,
    },
    {
      id: "rcpt_01J5W61PQ7CF",
      at: "2026-08-20T18:11:00.000Z",
      actor: "Chris Zheng",
      operation: "grant/approve",
      object: "grant/read-workroom",
      outcome: "completed",
      evidence: 2,
    },
  ],
};

export function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

export function mergeState(candidate = {}) {
  const base = cloneDefaultState();
  return {
    ...base,
    ...candidate,
    profile: { ...base.profile, ...(candidate.profile || {}) },
    settings: { ...base.settings, ...(candidate.settings || {}) },
    workspaces: Array.isArray(candidate.workspaces) ? candidate.workspaces : base.workspaces,
    buffers: Array.isArray(candidate.buffers) ? candidate.buffers : base.buffers,
    providers: Array.isArray(candidate.providers) ? candidate.providers : base.providers,
    approvals: Array.isArray(candidate.approvals) ? candidate.approvals : base.approvals,
    agents: Array.isArray(candidate.agents) ? candidate.agents : base.agents,
    receipts: Array.isArray(candidate.receipts) ? candidate.receipts : base.receipts,
  };
}
