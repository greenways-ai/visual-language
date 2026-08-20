// @ts-check

import {
  greenwaysV2ComponentGroups,
  greenwaysV2Components,
  greenwaysV2WorkbenchRegions,
  greenwaysV2WorkflowStates,
  greenwaysV2Workflows,
} from "./component-catalogue.js";

/**
 * @typedef {object} GreenwaysV2AstroComponentContract
 * @property {string} id
 * @property {string} label
 * @property {string} exportKey
 * @property {string} source
 * @property {readonly string[]} catalogueIds
 * @property {"none" | "native" | "host"} behaviourOwner
 * @property {string} boundary
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

export {
  greenwaysV2ComponentGroups,
  greenwaysV2Components as greenwaysV2ComponentDefinitions,
  greenwaysV2WorkbenchRegions,
  greenwaysV2WorkflowStates as greenwaysV2StateDefinitions,
  greenwaysV2Workflows as greenwaysV2WorkflowDefinitions,
};

export const greenwaysV2StateMarkers = deepFreeze([
  ...new Set([
    ...greenwaysV2Components.flatMap((component) => component.states),
    ...greenwaysV2WorkflowStates.map((state) => state.id),
  ]),
]);

/** @type {readonly GreenwaysV2AstroComponentContract[]} */
export const greenwaysV2AstroComponents = deepFreeze([
  {
    id: "navigation",
    label: "Navigation",
    exportKey: "./v2/astro/Navigation.astro",
    source: "src/v2/astro/Navigation.astro",
    catalogueIds: ["primary-navigation"],
    behaviourOwner: "native",
    boundary: "Renders destinations and current location; route changes remain ordinary link navigation.",
  },
  {
    id: "action",
    label: "Action",
    exportKey: "./v2/astro/Action.astro",
    source: "src/v2/astro/Action.astro",
    catalogueIds: ["button"],
    behaviourOwner: "host",
    boundary: "Presents intent and pending state; the host owns the command and its outcome.",
  },
  {
    id: "toggle",
    label: "Toggle",
    exportKey: "./v2/astro/Toggle.astro",
    source: "src/v2/astro/Toggle.astro",
    catalogueIds: ["toggle"],
    behaviourOwner: "host",
    boundary: "Displays requested and actual state separately; a changed control is not proof of an external effect.",
  },
  {
    id: "field",
    label: "Field",
    exportKey: "./v2/astro/Field.astro",
    source: "src/v2/astro/Field.astro",
    catalogueIds: ["text-field"],
    behaviourOwner: "host",
    boundary: "Owns labels, hints and error relationships; the host owns data, validation and submission.",
  },
  {
    id: "tabs",
    label: "Tabs",
    exportKey: "./v2/astro/Tabs.astro",
    source: "src/v2/astro/Tabs.astro",
    catalogueIds: ["tabs"],
    behaviourOwner: "host",
    boundary: "Declares tab semantics and selection; the host owns panel switching and history.",
  },
  {
    id: "filter-bar",
    label: "Filter bar",
    exportKey: "./v2/astro/FilterBar.astro",
    source: "src/v2/astro/FilterBar.astro",
    catalogueIds: ["text-field", "filter-chip"],
    behaviourOwner: "host",
    boundary: "Collects search and filter intent; the host calculates and supplies results.",
  },
  {
    id: "list",
    label: "List",
    exportKey: "./v2/astro/List.astro",
    source: "src/v2/astro/List.astro",
    catalogueIds: ["list"],
    behaviourOwner: "none",
    boundary: "Presents supplied records and selection without inventing application state.",
  },
  {
    id: "card",
    label: "Card",
    exportKey: "./v2/astro/Card.astro",
    source: "src/v2/astro/Card.astro",
    catalogueIds: ["card"],
    behaviourOwner: "none",
    boundary: "Composes one bounded object; application commands belong in an explicit actions slot.",
  },
  {
    id: "data-table",
    label: "Data table",
    exportKey: "./v2/astro/DataTable.astro",
    source: "src/v2/astro/DataTable.astro",
    catalogueIds: ["table"],
    behaviourOwner: "none",
    boundary: "Presents comparable supplied records; sorting, loading and pagination remain host-owned.",
  },
  {
    id: "panel",
    label: "Panel",
    exportKey: "./v2/astro/Panel.astro",
    source: "src/v2/astro/Panel.astro",
    catalogueIds: ["panel"],
    behaviourOwner: "native",
    boundary: "Owns grouping and optional native disclosure only; content state remains host-owned.",
  },
  {
    id: "dialog",
    label: "Dialog",
    exportKey: "./v2/astro/Dialog.astro",
    source: "src/v2/astro/Dialog.astro",
    catalogueIds: ["dialog"],
    behaviourOwner: "host",
    boundary: "Provides dialog structure; opening, focus return, validation and commands remain host-owned.",
  },
  {
    id: "status",
    label: "Status",
    exportKey: "./v2/astro/Status.astro",
    source: "src/v2/astro/Status.astro",
    catalogueIds: ["status"],
    behaviourOwner: "none",
    boundary: "Reports supplied state through text, shape and colour without inferring truth.",
  },
  {
    id: "activity-list",
    label: "Activity list",
    exportKey: "./v2/astro/ActivityList.astro",
    source: "src/v2/astro/ActivityList.astro",
    catalogueIds: ["activity-item", "activity-region"],
    behaviourOwner: "none",
    boundary: "Displays supplied actors, timestamps and evidence; it never manufactures an activity record.",
  },
  {
    id: "approval-card",
    label: "Approval card",
    exportKey: "./v2/astro/ApprovalCard.astro",
    source: "src/v2/astro/ApprovalCard.astro",
    catalogueIds: ["approval-card"],
    behaviourOwner: "host",
    boundary: "Makes requested scope and actual authority legible; decision effects remain host-owned.",
  },
  {
    id: "receipt",
    label: "Receipt",
    exportKey: "./v2/astro/Receipt.astro",
    source: "src/v2/astro/Receipt.astro",
    catalogueIds: ["receipt-card"],
    behaviourOwner: "none",
    boundary: "Presents supplied identifiers and evidence; styling cannot create or verify a receipt.",
  },
  {
    id: "workbench-shell",
    label: "Workbench shell",
    exportKey: "./v2/astro/WorkbenchShell.astro",
    source: "src/v2/astro/WorkbenchShell.astro",
    catalogueIds: ["command-bar", "workbench-rail", "inspector", "activity-region", "status-line"],
    behaviourOwner: "host",
    boundary: "Provides named composition regions; navigation, data, commands, persistence and effects remain application-owned.",
  },
]);

/** @param {string} id */
export function getGreenwaysV2ComponentDefinition(id) {
  return greenwaysV2Components.find((component) => component.id === id || component.label === id);
}

/** @param {string} id */
export function getGreenwaysV2AstroComponent(id) {
  return greenwaysV2AstroComponents.find((component) => component.id === id || component.label === id);
}
