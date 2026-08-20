import { FOREMAN_TOOL_SURFACE_VERSION, foremanRunTimeline } from "./tool-surface.js";
import { projects, people, agents, clients, sessions, executionHosts, approvals } from "./workbench.identities.js";
import { checkpoints, artifacts, leases, runs, workItems, externalEffects } from "./workbench.execution.js";
import { buildouts, attentionItems, recentActivity } from "./workbench.buildouts.js";
import { laneEvents, stateMatrix, navigation, viewDefinitions, statusLine } from "./workbench.timeline.js";

const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
};
const byId = (items, id, label) => {
  const value = items.find((item) => item.id === id);
  if (!value) throw new Error(`Unknown Foreman ${label}: ${id}`);
  return value;
};

export const FOREMAN_WORKBENCH_VERSION = "foreman-workbench/1";
export const foremanWorkbench = deepFreeze({
  meta: {
    version: FOREMAN_WORKBENCH_VERSION,
    toolSurfaceVersion: FOREMAN_TOOL_SURFACE_VERSION,
    title: "Foreman Projects and Buildouts",
    description: "A high-fidelity static work-order desk for project outcomes, buildouts, work, execution evidence, approvals, and verified external effects.",
    specimenLabel: "Static product specimen",
    truthfulnessNote: "No work, approval, host, handoff, provider, or GitHub action is connected. Controls demonstrate placement and disclose that no request was sent.",
  },
  selected: { projectId: "greenways-platform", buildoutId: "homepage-v2", workItemId: "work-homepage-assembly", approvalId: "approval-a17", externalEffectId: "effect-homepage-followup" },
  groupOrder: ["needs-attention", "running", "waiting", "completed", "stopped"],
  groupLabels: { "needs-attention": "Needs attention", running: "Running", waiting: "Waiting", completed: "Completed", stopped: "Stopped" },
  navigation, viewDefinitions, projects, people, agents, clients, sessions, executionHosts, approvals, checkpoints, artifacts, leases, runs, workItems, externalEffects, buildouts, attentionItems, recentActivity, laneEvents, stateMatrix, runVocabulary: foremanRunTimeline, statusLine,
});

export const getForemanProject = (id) => byId(foremanWorkbench.projects, id, "project");
export const getForemanBuildout = (id) => byId(foremanWorkbench.buildouts, id, "buildout");
export const getForemanWorkItem = (id) => byId(foremanWorkbench.workItems, id, "work item");
export const getForemanSession = (id) => byId(foremanWorkbench.sessions, id, "session");
export const getForemanAgent = (id) => byId([...foremanWorkbench.people, ...foremanWorkbench.agents], id, "actor");
export const getForemanExecutionHost = (id) => byId(foremanWorkbench.executionHosts, id, "execution host");
export const getForemanApproval = (id) => byId(foremanWorkbench.approvals, id, "approval");
export const getForemanArtifact = (id) => byId(foremanWorkbench.artifacts, id, "artifact");
export const getForemanExternalEffect = (id) => byId(foremanWorkbench.externalEffects, id, "external effect");
export const getForemanBuildoutGroups = () => foremanWorkbench.groupOrder.map((id) => ({ id, label: foremanWorkbench.groupLabels[id], buildouts: foremanWorkbench.buildouts.filter((buildout) => buildout.group === id) }));
