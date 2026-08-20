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

export const GREENWAYS_PLATFORM_HOMEPAGE_VERSION = "greenways-platform-homepage/1";

export const greenwaysPlatformHomepage = deepFreeze({
  meta: {
    title: "www.greenways.ai homepage",
    description: "A public homepage design for Greenways as a publishing system for worlds, books, documents, and sites.",
    specimenLabel: "Public website design specimen",
    truthfulnessNote: "Links move within this specimen. No account, publication, agent, or provider action is performed.",
  },
  navigation: {
    items: [
      { label: "Works", href: "#publication-forms" },
      { label: "Process", href: "#publishing-sequence" },
      { label: "Workspace", href: "#publishing-desk" },
      { label: "Principles", href: "#release-principles" },
    ],
    command: { label: "Enter Greenways", href: "#start" },
  },
  hero: {
    kicker: "A publishing system for the living web",
    headline: "Make a place on the web.",
    introduction: "Build a world, write the book, publish the site — without splitting the work apart.",
    primaryAction: { label: "See the publishing sequence", href: "#publishing-sequence" },
    secondaryAction: { label: "Open the publishing desk", href: "#publishing-desk" },
  },
  featuredWork: {
    index: "Publication 01",
    title: "The Peacock Ballroom",
    descriptor: "One work. Four public forms.",
    edition: "Design specimen edition",
    sourceNote: "Each public form remains attached to the same sources, identity, and history.",
    forms: [
      { id: "world", index: "01", label: "World", detail: "Spatial edition" },
      { id: "book", index: "02", label: "Book", detail: "Reading edition" },
      { id: "document", index: "03", label: "Document", detail: "Living notes" },
      { id: "site", index: "04", label: "Site", detail: "Public home" },
    ],
  },
  sequence: [
    {
      id: "gather",
      index: "01",
      label: "Gather",
      statement: "Notes, images, sources, and conversations stay with the work.",
      detail: "Bring the material in without losing where it came from.",
    },
    {
      id: "shape",
      index: "02",
      label: "Shape",
      statement: "Arrange pages, rooms, paths, and chapters in one publication.",
      detail: "The work may be read, entered, followed, or explored.",
    },
    {
      id: "release",
      index: "03",
      label: "Release",
      statement: "Publish the world, the book, the document, or the whole set.",
      detail: "Keep the public edition connected to its history.",
    },
  ],
  publicationForms: [
    { id: "world", index: "01", label: "World", statement: "A place people can enter.", detail: "Rooms, paths, objects, sound, and motion." },
    { id: "book", index: "02", label: "Book", statement: "A sequence people can carry.", detail: "Chapters, plates, editions, and reading paths." },
    { id: "document", index: "03", label: "Document", statement: "A living record people can return to.", detail: "Notes, sources, decisions, and revisions." },
    { id: "site", index: "04", label: "Site", statement: "A public home for the work.", detail: "A durable address with its own shape and voice." },
  ],
  desk: {
    kicker: "Greenways OS · the publishing desk",
    headline: "The place where the work takes shape.",
    introduction: "Write, arrange, review, and release from one calm workspace. The public work stays at the centre.",
    panels: [
      { id: "studio", index: "01", label: "Compose", headline: "Shape the publication", detail: "Pages, scenes, sources, and previews remain side by side." },
      { id: "foreman", index: "02", label: "Coordinate", headline: "Bring in the right help", detail: "People and agents join through named work, scope, and approval." },
      { id: "receipts", index: "03", label: "Release", headline: "Leave a visible history", detail: "Versions, approvals, and publication evidence travel with the work." },
    ],
  },
  coordination: {
    kicker: "Optional coordination",
    headline: "Bring help without handing over the work.",
    introduction: "Foreman can coordinate agents, approvals, and returns. Greenways keeps every contribution attached to the publication and visible to its owner.",
    rules: [
      { label: "Named scope", detail: "Every request says what may be used and what must return." },
      { label: "Human release", detail: "Assistance never becomes publication authority by accident." },
      { label: "Visible evidence", detail: "Results, decisions, and external effects remain attributable." },
    ],
  },
  principles: [
    { id: "one-work", index: "01", label: "One work", detail: "Each public form shares an identity, sources, and history." },
    { id: "portable", index: "02", label: "Portable", detail: "Move between the web, the desk, and the archive without rebuilding the work." },
    { id: "human-release", index: "03", label: "Human release", detail: "Agents may assist. A person decides what becomes public." },
  ],
  finalDoorway: {
    kicker: "Greenways · design specimen 01",
    headline: "Start with a page. Leave with a world.",
    introduction: "The first step is small: make a work and give it a public place.",
    action: { label: "Return to the beginning", href: "#top" },
    secondary: "Open foundations remain discoverable after the product story, not in front of it.",
  },
  adoptionNotes: [
    "Keep the production homepage centred on making and publishing one work.",
    "Replace specimen anchors with real product destinations only when those destinations exist.",
    "Keep Greenways OS, Foreman, and infrastructure detail subordinate to the publication journey.",
    "Keep open-source projects available through About or the footer rather than the first viewport.",
  ],
});
