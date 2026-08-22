const freeze = (value) => Object.freeze(value);

/** @typedef {"brand-book" | "documentation" | "application" | "wireframe" | "placeholder"} VisualLayoutDestinationKind */
/** @typedef {"ready" | "reference" | "placeholder"} VisualLayoutDestinationStatus */

/**
 * @typedef {object} VisualLayoutDestination
 * @property {string} id
 * @property {string} label
 * @property {string=} path
 * @property {string} summary
 * @property {VisualLayoutDestinationKind} kind
 * @property {VisualLayoutDestinationStatus} status
 * @property {boolean=} external
 */

/** @typedef {{ id: string, label: string, shortLabel: string, icon: string, summary: string, routes: readonly VisualLayoutDestination[] }} VisualLayoutSection */

/** @type {readonly VisualLayoutSection[]} */
export const visualLayoutSections = freeze([
  {
    id: "themes",
    label: "Themes",
    shortLabel: "Themes",
    icon: "spark",
    summary: "Brand books, documentation moods, and the generated worlds that give the language a place to live.",
    routes: [
      {
        id: "v1-documentation-brand-book",
        label: "v1 documentation style",
        path: "/v1/",
        summary: "The shared documentation shell: route hierarchy, reading space, material surfaces, and project accents.",
        kind: "brand-book",
        status: "ready",
      },
      {
        id: "v2-greenways-brand-book",
        label: "v2 Greenways system",
        path: "/v2/foundations/",
        summary: "Neutral structure, peacock identity, semantic states, and host-specific density.",
        kind: "brand-book",
        status: "ready",
      },
      {
        id: "historia-documentation",
        label: "Historia documentation",
        path: "https://oss.greenways.ai/historia/",
        summary: "Archive, evidence, and comparison language with a deep blue signal.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "hodos-documentation",
        label: "Hodos documentation",
        path: "https://oss.greenways.ai/hodos/",
        summary: "Host-composition and visual-language documentation for the Hodos runtime.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
    ],
  },
  {
    id: "os",
    label: "OS",
    shortLabel: "OS",
    icon: "layers",
    summary: "The Greenways Fabric, its authority boundaries, and the extensions that carry one workspace across hosts.",
    routes: [
      {
        id: "greenways-fabric",
        label: "Greenways Fabric",
        path: "/v2/applications/greenways-platform/homepage/",
        summary: "Storage, identity, agents, applications, and explicit hosted crossings beneath the OS experience.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-os-v2-wireframes",
        label: "Greenways OS surfaces",
        path: "/concepts/greenways-v2/",
        summary: "Native desktop, browser desktop, side panel, popup, and public web studies at their proper scale.",
        kind: "wireframe",
        status: "reference",
      },
    ],
  },
  {
    id: "product",
    label: "Product",
    shortLabel: "Product",
    icon: "grid",
    summary: "The product vocabulary people and agents use to search, relate, imagine, coordinate, and publish.",
    routes: [
      {
        id: "greenways-product-search",
        label: "Search",
        path: "/concepts/greenways-v2/#search",
        summary: "Classify, relate, and recontextualise material without rewriting its source.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-product-timeline",
        label: "Timeline",
        path: "/concepts/greenways-v2/#timeline",
        summary: "Keep conversations, decisions, relationships, and meaningful activity together.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-product-imagine",
        label: "Imagine",
        summary: "A future place for visual thought, generated worlds, and material exploration.",
        kind: "placeholder",
        status: "placeholder",
      },
      {
        id: "greenways-product-spaces",
        label: "Spaces",
        path: "/concepts/greenways-v2/#spaces",
        summary: "Turn selected private work into reviewed public releases.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-product-cowork",
        label: "Cowork",
        path: "/concepts/greenways-v2/#cowork",
        summary: "Coordinate people and agents around bounded context, authority, and outcomes.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-product-world",
        label: "World",
        summary: "A future publication space for places, books, and living releases.",
        kind: "placeholder",
        status: "placeholder",
      },
    ],
  },
  {
    id: "infra",
    label: "Infra",
    shortLabel: "Infra",
    icon: "network",
    summary: "The infrastructure projects that make the Greenways Fabric portable, observable, and effectful.",
    routes: [
      {
        id: "hoplite-documentation",
        label: "Hoplite",
        path: "https://oss.greenways.ai/hoplite/",
        summary: "High-performance application-server documentation with a cyan project signal.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "tahto-documentation",
        label: "Tahto",
        path: "https://oss.greenways.ai/tahto/",
        summary: "Semantic and synchronization-fabric documentation with a gold project signal.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "ignatius-documentation",
        label: "Ignatius",
        path: "https://oss.greenways.ai/ignatius/",
        summary: "Effectful execution, ordered transitions, and receipts at the provider boundary.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "hestia-documentation",
        label: "Hestia",
        path: "https://oss.greenways.ai/hestia/",
        summary: "Sources, evidence, retrieval, and the cloud boundary around the Fabric.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
    ],
  },
]);

export const visualLayoutDestinationKinds = freeze({
  "brand-book": "Brand book",
  documentation: "Documentation",
  application: "Application",
  wireframe: "Wireframe",
  placeholder: "Placeholder",
});

export function flattenVisualLayoutDestinations(sections = visualLayoutSections) {
  return sections.flatMap((section) => section.routes);
}
