export type ForemanWorkbenchState =
  | "first-use"
  | "loading"
  | "empty-project"
  | "empty-filter"
  | "active"
  | "waiting-for-approval"
  | "stale"
  | "provider-disconnected"
  | "host-unavailable"
  | "partial-result"
  | "recoverable-failure"
  | "fatal-failure"
  | "cancelled"
  | "completed"
  | "externally-verified";

export type ForemanBuildoutGroup = "needs-attention" | "running" | "waiting" | "completed" | "stopped";
export type ForemanSignal = "neutral" | "info" | "warning" | "danger" | "success";

export interface ForemanProject {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly outcome: string;
  readonly repository: string;
  readonly state: string;
  readonly ownerId: string;
  readonly buildoutIds: readonly string[];
  readonly attentionCount: number;
  readonly lastVerifiedAt: string;
}

export interface ForemanActor {
  readonly id: string;
  readonly kind: "person" | "agent";
  readonly name: string;
  readonly role?: string;
  readonly purpose?: string;
  readonly mandate?: string;
  readonly ownerId?: string;
  readonly state: string;
}

export interface ForemanClient {
  readonly id: string;
  readonly profileId: string;
  readonly profile: Readonly<Record<string, unknown>>;
  readonly label: string;
  readonly state: string;
  readonly observedCapability: string;
  readonly actionState: string;
  readonly sessionIds: readonly string[];
  readonly truth: string;
}

export interface ForemanSession {
  readonly id: string;
  readonly label: string;
  readonly provider: string;
  readonly surface: string;
  readonly agentId: string;
  readonly clientId: string;
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly state: string;
  readonly authority: string;
  readonly lastObservedAt: string;
}

export interface ForemanExecutionHost {
  readonly id: string;
  readonly sourceId: string;
  readonly label: string;
  readonly summary: string;
  readonly state: string;
  readonly observedAt: string;
  readonly trust: string;
  readonly capabilities: readonly string[];
  readonly bounds: readonly string[];
  readonly network: string;
  readonly expandedImplementation: string;
  readonly advertisedGeneration: string;
}

export interface ForemanApproval {
  readonly id: string;
  readonly label: string;
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly requestedById: string;
  readonly decisionOwnerId: string;
  readonly state: string;
  readonly operation: string;
  readonly requestedCapabilities: readonly string[];
  readonly consequence: string;
  readonly expiry: string;
  readonly excludedAuthority: readonly string[];
}

export interface ForemanCheckpoint {
  readonly id: string;
  readonly runId: string | null;
  readonly label: string;
  readonly state: string;
  readonly recordedAt: string;
  readonly summary: string;
  readonly evidenceIds: readonly string[];
}

export interface ForemanArtifact {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly state: string;
  readonly producerRunId: string | null;
  readonly digest: string | null;
  readonly ancestry: string;
  readonly openLabel: string;
}

export interface ForemanLease {
  readonly id: string;
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly hostId: string;
  readonly hostGeneration: string;
  readonly runId: string;
  readonly state: string;
  readonly requestedAt: string;
  readonly grantedAt: string;
  readonly expiresAt: string;
  readonly releasedAt: string;
  readonly requestedCapabilities: readonly string[];
  readonly actualCapabilities: readonly string[];
  readonly excludedAuthority: readonly string[];
  readonly cleanupState: string;
  readonly cleanupEvidence: string;
}

export interface ForemanRun {
  readonly id: string;
  readonly label: string;
  readonly projectId: string;
  readonly buildoutId: string;
  readonly workItemId: string;
  readonly originSessionId: string;
  readonly leaseId: string;
  readonly state: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly checkpointIds: readonly string[];
  readonly artifactIds: readonly string[];
  readonly cleanupState: string;
  readonly localOutcome: string;
  readonly externalEffectId: string;
}

export interface ForemanWorkItem {
  readonly id: string;
  readonly buildoutId: string;
  readonly title: string;
  readonly state: string;
  readonly ownerId: string;
  readonly dependencyIds: readonly string[];
  readonly sessionIds: readonly string[];
  readonly runIds: readonly string[];
  readonly expectedOutput: string;
  readonly nextAction: string;
}

export interface ForemanExternalEffect {
  readonly id: string;
  readonly label: string;
  readonly projectId: string;
  readonly buildoutId: string;
  readonly state: string;
  readonly requestedAt: string;
  readonly submittedAt: string;
  readonly providerState: string;
  readonly readBackState: string;
  readonly canonicalUrl: string | null;
  readonly canonicalRevision: string | null;
  readonly artifactId?: string;
  readonly truth: string;
}

export interface ForemanBuildout {
  readonly id: string;
  readonly projectId: string;
  readonly code: string;
  readonly title: string;
  readonly goal: string;
  readonly lifecycleState: string;
  readonly displayState: string;
  readonly group: ForemanBuildoutGroup;
  readonly ownerId: string;
  readonly agentIds: readonly string[];
  readonly sessionIds: readonly string[];
  readonly clientIds: readonly string[];
  readonly currentWorkItemId: string;
  readonly workItemIds: readonly string[];
  readonly executionHostId: string | null;
  readonly leaseId: string | null;
  readonly runId: string | null;
  readonly lastCheckpointId: string | null;
  readonly approvalIds: readonly string[];
  readonly artifactIds: readonly string[];
  readonly externalEffectIds: readonly string[];
  readonly attention: string | null;
  readonly lastEvidence: string;
  readonly updatedAt: string;
}

export interface ForemanAttentionItem {
  readonly id: string;
  readonly kind: string;
  readonly label: string;
  readonly buildoutId: string;
  readonly summary: string;
  readonly state: string;
  readonly action: string;
}

export interface ForemanActivityEntry {
  readonly id: string;
  readonly occurredAt: string;
  readonly actorId: string;
  readonly state: string;
  readonly summary: string;
  readonly evidenceId: string;
  readonly externalEffectId: string | null;
}

export interface ForemanLaneEvent {
  readonly id: string;
  readonly time: string;
  readonly state: string;
  readonly kind: string;
  readonly title: string;
  readonly detail: string;
  readonly identity: string;
  readonly evidence: string;
}

export interface ForemanStateSpecimen {
  readonly id: ForemanWorkbenchState;
  readonly label: string;
  readonly signal: ForemanSignal;
  readonly summary: string;
  readonly evidence: string;
}

export interface ForemanNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly count: string;
  readonly purpose: string;
}

export interface ForemanViewDefinition {
  readonly id: "overview" | "board" | "workbench";
  readonly label: string;
  readonly description: string;
}

export interface ForemanStatusLineItem {
  readonly id: string;
  readonly label: string;
  readonly state: string;
  readonly value: string;
  readonly detail: string;
}

export interface ForemanWorkbenchContract {
  readonly meta: {
    readonly version: "foreman-workbench/1";
    readonly toolSurfaceVersion: string;
    readonly title: string;
    readonly description: string;
    readonly specimenLabel: string;
    readonly truthfulnessNote: string;
  };
  readonly selected: Readonly<Record<string, string>>;
  readonly groupOrder: readonly ForemanBuildoutGroup[];
  readonly groupLabels: Readonly<Record<ForemanBuildoutGroup, string>>;
  readonly navigation: readonly ForemanNavigationItem[];
  readonly viewDefinitions: readonly ForemanViewDefinition[];
  readonly projects: readonly ForemanProject[];
  readonly people: readonly ForemanActor[];
  readonly agents: readonly ForemanActor[];
  readonly clients: readonly ForemanClient[];
  readonly sessions: readonly ForemanSession[];
  readonly executionHosts: readonly ForemanExecutionHost[];
  readonly approvals: readonly ForemanApproval[];
  readonly checkpoints: readonly ForemanCheckpoint[];
  readonly artifacts: readonly ForemanArtifact[];
  readonly leases: readonly ForemanLease[];
  readonly runs: readonly ForemanRun[];
  readonly workItems: readonly ForemanWorkItem[];
  readonly externalEffects: readonly ForemanExternalEffect[];
  readonly buildouts: readonly ForemanBuildout[];
  readonly attentionItems: readonly ForemanAttentionItem[];
  readonly recentActivity: readonly ForemanActivityEntry[];
  readonly laneEvents: Readonly<Record<"work" | "execution" | "external", readonly ForemanLaneEvent[]>>;
  readonly stateMatrix: readonly ForemanStateSpecimen[];
  readonly runVocabulary: readonly Readonly<Record<string, string>>[];
  readonly statusLine: readonly ForemanStatusLineItem[];
}

export const FOREMAN_WORKBENCH_VERSION: "foreman-workbench/1";
export const foremanWorkbench: ForemanWorkbenchContract;
export function getForemanProject(id: string): ForemanProject;
export function getForemanBuildout(id: string): ForemanBuildout;
export function getForemanWorkItem(id: string): ForemanWorkItem;
export function getForemanSession(id: string): ForemanSession;
export function getForemanAgent(id: string): ForemanActor;
export function getForemanExecutionHost(id: string): ForemanExecutionHost;
export function getForemanApproval(id: string): ForemanApproval;
export function getForemanArtifact(id: string): ForemanArtifact;
export function getForemanExternalEffect(id: string): ForemanExternalEffect;
export function getForemanBuildoutGroups(): readonly {
  readonly id: ForemanBuildoutGroup;
  readonly label: string;
  readonly buildouts: readonly ForemanBuildout[];
}[];
