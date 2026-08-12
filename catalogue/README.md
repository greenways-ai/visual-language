# Greenways visual asset catalogue

This directory is the first concrete catalogue built on the
`greenways-asset/0-alpha` registry in `greenways-ai/greenways-os`.

Only `objects/**` is transported by standard Git LFS. Manifests, records,
aliases, collections, release locks, resolver metadata, and lifecycle decisions
remain ordinary Git text so a pull request can review them without downloading
every image.

## Bootstrap state

The catalogue begins in `awaiting-sources`. The exact eight reviewed source
files are declared in `bootstrap-sources.json`, including their names, byte
lengths, PNG dimensions, SHA-256 digests, aliases, selection states, and Hodos
parent/edit relationship. No asset is public in this state.

Stage all eight files together under `catalogue/bootstrap-seed/` and push the
branch. The `Bootstrap project-flower Git LFS catalogue` workflow will:

1. verify every source against the committed contract;
2. import it through the Greenways asset registry;
3. create append-only JSON and `.hal` revisions;
4. preserve the taller Hodos peacock as the compact rendition's parent;
5. promote the seven selected crests to their reviewed states;
6. route all exact objects through Git LFS;
7. remove the temporary seed files; and
8. commit the completed catalogue back to the branch.

The seed directory is intentionally ignored after this one-time transfer. From a
local checkout, use `git add -f catalogue/bootstrap-seed` for the staging commit.

## Completed layout

```text
catalogue/
├── objects/sha256/           hydrated source bytes; Git stores LFS pointers
├── records/                  append-only operational revisions
├── manifests/                portable `.hal` revisions
├── heads/                    current revision pointers
├── indexes/sha256/           exact-byte deduplication index
├── aliases/                  stable human-readable pointers
├── collections/              reviewed asset groups
├── renditions/               deterministic output bindings
├── releases/                 application-facing digest locks
├── resolver/                 static publication metadata
└── site-index.json           catalogue-page projection
```

The initial collection contains the seven Greenways project flowers and one
retained Hodos parent generation. The seven selected crests are approved. The
compact Hodos peacock is the first asset promoted to `published` and therefore
the only source copied into the public site output in this release.

## Verify

Use an LFS-aware checkout and run:

```bash
git lfs pull
npm run verify:catalogue
```

A checkout containing pointer text instead of hydrated image bytes is reported
explicitly. The public site build never uses the Git LFS endpoint as an
application URL; it verifies and copies only reviewed published renditions.
