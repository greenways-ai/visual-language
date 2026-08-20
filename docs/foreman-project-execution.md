# Foreman selected-buildout execution evidence

Status: static high-fidelity follow-up for `greenways-ai/visual-language#36` after the project and buildout screen family merged in pull request #63.

Primary route family:

```text
/v2/applications/foreman/projects/
/v2/applications/foreman/projects/[project]/
/v2/applications/foreman/projects/[project]/buildouts/[buildout]/
```

Execution contract:

```text
foreman-project-execution/1
```

Source vocabulary:

```text
Foreman MCP and sandbox tools · issue #50 · tool-surface/1.0
```

## Scope and lineage

Pull request #63 established the Foreman project overview, project chooser, lifecycle board, selected-buildout workbench, responsive shell, and base evidence model. Its stated follow-up was to consume the merged #50 client, execution-host, lease, Work-run, cleanup, and external-effect vocabulary inside the real selected-buildout route.

This slice completes that integration without replacing the merged overview, board, route family, project fixture, or shared shell. It adds one bounded execution record to the selected `greenways-visual-language / foreman-project-workbench` buildout.

## Contract

`src/foreman/projects-execution.js` publishes one deeply frozen `foreman-project-execution/1` record tied to the source-owned selected project and buildout constants. It imports rather than restates:

- client capability profiles;
- execution-host advertisements;
- canonical run-state vocabulary; and
- profile-specific tool availability.

The `.d.ts` companion keeps the fixture closed and typed without adding it to the public package export map.

## Identity laws

The workbench preserves these different records:

```text
person
bounded agent
provider session
MCP or application client
execution-host advertisement
human approval
sandbox lease
canonical Work run
checkpoint
artifact
external-effect request
canonical provider read-back
```

A Kimi or ChatGPT session is not an execution host. A browser or MCP client is not a durable grant. A host advertisement is not a lease. A lease is not a Work run. A completed Work run is not a GitHub effect.

The fixture includes both:

- an Observe-only ChatGPT Pro client whose action state is unavailable; and
- a directly enrolled Foreman application client whose application operations remain gated.

## Three evidence lanes

The selected-buildout workbench renders three visibly separate lanes before the existing detailed work-item, session, approval, artifact, and activity sections.

### Work

The Work lane shows intent, the selected work item, provider sessions, decisions, and the local outcome. It names the provider session and client independently.

### Execution

The Execution lane consumes every state in the source-owned #50 run vocabulary:

```text
requested
approval-required
granted
allocating
running
checkpointed
completed
cleaned
```

It keeps the requested host profile and actual host advertisement separate, then shows exact approval, request-bound lease, canonical Work run, checkpoint, retained artifacts, and cleanup evidence.

### External effects

The External effects lane shows:

1. an exact GitHub mutation request;
2. an uncertain provider outcome with no canonical URL or revision; and
3. pull request #63 as an externally verified comparison with canonical URL, merged state, and the 40-character merge revision.

## Closed specimen dataset

The fixture contains:

- two distinct client contexts;
- references to two existing provider sessions;
- one actual execution-host advertisement and host generation;
- one exact human approval;
- one request-bound sandbox lease;
- one canonical Work run;
- one checkpoint;
- two retained artifacts;
- one uncertain GitHub effect; and
- one externally verified GitHub read-back.

All identifiers cross-reference exactly. Validation rejects missing client, host, approval, lease, run, checkpoint, artifact, or external-effect identities.

## Truthful completion

The status line deliberately publishes three separate claims:

```text
Local work · completed
Cleanup · verified
GitHub delivery · awaiting read-back
```

The current external effect remains uncertain even though the local Work run completed and cleanup was verified. Pull request #63 appears alongside it only as a distinct, canonical read-back example.

## Responsive behaviour

The new composition extends the existing Foreman responsive shell:

- **Desktop:** three adjacent evidence lanes with the existing rail, workspace, and inspector.
- **1120px / 72rem:** the inspector follows below through the existing shell rule; the evidence lanes become two columns and the external lane spans the row.
- **820px and below:** lane content remains in the primary workspace while the inspector stays below.
- **640px / 44rem:** summary, lanes, read-back comparison, and capability scope become one-column records.
- **480px / 30rem:** compact padding and narrow timeline fields preserve required controls and evidence.
- **320px / 20rem:** the timeline becomes a one-column document flow with no document-level horizontal overflow.

State is always expressed with labels and structure as well as semantic colour.

## Static boundary

The route remains a static product specimen. It performs no fetch, WebSocket, MCP invocation, provider SDK call, host allocation, lease grant, Work execution, approval mutation, GitHub mutation, persistence, or background operation.

The existing controls continue to identify themselves as non-operational review specimens.

## Production adoption

Production Foreman and Greenways Fabric remain responsible for:

- client capability advertisement and revocation;
- provider-session observation;
- application-scoped authority;
- execution-host enrollment and generation freshness;
- exact human approval;
- lease grant, expiry, revocation, and cleanup;
- canonical Work execution and checkpointing;
- artifact retention and provenance;
- external mutation; and
- authoritative external read-back.

No fixture timestamp, digest, host generation, lease, run, approval, or external-effect identity should be copied into production as live state.

## Validation

Focused validation:

```text
node --test test/foreman-project-execution.test.mjs
```

Repository validation after publication:

```text
npm test
npm run build
```
