export interface GreenwaysOsProductSurface {
  id: "fabric" | "search" | "timeline" | "cowork" | "spaces";
  label: string;
  code: string;
  purpose: string;
  abstraction: string;
  environments: readonly string[];
  systemBoundary: string;
  states: readonly string[];
}

export const greenwaysOsProductSurfaces = [
  {
    id: "fabric",
    label: "Fabric",
    code: "FB",
    purpose: "Selected files, identity, devices and storage under the person's control.",
    abstraction: "Tahto semantic roots, identities, revisions and synchronisation over Hara filesystem contracts.",
    environments: ["Hara local runtime", "Hoplite service boundary"],
    systemBoundary: "OS custody, storage providers and explicit device grants",
    states: ["available", "offline", "syncing", "conflicted", "recovery-required"],
  },
  {
    id: "search",
    label: "Search",
    code: "SR",
    purpose: "Classify, relate and recontextualise material without rewriting its source.",
    abstraction: "Hestia sources, anchors, evidence and retrieval linked to Tahto roots.",
    environments: ["Hara package", "Hoplite service boundary", "Hodos client projection"],
    systemBoundary: "Only user-approved Fabric and provider scopes are searchable",
    states: ["proposal", "accepted", "rejected", "low-confidence", "stale"],
  },
  {
    id: "timeline",
    label: "Timeline",
    code: "TL",
    purpose: "Keep chats, decisions, project relationships and meaningful activity together.",
    abstraction: "Hestia archives and evidence with Tahto identity and relationship references.",
    environments: ["Hara package", "Hoplite service boundary", "Hodos client projection"],
    systemBoundary: "Selected activity only; no ambient device surveillance",
    states: ["imported", "linked", "accepted", "unresolved", "source-unavailable"],
  },
  {
    id: "cowork",
    label: "Cowork",
    code: "CW",
    purpose: "Coordinate people and agents around bounded context, authority and outcomes.",
    abstraction: "Tahto authority and project values with Hestia context, evidence and approvals.",
    environments: ["Hara package", "Hoplite service boundary", "Ignatius execution", "Hodos client projection"],
    systemBoundary: "Scoped files, context packs, capabilities and human checkpoints",
    states: ["proposed", "active", "waiting", "blocked", "uncertain", "accepted"],
  },
  {
    id: "spaces",
    label: "Spaces",
    code: "SP",
    purpose: "Turn selected private work into reviewed public releases.",
    abstraction: "Tahto release roots and provenance with Hestia source evidence and Platform delivery.",
    environments: ["Hara package", "Hoplite serving", "Ignatius release execution", "Hodos client projection"],
    systemBoundary: "An immutable release is public; the source Fabric remains private",
    states: ["draft", "review", "signed", "published", "superseded", "revoked"],
  },
] as const satisfies readonly GreenwaysOsProductSurface[];

export const greenwaysOsExecutionEnvironments = [
  {
    id: "hara",
    label: "Hara",
    role: "Portable contracts, packages, validators and programs.",
    authority: "No ambient host authority.",
  },
  {
    id: "hoplite",
    label: "Hoplite",
    role: "Network-serving and streaming execution for Hara applications.",
    authority: "Runs only installed, bounded service operations.",
  },
  {
    id: "ignatius",
    label: "Ignatius",
    role: "Effectful execution, ordered transitions, shared finality and receipts.",
    authority: "Accepts only validated, signed and scoped transitions.",
  },
  {
    id: "hodos",
    label: "Hodos",
    role: "Client-side Hara package resolution and visible materialisation.",
    authority: "Materialises approved packages without owning keys or storage.",
  },
] as const;

export const greenwaysOsAbstractionOwners = [
  {
    id: "tahto",
    label: "Tahto",
    role: "Semantic fabric: identities, objects, links, roots, revisions, authority and synchronisation.",
    builtWith: "Hara packages and deterministic kernels.",
  },
  {
    id: "hestia",
    label: "Hestia",
    role: "Knowledge fabric: sources, anchors, evidence, assertions, lineage and retrieval.",
    builtWith: "Hara packages and replaceable providers.",
  },
] as const;

export interface GreenwaysOsV2Application {
  id: "today" | "workrooms" | "studio" | "campaigns" | "packages" | "keyring" | "receipts";
  label: string;
  code: string;
  purpose: string;
  signal: "sage" | "clay" | "sky" | "gold" | "violet" | "coral" | "ink";
}

export interface GreenwaysOsV2Surface {
  id: "desktop" | "extension-desktop" | "extension-panel" | "extension-popup" | "web";
  label: string;
  code: string;
  eyebrow: string;
  summary: string;
  boundary: string;
  viewport: string;
  capabilities: readonly string[];
}

export const greenwaysOsV2Applications = [
  {
    id: "today",
    label: "Today",
    code: "TD",
    purpose: "Decisions, focus and movement across the workspace.",
    signal: "sage",
  },
  {
    id: "workrooms",
    label: "Workrooms",
    code: "WR",
    purpose: "Persistent rooms for people, agents, sources and decisions.",
    signal: "clay",
  },
  {
    id: "studio",
    label: "Studio",
    code: "ST",
    purpose: "Compose, inspect and publish portable creative work.",
    signal: "sky",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    code: "CP",
    purpose: "Coordinate distribution, rights, milestones and results.",
    signal: "gold",
  },
  {
    id: "packages",
    label: "Packages",
    code: "PK",
    purpose: "Discover and install declared workspace capabilities.",
    signal: "violet",
  },
  {
    id: "keyring",
    label: "Keyring",
    code: "KY",
    purpose: "Manage identity, custody, scoped grants and recovery.",
    signal: "coral",
  },
  {
    id: "receipts",
    label: "Receipts",
    code: "RC",
    purpose: "Read the evidence behind meaningful actions and hand-offs.",
    signal: "ink",
  },
] as const satisfies readonly GreenwaysOsV2Application[];

export const greenwaysOsV2Surfaces = [
  {
    id: "desktop",
    label: "Native desktop",
    code: "DT",
    eyebrow: "Full workspace · local provider",
    summary:
      "The widest Greenways frame: buffers, split panes, inspectors and a native capability line for files, repositories, jobs and protected keys.",
    boundary: "Portable workspace + optional greenwaysd",
    viewport: "1440 × 960 reference frame",
    capabilities: ["local files", "repositories", "native key custody", "durable jobs"],
  },
  {
    id: "extension-desktop",
    label: "Extension desktop",
    code: "XT",
    eyebrow: "Full-page Chrome workspace",
    summary:
      "The primary browser operating environment, opened in a tab and rebuilt from durable workspace state rather than held inside the service worker.",
    boundary: "Portable workspace + browser capability provider",
    viewport: "Chrome tab · responsive",
    capabilities: ["tabs", "capture", "downloads", "identity"],
  },
  {
    id: "extension-panel",
    label: "Chrome side panel",
    code: "SP",
    eyebrow: "Persistent page companion",
    summary:
      "A narrow contextual tool for capture, provenance, agent requests, approvals and receipts while the user keeps browsing.",
    boundary: "Current tab context + named browser commands",
    viewport: "360–480 px panel",
    capabilities: ["current page", "capture", "inspect", "approve"],
  },
  {
    id: "extension-popup",
    label: "Chrome popup",
    code: "PP",
    eyebrow: "Launcher and health display",
    summary:
      "A deliberately small status surface: connection health, pending approvals, active agents and three immediate actions.",
    boundary: "No workspace editing; launch and status only",
    viewport: "384 × 600 px popup",
    capabilities: ["open panel", "open desktop", "save page"],
  },
  {
    id: "web",
    label: "Greenways web",
    code: "WB",
    eyebrow: "Public publishing + remote workspace",
    summary:
      "The public doorway into worlds, publications and profiles, with a signed-in workspace that uses remote providers and the same portable objects.",
    boundary: "Public web shell + Hestia/remote providers",
    viewport: "Responsive public site",
    capabilities: ["publish", "discover", "collaborate", "remote sync"],
  },
] as const satisfies readonly GreenwaysOsV2Surface[];

export type GreenwaysOsV2SurfaceId = (typeof greenwaysOsV2Surfaces)[number]["id"];

export function getGreenwaysOsV2Surface(id: string) {
  return greenwaysOsV2Surfaces.find((surface) => surface.id === id);
}
