// @ts-check

/** @typedef {"navigation" | "action" | "input" | "content" | "data" | "feedback" | "workbench"} GreenwaysV2ComponentGroup */
/** @typedef {"shared-visual" | "application-owned"} GreenwaysV2ComponentOwnership */
/**
 * @typedef {object} GreenwaysV2ComponentDefinition
 * @property {string} id
 * @property {string} label
 * @property {GreenwaysV2ComponentGroup} group
 * @property {string} element
 * @property {string} purpose
 * @property {readonly string[]} states
 * @property {readonly string[]} requiredAttributes
 * @property {GreenwaysV2ComponentOwnership} visualOwner
 * @property {string} behaviourOwner
 */
/**
 * @typedef {object} GreenwaysV2WorkflowDefinition
 * @property {string} id
 * @property {string} label
 * @property {readonly string[]} steps
 * @property {string} evidence
 * @property {string} applicationBoundary
 */
/**
 * @typedef {object} GreenwaysV2StateDefinition
 * @property {string} id
 * @property {string} label
 * @property {string} meaning
 * @property {string} evidence
 * @property {string} nextAction
 * @property {string} nonColourCue
 */

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
};

/** @type {readonly GreenwaysV2ComponentDefinition[]} */
export const greenwaysV2Components = deepFreeze([
  { id: "primary-navigation", label: "Primary navigation", group: "navigation", element: "nav", purpose: "Moves between stable product areas without hiding the current location.", states: ["default", "current", "collapsed"], requiredAttributes: ["aria-label", "aria-current"], visualOwner: "shared-visual", behaviourOwner: "Host application owns routing." },
  { id: "breadcrumbs", label: "Breadcrumbs", group: "navigation", element: "nav", purpose: "Shows hierarchy and a reversible path through nested work.", states: ["default", "overflow"], requiredAttributes: ["aria-label", "aria-current"], visualOwner: "shared-visual", behaviourOwner: "Host application owns hierarchy." },
  { id: "tabs", label: "Tabs", group: "navigation", element: "div", purpose: "Switches among peer views while preserving one selected tab.", states: ["default", "selected", "disabled"], requiredAttributes: ["role=tablist", "aria-selected", "aria-controls"], visualOwner: "shared-visual", behaviourOwner: "Host application owns selection and panels." },
  { id: "button", label: "Button", group: "action", element: "button", purpose: "Invokes one named action with visible text or an accessible name.", states: ["default", "hover", "focus", "pressed", "disabled", "busy"], requiredAttributes: ["type", "aria-label when icon-only", "aria-busy when running"], visualOwner: "shared-visual", behaviourOwner: "Host application owns the effect." },
  { id: "toggle", label: "Toggle", group: "action", element: "button", purpose: "Changes a reversible preference without claiming an external connection succeeded.", states: ["off", "on", "disabled"], requiredAttributes: ["role=switch", "aria-checked"], visualOwner: "shared-visual", behaviourOwner: "Host application owns preference persistence." },
  { id: "text-field", label: "Text field", group: "input", element: "input", purpose: "Collects a named value with help and error relationships.", states: ["empty", "filled", "invalid", "disabled", "readonly"], requiredAttributes: ["label", "aria-describedby", "aria-invalid when invalid"], visualOwner: "shared-visual", behaviourOwner: "Host application owns validation." },
  { id: "filter-chip", label: "Filter chip", group: "input", element: "button", purpose: "Adds or removes one filter while keeping the active query legible.", states: ["available", "selected", "disabled"], requiredAttributes: ["aria-pressed"], visualOwner: "shared-visual", behaviourOwner: "Host application owns filtering." },
  { id: "list", label: "Selectable list", group: "content", element: "ul", purpose: "Presents scannable objects with a non-colour selected cue.", states: ["default", "selected", "empty", "loading"], requiredAttributes: ["accessible item names", "aria-current or aria-selected"], visualOwner: "shared-visual", behaviourOwner: "Host application owns object selection." },
  { id: "card", label: "Card", group: "content", element: "article", purpose: "Groups one object summary, its state, evidence and next action.", states: ["default", "selected", "disabled"], requiredAttributes: ["heading", "state text"], visualOwner: "shared-visual", behaviourOwner: "Host application owns navigation or actions." },
  { id: "table", label: "Data table", group: "data", element: "table", purpose: "Compares structured records using headers and compact status text.", states: ["default", "sorted", "empty", "loading"], requiredAttributes: ["caption", "scope on headers", "aria-sort when sorted"], visualOwner: "shared-visual", behaviourOwner: "Host application owns data and sorting." },
  { id: "panel", label: "Panel", group: "content", element: "section", purpose: "Defines a bounded work or inspection region without decorative colour fields.", states: ["default", "recessed", "raised", "collapsed"], requiredAttributes: ["heading or aria-label"], visualOwner: "shared-visual", behaviourOwner: "Host application owns disclosure." },
  { id: "dialog", label: "Dialog", group: "feedback", element: "dialog", purpose: "Interrupts only for a bounded decision with explicit close and focus return.", states: ["closed", "open", "busy"], requiredAttributes: ["aria-labelledby", "close action", "focus return"], visualOwner: "shared-visual", behaviourOwner: "Host application owns opening, validation and result." },
  { id: "status", label: "Status", group: "feedback", element: "span", purpose: "Pairs semantic text and shape with colour rather than relying on colour alone.", states: ["neutral", "info", "success", "warning", "danger", "offline"], requiredAttributes: ["visible text", "aria-live only for changes"], visualOwner: "shared-visual", behaviourOwner: "Host application owns truth and timestamps." },
  { id: "activity-item", label: "Activity item", group: "feedback", element: "article", purpose: "Shows actor, action, time, affected object and adjacent evidence.", states: ["observed", "pending", "uncertain", "verified"], requiredAttributes: ["actor", "timestamp", "evidence link"], visualOwner: "shared-visual", behaviourOwner: "Host application owns activity records." },
  { id: "approval-card", label: "Approval card", group: "feedback", element: "article", purpose: "Shows the exact request, scope, consequence, expiry and human decision.", states: ["requested", "approved", "denied", "expired", "cancelled"], requiredAttributes: ["requesting actor", "scope", "consequence", "decision controls"], visualOwner: "shared-visual", behaviourOwner: "Host application owns authority evaluation and decision." },
  { id: "receipt-card", label: "Receipt card", group: "feedback", element: "article", purpose: "Shows an attributable result and its evidence without implying universal authority.", states: ["recorded", "verified", "uncertain", "superseded"], requiredAttributes: ["actor", "operation", "time", "evidence"], visualOwner: "shared-visual", behaviourOwner: "Host application owns receipt generation and verification." },
  { id: "command-bar", label: "Command bar", group: "workbench", element: "header", purpose: "Holds project context, search and named commands at workbench density.", states: ["default", "searching", "command-open"], requiredAttributes: ["search label", "command names"], visualOwner: "shared-visual", behaviourOwner: "Host application owns command dispatch." },
  { id: "workbench-rail", label: "Workbench rail", group: "workbench", element: "nav", purpose: "Provides project and buildout navigation beside the primary workspace.", states: ["expanded", "compact", "hidden"], requiredAttributes: ["aria-label", "current item"], visualOwner: "shared-visual", behaviourOwner: "Host application owns route and selection." },
  { id: "inspector", label: "Inspector", group: "workbench", element: "aside", purpose: "Shows contextual fields, evidence and actions for the selected object.", states: ["open", "empty", "collapsed"], requiredAttributes: ["heading or aria-label", "selected object name"], visualOwner: "shared-visual", behaviourOwner: "Host application owns inspected data." },
  { id: "activity-region", label: "Activity region", group: "workbench", element: "section", purpose: "Presents ordered progress, logs and recovery information without becoming an unstructured console.", states: ["active", "paused", "empty", "error"], requiredAttributes: ["heading", "ordered timestamps", "live-region policy"], visualOwner: "shared-visual", behaviourOwner: "Host application owns streaming and retention." },
  { id: "status-line", label: "Status line", group: "workbench", element: "footer", purpose: "Shows compact connection, selection, task and keyboard context.", states: ["ready", "busy", "degraded", "offline"], requiredAttributes: ["visible labels", "no colour-only state"], visualOwner: "shared-visual", behaviourOwner: "Host application owns observed state." },
]);

/** @type {readonly GreenwaysV2WorkflowDefinition[]} */
export const greenwaysV2Workflows = deepFreeze([
  { id: "search-filter-select-inspect", label: "Search, filter, select, inspect", steps: ["search", "filter", "select", "inspect"], evidence: "The selected object name and active filters remain visible together.", applicationBoundary: "The laboratory supplies layout and state markers; the application owns query execution and selection." },
  { id: "create-validate-preview-approve-receipt", label: "Create, validate, preview, approve, receipt", steps: ["create", "validate", "preview", "request approval", "record result"], evidence: "Validation, human decision and resulting receipt remain separate records.", applicationBoundary: "The laboratory never performs validation, authority evaluation or persistence." },
  { id: "load-run-observe-recover", label: "Load session, run, observe, recover", steps: ["load", "run", "observe", "pause or fail", "recover"], evidence: "The current attempt, last checkpoint and safe recovery action are adjacent.", applicationBoundary: "The laboratory does not start sessions, execute work or invent completion." },
  { id: "connect-authority-reconnect-revoke", label: "Connect, request authority, reconnect, revoke", steps: ["configure", "observe connection", "request authority", "reconnect", "revoke"], evidence: "Desired, observed and authorised states remain visibly distinct.", applicationBoundary: "The laboratory never treats a toggle or login as proof of authority." },
]);

/** @type {readonly GreenwaysV2StateDefinition[]} */
export const greenwaysV2WorkflowStates = deepFreeze([
  { id: "empty-first-use", label: "First use", meaning: "No object exists yet.", evidence: "A plain explanation and one safe creation action.", nextAction: "Create the first object", nonColourCue: "Empty-state heading and illustration label" },
  { id: "empty-filtered", label: "No filtered results", meaning: "Objects exist, but none match the current query.", evidence: "Visible active filters and total item count.", nextAction: "Clear or edit filters", nonColourCue: "Filter summary and reset control" },
  { id: "loading", label: "Loading", meaning: "The result is not available yet.", evidence: "Named operation and elapsed or last-observed time.", nextAction: "Wait or cancel when supported", nonColourCue: "Busy text and progress indicator" },
  { id: "stale", label: "Stale", meaning: "The view is usable but not current.", evidence: "Last successful observation and affected fields.", nextAction: "Refresh", nonColourCue: "Stale label and timestamp" },
  { id: "partial", label: "Partial", meaning: "Some requested output arrived while some did not.", evidence: "Completed and missing portions listed separately.", nextAction: "Inspect missing work", nonColourCue: "Fraction and missing-items list" },
  { id: "offline", label: "Offline", meaning: "The provider or device cannot currently be reached.", evidence: "Last observed state and locally available work.", nextAction: "Reconnect", nonColourCue: "Offline label and disconnected icon" },
  { id: "recoverable-error", label: "Recoverable error", meaning: "The operation failed but retained work permits a safe retry.", evidence: "Failure stage, retained checkpoint and retry consequence.", nextAction: "Retry from checkpoint", nonColourCue: "Error heading and retry action" },
  { id: "fatal-error", label: "Fatal error", meaning: "The current operation cannot continue safely.", evidence: "Failure stage, retained evidence and escalation path.", nextAction: "Open diagnostics", nonColourCue: "Danger heading and stop symbol" },
  { id: "waiting-approval", label: "Waiting for approval", meaning: "A consequential request is paused for one exact decision.", evidence: "Actor, scope, consequence and expiry.", nextAction: "Review request", nonColourCue: "Approval label and decision controls" },
  { id: "active", label: "Active", meaning: "Work is currently progressing or awaiting an expected event.", evidence: "Actor, current step and last activity time.", nextAction: "Observe or pause", nonColourCue: "Active verb and progress text" },
  { id: "success", label: "Success", meaning: "The requested transition completed and is supported by evidence.", evidence: "Artifact, receipt or authoritative read-back.", nextAction: "Inspect result", nonColourCue: "Success label and check symbol" },
]);

export const greenwaysV2WorkbenchRegions = deepFreeze([
  "command-bar",
  "workbench-rail",
  "primary-workspace",
  "inspector",
  "activity-region",
  "status-line",
]);

export const greenwaysV2ComponentGroups = deepFreeze([
  "navigation", "action", "input", "content", "data", "feedback", "workbench",
]);
