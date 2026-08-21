// @ts-check

/** @typedef {"ready" | "in-progress" | "planned" | "exploration"} GreenwaysV2CatalogueStatus */
/** @typedef {"shared-contract" | "product-laboratory" | "historical-exploration"} GreenwaysV2CatalogueOwnership */
/**
 * @typedef {object} GreenwaysV2CatalogueRoute
 * @property {string} id
 * @property {string} label
 * @property {string} path
 * @property {string} summary
 * @property {GreenwaysV2CatalogueStatus} status
 * @property {GreenwaysV2CatalogueOwnership} ownership
 * @property {number=} issue
 * @property {boolean=} primary
 * @property {readonly GreenwaysV2CatalogueRoute[]=} children
 */
/**
 * @typedef {object} GreenwaysV2CatalogueGroup
 * @property {"foundations" | "library" | "applications"} id
 * @property {string} label
 * @property {string} summary
 * @property {readonly GreenwaysV2CatalogueRoute[]} routes
 */

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

/** @type {Readonly<Record<GreenwaysV2CatalogueStatus, string>>} */
export const catalogueStatusLabels = deepFreeze({
  ready: "Ready",
  "in-progress": "In progress",
  planned: "Planned",
  exploration: "Exploration",
});

/** @type {Readonly<Record<GreenwaysV2CatalogueOwnership, string>>} */
export const catalogueOwnershipLabels = deepFreeze({
  "shared-contract": "Shared contract",
  "product-laboratory": "Product laboratory",
  "historical-exploration": "Historical exploration",
});

/** @type {Readonly<GreenwaysV2CatalogueRoute>} */
export const greenwaysV2CatalogueHome = deepFreeze({
  id: "catalogue-home",
  label: "Greenways v2 catalogue",
  path: "/",
  summary: "The shared route index for Greenways foundations, reusable interface studies, and application laboratories.",
  status: "ready",
  ownership: "shared-contract",
  primary: true,
});

/** @type {readonly GreenwaysV2CatalogueGroup[]} */
export const greenwaysV2Catalogue = deepFreeze([
  {
    id: "foundations",
    label: "Foundations",
    summary: "Protected identity, semantic tokens, material, typography, geometry, motion, accessibility, and responsive rules.",
    routes: [
      {
        id: "foundations-laboratory",
        label: "Foundations laboratory",
        path: "/v2/foundations/",
        summary: "Executable specimens for the complete shared Greenways v2 visual contract.",
        status: "ready",
        ownership: "shared-contract",
        issue: 33,
        primary: true,
      },
    ],
  },
  {
    id: "library",
    label: "Library",
    summary: "Reusable components and workflow-state studies, separated from application-owned behaviour.",
    routes: [
      {
        id: "library-home",
        label: "Library overview",
        path: "/v2/library/",
        summary: "The index for shared component and workflow-state laboratories.",
        status: "ready",
        ownership: "shared-contract",
        issue: 34,
        primary: true,
        children: [
          {
            id: "component-laboratory",
            label: "Components",
            path: "/v2/library/components/",
            summary: "Navigation, controls, content, status, approval, activity, and receipt primitives.",
            status: "ready",
            ownership: "shared-contract",
            issue: 34,
            primary: true,
          },
          {
            id: "workflow-state-laboratory",
            label: "Workflow states",
            path: "/v2/library/workflows/",
            summary: "Initial, active, empty, loading, degraded, error, recovery, and success compositions.",
            status: "ready",
            ownership: "shared-contract",
            issue: 34,
            primary: true,
          },
        ],
      },
    ],
  },
  {
    id: "applications",
    label: "Applications",
    summary: "Product-specific laboratories built on the shared package without becoming package exports.",
    routes: [
      {
        id: "greenways-suite",
        label: "Current Greenways suite",
        path: "/v2/applications/greenways-suite/",
        summary: "The current Spaces and Flow shell across native desktop, browser workspace, bounded companion, CLI, and exact cross-application handoffs.",
        status: "in-progress",
        ownership: "product-laboratory",
        issue: 58,
        primary: true,
        children: [
          {
            id: "greenways-suite-desktop",
            label: "Spaces · Native desktop",
            path: "/v2/applications/greenways-suite/desktop/",
            summary: "A source-backed Spaces workbench with one selected identity across map, evidence, sources, and cited brief composition.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 59,
            primary: true,
          },
          {
            id: "greenways-suite-browser",
            label: "Flow · Browser workspace",
            path: "/v2/applications/greenways-suite/browser/",
            summary: "A project-first Flow Control Room for agents, work, hosts, handoffs, attention, and attributable activity.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 36,
            primary: true,
          },
          {
            id: "greenways-suite-companion",
            label: "Browser companion",
            path: "/v2/applications/greenways-suite/companion/",
            summary: "Bounded Spaces capture and Flow context review without compressing either full application into a side panel or popup.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 58,
            primary: true,
          },
          {
            id: "greenways-suite-cli",
            label: "CLI companion",
            path: "/v2/applications/greenways-suite/cli/",
            summary: "Current Spaces and Flow command examples with stable references, compatibility disclosure, and absent future products.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 58,
            primary: true,
          },
          {
            id: "greenways-suite-handoff",
            label: "Spaces ↔ Flow handoff",
            path: "/v2/applications/greenways-suite/handoff/",
            summary: "A traceable cited brief to project work to selected result loop with included context, excluded authority, and uncertain states.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 58,
            primary: true,
          },
        ],
      },
      {
        id: "foreman",
        label: "Foreman",
        path: "/v2/applications/foreman/",
        summary: "The application at the fore: projects, buildouts, sessions, approvals, handoffs, execution, and activity.",
        status: "in-progress",
        ownership: "product-laboratory",
        issue: 35,
        primary: true,
        children: [
          {
            id: "foreman-model",
            label: "Product model and states",
            path: "/v2/applications/foreman/model/",
            summary: "User language, information architecture, entity relationships, navigation, and truthful lifecycle states.",
            status: "ready",
            ownership: "product-laboratory",
            issue: 35,
            primary: true,
          },
          {
            id: "foreman-tools",
            label: "MCP and sandbox tools",
            path: "/v2/applications/foreman/tools/",
            summary: "Application-scoped Observe/Act tools, client capability negotiation, browser consent, execution hosts, sandbox leases, and evidence.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 50,
            primary: true,
          },
          {
            id: "foreman-projects",
            label: "Projects and buildouts",
            path: "/v2/applications/foreman/projects/",
            summary: "The project index, buildout board, selected buildout workbench, evidence, and human attention.",
            status: "planned",
            ownership: "product-laboratory",
            issue: 36,
            primary: true,
          },
          {
            id: "foreman-handoffs",
            label: "Authorised handoffs",
            path: "/v2/applications/foreman/handoffs/",
            summary: "Explicit cross-provider requests, approval, dispatch, return, recovery, and evidence.",
            status: "planned",
            ownership: "product-laboratory",
            issue: 37,
            primary: true,
          },
          {
            id: "foreman-surfaces",
            label: "Delivery surfaces",
            path: "/v2/applications/foreman/surfaces/",
            summary: "Native desktop, browser workspace, side panel, compact launcher, and CLI companion boundaries.",
            status: "planned",
            ownership: "product-laboratory",
            issue: 38,
            primary: true,
          },
        ],
      },
      {
        id: "greenways-platform",
        label: "Greenways Fabric",
        path: "/v2/applications/greenways-platform/",
        summary: "The personal operating environment that keeps storage, identity, agents, and applications connected under the person’s control.",
        status: "in-progress",
        ownership: "product-laboratory",
        issue: 54,
        primary: true,
        children: [
          {
            id: "greenways-platform-homepage",
            label: "www.greenways.ai homepage",
            path: "/v2/applications/greenways-platform/homepage/",
            summary: "A Fabric-first public doorway centred on self-hosted storage, durable identity, bounded agents, replaceable applications, and optional hosted services.",
            status: "in-progress",
            ownership: "product-laboratory",
            issue: 54,
            primary: true,
          },
        ],
      },
      {
        id: "greenways-os-exploration",
        label: "Greenways OS interface atlas",
        path: "/concepts/greenways-v2/",
        summary: "Historical host-surface studies retained as exploration, not the current Spaces and Flow product architecture.",
        status: "exploration",
        ownership: "historical-exploration",
        primary: false,
        children: [
          {
            id: "greenways-os-native-desktop",
            label: "Native desktop study",
            path: "/concepts/greenways-v2/desktop/",
            summary: "Historical full-workspace host study.",
            status: "exploration",
            ownership: "historical-exploration",
            primary: false,
          },
          {
            id: "greenways-os-browser-desktop",
            label: "Browser desktop study",
            path: "/concepts/greenways-v2/extension-desktop/",
            summary: "Historical full-page extension workspace study.",
            status: "exploration",
            ownership: "historical-exploration",
            primary: false,
          },
          {
            id: "greenways-os-side-panel",
            label: "Side panel study",
            path: "/concepts/greenways-v2/extension-panel/",
            summary: "Historical contextual browser companion study.",
            status: "exploration",
            ownership: "historical-exploration",
            primary: false,
          },
          {
            id: "greenways-os-popup",
            label: "Compact popup study",
            path: "/concepts/greenways-v2/extension-popup/",
            summary: "Historical launcher and health surface study.",
            status: "exploration",
            ownership: "historical-exploration",
            primary: false,
          },
          {
            id: "greenways-os-web",
            label: "Web study",
            path: "/concepts/greenways-v2/web/",
            summary: "Historical public publishing and remote workspace study.",
            status: "exploration",
            ownership: "historical-exploration",
            primary: false,
          },
        ],
      },
      {
        id: "greenways-product-exploration",
        label: "Earlier Greenways product screens",
        path: "/concepts/greenways/",
        summary: "The superseded product taxonomy retained for historical review and migration evidence.",
        status: "exploration",
        ownership: "historical-exploration",
        primary: false,
        children: [
          ...["today", "workrooms", "studio", "campaigns", "packages", "keyring", "receipts"].map((id) => ({
            id: `greenways-product-${id}`,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            path: `/concepts/greenways/${id}/`,
            summary: `Historical ${id} product-screen study.`,
            status: /** @type {const} */ ("exploration"),
            ownership: /** @type {const} */ ("historical-exploration"),
            primary: false,
          })),
          {
            id: "greenways-product-control-plane",
            label: "Control plane study",
            path: "/concepts/greenways/control-plane/",
            summary: "Historical infrastructure-oriented product study.",
            status: "exploration",
            ownership: "historical-exploration",
            primary: false,
          },
        ],
      },
    ],
  },
]);

/**
 * @param {readonly GreenwaysV2CatalogueRoute[]} routes
 * @returns {GreenwaysV2CatalogueRoute[]}
 */
const flattenRoutes = (routes) => routes.flatMap((route) => [route, ...flattenRoutes(route.children ?? [])]);

/**
 * @param {readonly GreenwaysV2CatalogueGroup[]} [groups]
 * @returns {readonly GreenwaysV2CatalogueRoute[]}
 */
export function flattenCatalogueRoutes(groups = greenwaysV2Catalogue) {
  return groups.flatMap((group) => flattenRoutes(group.routes));
}

/** @param {string} value */
const normaliseBase = (value) => {
  const clean = String(value || "/").split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}` : "";
};

/**
 * @param {string} value
 * @param {string} [basePath]
 */
export function normaliseCataloguePath(value, basePath = "/") {
  let pathname = String(value || "/");
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(pathname)) pathname = new URL(pathname).pathname;
  pathname = pathname.split(/[?#]/, 1)[0] || "/";
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, "/");

  const base = normaliseBase(basePath);
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) pathname = pathname.slice(base.length) || "/";
  if (pathname !== "/" && !pathname.endsWith("/")) pathname = `${pathname}/`;
  return pathname;
}

/**
 * @param {string} path
 * @param {string} [basePath]
 */
export function catalogueHref(path, basePath = "/") {
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith("//")) return path;
  const base = normaliseBase(basePath);
  const pathname = normaliseCataloguePath(path);
  return `${base}${pathname}` || "/";
}

/**
 * @param {string} routePath
 * @param {string} currentPath
 * @param {string} [basePath]
 */
export function isCatalogueRouteCurrent(routePath, currentPath, basePath = "/") {
  const route = normaliseCataloguePath(routePath);
  const current = normaliseCataloguePath(currentPath, basePath);
  return route === current || (route === "/" && current === "/v2/");
}

/**
 * @param {string} routePath
 * @param {string} currentPath
 * @param {string} [basePath]
 */
export function isCatalogueRouteActive(routePath, currentPath, basePath = "/") {
  const route = normaliseCataloguePath(routePath);
  const current = normaliseCataloguePath(currentPath, basePath);
  return route === current || (route === "/" && current === "/v2/") || (route !== "/" && current.startsWith(route));
}

/** @param {string} path */
export function getCatalogueRoute(path) {
  const target = normaliseCataloguePath(path);
  if (target === greenwaysV2CatalogueHome.path || target === "/v2/") return greenwaysV2CatalogueHome;
  return flattenCatalogueRoutes().find((route) => normaliseCataloguePath(route.path) === target);
}

/** @param {string} path */
export function getCatalogueGroup(path) {
  const target = normaliseCataloguePath(path);
  return greenwaysV2Catalogue.find((group) => flattenRoutes(group.routes).some((route) => normaliseCataloguePath(route.path) === target));
}

export function getCatalogueStaticRoutes() {
  return flattenCatalogueRoutes().filter((route) => route.path.startsWith("/v2/") && route.path !== greenwaysV2CatalogueHome.path);
}
