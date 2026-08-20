export type GreenwaysV2WorkflowTone = "neutral" | "info" | "success" | "warning" | "danger";
export type GreenwaysV2WorkflowOwner = "shared" | "host";

export interface GreenwaysV2WorkflowState {
  readonly id: string;
  readonly label: string;
  readonly tone: GreenwaysV2WorkflowTone;
  readonly terminal: boolean;
  readonly nonColourCue: string;
  readonly evidence: string;
  readonly recovery: string;
}

export interface GreenwaysV2WorkflowStep {
  readonly id: string;
  readonly label: string;
  readonly owner: GreenwaysV2WorkflowOwner;
  readonly responsibility: string;
}

export interface GreenwaysV2WorkflowStudy {
  readonly id: "search-inspect" | "create-approve" | "session-recovery" | "connection-authority";
  readonly label: string;
  readonly summary: string;
  readonly steps: readonly GreenwaysV2WorkflowStep[];
  readonly states: readonly string[];
  readonly sharedSemantics: readonly string[];
  readonly hostResponsibilities: readonly string[];
  readonly evidence: readonly string[];
}

export declare const GREENWAYS_V2_WORKFLOW_CONTRACT_VERSION: "1";
export declare const greenwaysV2WorkflowStates: readonly GreenwaysV2WorkflowState[];
export declare const greenwaysV2WorkflowStudies: readonly GreenwaysV2WorkflowStudy[];
export declare const greenwaysV2WorkflowOwnership: Readonly<{
  shared: readonly string[];
  host: readonly string[];
  rule: string;
}>;
export declare function getGreenwaysV2WorkflowState(id: string): GreenwaysV2WorkflowState | undefined;
export declare function getGreenwaysV2WorkflowStudy(id: string): GreenwaysV2WorkflowStudy | undefined;
