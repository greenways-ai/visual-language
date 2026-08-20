export { foremanEntityDefinitions, foremanRelationships } from "./entities.js";
export { foremanForbiddenPrimaryTerms, foremanPrimaryNavigation, foremanCoreJourney, foremanDetailLayers } from "./language.js";
export { foremanRouteInventory } from "./routes.js";
export { foremanExperienceStates, foremanStateFamilies, foremanTruthfulnessRules } from "./states.js";
export {
  FOREMAN_TOOL_SURFACE_VERSION,
  foremanArchitectureLayers,
  foremanClientProfiles,
  foremanExecutionHosts,
  foremanLeaseSpecimen,
  foremanRecoveryStates,
  foremanRunTimeline,
  foremanToolClasses,
  foremanTools,
  foremanToolsForProfile,
  foremanTrustLaws,
} from "./tool-surface.js";

export const FOREMAN_MODEL_VERSION = "1.1";

export const foremanSourceMappings = Object.freeze([
  Object.freeze({ source: "greenways-os#146", owns: Object.freeze(["domain records", "shared desktop/browser/CLI model", "closed transitions"]) }),
  Object.freeze({ source: "greenways-os#147", owns: Object.freeze(["durable handoff lifecycle", "session attribution", "bounded authority"]) }),
  Object.freeze({ source: "greenways-os#148", owns: Object.freeze(["GitHub projection", "separate external permissions", "canonical read-back"]) }),
  Object.freeze({ source: "greenways-os#149", owns: Object.freeze(["two-provider proof", "restart recovery", "verified external effect"]) }),
  Object.freeze({ source: "greenways-os#56", owns: Object.freeze(["application-scoped MCP discovery", "Observe/Act capability negotiation", "no-token-passthrough ingress"]) }),
  Object.freeze({ source: "greenways-os#155", owns: Object.freeze(["execution hosts", "sandbox leases", "canonical Work host path"]) }),
]);
