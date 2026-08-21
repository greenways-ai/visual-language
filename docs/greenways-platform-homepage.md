# Greenways Fabric homepage laboratory

Issue: [#54](https://github.com/greenways-ai/visual-language/issues/54)

Route: `/v2/applications/greenways-platform/homepage/`

## Purpose

This route is the proposed public doorway for `www.greenways.ai`. It supersedes the earlier publishing-led homepage study while preserving its neutral editorial grammar and stable route.

The public proposition is now:

> Greenways Fabric keeps your storage, identity, agents, applications, and history connected under your control.

The Fabric is presented as the personal operating system. Spaces, Build, Studio, Socials, publishing, collaboration, public works, and delivery are capabilities and applications on top of it—not the product foundation itself.

The route is an executable visual-language specimen. It does not change the production homepage, install Greenways OS, mount storage, create keys, enrol identities, invoke agents, launch applications, connect Platform, or publish work.

## Public disclosure order

The homepage uses this order:

1. **Greenways Fabric** — the personal OS and durable layer beneath every window.
2. **Storage you host** — computer, home server, or chosen infrastructure using open source, open standards, and portable formats.
3. **Identity you carry** — one person linked through keys to distinct devices, applications, collaborators, agents, and optional hosted accounts.
4. **Agents you direct** — named participants with a purpose, bounded context, expiry, revocation, and attributable return.
5. **Same Fabric, different windows** — Desktop, browser, CLI, and home server reach the same personal Fabric.
6. **Applications on top** — Spaces, Build, Studio, and Socials as focused views and tools.
7. **Private Fabric and optional Platform** — only explicitly selected references, releases, invitations, or profile fields cross into hosted services.
8. **Open by construction** — open source and standards expressed as ownership, portability, replaceability, and durability.

This order is intentional. It prevents the public site from becoming a publishing landing page, application catalogue, cloud-account pitch, infrastructure diagram, or open-source project index.

## Editorial laws

- Say what the Fabric enables before explaining how it is built.
- Name Greenways Fabric in the first viewport.
- Describe self-hosting as a choice over location, operation, movement, backup, and recovery.
- Do not imply that self-hosting alone guarantees backup, uptime, security, or recovery.
- Explain keys through durable identity and verifiable relationships rather than cryptographic mechanics.
- Keep person, device, application, collaborator, agent, and hosted account distinct.
- Give agents names, roles, boundaries, expiry, revocation, and attributable results.
- Present applications after the Fabric is understood.
- Use the line: “The application is a view. The Fabric is the OS.”
- Keep Greenways Platform optional and separately authenticated.
- Never imply automatic upload, sync, publication, or transfer of private Fabric state.

## Application relationship

The current foreground applications are exactly:

```text
Spaces   understand
Build    coordinate
Studio   create
Socials  connect
```

They share Fabric identity, storage choices, agents, references, and history. They remain application-owned views and domains rather than separate silos or identity roots.

No fifth Publish, Research, Home, Packages, Keyring, or Receipts application is introduced by the homepage.

## Visual contract

- Structural canvas, header, panels, diagrams, and footer use shared neutral v2 roles.
- The Greenways mosaic mark is the strongest multicolour moment.
- Emerald, aqua, sapphire, and violet appear as restrained threads, node identifiers, and application signals.
- Brand colours never become broad structural backgrounds.
- Semantic success, warning, danger, stale, disconnected, and approval states remain separate from brand/application identity.
- The Fabric is shown as a calm neutral core linked to storage, identity, agents, and applications—not a glowing cloud.
- The page uses numbered plates, rules, grids, labels, and terse instructional copy in the discipline of a 1970s technical manual.
- Light and dark themes preserve equivalent hierarchy.

The route-specific stylesheets contain no literal colour palette. They consume shared `--gw-v2-*` tokens.

## Truthfulness boundary

All visible calls to action are in-page anchors. The specimen explicitly states that no storage, identity, agent, application, account, or hosted-service action is performed.

The storage section states that self-hosting is control rather than a guarantee. The Platform section states that only an explicitly selected boundary crossing moves into hosted services. The application section makes no claim that the applications are installed or available.

A later production adoption must replace anchors only when the corresponding route, state, and operation exist and can be read back authoritatively.

## Production adoption checklist

- Keep the first viewport centred on Greenways Fabric as the personal OS.
- Preserve the “storage you host · identity you carry · agents you direct · applications you choose” hierarchy.
- Use self-hosted, open-source, open-standard, and portable language as user freedoms rather than project badges.
- Keep applications below the Fabric explanation.
- Keep Greenways Platform optional and visibly separate from private Fabric authority.
- Connect calls to action only to truthful, available destinations.
- Show installed, connected, backed-up, recovered, synced, public, or verified state only after authoritative evidence exists.
- Keep internal technology and provider names in developer documentation or diagnostic disclosure.
- Review light and dark rendering at desktop, 820px, 390px, and 320px.
- Verify keyboard focus, reduced motion, contrast, accessible diagram alternatives, and no document-level horizontal overflow.

## Source ownership

- `src/v2/greenways-platform-homepage.js` owns the closed Fabric-first editorial and section contract plus compatibility exports for the earlier laboratory name.
- `src/pages/v2/applications/greenways-platform/homepage.astro` owns the executable catalogue composition.
- `src/v2/greenways-platform-homepage*.css` owns route-specific core, ownership, identity, application, and responsive presentation using shared tokens. The historical filenames remain stable to keep the change additive.
- `src/v2/catalogue-manifest.js` owns route discovery and Fabric-first application-family copy.
- `test/greenways-platform-homepage.test.mjs` owns focused contract enforcement.

Production installation, storage, identity, authority, agents, application runtime, hosted connections, and deployment remain outside `@greenways-ai/visual-language`.
