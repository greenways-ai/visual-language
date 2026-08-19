export interface GreenwaysScreenDefinition {
  id: string;
  label: string;
  navCode: string;
  eyebrow: string;
  summary: string;
  outcome: string;
  primaryAction: string;
  secondaryAction: string;
  tone: "sage" | "clay" | "sky" | "gold" | "violet" | "coral" | "ink";
}

export const greenwaysProductScreens = [
  {
    id: "today",
    label: "Today",
    navCode: "TD",
    eyebrow: "Personal command centre",
    summary:
      "A quiet daily view that turns active work, agent activity, approvals and useful signals into one readable briefing.",
    outcome: "Know what matters, what moved and what needs a human decision.",
    primaryAction: "Start focus block",
    secondaryAction: "Open briefing",
    tone: "sage",
  },
  {
    id: "workrooms",
    label: "Workrooms",
    navCode: "WR",
    eyebrow: "Shared spaces for people and agents",
    summary:
      "Persistent rooms where a team can gather files, conversations, decisions, automations and accountable agent identities.",
    outcome: "Keep collaborative work legible without flattening it into a chat stream.",
    primaryAction: "Create workroom",
    secondaryAction: "Invite collaborator",
    tone: "clay",
  },
  {
    id: "studio",
    label: "Studio",
    navCode: "ST",
    eyebrow: "Prepare and publish creative work",
    summary:
      "A focused production surface for composing a release, arranging source material and reviewing every derived output.",
    outcome: "Move from source material to a portable publication with less tool switching.",
    primaryAction: "Publish release",
    secondaryAction: "Preview package",
    tone: "sky",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    navCode: "CP",
    eyebrow: "Coordinate distribution",
    summary:
      "A campaign control room that joins channels, collaborators, milestones, rights and measured outcomes around one brief.",
    outcome: "See the whole campaign while preserving the evidence behind every result.",
    primaryAction: "Create campaign",
    secondaryAction: "Share status",
    tone: "gold",
  },
  {
    id: "packages",
    label: "Packages",
    navCode: "PK",
    eyebrow: "Reusable tools and formats",
    summary:
      "A calm registry for discovering trusted packages, understanding maintainers and installing capabilities into a workspace.",
    outcome: "Make open tooling approachable without hiding provenance or compatibility.",
    primaryAction: "Publish package",
    secondaryAction: "Browse namespaces",
    tone: "violet",
  },
  {
    id: "keyring",
    label: "Keyring",
    navCode: "KY",
    eyebrow: "Identity and permissions",
    summary:
      "A human-readable place to manage personal keys, connected agents, scoped grants and recovery without crypto-first language.",
    outcome: "Understand who can act, where they can act and how access can be recovered.",
    primaryAction: "Add identity",
    secondaryAction: "Review access",
    tone: "coral",
  },
  {
    id: "receipts",
    label: "Receipts",
    navCode: "RC",
    eyebrow: "Accountability without surveillance",
    summary:
      "A searchable trail of meaningful actions, approvals and hand-offs that makes work verifiable without exposing everything.",
    outcome: "Answer what happened, who authorised it and what evidence is attached.",
    primaryAction: "Export receipt",
    secondaryAction: "Set a filter",
    tone: "ink",
  },
] as const satisfies readonly GreenwaysScreenDefinition[];

export type GreenwaysScreenId = (typeof greenwaysProductScreens)[number]["id"];

export function getGreenwaysScreen(id: string) {
  return greenwaysProductScreens.find((screen) => screen.id === id);
}
