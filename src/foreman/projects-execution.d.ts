import type {
  ForemanClientProfile,
  ForemanExecutionHost,
  ForemanRunState,
  ForemanToolClassId,
} from "./tool-surface.js";

export type ForemanExecutionLaneId = "work" | "execution" | "external";
export type ForemanExecutionStatus = "active" | "observed" | "running" | "requested" | "approval-required" | "granted" | "allocating" | "checkpointed" | "completed" | "cleaned" | "verified" | "uncertain";

export interface ForemanExecutionAdvertisedTool {
  readonly id: string;
  readonly name: string;
  readonly classId: ForemanToolClassId;
}

export interface ForemanExecutionClient {
  readonly id: string;
  readonly profileId: string;
  readonly profile: ForemanClientProfile;
  readonly label: string;
  readonly state: string;
  readonly sessionId: string;
  readonly observedCapability: string;
  readonly actionState: "unavailable" | "gated";
  readonly advertisedTools: readonly ForemanExecutionAdvertisedTool[];
  readonly truth: string;
}

export interface ForemanHostAdvertisement extends ForemanExecutionHost {
  readonly id: string;
  readonly hostId: string;
  readonly generation: string;
  readonly freshness: string;
}

export interface ForemanExecutionApproval {
  readonly id: string;
  readonly label: string;
  readonly state: "granted";
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly requestedBy: string;
  readonly decisionOwner: string;
  readonly operation: string;
  readonly requestedCapabilities: readonly string[];
  readonly consequence: string;
  readonly excludedAuthority: readonly string[];
  readonly decidedAt: string;
  readonly expiresAt: string;
}

export interface ForemanExecutionLease {
  readonly id: string;
  readonly state: "released";
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly approvalId: string;
  readonly clientId: string;
  readonly originSessionId: string;
  readonly requestedHostId: string;
  readonly actualHostAdvertisementId: string;
  readonly runId: string;
  readonly requestedAt: string;
  readonly grantedAt: string;
  readonly expiresAt: string;
  readonly releasedAt: string;
  readonly requestedCapabilities: readonly string[];
  readonly actualCapabilities: readonly string[];
  readonly excludedAuthority: readonly string[];
  readonly cleanupState: "verified";
  readonly cleanupEvidence: string;
}

export interface ForemanExecutionCheckpoint {
  readonly id: string;
  readonly runId: string;
  readonly label: string;
  readonly state: "completed";
  readonly recordedAt: string;
  readonly summary: string;
  readonly artifactIds: readonly string[];
}

export interface ForemanExecutionArtifact {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly state: "retained";
  readonly producerRunId: string;
  readonly digest: string;
  readonly ancestry: string;
  readonly evidence: string;
}

export interface ForemanExecutionExternalEffect {
  readonly id: string;
  readonly label: string;
  readonly projectId: string;
  readonly buildoutId: string;
  readonly state: "uncertain" | "verified";
  readonly requestedAt: string;
  readonly submittedAt: string;
  readonly provider: string;
  readonly providerState: string;
  readonly readBackState: "awaiting" | "canonical";
  readonly canonicalUrl: string | null;
  readonly canonicalRevision: string | null;
  readonly idempotencyKey: string;
  readonly truth: string;
}

export interface ForemanExecutionRun {
  readonly id: string;
  readonly label: string;
  readonly state: "completed";
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly originSessionId: string;
  readonly clientId: string;
  readonly approvalId: string;
  readonly leaseId: string;
  readonly requestedHostId: string;
  readonly actualHostAdvertisementId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly checkpointIds: readonly string[];
  readonly artifactIds: readonly string[];
  readonly cleanupState: "verified";
  readonly localOutcome: string;
  readonly externalEffectId: string;
}

export interface ForemanExecutionLaneEvent {
  readonly id: string;
  readonly time: string;
  readonly state: ForemanExecutionStatus;
  readonly kind: string;
  readonly title: string;
  readonly detail: string;
  readonly identity: string;
  readonly evidence: string;
}

export interface ForemanExecutionStatusLineItem {
  readonly id: string;
  readonly label: string;
  readonly state: "completed" | "verified" | "uncertain";
  readonly value: string;
  readonly detail: string;
}

export interface ForemanProjectExecutionContract {
  readonly meta: {
    readonly version: "foreman-project-execution/1";
    readonly toolSurfaceVersion: "1.0";
    readonly title: string;
    readonly description: string;
    readonly specimenLabel: string;
    readonly truth: string;
  };
  readonly selected: {
    readonly projectId: string;
    readonly buildoutId: string;
    readonly workItemId: string;
    readonly originSessionId: string;
    readonly observeSessionId: string;
    readonly currentExternalEffectId: string;
    readonly verifiedExternalEffectId: string;
  };
  readonly clients: readonly ForemanExecutionClient[];
  readonly hostAdvertisements: readonly ForemanHostAdvertisement[];
  readonly approvals: readonly ForemanExecutionApproval[];
  readonly leases: readonly ForemanExecutionLease[];
  readonly runs: readonly ForemanExecutionRun[];
  readonly checkpoints: readonly ForemanExecutionCheckpoint[];
  readonly artifacts: readonly ForemanExecutionArtifact[];
  readonly externalEffects: readonly ForemanExecutionExternalEffect[];
  readonly laneOrder: readonly ForemanExecutionLaneId[];
  readonly laneLabels: Readonly<Record<ForemanExecutionLaneId, string>>;
  readonly laneSummaries: Readonly<Record<ForemanExecutionLaneId, string>>;
  readonly laneEvents: Readonly<Record<ForemanExecutionLaneId, readonly ForemanExecutionLaneEvent[]>>;
  readonly runVocabulary: readonly ForemanRunState[];
  readonly statusLine: readonly ForemanExecutionStatusLineItem[];
}

export const FOREMAN_PROJECT_EXECUTION_VERSION: "foreman-project-execution/1";
export const foremanProjectExecution: ForemanProjectExecutionContract;
export function getForemanProjectExecution(projectId: string, buildoutId: string): ForemanProjectExecutionContract | undefined;
export function validateForemanProjectExecution(): boolean;
