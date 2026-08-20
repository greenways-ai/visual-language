// @ts-check

/** @typedef {"navigation" | "button" | "toggle" | "field" | "tabs" | "filters" | "list" | "card" | "table" | "panel" | "dialog" | "status" | "activity" | "approval" | "receipt" | "workbench"} GreenwaysV2ComponentCategory */
/** @typedef {"none" | "native" | "host"} GreenwaysV2BehaviourOwner */
/**
 * @typedef {object} GreenwaysV2ComponentDefinition
 * @property {GreenwaysV2ComponentCategory} id
 * @property {string} name
 * @property {string} exportKey
 * @property {string} source
 * @property {string} semanticRoot
 * @property {string} dataMarker
 * @property {readonly string[]} states
 * @property {readonly string[]} accessibility
 * @property {GreenwaysV2BehaviourOwner} behaviourOwner
 * @property {string} boundary
 */
/**
 * @typedef {object} GreenwaysV2WorkbenchRegion
 * @property {"command-bar" | "navigation" | "workspace" | "inspector" | "activity" | "status"} id
 * @property {string} label
 * @property {string} slot
 * @property {string} landmark
 * @property {string} collapse
 */

/**
 * @template T
 * @param {T} value
 * @returns {Readonly<T>}
 */
const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return /** @type {Readonly<T>} */ (value);
};

export const GREENWAYS_V2_COMPONENT_CONTRACT_VERSION = "1";

export const greenwaysV2StateMarkers = deepFreeze([
  "initial",
  "active",
  "selected",
  "loading",
  "empty",
  "stale",
  "partial",
  "offline",
  "success",
  "warning",
  "danger",
  "disabled",
]);

/** @type {readonly GreenwaysV2ComponentDefinition[]} */
export const greenwaysV2Components = deepFreeze([
  {
    id: "navigation",
    name: "Navigation",
    exportKey: "./v2/astro/Navigation.astro",
    source: "src/v2/astro/Navigation.astro",
    semanticRoot: "nav",
    dataMarker: "Navigation",
    states: ["initial", "active", "selected", "disabled"],
    accessibility: ["labelled landmark", "aria-current", "disabled item text"],
    behaviourOwner: "native",
    boundary: "Renders destinations and current location; route changes remain ordinary link navigation.",
  },
  {
    id: "button",
    name: "Action",
    exportKey: "./v2/astro/Action.astro",
    source: "src/v2/astro/Action.astro",
    semanticRoot: "button or anchor",
    dataMarker: "Action",
    states: ["initial", "loading", "disabled", "danger"],
    accessibility: ["native control", "visible focus", "aria-busy"],
    behaviourOwner: "host",
    boundary: "Presents an action and its pending state; the host owns the command and outcome.",
  },
  {
    id: "toggle",
    name: "Toggle",
    exportKey: "./v2/astro/Toggle.astro",
    source: "src/v2/astro/Toggle.astro",
    semanticRoot: "label and checkbox",
    dataMarker: "Toggle",
    states: ["initial", "active", "disabled", "stale"],
    accessibility: ["native checkbox", "role switch", "requested-versus-actual text"],
    behaviourOwner: "host",
    boundary: "Displays requested and actual state separately; changing the control is not proof of an external effect.",
  },
  {
    id: "field",
    name: "Field",
    exportKey: "./v2/astro/Field.astro",
    source: "src/v2/astro/Field.astro",
    semanticRoot: "label and form control",
    dataMarker: "Field",
    states: ["initial", "active", "success", "danger", "disabled"],
    accessibility: ["explicit label", "described-by hint", "announced error"],
    behaviourOwner: "host",
    boundary: "Owns form semantics and validation presentation; the host owns data and submission.",
  },
  {
    id: "tabs",
    name: "Tabs",
    exportKey: "./v2/astro/Tabs.astro",
    source: "src/v2/astro/Tabs.astro",
    semanticRoot: "tablist",
    dataMarker: "Tabs",
    states: ["initial", "selected", "disabled"],
    accessibility: ["tablist label", "aria-selected", "controlled panel ids"],
    behaviourOwner: "host",
    boundary: "Declares tab semantics and selection; panel switching and history are host-owned.",
  },
  {
    id: "filters",
    name: "FilterBar",
    exportKey: "./v2/astro/FilterBar.astro",
    source: "src/v2/astro/FilterBar.astro",
    semanticRoot: "search form",
    dataMarker: "FilterBar",
    states: ["initial", "active", "empty", "loading"],
    accessibility: ["search landmark", "labelled query", "result summary"],
    behaviourOwner: "host",
    boundary: "Collects search and filter intent; result calculation and loading remain host-owned.",
  },
  {
    id: "list",
    name: "List",
    exportKey: "./v2/astro/List.astro",
    source: "src/v2/astro/List.astro",
    semanticRoot: "section and list",
    dataMarker: "List",
    states: ["initial", "selected", "empty", "loading", "stale"],
    accessibility: ["labelled region", "real list", "non-colour status label"],
    behaviourOwner: "none",
    boundary: "Presents ordered or unordered records without inventing selection or completion behaviour.",
  },
  {
    id: "card",
    name: "Card",
    exportKey: "./v2/astro/Card.astro",
    source: "src/v2/astro/Card.astro",
    semanticRoot: "article",
    dataMarker: "Card",
    states: ["initial", "selected", "loading", "success", "warning", "danger"],
    accessibility: ["labelled article", "semantic heading", "explicit selected marker"],
    behaviourOwner: "none",
    boundary: "Composes a bounded item; application commands belong in an explicit actions slot.",
  },
  {
    id: "table",
    name: "DataTable",
    exportKey: "./v2/astro/DataTable.astro",
    source: "src/v2/astro/DataTable.astro",
    semanticRoot: "table",
    dataMarker: "DataTable",
    states: ["initial", "empty", "loading", "stale"],
    accessibility: ["caption", "column headers", "row headers", "compact data labels"],
    behaviourOwner: "none",
    boundary: "Presents comparable records; sorting and pagination are explicit host controls.",
  },
  {
    id: "panel",
    name: "Panel",
    exportKey: "./v2/astro/Panel.astro",
    source: "src/v2/astro/Panel.astro",
    semanticRoot: "section or details",
    dataMarker: "Panel",
    states: ["initial", "active", "loading", "empty"],
    accessibility: ["labelled region", "native disclosure", "separate action slot"],
    behaviourOwner: "native",
    boundary: "Owns grouping and optional disclosure only; content state remains host-owned.",
  },
  {
    id: "dialog",
    name: "Dialog",
    exportKey: "./v2/astro/Dialog.astro",
    source: "src/v2/astro/Dialog.astro",
    semanticRoot: "dialog",
    dataMarker: "Dialog",
    states: ["initial", "active", "loading", "danger"],
    accessibility: ["labelled dialog", "described dialog", "native close form"],
    behaviourOwner: "host",
    boundary: "Provides dialog structure and visible specimen state; opening, focus return, and commands remain host-owned.",
  },
  {
    id: "status",
    name: "Status",
    exportKey: "./v2/astro/Status.astro",
    source: "src/v2/astro/Status.astro",
    semanticRoot: "status text",
    dataMarker: "Status",
    states: ["initial", "active", "success", "warning", "danger", "offline"],
    accessibility: ["text label", "shape marker", "optional live region"],
    behaviourOwner: "none",
    boundary: "Reports a supplied state without inferring success from colour or intent.",
  },
  {
    id: "activity",
    name: "ActivityList",
    exportKey: "./v2/astro/ActivityList.astro",
    source: "src/v2/astro/ActivityList.astro",
    semanticRoot: "section and ordered list",
    dataMarker: "ActivityList",
    states: ["initial", "empty", "loading", "partial", "stale"],
    accessibility: ["chronological list", "time element", "actor attribution", "evidence link"],
    behaviourOwner: "none",
    boundary: "Displays supplied history and evidence; it never manufactures an activity record.",
  },
  {
    id: "approval",
    name: "ApprovalCard",
    exportKey: "./v2/astro/ApprovalCard.astro",
    source: "src/v2/astro/ApprovalCard.astro",
    semanticRoot: "article",
    dataMarker: "ApprovalCard",
    states: ["initial", "active", "success", "warning", "danger", "stale"],
    accessibility: ["requested and actual state", "scope list", "actor attribution", "action group label"],
    behaviourOwner: "host",
    boundary: "Makes scope and authority legible; approving, denying, expiry, and revocation remain host operations.",
  },
  {
    id: "receipt",
    name: "Receipt",
    exportKey: "./v2/astro/Receipt.astro",
    source: "src/v2/astro/Receipt.astro",
    semanticRoot: "article",
    dataMarker: "Receipt",
    states: ["initial", "success", "warning", "danger", "partial"],
    accessibility: ["receipt identifier", "verification status", "time element", "evidence list"],
    behaviourOwner: "none",
    boundary: "Presents supplied evidence and verification; visual completion never substitutes for a real receipt.",
  },
  {
    id: "workbench",
    name: "WorkbenchShell",
    exportKey: "./v2/astro/WorkbenchShell.astro",
    source: "src/v2/astro/WorkbenchShell.astro",
    semanticRoot: "section with named landmarks",
    dataMarker: "WorkbenchShell",
    states: ["initial", "active", "loading", "empty", "offline", "danger"],
    accessibility: ["named regions", "one primary workspace", "compact linear order", "visible status text"],
    behaviourOwner: "host",
    boundary: "Provides composition regions only; commands, navigation state, data, persistence, and effects remain application-owned.",
  },
]);

/** @type {readonly GreenwaysV2WorkbenchRegion[]} */
export const greenwaysV2WorkbenchRegions = deepFreeze([
  { id: "command-bar", label: "Command bar", slot: "command-bar", landmark: "header", collapse: "first" },
  { id: "navigation", label: "Project and buildout navigation", slot: "navigation", landmark: "nav", collapse: "second" },
  { id: "workspace", label: "Primary workspace", slot: "default", landmark: "main", collapse: "third" },
  { id: "inspector", label: "Inspector", slot: "inspector", landmark: "aside", collapse: "fourth" },
  { id: "activity", label: "Activity and log", slot: "activity", landmark: "aside", collapse: "fifth" },
  { id: "status", label: "Compact status", slot: "status", landmark: "footer", collapse: "last" },
]);

/** @param {string} id */
export function getGreenwaysV2Component(id) {
  return greenwaysV2Components.find((component) => component.id === id || component.name === id);
}
