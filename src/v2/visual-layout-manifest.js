const freeze = (value) => Object.freeze(value);

/** @typedef {"brand-book" | "documentation" | "application" | "wireframe"} VisualLayoutDestinationKind */

/**
 * @typedef {object} VisualLayoutDestination
 * @property {string} id
 * @property {string} label
 * @property {string} path
 * @property {string} summary
 * @property {VisualLayoutDestinationKind} kind
 * @property {"ready" | "reference"} status
 * @property {boolean=} external
 */

/** @typedef {{ id: string, label: string, summary: string, routes: readonly VisualLayoutDestination[] }} VisualLayoutSection */

/** @type {readonly VisualLayoutSection[]} */
export const visualLayoutSections = freeze([
  {
    id: "brand-systems",
    label: "Brand systems",
    summary: "The two canonical visual contracts: documentation-first v1 and host-adaptive v2.",
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
    ],
  },
  {
    id: "documentation-styles",
    label: "Documentation styles",
    summary: "Living product documentation surfaces that adopt the shared Greenways documentation relationship.",
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
        id: "historia-documentation",
        label: "Historia",
        path: "https://oss.greenways.ai/historia/",
        summary: "Historical analysis documentation with a blue project signal.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "hodos-documentation",
        label: "Hodos",
        path: "https://oss.greenways.ai/hodos/",
        summary: "Visual language and host-composition documentation for the Hodos runtime.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "hestia-documentation",
        label: "Hestia",
        path: "https://oss.greenways.ai/hestia/",
        summary: "Fabric and cloud-boundary documentation with a terracotta project signal.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
      {
        id: "ignatius-documentation",
        label: "Ignatius",
        path: "https://oss.greenways.ai/ignatius/",
        summary: "Language and tooling documentation with a gold signal on a dark technical field.",
        kind: "documentation",
        status: "reference",
        external: true,
      },
    ],
  },
  {
    id: "application-styles",
    label: "Application styles",
    summary: "Product-owned laboratories that compose the shared visual contract into real application language.",
    routes: [
      {
        id: "foreman-application",
        label: "Foreman",
        path: "/v2/applications/foreman/",
        summary: "Projects, buildouts, sessions, approvals, handoffs, execution, and activity.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-platform-application",
        label: "Greenways Platform",
        path: "/v2/applications/greenways-platform/homepage/",
        summary: "A publication-led public doorway for worlds, books, documents, sites, and workspaces.",
        kind: "application",
        status: "reference",
      },
      {
        id: "greenways-public-site",
        label: "Greenways public site",
        path: "https://greenways.ai/",
        summary: "The public Greenways doorway and product expression.",
        kind: "application",
        status: "reference",
        external: true,
      },
    ],
  },
  {
    id: "wireframes",
    label: "Wireframes and concept studies",
    summary: "Host surfaces and product wireframes retained as navigable visual evidence.",
    routes: [
      {
        id: "greenways-os-v2-wireframes",
        label: "Greenways OS v2 surfaces",
        path: "/concepts/greenways-v2/",
        summary: "Native desktop, browser desktop, side panel, popup, and public web studies.",
        kind: "wireframe",
        status: "reference",
      },
      {
        id: "greenways-product-wireframes",
        label: "Earlier Greenways product screens",
        path: "/concepts/greenways/",
        summary: "Historical product-screen studies retained for migration and visual comparison.",
        kind: "wireframe",
        status: "reference",
      },
      {
        id: "statstrade-wireframes",
        label: "Statstrade studies",
        path: "/concepts/statstrade/",
        summary: "A project-specific visual language study for feed and arena surfaces.",
        kind: "wireframe",
        status: "reference",
      },
    ],
  },
]);

export const visualLayoutDestinationKinds = freeze({
  "brand-book": "Brand book",
  documentation: "Documentation",
  application: "Application",
  wireframe: "Wireframe",
});

export function flattenVisualLayoutDestinations(sections = visualLayoutSections) {
  return sections.flatMap((section) => section.routes);
}
