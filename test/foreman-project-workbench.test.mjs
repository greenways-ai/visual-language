import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  FOREMAN_SELECTED_BUILDOUT_ID,
  FOREMAN_SELECTED_PROJECT_ID,
  foremanProjectStateIds,
  foremanProjects,
  getForemanBuildout,
  getForemanBuildoutHref,
  getForemanProject,
  validateForemanProjectLaboratory,
} from "../src/foreman/projects-laboratory.js";
import { foremanForbiddenPrimaryTerms } from "../src/foreman/language.js";
import { foremanStateFamilies } from "../src/foreman/states.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the project laboratory is frozen, unique, and covers the Foreman buildout lifecycle", () => {
  assert.equal(validateForemanProjectLaboratory(), true);
  assert.ok(Object.isFrozen(foremanProjects));
  assert.equal(new Set(foremanProjects.map((project) => project.id)).size, foremanProjects.length);

  const represented = new Set(foremanProjects.flatMap((project) => project.buildouts.map((buildout) => buildout.state)));
  for (const state of foremanStateFamilies.buildout) {
    assert.ok(represented.has(state) || state === "planned", state);
  }

  for (const state of ["first-use", "loading", "empty-filtered", "active", "waiting-for-approval", "degraded", "disconnected", "completed", "failed", "cancelled"]) {
    assert.ok(foremanProjectStateIds.includes(state), state);
  }
});

test("the selected buildout preserves identities, sessions, approvals, evidence, and external truth", () => {
  const project = getForemanProject(FOREMAN_SELECTED_PROJECT_ID);
  const buildout = getForemanBuildout(FOREMAN_SELECTED_PROJECT_ID, FOREMAN_SELECTED_BUILDOUT_ID);
  assert.ok(project);
  assert.ok(buildout);
  assert.equal(project.buildouts[0], buildout);
  assert.ok(buildout.providers.length >= 3);
  assert.ok(buildout.sessions.length >= 3);
  assert.equal(new Set(buildout.sessions.map((session) => session.id)).size, buildout.sessions.length);
  assert.equal(new Set(buildout.sessions.map((session) => session.connectionId)).size, buildout.sessions.length);
  assert.ok(buildout.sessions.some((session) => session.provider === "Kimi CLI"));
  assert.ok(buildout.sessions.some((session) => session.provider === "ChatGPT Web"));
  assert.ok(buildout.sessions.some((session) => session.provider === "GitHub"));
  assert.ok(buildout.workItems.some((item) => item.state === "waiting-for-approval"));
  assert.ok(buildout.workItems.every((item) => item.expectedOutput && item.evidence && item.nextAction));
  assert.ok(buildout.approvals.every((approval) => approval.scope && approval.consequence && approval.excludes && approval.expiresAt));
  assert.match(buildout.github.actualState, /no publication result is asserted/i);
  assert.match(buildout.github.verification, /canonical branch and pull-request read-back/i);
  assert.equal(
    getForemanBuildoutHref(project.id, buildout.id, "/visual-language/"),
    "/visual-language/v2/applications/foreman/projects/greenways-visual-language/buildouts/foreman-project-workbench/",
  );
});

test("the Foreman route family exposes project choice, lifecycle board, unified workbench, and evidence", async () => {
  const [shell, overview, projects, project, buildout, manifest] = await Promise.all([
    read("src/foreman/ForemanShell.astro"),
    read("src/pages/v2/applications/foreman/index.astro"),
    read("src/pages/v2/applications/foreman/projects/index.astro"),
    read("src/pages/v2/applications/foreman/projects/[project].astro"),
    read("src/pages/v2/applications/foreman/projects/[project]/buildouts/[buildout].astro"),
    read("src/v2/catalogue-manifest.js"),
  ]);

  assert.match(shell, /gw-v2-workbench/);
  assert.match(shell, /import "\.\.\/v2\/workbench\.css"/);
  assert.match(shell, /import "\.\.\/v2\/library\.css"/);
  assert.match(shell, /aria-label="Foreman primary navigation"/);
  assert.match(shell, /Specimen data only/);
  assert.match(overview, /Human attention/);
  assert.match(overview, /Active work/);
  assert.match(overview, /Recent verified movement/);
  assert.match(projects, /stateSpecimens\.map/);
  assert.match(project, /data-foreman-buildout-board/);
  assert.match(project, /Desired and observed state are separate facts/);
  assert.match(buildout, /data-foreman-selected-buildout/);
  assert.match(buildout, /id="work-items"/);
  assert.match(buildout, /id="sessions"/);
  assert.match(buildout, /id="approvals"/);
  assert.match(buildout, /id="artifacts"/);
  assert.match(buildout, /id="activity"/);
  assert.match(buildout, /These controls are static review specimens/);
  assert.match(manifest, /path: "\/v2\/applications\/foreman\/projects\/"/);
  assert.match(manifest, /issue: 36/);

  const visibleSource = `${shell}\n${overview}\n${projects}\n${project}\n${buildout}`;
  for (const term of foremanForbiddenPrimaryTerms) {
    assert.doesNotMatch(visibleSource, new RegExp(`\\b${term}\\b`, "i"), term);
  }
  assert.doesNotMatch(visibleSource, /on(?:click|mouse|pointer|touch|key)[a-z]*=/i);
  assert.doesNotMatch(visibleSource, /tabindex="[1-9]\d*"/i);
});

test("Foreman styling preserves protected tokens and compact layout boundaries", async () => {
  const entry = await read("src/foreman/projects.css");
  const parts = await Promise.all([
    "shell.css",
    "controls.css",
    "cards.css",
    "board.css",
    "workbench.css",
    "responsive.css",
  ].map((name) => read(`src/foreman/projects/${name}`)));
  const css = [entry, ...parts].join("\n");
  for (const name of ["shell", "controls", "cards", "board", "workbench", "responsive"]) {
    assert.match(entry, new RegExp(`@import "\\./projects/${name}\\.css";`), name);
  }
  assert.match(css, /var\(--gw-v2-canvas\)/);
  assert.match(css, /var\(--gw-v2-surface\)/);
  assert.match(css, /var\(--gw-v2-seam\)/);
  assert.match(css, /var\(--gw-v2-brand-spectrum\)/);
  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /min-inline-size:\s*0/);
  assert.match(css, /@media \(max-width: 72rem\)/);
  assert.match(css, /@media \(max-width: 58rem\)/);
  assert.match(css, /@media \(max-width: 44rem\)/);
  assert.match(css, /@media \(max-width: 30rem\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\brgba?\(/i);
  assert.doesNotMatch(css, /\bhsla?\(/i);
  assert.doesNotMatch(css, /--gw-v2-[a-z0-9-]+\s*:/i);
  assert.doesNotMatch(css, /white-space:\s*nowrap/i);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/i);
});
