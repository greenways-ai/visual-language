export type GreenwaysV2AstroBehaviourOwner = "none" | "native" | "host";

export interface GreenwaysV2AstroComponentContract {
  readonly id: string;
  readonly label: string;
  readonly exportKey: string;
  readonly source: string;
  readonly catalogueIds: readonly string[];
  readonly behaviourOwner: GreenwaysV2AstroBehaviourOwner;
  readonly boundary: string;
}

export declare const GREENWAYS_V2_COMPONENT_CONTRACT_VERSION: "1";
export { greenwaysV2ComponentGroups } from "./component-catalogue.js";
export { greenwaysV2Components as greenwaysV2ComponentDefinitions } from "./component-catalogue.js";
export { greenwaysV2WorkbenchRegions } from "./component-catalogue.js";
export { greenwaysV2WorkflowStates as greenwaysV2StateDefinitions } from "./component-catalogue.js";
export { greenwaysV2Workflows as greenwaysV2WorkflowDefinitions } from "./component-catalogue.js";
export declare const greenwaysV2StateMarkers: readonly string[];
export declare const greenwaysV2AstroComponents: readonly GreenwaysV2AstroComponentContract[];
export declare function getGreenwaysV2ComponentDefinition(id: string): unknown;
export declare function getGreenwaysV2AstroComponent(id: string): GreenwaysV2AstroComponentContract | undefined;
