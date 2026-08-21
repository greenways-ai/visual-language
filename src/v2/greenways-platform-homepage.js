// @ts-check

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

export const GREENWAYS_FABRIC_HOMEPAGE_VERSION = "greenways-fabric-homepage/3";

export const greenwaysFabricHomepage = deepFreeze({
  meta: {
    title: "Greenways Fabric",
    description: "An interface-led homepage study showing how Greenways Fabric gathers storage, identity, agents, Spaces, and Flow into one calm personal operating environment.",
    specimenLabel: "Static interface study",
    truthfulnessNote: "Controls change this visual specimen only. No storage, identity, agent, application, account, upload, sync, or hosted action is performed.",
  },
  hero: {
    kicker: "Greenways Fabric · personal operating environment",
    headline: "Everything settles into place.",
    introduction: "Your work. Your identity. Clear roles.",
  },
  modes: [
    { id: "scatter", label: "Scattered" },
    { id: "fabric", label: "Fabric" },
  ],
  fragments: [
    { id: "tabs", glyph: "▥", label: "12 open tabs", detail: "three browsers" },
    { id: "downloads", glyph: "↓", label: "Downloads", detail: "7 unnamed files" },
    { id: "notes", glyph: "✎", label: "Untitled notes", detail: "four copies" },
    { id: "account", glyph: "◇", label: "Another account", detail: "identity split" },
    { id: "agent", glyph: "◎", label: "Agent output", detail: "scope unclear" },
    { id: "tasks", glyph: "✓", label: "Loose tasks", detail: "six places" },
    { id: "receipt", glyph: "↳", label: "Result history", detail: "detached" },
    { id: "source", glyph: "⌁", label: "Source links", detail: "context missing" },
  ],
  fabric: {
    label: "Personal Fabric",
    status: [
      { id: "storage", label: "Storage", value: "Home" },
      { id: "identity", label: "Identity", value: "Linked" },
      { id: "agents", label: "Agents", value: "Scoped" },
      { id: "history", label: "History", value: "Current" },
    ],
  },
  workspace: {
    objects: [
      { id: "atlas", label: "Peacock atlas", kind: "Space", state: "active" },
      { id: "brief", label: "Migration brief", kind: "Document", state: "ready" },
      { id: "release", label: "Release 07", kind: "Flow", state: "review" },
    ],
    spaces: {
      label: "Spaces",
      verb: "Understand",
      title: "Peacock atlas",
      meta: "4 sources · 12 references",
      sources: [
        { id: "field", label: "Field notes", state: "grounded" },
        { id: "archive", label: "Archive plate", state: "linked" },
        { id: "brief", label: "Cited brief", state: "ready" },
        { id: "map", label: "Relationship map", state: "current" },
      ],
    },
    flow: {
      label: "Flow",
      verb: "Coordinate",
      title: "Fabric homepage",
      meta: "3 actors · 1 review",
      lanes: [
        { id: "intent", label: "Intent", count: "01", item: "Preserve the calm centre" },
        { id: "work", label: "In motion", count: "02", item: "Interface and responsive proof" },
        { id: "review", label: "Review", count: "01", item: "Human visual acceptance" },
      ],
    },
  },
  identity: {
    label: "You",
    detail: "2 enrolled surfaces",
  },
  agents: [
    { id: "source-analysis", label: "Source analyst", application: "Spaces", scope: "Selected sources", state: "Ends with brief" },
    { id: "delivery", label: "Release coordinator", application: "Flow", scope: "Homepage buildout", state: "Ends after review" },
  ],
  applications: {
    headline: "One Fabric. Two current views.",
    items: [
      { id: "spaces", label: "Spaces", verb: "Understand" },
      { id: "flow", label: "Flow", verb: "Coordinate" },
    ],
  },
  platform: {
    headline: "Only the selected piece crosses.",
    selected: { label: "Peacock brief", detail: "Public projection" },
    privateItems: ["Source archive", "Agent scopes", "Private notes"],
    hostedItems: ["Shared brief", "Invitation", "Public profile"],
  },
  closing: {
    headline: "Keep the centre.",
    detail: "Applications can change. Your Fabric remains.",
  },
  adoptionNotes: [
    "Lead with the decluttering experience rather than explanatory sections.",
    "Keep Spaces and Flow as the only current application names.",
    "Keep the personal Fabric private by default and make hosted crossing explicit.",
    "Treat self-hosting, open source, open standards, and portable formats as quiet product facts rather than a word-heavy feature catalogue.",
  ],
});

// Compatibility for the stable route and previously published import surface.
export const GREENWAYS_PLATFORM_HOMEPAGE_VERSION = GREENWAYS_FABRIC_HOMEPAGE_VERSION;
export const greenwaysPlatformHomepage = greenwaysFabricHomepage;
