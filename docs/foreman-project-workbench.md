# Foreman project and buildout workbench

Status: static high-fidelity product laboratory for `greenways-ai/visual-language#36`.

Route:

```text
/v2/applications/foreman/projects/
```

Contract:

```text
foreman-workbench/1
```

This route turns the product language from #35 and the MCP, client, execution-host, lease, run, cleanup, and external-effect vocabulary from #50 into one coherent Foreman workbench. It does not introduce another architecture page and it does not implement a live Foreman runtime.

## Outcome

A reviewer can follow the complete bounded journey in one route:

```text
select project
  -> inspect attention and active buildouts
  -> group buildouts by lifecycle
  -> open one buildout
  -> inspect work and provider sessions
  -> inspect requested and actual execution
  -> inspect approval, artifacts, and evidence
  -> distinguish local completion from external delivery
```

The visual direction is an industrial work-order desk: strong rules, compact records, document labels, explicit identities, and evidence references. Colour supports semantic state but never carries the state alone.

## Closed specimen dataset

`src/foreman/workbench.js` publishes one deeply frozen `foreman-workbench/1` record with:

- three projects;
- eight buildouts across needs-attention, running, waiting, completed, and stopped groups;
- ten work items covering active, waiting, failed, blocked, cancelled, and completed work;
- one person and four bounded agent profiles;
- two client contexts, including an Observe-only ChatGPT MCP client;
- seven distinct provider sessions;
- three execution-host advertisements derived from the #50 tool-surface contract;
- one request-bound sandbox lease and one canonical Work run;
- two exact human approvals;
- checkpoints and artifacts;
- one local success whose GitHub delivery remains uncertain; and
- canonical GitHub read-back for completed comparison records.

The `.d.ts` companion is deliberately local to the Foreman application laboratory. It is not added to the package export map.

## Connected screen family

### Project overview

The initial viewport contains:

- Foreman identity;
- selected project identity;
- active buildout count;
- pending human attention;
- recent verified activity; and
- compact active-buildout work orders.

The overview does not fill the page with generic KPI cards. Attention records name their affected buildout and next safe action. Activity records name their actor and evidence.

### Buildout board

The board groups work orders by lifecycle rather than modelling every outcome as a movable Kanban card. Every row keeps these identities adjacent:

- project and buildout;
- current work item;
- human owner and bounded agents;
- provider sessions;
- execution host advertisement;
- checkpoint;
- approval; and
- external-effect/read-back state.

One buildout may contain several sessions and providers. Those records are never rendered as one generic agent.

### Selected-buildout workbench

The core desk uses three explicit lanes:

1. **Work** — intent, work items, sessions, and decisions.
2. **Execution** — requested host, actual host advertisement, lease, canonical Work run, checkpoint, artifact, and cleanup.
3. **External effects** — provider mutation request, uncertain outcome, and authoritative read-back.

The inspector keeps the selected work item, bounded agent, provider sessions, client capability, requested capabilities, actual host, lease, expiry, run, approval, artifacts, and excluded authority together without merging them.

The status line intentionally reads as three claims:

```text
Local work: completed
Cleanup: verified
GitHub delivery: awaiting read-back
```

A local patch, completed run, or verified cleanup therefore cannot look like successful GitHub delivery.

## Identity laws

The route preserves these separate records:

```text
person
agent profile
provider session
MCP/browser/desktop client
execution host advertisement
sandbox lease
canonical Work run
approval
artifact
external effect
canonical external read-back
```

The visual identity legend uses labels and different marker shapes as well as restrained semantic colour. Provider sessions show provider and native working context separately. The Observe-only client states that action is unavailable rather than presenting a disabled mutation as a hidden fetch operation.

## State matrix

The route exposes specimens for:

- first use;
- loading;
- empty project;
- empty filtered result;
- active;
- waiting for approval;
- stale;
- provider disconnected;
- host unavailable;
- partial result;
- recoverable failure;
- fatal failure;
- cancelled;
- completed; and
- externally verified.

Each state includes its meaning and required evidence. The matrix is executable fixture data rather than an informal screenshot checklist.

## Responsive contract

The route is designed at these boundaries:

- **Desktop:** project rail, primary workspace, and inspector.
- **1120px:** narrower project rail; inspector moves below the workspace in two columns.
- **820px:** project rail becomes a top region; the inspector remains below the workspace.
- **640px:** project context and attention stack first; view controls and commands become full-width where needed.
- **390px:** buildout fields, state specimens, status line, and inspector become one-column records.
- **320px:** one-column document flow, full-width commands, no hidden required control, and no document-level horizontal overflow.

The three workbench lanes are native ordered disclosures, so compact layouts preserve hierarchy without turning into a log relay.

## Static interaction contract

Local JavaScript is limited to:

- switching among the three connected views;
- filtering static specimen records; and
- announcing that a displayed command sent no request.

There is no fetch, WebSocket, provider SDK, browser API, persistence, host allocation, approval mutation, GitHub mutation, or background operation.

## Production ownership

This laboratory owns visual composition and fixture truth only.

Production Foreman and Greenways Fabric remain responsible for:

- project, buildout, work, session, approval, artifact, and activity state;
- application-scoped authority;
- client capability advertisement;
- provider and browser boundaries;
- execution-host enrollment and advertisement;
- lease grant, expiry, revocation, and cleanup;
- canonical Work execution and checkpointing;
- handoff dispatch and return; and
- external mutation plus authoritative read-back.

No fixture identifier, timestamp, actor, repository record, digest, capability, or host advertisement should be copied into production as live state.

## Follow-on work

- #37 should reuse the selected work-item, origin session, approval, external-effect, and evidence composition for authorised handoffs.
- #38 should adapt the same objects into desktop, browser side-panel, launcher, and CLI-specific disclosure levels.
- #39 should own the screenshot matrix, keyboard/focus audit, light/dark review, route status, and exact downstream adoption revision.

## Validation

Focused validation:

```text
node --test test/foreman-project-workbench.test.mjs
```

Repository validation after publication:

```text
npm test
npm run build
```
