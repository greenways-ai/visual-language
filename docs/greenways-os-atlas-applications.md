# Greenways OS atlas application layer

Primary issue: `greenways-ai/visual-language#41`

## Decision

Earlier Greenways product screens are feature sources for the Greenways OS interface atlas. They are not restored as a second navigation architecture and they do not replace the five host surfaces.

The atlas keeps one portable workspace expressed through native desktop, browser desktop, browser side panel, compact popup, and web. Today, Workrooms, Studio, Campaigns, Packages, Keyring, and Receipts become applications and tools that open inside the host appropriate to the task.

## Application launcher

The shared shell now contains a semantic application launcher with two groups:

- **Workspace:** Today, Workrooms, and Studio.
- **Operations:** Campaigns, Packages, Keyring, and Receipts.

Each launcher entry carries the earlier screen’s user-facing purpose and primary action. It opens the host surface selected for that task rather than pretending that every application has the same layout.

The launcher also exposes recent objects and human-attention items:

- a Studio release awaiting review;
- an active campaign with approval work;
- a scoped Keyring grant awaiting review.

`Cmd/Ctrl+Shift+A` opens or closes the launcher. The launcher stores only the last selected application identifier for prototype continuity.

## Features carried forward

The surface pages now include an application-continuity layer beneath each host study.

| Earlier application | Carried-forward feature |
| --- | --- |
| Today | ordered focus, daily briefing, active work, and signals |
| Workrooms | contextual conversation, evidence, people, agents, and composer |
| Studio | source-aware composition, destination preview, and receipt readiness |
| Campaigns | verified metrics, progress, milestones, and approval attention |
| Packages | purpose, compatibility, version, maintainer, and install intent |
| Keyring | identity health, scoped grants, expiry, and recovery explanation |
| Receipts | searchable action history and preparation-to-approval trace |

The five host surfaces select only the portions that fit their information and command boundaries. Compact surfaces do not become miniature desktops.

## Visual contract

The launcher and continuity layer use the shared Greenways v2 roles:

- neutral canvas, surface, overlay, seam, text, radius, elevation, and material tokens;
- restrained peacock identifiers for application marks;
- sapphire-led interaction, selection, link, and focus roles;
- separately named success, warning, and danger roles.

The new stylesheet owns no literal colour palette. Publication and world artwork remains outside the neutral interface-chrome rule.

## Truthfulness boundary

This is an interactive visual prototype. The launcher does not claim that a runtime action occurred. Opening a launcher destination navigates to a host study. Buttons used as specimens may show an interaction toast, but the atlas does not claim that a package was installed, a release was published, a grant was authorised, or a receipt was written unless the existing specimen explicitly represents that state.

The application layer does not change provider boundaries, capability routing, persistence, agent execution, package installation, identity custody, or publication behaviour.

## Validation

- focused application-launcher and continuity contract tests;
- existing Greenways OS route, host-boundary, responsive, keyboard, and reduced-motion tests;
- full `npm test`;
- full `npm run build`;
- later rendered review in both themes and at the issue #41 viewport matrix.
