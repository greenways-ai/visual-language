# Foreman product language, information architecture, and state model

This is the visual-language contract for issues #35 and #50. It defines the labels, relationships, routes, visible states, application tool classes, client-capability boundaries, and execution-host coordination that later Foreman laboratories must preserve. It does not implement providers, persistence, authority evaluation, messaging, MCP transport, browser APIs, sandbox execution, or GitHub mutation.

## Product proposition

Foreman is the foreground application for organising a software project, following buildouts across AI providers and interfaces, handing bounded work between authorised agents, running that work on approved execution hosts, projecting durable work into GitHub, and understanding what actually happened.

Greenways OS supplies identity, access, storage, synchronisation, messaging, connections, durable Work, execution-host coordination, and history beneath Foreman. Those services remain invisible in ordinary task navigation.

## Product laws

1. A **Project** is the stable home for one software effort.
2. A **Buildout** is one intended outcome spanning work items, sessions, providers, approvals, runs, and artifacts.
3. A **Work item** is bounded, has dependencies and an owner, and names expected completion evidence.
4. A **Person**, **Agent**, **Application**, **Client**, **Connection**, **Device**, **Session**, **Execution host**, **Sandbox**, and **Run** remain distinct identities.
5. A **Session** belongs to one provider or surface. Foreman does not invent one universal conversation.
6. A **Handoff** is a durable bounded request with separate request, acceptance, progress, return, and completion states.
7. An **Approval** covers one exact consequential request; it does not imply completion.
8. An **Artifact** preserves producer and ancestry.
9. A **GitHub record** remains authoritative in GitHub and becomes verified only after canonical read-back.
10. **Activity** is attributable evidence, not an undifferentiated log stream.
11. An **MCP client** is one optional application client. It transports the installed Foreman tool surface but does not own Foreman state or Fabric authority.
12. An **Execution host** advertises bounded capability; it does not grant itself work or external-effect authority.
13. A **Sandbox lease** binds one actor, application, project, buildout, work item, run, host generation, capability set, and expiry.
14. The browser companion may provide the human control plane, while execution logs and artifacts may use a direct bounded Fabric-to-host data plane.
15. A completed sandbox run or local commit does not prove a GitHub push, pull request, merge, deployment, or publication.

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
  -> choose an execution option when required
  -> approve or hand off
  -> inspect activity and evidence
```

Infrastructure implementation names do not appear in primary navigation. Execution hosts and sandboxes appear contextually inside work and buildout views. Technical state belongs under Settings → Diagnostics.

## Entity ownership and visibility

| Entity | Authority | Visibility | Meaning |
| --- | --- | --- | --- |
| Project | Foreman | Primary | One software effort and its exact external links. |
| Buildout | Foreman | Primary | One outcome spanning work, sessions, approvals, runs, and artifacts. |
| Work item | Foreman | Primary | One bounded task and its dependencies. |
| Person | Human actor | Primary | Owns projects and consequential decisions. |
| Agent | Person or project | Primary | A bounded named profile, not a live session. |
| Provider | External service or tool | Expanded | Attribution behind a connection. |
| Connection | Person or project | Primary | Login and observed availability without implied authority. |
| Client | Greenways Fabric | Expanded | One enrolled application or MCP client with observed capabilities. |
| Session | Person or agent on one connection | Primary | One live or resumable working context. |
| Execution host | Greenways Fabric | Contextual | An enrolled location advertising bounded execution choices. |
| Sandbox lease | Greenways Fabric | Contextual | One exact request-bound grant to use a selected host. |
| Run | Foreman/Fabric Work | Contextual | One attributable attempt to progress a work item. |
| Approval | Person | Primary | An exact human decision and its consequences. |
| Handoff | Foreman | Contextual | A durable request between two distinct sessions. |
| Artifact | Producing work or external authority | Contextual | A referenced output with ancestry. |
| GitHub record | GitHub | Contextual | A rebuildable projection of exact external state. |
| Activity entry | Observed actor or authority | Primary | A causal event with adjacent evidence. |

The executable source in `src/foreman/` defines the normal, expanded, and diagnostic fields and lifecycle for every entity. The MCP/sandbox laboratory adds static application-tool, client-profile, host, lease, run, and boundary specimens without changing the infrastructure ownership above.

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

Execution hosts distinguish unknown, offline, connecting, ready, degraded, draining, and revoked. Sandbox leases distinguish requested, approval-required, granted, denied, expired, and revoked. Sandboxes/runs distinguish allocating, preparing, ready, running, checkpointed, waiting, completed, stopping, cleaned, orphaned, cancelled, timed-out, and failed.

## Truthfulness contract

- Requested is not accepted.
- Accepted is not completed.
- Provider login is not mutation authority.
- An advertised MCP tool is not a current Greenways grant.
- A subscription or workspace label is not evidence of actual tool capability.
- A visible online host is not an execution lease.
- A granted lease is not a completed run.
- A completed run is not cleanup evidence.
- A local branch, commit, patch, or command exit does not prove a GitHub mutation.
- External success appears only after canonical read-back.
- Desired, requested, advertised, authorised, observed, executed, cleaned, and externally verified states remain visibly distinct.
- Unavailable, stale, uncertain, orphaned, and partial outcomes do not collapse into success.
- Human intervention remains adjacent to the transition it controls and visible in Activity.

## Detail layers

### Normal UI

Show plain-language state, owner, human attention, next action, execution choice when relevant, and adjacent evidence. Do not lead with MCP transport, container engines, storage roots, policy traces, or raw provider errors.

### Expanded details

Show provider attribution, client/session/correlation identifiers, host generation, lease expiry, requested capabilities, network policy, timestamps, canonical URLs, artifact ancestry, and requested-versus-actual state.

### Diagnostics

Show adapter/application revision, transport, retry generation, synchronisation state, capability-manifest freshness, normalised low-level errors, and authority evaluation. Never show credentials, tokens, browser cookies, private keys, secret material, or unrelated private context.

## Delivery surfaces

### Desktop and full-page browser

Own the complete project/buildout workbench: project selection, buildout structure, work items, sessions, people and agents, connections, approvals, execution choices, sandbox/run evidence, artifacts, GitHub projection, and activity.

### Browser companion

Own current-context capture, exact visible-session attachment, a bounded handoff, one exact approval, execution-host choice, sandbox-lease consent/revocation, selected-output capture, compact progress, and recent activity. It does not duplicate the complete workbench, become the primary state store, execute the sandbox, or proxy every log and artifact.

### CLI companion

Own copyable status and identity views plus bounded project, buildout, session, handoff, approval, execution-host, lease, run, and activity commands. It preserves terminal semantics rather than imitating the desktop.

### Optional MCP client

Own only its prompt context and observed tool capability. It discovers the exact installed Foreman tool revision through `mcp.greenways.ai`, invokes currently available application tools, and receives bounded results/evidence. It does not receive browser credentials, execution-host credentials, Fabric root authority, or unrestricted infrastructure operations.

## Foreman application tool surface

Foreman owns one closed, versioned application tool catalogue reused by Desktop, CLI, browser companion, and optional MCP ingress.

### Observe

Observe tools read current projections and exact evidence without creating durable work or an external effect:

```text
foreman.projects.list
foreman.project.get
foreman.buildouts.list
foreman.buildout.get
foreman.work.get
foreman.sessions.list
foreman.session.get
foreman.approvals.list
foreman.approval.get
foreman.execution.hosts.list
foreman.execution.run.get
foreman.activity.list
foreman.artifact.get
```

Every result names freshness, provenance, bounds, requested-versus-observed state, and canonical external references where applicable.

### Act

Act tools request one bounded Foreman transition through current Fabric authority:

```text
foreman.buildout.create
foreman.work.submit
foreman.work.cancel
foreman.session.attach
foreman.execution.lease.request
foreman.execution.lease.revoke
foreman.execution.run.cancel
foreman.approval.decide
foreman.output.capture
```

An action names actor/application/client context, project/buildout/work/run scope, expected head or idempotency key where applicable, requested capabilities, limits, expiry, approval policy, and retained evidence.

### External effect

External-effect tools request or inspect a separately authorised GitHub/provider mutation:

```text
foreman.external-effect.request
foreman.external-effect.get
```

The effect retains exact arguments, permission/approval, idempotency, uncertain outcome, returned identity, and authoritative read-back. No read, local execution, or generic work grant implies external mutation authority.

Tool availability is negotiated from the actual client profile and current Greenways grant. As a dated product-reference specimen on 21 August 2026, ChatGPT Pro custom MCP is represented as an Observe/read-fetch profile, while action-capable MCP workspaces and directly enrolled Foreman clients still remain gated by Greenways authority and human approval. This dated example may change; the durable design rule is to render observed capability rather than infer it from a product-plan label.

## MCP and host architecture

```text
ChatGPT or another MCP client
        |
        | MCP over HTTPS, independently authenticated
        v
mcp.greenways.ai
  discovery, OAuth termination, connection selection,
  versioned tool advertisement, bounded relay, revocation
        |
        v
selected Greenways Fabric generation
  identity, application dispatch, authority, durable Work,
  host selection, leases, evidence, recovery
        |
        +--> Foreman application service
        |      owns product operations and state laws
        |
        +--> browser companion (control plane)
        |      exact visible-session binding, consent, host choice,
        |      lease inspection/revocation, compact progress
        |
        +--> execution host (data plane)
               isolated workspace, bounded execution, progress,
               artifacts, cancellation, cleanup
```

The MCP credential terminates at `mcp.greenways.ai`. Browser, provider, Fabric, execution-host, and external-service credentials terminate at their own boundaries. The Fabric correlates separately authenticated identities and may issue a short-lived request-bound capability; it never passes one subsystem's credential through to another.

`mcp.greenways.ai` may transport and advertise installed application tools. It does not own Foreman projects, buildouts, work items, approvals, migrations, durable Work, sandbox execution, or independent external-effect authority.

## Execution hosts and sandbox leases

Foreman presents execution in consumer language such as **Mac Studio · isolated project sandbox**. Implementation detail such as container, local process, SSH, VM, or cloud-worker provider appears only in expanded details/diagnostics.

A host choice shows:

- current availability and last observation;
- trust/ownership summary;
- advertised semantic capabilities;
- resource and time bounds;
- network policy;
- affected project/work; and
- why the host is unavailable or insufficient.

A sandbox-lease approval keeps adjacent:

- requester and originating session;
- exact project, buildout, work item, and run;
- selected host and host generation;
- data shared and immutable input revision;
- requested semantic capabilities;
- network/resource policy and expiry;
- excluded authority; and
- the consequence of approval or denial.

Excluded authority includes unrelated host files, browser cookies, provider credentials, keychains, SSH agents, ambient cloud credentials, GitHub push, merge, deployment, and publication unless separately requested and authorised.

After consent, the browser companion remains the control/revocation plane. The Fabric may establish a direct bounded data plane to the host so large logs and artifacts do not transit the extension or MCP gateway. Cleanup is an attributable transition; a lost host or missing cleanup proof remains orphaned/uncertain rather than being displayed as destroyed.

Foreman requests semantic operations such as exact checkout, candidate evaluation, bounded test execution, cancellation, artifact return, and cleanup. It never exposes a generic `shell(command)`, raw Docker API, unrestricted filesystem root, arbitrary database query, Hara source evaluation, or native handle.

## Source mapping

This contract was reviewed against:

- `greenways-ai/greenways-os#49` — foreground product hierarchy and first proof;
- `greenways-ai/greenways-os#146` — domain records and the shared desktop/browser/CLI model;
- `greenways-ai/greenways-os#147` — durable cross-session requests and bounded authority;
- `greenways-ai/greenways-os#148` — exact GitHub projection and authoritative read-back;
- `greenways-ai/greenways-os#149` — two-provider, restart, sandbox-host, and verified-effect release gate;
- `greenways-ai/greenways-os#56` — application-scoped optional MCP discovery, authentication, routing, capability negotiation, and no-token-passthrough boundary; and
- `greenways-ai/greenways-os#155` — enrolled execution hosts, sandbox leases, canonical Work host/store/executor binding, and cleanup/recovery.

Visual Language owns labels, relationships, visible states, information hierarchy, capability/authority disclosure, and truthful specimens. Greenways OS owns production behaviour.
