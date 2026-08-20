export type ForemanToolClassId = "observe" | "act" | "external-effect";

export interface ForemanToolClass {
  readonly id: ForemanToolClassId;
  readonly label: string;
  readonly effect: string;
  readonly purpose: string;
  readonly evidence: string;
}

export interface ForemanTool {
  readonly id: string;
  readonly name: string;
  readonly classId: ForemanToolClassId;
  readonly label: string;
  readonly purpose: string;
  readonly fabricService: string;
  readonly approval: string;
  readonly resultEvidence: string;
}

export interface ForemanClientProfile {
  readonly id: string;
  readonly label: string;
  readonly kind: "remote-mcp-client" | "enrolled-application-host";
  readonly observedCapability: string;
  readonly toolClasses: readonly ForemanToolClassId[];
  readonly actionState: "unavailable" | "gated";
  readonly truth: string;
  readonly referenceDate: string;
}

export interface ForemanExecutionHost {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly state: "ready" | "approval-required" | "degraded";
  readonly observedAt: string;
  readonly trust: string;
  readonly capabilities: readonly string[];
  readonly bounds: readonly string[];
  readonly network: string;
  readonly expandedImplementation: string;
}

export interface ForemanLeaseSpecimen {
  readonly id: string;
  readonly state: "approval-required";
  readonly originContext: string;
  readonly requestedBy: string;
  readonly project: string;
  readonly buildout: string;
  readonly workItem: string;
  readonly host: string;
  readonly capabilities: readonly string[];
  readonly network: string;
  readonly expiry: string;
  readonly excludedAuthority: readonly string[];
  readonly controlPlane: string;
  readonly dataPlane: string;
}

export interface ForemanRunState {
  readonly id: string;
  readonly label: string;
  readonly evidence: string;
}

export interface ForemanArchitectureLayer {
  readonly id: string;
  readonly label: string;
  readonly owns: string;
  readonly mustNotOwn: string;
}

export interface ForemanTrustLaw {
  readonly id: string;
  readonly statement: string;
}

export const FOREMAN_TOOL_SURFACE_VERSION: "1.0";
export const foremanToolClasses: readonly ForemanToolClass[];
export const foremanTools: readonly ForemanTool[];
export const foremanClientProfiles: readonly ForemanClientProfile[];
export const foremanExecutionHosts: readonly ForemanExecutionHost[];
export const foremanLeaseSpecimen: ForemanLeaseSpecimen;
export const foremanRunTimeline: readonly ForemanRunState[];
export const foremanRecoveryStates: readonly ForemanRunState[];
export const foremanArchitectureLayers: readonly ForemanArchitectureLayer[];
export const foremanTrustLaws: readonly ForemanTrustLaw[];
export function foremanToolsForProfile(profileId: string): readonly ForemanTool[];
