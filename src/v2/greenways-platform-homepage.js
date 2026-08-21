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

export const GREENWAYS_FABRIC_HOMEPAGE_VERSION = "greenways-fabric-homepage/2";

export const greenwaysFabricHomepage = deepFreeze({
  meta: {
    title: "www.greenways.ai homepage",
    description: "A public homepage design for Greenways Fabric as the personal operating environment beneath storage, identity, agents, and applications.",
    specimenLabel: "Public website design specimen",
    truthfulnessNote: "Links move within this specimen. No storage, identity, agent, application, account, or hosted-service action is performed.",
  },
  navigation: {
    items: [
      { label: "Fabric", href: "#fabric" },
      { label: "Storage", href: "#storage" },
      { label: "Identity", href: "#identity" },
      { label: "Applications", href: "#applications" },
      { label: "Platform", href: "#platform" },
    ],
    command: { label: "Start with your Fabric", href: "#start" },
  },
  hero: {
    kicker: "Greenways Fabric · your personal operating environment",
    headline: "Your digital life, held together.",
    introduction: "Store your work where you choose. Carry one identity across devices. Give agents clear roles. Open any application without giving up the underlying Fabric.",
    primaryAction: { label: "See what the Fabric holds", href: "#fabric" },
    secondaryAction: { label: "Explore the applications", href: "#applications" },
  },
  core: {
    label: "Your Fabric",
    statement: "One durable layer beneath every Greenways window.",
    note: "Applications can change. Your Fabric remains.",
    pillars: [
      { id: "storage", index: "01", label: "Storage", detail: "Lives where you choose" },
      { id: "identity", index: "02", label: "Identity", detail: "Travels with you" },
      { id: "agents", index: "03", label: "Agents", detail: "Work within a role" },
      { id: "applications", index: "04", label: "Applications", detail: "Use the same foundation" },
    ],
  },
  fabric: {
    kicker: "01 · The personal OS",
    headline: "The Fabric is the OS.",
    introduction: "Greenways keeps the durable parts of your digital life below any single application: where work lives, who may act, what an agent was asked to do, and how everything remains connected.",
    capabilities: [
      {
        id: "owned-storage",
        index: "01",
        label: "Storage you host",
        statement: "Keep work on your computer, home server, or infrastructure you choose.",
        detail: "Open software and open standards keep the exit visible.",
      },
      {
        id: "durable-identity",
        index: "02",
        label: "Identity you carry",
        statement: "Move between devices and applications without becoming a new person in every silo.",
        detail: "Keys prove the link while Greenways shows names, roles, and access.",
      },
      {
        id: "bounded-agents",
        index: "03",
        label: "Agents you direct",
        statement: "Give every agent a name, a purpose, a boundary, and an end date.",
        detail: "Returned work remains attributable to the agent and request.",
      },
      {
        id: "replaceable-apps",
        index: "04",
        label: "Applications you choose",
        statement: "Use Spaces, Build, Studio, Socials, or another compatible application over the same Fabric.",
        detail: "Changing the tool does not require surrendering the underlying work.",
      },
    ],
  },
  storage: {
    kicker: "02 · Storage you host",
    headline: "Your work does not need to live inside someone else’s application.",
    introduction: "Choose the place that fits the work. Greenways keeps storage, movement, backup, and recovery visible without making one vendor the permanent home of your identity.",
    locations: [
      { id: "computer", index: "A", label: "Your computer", detail: "Private work close at hand" },
      { id: "home-server", index: "B", label: "Home server", detail: "An always-available personal home" },
      { id: "chosen-host", index: "C", label: "Chosen host", detail: "Infrastructure you select and can replace" },
    ],
    principles: [
      { label: "Open source", detail: "The foundation can be inspected, operated, and maintained outside one hosted account." },
      { label: "Open standards", detail: "Files, identities, references, and handoffs use documented boundaries rather than a private export promise." },
      { label: "Portable formats", detail: "Exact exports and durable references make moving or rebuilding a deliberate operation." },
    ],
    caveat: "Self-hosting is control, not magic. Backup, availability, and recovery remain choices that Greenways makes visible.",
  },
  identity: {
    kicker: "03 · Identity you carry",
    headline: "One person. Several devices. Clear relationships.",
    introduction: "Keys link your Greenways identity to the devices, applications, collaborators, and agents you approve. The cryptography stays underneath; the interface shows who, where, why, and for how long.",
    centre: { label: "You", detail: "Durable Greenways identity" },
    links: [
      { id: "desktop", index: "01", label: "Desktop", detail: "Enrolled device" },
      { id: "browser", index: "02", label: "Browser", detail: "Bounded companion" },
      { id: "cli", index: "03", label: "CLI", detail: "Named client" },
      { id: "collaborator", index: "04", label: "Collaborator", detail: "Independent identity" },
      { id: "agent", index: "05", label: "Agent", detail: "Scoped participant" },
      { id: "platform", index: "06", label: "Platform account", detail: "Optional hosted identity" },
    ],
    laws: [
      "A device is not a person.",
      "An application is not an identity root.",
      "An agent does not inherit every permission you hold.",
      "Revoking access does not erase the work you own.",
    ],
  },
  agents: {
    kicker: "04 · Agents you direct",
    headline: "Help that arrives with a role—and leaves without taking the keys.",
    introduction: "Agents participate through named assignments. Each one can see only the context it needs, acts for a stated purpose, and returns work with a visible history.",
    examples: [
      {
        id: "analyst",
        index: "01",
        label: "Atlas analyst",
        application: "Spaces",
        purpose: "Compare three sources and return a cited brief.",
        scope: "Selected sources only",
        expiry: "Ends after the brief",
        return: "Brief + source links",
      },
      {
        id: "builder",
        index: "02",
        label: "Release builder",
        application: "Build",
        purpose: "Prepare one project artifact for review.",
        scope: "Named project work",
        expiry: "Ends on completion or revocation",
        return: "Artifact + evidence",
      },
      {
        id: "editor",
        index: "03",
        label: "Scene editor",
        application: "Studio",
        purpose: "Produce a candidate scene from approved assets.",
        scope: "Project assets and scene only",
        expiry: "Ends after candidate delivery",
        return: "Candidate + edit history",
      },
    ],
    rule: "Name the agent. Bound the work. Keep the result attributable.",
  },
  surfaces: {
    kicker: "05 · Same Fabric, different windows",
    headline: "Open the same life from the surface that fits the moment.",
    introduction: "Desktop, browser, CLI, and a home server are ways to reach the same personal Fabric. They do not create competing copies of your identity or turn each window into a separate OS.",
    items: [
      { id: "desktop", index: "01", label: "Desktop", verb: "Work deeply", detail: "Full applications, local files, and private authority." },
      { id: "browser", index: "02", label: "Browser", verb: "Work in context", detail: "Capture, inspect, hand off, and continue beside the web." },
      { id: "cli", index: "03", label: "CLI", verb: "Work precisely", detail: "Address the same Spaces, projects, agents, and evidence by stable identity." },
      { id: "server", index: "04", label: "Home server", verb: "Keep it available", detail: "Your Fabric can continue when no visible application window is open." },
    ],
  },
  applications: {
    kicker: "06 · Applications on top",
    headline: "The application is a view. The Fabric is the OS.",
    introduction: "Each Greenways application concentrates on a different kind of work while sharing the same identity, storage choices, agents, references, and history.",
    items: [
      { id: "spaces", index: "01", label: "Spaces", verb: "Understand", detail: "Bring sources, maps, questions, evidence, and briefs into one grounded place." },
      { id: "build", index: "02", label: "Build", verb: "Coordinate", detail: "Keep people, agents, work, hosts, handoffs, artifacts, and verified outcomes inside one project." },
      { id: "studio", index: "03", label: "Studio", verb: "Create", detail: "Compose worlds, scenes, media, documents, timelines, and renders." },
      { id: "socials", index: "04", label: "Socials", verb: "Connect", detail: "Understand people, organisations, conversations, audiences, and campaigns." },
    ],
  },
  platform: {
    kicker: "07 · Private Fabric, optional Platform",
    headline: "Connect outward without moving the centre of gravity.",
    introduction: "Greenways Platform can add selected collaboration, public work, discovery, and delivery. Your personal Fabric remains useful without it, and local work stays private until you choose a boundary crossing.",
    privateSide: {
      label: "Your Fabric",
      detail: "Private storage, identity, agents, applications, and history remain under your authority.",
      items: ["Local work remains useful offline", "Private context is excluded by default", "Disconnecting a service does not erase ownership"],
    },
    crossing: {
      label: "Only what you select crosses",
      detail: "A specific release, reference, invitation, profile field, or collaboration record—not an unrestricted copy of the Fabric.",
    },
    hostedSide: {
      label: "Greenways Platform",
      detail: "Optional hosted collaboration, public works, profiles, organisations, communities, discovery, and delivery.",
      items: ["Separately authenticated", "Explicitly scoped", "Revocable without replacing local identity"],
    },
  },
  openPrinciples: {
    kicker: "08 · Open by construction",
    headline: "Freedom that survives the first application.",
    items: [
      { id: "source", index: "01", label: "Open source", detail: "The personal foundation is inspectable and operable beyond one vendor." },
      { id: "standards", index: "02", label: "Open standards", detail: "Applications meet the Fabric through documented contracts." },
      { id: "self-hosted", index: "03", label: "Self-hosted", detail: "Storage and service location remain choices rather than hidden assumptions." },
      { id: "portable", index: "04", label: "Portable", detail: "Works, references, and history can move without becoming anonymous files." },
      { id: "replaceable", index: "05", label: "Replaceable", detail: "Applications and providers may change while the Fabric identity remains." },
      { id: "inspectable", index: "06", label: "Inspectable", detail: "Agent work, handoffs, decisions, and external results retain evidence." },
    ],
  },
  finalDoorway: {
    kicker: "Greenways Fabric · design specimen 02",
    headline: "Start with your own Fabric.",
    introduction: "Choose where it lives. Establish your identity. Add the applications and agents that serve the work—not the other way around.",
    action: { label: "Return to the beginning", href: "#top" },
    secondary: "Developer and open-source foundations remain available after the human product story.",
  },
  adoptionNotes: [
    "Keep the production homepage centred on Greenways Fabric as the personal OS.",
    "Explain self-hosting, open source, open standards, keys, and agents through user control rather than infrastructure topology.",
    "Present Spaces, Build, Studio, and Socials only after the Fabric is understood.",
    "Keep Greenways Platform optional and show exactly selected boundary crossings rather than automatic upload.",
    "Replace specimen anchors with live destinations only when those destinations and states are authoritative.",
  ],
});

// Compatibility for the stable route and the previously published laboratory import surface.
export const GREENWAYS_PLATFORM_HOMEPAGE_VERSION = GREENWAYS_FABRIC_HOMEPAGE_VERSION;
export const greenwaysPlatformHomepage = greenwaysFabricHomepage;
