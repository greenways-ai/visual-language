# Greenways visual asset catalogue

This directory is the first concrete catalogue built on the
`greenways-asset/0-alpha` registry in `greenways-ai/greenways-os`.

Only the permanent `objects/**` tree is transported by standard Git LFS in the
completed catalogue. Manifests, records, aliases, collections, release locks,
resolver metadata, and lifecycle decisions remain ordinary Git text so a pull
request can review them without downloading every image.

## Bootstrap state

The catalogue begins in `awaiting-sources`. The exact eight reviewed source
files are declared in `bootstrap-sources.json`, including their names, byte
lengths, PNG dimensions, SHA-256 digests, aliases, selection states, and Hodos
parent/edit relationship. No asset is public in this state.

The reviewed ZIP itself is pinned by `bootstrap-bundle.json`. The preferred
one-time handoff is:

```bash
git lfs install
npm run stage:catalogue-bundle -- /path/to/greenways-project-flower-lfs-seed.zip
git commit -m "Stage the reviewed project-flower sources"
git push origin agent/project-flower-source-bootstrap-16
```

`stage:catalogue-bundle` verifies the archive byte length and SHA-256 before
reading it. It then confirms the archive contains exactly the eight declared
seed entries, extracts only those PNGs, verifies every source again, and hands
them to the ordinary seed staging gate. Renaming the downloaded ZIP is safe;
its exact bytes, rather than its local filename, determine acceptance.

For an already unpacked, independently verified source directory, the lower
level command remains available:

```bash
npm run stage:catalogue-seed
```

The staging helper verifies all eight files and temporarily adds the seed path
to the local branch's LFS attributes before staging. It then inspects every
staged blob and refuses to continue unless the blob is a canonical Git LFS
pointer whose OID and size exactly match the reviewed source contract. The raw
PNG bytes therefore never enter ordinary Git history.

The `Bootstrap project-flower Git LFS catalogue` workflow will then:

1. hydrate the eight reviewed seed objects from Git LFS;
2. verify every source against the committed contract;
3. import it through the Greenways asset registry pinned to the reviewed
   `greenways-ai/greenways-os#48` merge commit;
4. create append-only JSON and `.hal` revisions;
5. preserve the taller Hodos peacock as the compact rendition's parent;
6. promote the seven selected crests to their reviewed states;
7. reuse the same SHA-256 LFS objects at permanent content-addressed paths;
8. remove the temporary seed pointers and temporary LFS attribute; and
9. commit the completed catalogue back to the branch.

Because Git LFS uses the exact source SHA-256 as its object ID, the temporary
seed path and permanent content-addressed path do not duplicate the binary
object.

## Merge gate

Branches named `agent/project-flower-source-bootstrap-*` have an additional
pull-request gate. It intentionally fails while `bootstrap-status.json` is
`awaiting-sources` or `pending`. The gate turns green only after the generated
catalogue verifies all eight exact objects, seven selected crests, one published
release entry, and exactly one public PNG: the compact Hodos peacock rendition.
Do not merge a source-bootstrap pull request before this gate passes.

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
