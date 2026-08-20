# Foreman product language, information architecture, and state model

This is the visual-language contract for issue #35. It defines the labels, relationships, routes, and visible states later Foreman laboratories must preserve. It does not implement providers, persistence, authority evaluation, messaging, or GitHub mutation.

## Product proposition

Foreman is the foreground application for organising a software project, following buildouts across AI providers and interfaces, handing bounded work between authorised agents, projecting durable work into GitHub, and understanding what actually happened.

Greenways OS supplies identity, access, storage, synchronisation, messaging, connections, and history beneath Foreman. Those services remain invisible in ordinary task navigation.

## Product laws

1. A **Project** is the stable home for one software effort.
2. A **Buildout** is one intended outcome spanning work items, sessions, providers, approvals, and artifacts.
3. A **Work item** is bounded, has dependencies and an owner, and names expected completion evidence.
4. A **Person**, **Agent**, **Connection**, **Client**, and **Session** remain distinct identities.
5. A **Session** belongs to one provider or surface. Foreman does not invent one universal conversation.
6. A **Handoff** is a durable bounded request with separate request, acceptance, progress, return, and completion states.
7. An **Approval** covers one exact consequential request; it does not imply completion.
8. An **Artifact** preserves producer and ancestry.
9. A **GitHub record** remains authoritative in GitHub and becomes verified only after canonical read-back.
10. **Activity** is attributable evidence, not an undifferentiated log stream.

## Primary navigation

```text
Overview
Projects
Buildouts
Work items
Sessions
People and agents
Connections
Approvals
Activity
```

The core journey is:

```text
choose project
  -> inspect buildout
  -> open work item or session
  -> approve or hand off
  -> inspect activity and evidence
```

Infrastructure implementation names do not appear in primary navigation. Technical state belongs under Settings → Diagnostics.

## Entity ownership and visibility

| Entity | Authority | Visibility | Meaning |
| --- | --- | --- | --- |
| Project | Foreman | Primary | One software effort and its exact external links. |
| Buildout | Foreman | Primary | One outcome spanning work, sessions, approvals, and artifacts. |
| Work item | Foreman | Primary | One bounded task and its dependencies. |
| Person | Human actor | Primary | Owns projects and consequential decisions. |
| Agent | Person or project | Primary | A bounded named profile, not a live session. |
| Provider | External service or tool | Expanded | Attribution behind a connection. |
| Connection | Person or project | Primary | Login and observed availability without implied authority. |
| Session | Person or agent on one connection | Primary | One live or resumable working context. |
| Run | Foreman | Contextual | One attributable attempt to progress a work item. |
| Approval | Person | Primary | An exact human decision and its consequences. |
| Handoff | Foreman | Contextual | A durable request between two distinct sessions. |
| Artifact | Producing work or external authority | Contextual | A referenced output with ancestry. |
| GitHub record | GitHub | Contextual | A rebuildable projection of exact external state. |
| Activity entry | Observed actor or authority | Primary | A causal event with adjacent evidence. |

The executable source in `src/foreman/` defines the normal, expanded, and diagnostic fields and lifecycle for every entity.

## Required experience states

Every high-level surface accounts for:

- **First use** — honest setup and no invented activity.
- **Active** — current work or a verified transition is visible.
- **Paused** — actor, reason, and pause time are visible.
- **Waiting for approval** — exact request, scope, recipient, and expiry are visible.
- **Degraded** — unavailable portions and last successful observation are named.
- **Disconnected** — desired and last observed connection states remain distinct.
- **Completed** — artifacts or authoritative read-back support the claim.
- **Failed** — failure stage, retained work, and safe next action are visible.
- **Cancelled** — actor, time, and downstream consequences are visible.

Handoffs additionally distinguish requested, authorised, queued, accepted, running, returning, partial, completed, denied, expired, disconnected, and failed. External effects distinguish submitted, uncertain, and verified.

## Truthfulness contract

- Requested is not accepted.
- Accepted is not completed.
- Provider login is not mutation authority.
- A local branch, commit, patch, or command exit does not prove a GitHub mutation.
- External success appears only after canonical read-back.
- Desired, requested, and observed states remain visibly distinct.
- Unavailable, stale, uncertain, and partial outcomes do not collapse into success.
- Human intervention remains adjacent to the transition it controls and visible in Activity.

## Detail layers

### Normal UI

Show plain-language state, owner, human attention, next action, and adjacent evidence. Do not lead with transport, storage roots, policy traces, or raw provider errors.

### Expanded details

Show provider attribution, session and correlation identifiers, timestamps, canonical URLs, artifact ancestry, and requested-versus-actual state.

### Diagnostics

Show adapter revision, transport, retry generation, synchronisation state, normalised low-level errors, and authority evaluation. Never show credentials, secret material, or unrelated private context.

## Delivery surfaces

### Desktop and full-page browser

Own the complete project/buildout workbench: project selection, buildout structure, work items, sessions, people and agents, connections, approvals, artifacts, GitHub projection, and activity.

### Browser companion

Own current-context capture, a bounded handoff, one exact approval, and recent activity. It does not duplicate the complete workbench.

### CLI companion

Own copyable status and identity views plus bounded project, buildout, session, handoff, approval, and activity commands. It preserves terminal semantics rather than imitating the desktop.

## Source mapping

This contract was reviewed against:

- `greenways-ai/greenways-os#49` — foreground product hierarchy and first proof;
- `greenways-ai/greenways-os#146` — domain records and the shared desktop/browser/CLI model;
- `greenways-ai/greenways-os#147` — durable cross-session requests and bounded authority;
- `greenways-ai/greenways-os#148` — exact GitHub projection and authoritative read-back;
- `greenways-ai/greenways-os#149` — two-provider, restart, and verified-effect release gate.

Visual Language owns labels, relationships, visible states, information hierarchy, and truthful specimens. Greenways OS owns production behaviour.
