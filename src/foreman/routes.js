import { foremanStateFamilies } from "./states.js";
const frozen = (value) => Object.freeze(value);
const list = (values) => frozen(values.map((value) => frozen(value)));

export const foremanRouteInventory = frozen({
  desktop: list([
    ["overview", "/foreman/", "Overview", ["first-use", "active", "degraded"]],
    ["projects", "/foreman/projects/", "Projects", ["first-use", "active", "paused"]],
    ["project", "/foreman/projects/:projectId/", "Project", ["active", "paused", "degraded", "completed"]],
    ["buildouts", "/foreman/buildouts/", "Buildouts", foremanStateFamilies.buildout],
    ["buildout", "/foreman/buildouts/:buildoutId/", "Buildout", foremanStateFamilies.buildout],
    ["work-item", "/foreman/work-items/:workItemId/", "Work item", foremanStateFamilies.workItem],
    ["session", "/foreman/sessions/:sessionId/", "Session", foremanStateFamilies.session],
    ["people-agents", "/foreman/people-agents/", "People and agents", ["active", "paused", "degraded"]],
    ["connections", "/foreman/connections/", "Connections", foremanStateFamilies.connection],
    ["approvals", "/foreman/approvals/", "Approvals", foremanStateFamilies.approval],
    ["activity", "/foreman/activity/", "Activity", ["active", "degraded", "failed"]],
    ["diagnostics", "/foreman/settings/diagnostics/", "Diagnostics", ["active", "degraded", "disconnected"]],
  ].map(([id, pattern, label, states]) => ({ id, pattern, label, states }))),
  browserCompanion: list([
    ["current-context", "/companion/current/", "Current context", ["first-use", "active", "disconnected"]],
    ["handoff", "/companion/handoffs/:handoffId/", "Handoff", foremanStateFamilies.handoff],
    ["approval", "/companion/approvals/:approvalId/", "Approval", foremanStateFamilies.approval],
    ["activity", "/companion/activity/", "Recent activity", ["active", "degraded"]],
  ].map(([id, pattern, label, states]) => ({ id, pattern, label, states }))),
  cli: list([
    ["status", "foreman status", "Status", ["first-use", "active", "degraded", "disconnected"]],
    ["project", "foreman project show <project>", "Project", ["active", "paused", "degraded"]],
    ["buildout", "foreman buildout show <buildout>", "Buildout", foremanStateFamilies.buildout],
    ["session", "foreman session identify", "Session identity", foremanStateFamilies.session],
    ["handoff", "foreman handoff <request|status|cancel>", "Handoff", foremanStateFamilies.handoff],
    ["approval", "foreman approval <show|respond>", "Approval", foremanStateFamilies.approval],
    ["activity", "foreman activity tail", "Activity", ["active", "degraded", "failed"]],
  ].map(([id, pattern, label, states]) => ({ id, pattern, label, states }))),
});
