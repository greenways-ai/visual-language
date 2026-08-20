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
