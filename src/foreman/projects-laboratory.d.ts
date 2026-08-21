export interface ForemanActor {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly detail: string;
}

export interface ForemanIssue {
  readonly label: string;
  readonly number: number;
  readonly url: string;
}

export interface ForemanProgress {
  readonly completed: number;
  readonly total: number;
  readonly label: string;
}

export interface ForemanConnection {
  readonly id: string;
  readonly label: string;
  readonly provider: string;
  readonly surface: string;
  readonly desiredState: string;
  readonly actualState: string;
  readonly state: string;
  readonly observedAt: string;
  readonly authority: string;
}

export interface ForemanWorkItem {
  readonly id: string;
  readonly label: string;
  readonly state: string;
  readonly stateLabel: string;
  readonly owner: ForemanActor;
  readonly expectedOutput: string;
  readonly evidence: string;
  readonly nextAction: string;
}

export interface ForemanSession {
  readonly id: string;
  readonly label: string;
  readonly provider: string;
  readonly surface: string;
  readonly agent: ForemanActor;
  readonly connectionId: string;
  readonly state: string;
  readonly desiredState: string;
  readonly actualState: string;
  readonly currentWorkItem: string;
  readonly lastActivity: string;
  readonly evidence: string;
}

export interface ForemanApproval {
  readonly id: string;
  readonly label: string;
  readonly state: string;
  readonly requestingActor: ForemanActor;
  readonly decisionOwner: ForemanActor;
  readonly scope: string;
  readonly consequence: string;
  readonly excludes: string;
  readonly expiresAt: string;
}

export interface ForemanArtifact {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly producer: ForemanActor;
  readonly state: string;
  readonly ancestry: string;
  readonly evidence: string;
}

export interface ForemanGitHubProjection {
  readonly issue: ForemanIssue;
  readonly requestedEffect: string;
  readonly actualState: string;
  readonly verification: string;
  readonly state: string;
}

export interface ForemanActivity {
  readonly id: string;
  readonly time: string;
  readonly actor: ForemanActor;
  readonly state: string;
  readonly event: string;
  readonly affectedObject: string;
  readonly evidence: string;
}

export interface ForemanBuildout {
  readonly id: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly goal: string;
  readonly state: string;
  readonly stateLabel: string;
  readonly progress: ForemanProgress;
  readonly currentStep: string;
  readonly evidence?: string;
  readonly attention: string | null;
  readonly updatedAt: string;
  readonly providers: readonly string[];
  readonly issue: ForemanIssue | null;
  readonly workItems: readonly ForemanWorkItem[];
  readonly sessions: readonly ForemanSession[];
  readonly approvals: readonly ForemanApproval[];
  readonly artifacts: readonly ForemanArtifact[];
  readonly github: ForemanGitHubProjection | null;
  readonly activity: readonly ForemanActivity[];
}

export interface ForemanProject {
  readonly id: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly summary: string;
  readonly state: string;
  readonly owner: ForemanActor;
  readonly repository: {
    readonly label: string;
    readonly url: string;
  };
  readonly issueTracker: string;
  readonly updatedAt: string;
  readonly attentionCount: number;
  readonly activeCount: number;
  readonly completedCount: number;
  readonly buildouts: readonly ForemanBuildout[];
  readonly connections: readonly ForemanConnection[];
}

export interface ForemanStateSpecimen {
  readonly id: string;
  readonly label: string;
  readonly meaning: string;
  readonly evidence: string;
}

export const FOREMAN_PROJECT_LAB_VERSION: "1.0";
export const FOREMAN_SELECTED_PROJECT_ID: "greenways-visual-language";
export const FOREMAN_SELECTED_BUILDOUT_ID: "foreman-project-workbench";
export const foremanActors: Readonly<Record<string, ForemanActor>>;
export const foremanProjects: readonly ForemanProject[];
export const foremanProjectStateSpecimens: readonly ForemanStateSpecimen[];
export const foremanProjectStateIds: readonly string[];
export function getForemanProject(id: string): ForemanProject | undefined;
export function getForemanBuildout(projectId: string, buildoutId: string): ForemanBuildout | undefined;
export function getForemanBuildoutHref(projectId: string, buildoutId: string, base?: string): string;
export function validateForemanProjectLaboratory(): boolean;
