export type GreenwaysV2ComponentCategory =
  | "navigation"
  | "button"
  | "toggle"
  | "field"
  | "tabs"
  | "filters"
  | "list"
  | "card"
  | "table"
  | "panel"
  | "dialog"
  | "status"
  | "activity"
  | "approval"
  | "receipt"
  | "workbench";

export type GreenwaysV2BehaviourOwner = "none" | "native" | "host";

export interface GreenwaysV2ComponentDefinition {
  readonly id: GreenwaysV2ComponentCategory;
  readonly name: string;
  readonly exportKey: string;
  readonly source: string;
  readonly semanticRoot: string;
  readonly dataMarker: string;
  readonly states: readonly string[];
  readonly accessibility: readonly string[];
  readonly behaviourOwner: GreenwaysV2BehaviourOwner;
  readonly boundary: string;
}

export interface GreenwaysV2WorkbenchRegion {
  readonly id: "command-bar" | "navigation" | "workspace" | "inspector" | "activity" | "status";
  readonly label: string;
  readonly slot: string;
  readonly landmark: string;
  readonly collapse: string;
}

export declare const GREENWAYS_V2_COMPONENT_CONTRACT_VERSION: "1";
export declare const greenwaysV2StateMarkers: readonly string[];
export declare const greenwaysV2Components: readonly GreenwaysV2ComponentDefinition[];
export declare const greenwaysV2WorkbenchRegions: readonly GreenwaysV2WorkbenchRegion[];
export declare function getGreenwaysV2Component(id: string): GreenwaysV2ComponentDefinition | undefined;
