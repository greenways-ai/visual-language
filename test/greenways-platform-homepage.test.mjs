import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  GREENWAYS_FABRIC_HOMEPAGE_VERSION,
  GREENWAYS_PLATFORM_HOMEPAGE_VERSION,
  greenwaysFabricHomepage,
  greenwaysPlatformHomepage,
} from "../src/v2/greenways-platform-homepage.js";
import {
  getCatalogueGroup,
  getCatalogueRoute,
} from "../src/v2/catalogue-manifest.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const homepage = greenwaysFabricHomepage;
const stylePaths = [
  "src/v2/greenways-platform-homepage.css",
  "src/v2/greenways-platform-homepage-publication.css",
  "src/v2/greenways-platform-homepage-workspace.css",
  "src/v2/greenways-platform-homepage-responsive.css",
];
const readStyles = async () => (await Promise.all(stylePaths.map(read))).join("\n");

const walkStrings = (value) => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(walkStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(walkStrings);
  return [];
};

test("the homepage contract is closed, versioned, Fabric-first, and backwards compatible", () => {
  assert.equal(GREENWAYS_FABRIC_HOMEPAGE_VERSION, "greenways-fabric-homepage/2");
  assert.equal(GREENWAYS_PLATFORM_HOMEPAGE_VERSION, GREENWAYS_FABRIC_HOMEPAGE_VERSION);
  assert.equal(greenwaysPlatformHomepage, greenwaysFabricHomepage);
  assert.ok(Object.isFrozen(homepage));
  assert.ok(Object.isFrozen(homepage.hero));
  assert.equal(homepage.hero.headline, "Your digital life, held together.");
  assert.match(homepage.hero.kicker, /Greenways Fabric.*personal operating environment/i);
  assert.match(homepage.hero.introduction, /Store your work where you choose/i);
  assert.deepEqual(homepage.core.pillars.map((pillar) => pillar.id), ["storage", "identity", "agents", "applications"]);
  assert.equal(homepage.fabric.headline, "The Fabric is the OS.");
});

test("the first public story explains outcomes rather than infrastructure or publishing tools", () => {
  const firstStory = walkStrings({
    navigation: homepage.navigation,
    hero: homepage.hero,
    core: homepage.core,
    fabric: homepage.fabric,
    storage: homepage.storage,
    identity: homepage.identity,
    agents: homepage.agents,
  }).join(" ");

  assert.doesNotMatch(firstStory, /\b(?:Hara|Hestia|Tahto|Hoplite|Historia|Hodos|Ignatius|Foreman|MCP|sandbox|database|filesystem API|Docker)\b/i);
  assert.doesNotMatch(firstStory, /\b(?:AI-native|all-in-one|supercharge|solutions|seamless|revolutionary|decentralised)\b/i);
  assert.doesNotMatch(firstStory, /publishing system|publishing desk|publication-led/i);
  assert.match(firstStory, /\bFabric\b/);
  assert.match(firstStory, /\bstorage\b/i);
  assert.match(firstStory, /\bidentity\b/i);
  assert.match(firstStory, /\bagents?\b/i);
});

test("self-hosted storage is framed through open ownership and explicit limits", () => {
  const storageCopy = walkStrings(homepage.storage).join(" ");
  assert.match(storageCopy, /computer/i);
  assert.match(storageCopy, /home server/i);
  assert.match(storageCopy, /infrastructure you (?:select|choose)/i);
  assert.match(storageCopy, /Open source/i);
  assert.match(storageCopy, /Open standards/i);
  assert.match(storageCopy, /Portable formats/i);
  assert.match(storageCopy, /Self-hosting is control, not magic/i);
  assert.match(storageCopy, /Backup, availability, and recovery remain choices/i);
});

test("keys link distinct identities without granting ambient agent authority", () => {
  assert.match(homepage.identity.introduction, /Keys link your Greenways identity/i);
  assert.deepEqual(homepage.identity.links.map((link) => link.id), [
    "desktop",
    "browser",
    "cli",
    "collaborator",
    "agent",
    "platform",
  ]);
  assert.ok(homepage.identity.laws.includes("A device is not a person."));
  assert.ok(homepage.identity.laws.includes("An application is not an identity root."));
  assert.ok(homepage.identity.laws.includes("An agent does not inherit every permission you hold."));

  assert.deepEqual(homepage.agents.examples.map((agent) => agent.application), ["Spaces", "Build", "Studio"]);
  for (const agent of homepage.agents.examples) {
    assert.ok(agent.purpose.length > 0);
    assert.ok(agent.scope.length > 0);
    assert.match(agent.expiry, /Ends/i);
    assert.ok(agent.return.length > 0);
  }
  assert.match(homepage.agents.rule, /Name the agent.*Bound the work.*attributable/i);
});

test("exactly four applications sit on top of the Fabric", () => {
  assert.deepEqual(homepage.applications.items.map((application) => application.id), ["spaces", "build", "studio", "socials"]);
  assert.deepEqual(homepage.applications.items.map((application) => application.verb), ["Understand", "Coordinate", "Create", "Connect"]);
  assert.match(homepage.applications.headline, /application is a view.*Fabric is the OS/i);

  const applicationCopy = walkStrings(homepage.applications).join(" ");
  assert.doesNotMatch(applicationCopy, /\b(?:Research|Publish|Packages|Keyring|Receipts|Foreman)\b/);
});

test("the hosted Platform remains optional and cannot masquerade as the private Fabric", () => {
  const platformCopy = walkStrings(homepage.platform).join(" ");
  assert.match(homepage.platform.kicker, /Private Fabric, optional Platform/i);
  assert.match(platformCopy, /remains useful without it/i);
  assert.match(platformCopy, /Only what you select crosses/i);
  assert.match(platformCopy, /not an unrestricted copy of the Fabric/i);
  assert.match(platformCopy, /Separately authenticated/i);
  assert.match(platformCopy, /Revocable without replacing local identity/i);
  assert.doesNotMatch(platformCopy, /automatically (?:upload|sync|publish)/i);
});

test("the v2 catalogue keeps the stable route but describes a Fabric-first Greenways family", () => {
  const family = getCatalogueRoute("/v2/applications/greenways-platform/");
  const route = getCatalogueRoute("/v2/applications/greenways-platform/homepage/");

  assert.ok(family);
  assert.equal(family.label, "Greenways Fabric");
  assert.match(family.summary, /personal operating environment/i);
  assert.match(family.summary, /storage, identity, agents, and applications/i);
  assert.equal(family.status, "in-progress");
  assert.equal(family.ownership, "product-laboratory");
  assert.equal(family.issue, 54);
  assert.equal(family.primary, true);

  assert.ok(route);
  assert.equal(route.label, "www.greenways.ai homepage");
  assert.match(route.summary, /Fabric-first/i);
  assert.equal(route.status, "in-progress");
  assert.equal(route.issue, 54);
  assert.equal(route.primary, true);
  assert.equal(getCatalogueGroup(route.path)?.id, "applications");
});

test("the executable route has one truthful, keyboard-addressable Fabric composition", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /CatalogueShell/);
  assert.match(page, /MosaicLogo/);
  assert.match(page, /greenwaysFabricHomepage as homepage/);
  assert.match(page, /data-greenways-fabric-homepage=/);
  assert.match(page, /aria-label="Proposed Fabric-first www\.greenways\.ai homepage"/);
  assert.match(page, /role="note"/);
  for (const id of ["fabric", "storage", "identity", "agents", "surfaces", "applications", "platform", "open", "start"]) {
    assert.match(page, new RegExp(`id=["']${id}["']`), id);
  }
  assert.match(page, /class="gwf-storage__caveat"/);
  assert.match(page, /class="gwf-boundary__crossing"/);
  assert.match(page, /Production handoff/);
  assert.doesNotMatch(page, /<button\b/i);
  assert.doesNotMatch(page, /<form\b/i);
  assert.doesNotMatch(page, /href=["']\/(?:login|signup|install|publish|connect)/i);
  assert.doesNotMatch(page, /on(?:click|mouse|pointer|touch)=/i);
});

test("the route-specific stylesheet consumes shared v2 colour roles", async () => {
  const [entry, css] = await Promise.all([read("src/v2/greenways-platform-homepage.css"), readStyles()]);

  assert.match(entry, /@import "\.\/greenways-platform-homepage-publication\.css"/);
  assert.match(entry, /@import "\.\/greenways-platform-homepage-workspace\.css"/);
  assert.match(entry, /@import "\.\/greenways-platform-homepage-responsive\.css"/);
  assert.match(css, /var\(--gw-v2-canvas\)/);
  assert.match(css, /var\(--gw-v2-surface\)/);
  assert.match(css, /var\(--gw-v2-brand-emerald\)/);
  assert.match(css, /var\(--gw-v2-brand-aqua\)/);
  assert.match(css, /var\(--gw-v2-brand-sapphire\)/);
  assert.match(css, /var\(--gw-v2-brand-violet\)/);
  assert.match(css, /var\(--gw-v2-signal\)/);
  assert.match(css, /var\(--gw-v2-state-warning\)/);
  assert.doesNotMatch(css, /#[\da-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgb|rgba|hsl|hsla)\(/i);
  assert.doesNotMatch(css, /background(?:-color)?:\s*var\(--gw-v2-brand-(?:emerald|aqua|sapphire|violet)\)\s*;\s*\/\*\s*structural/i);
});

test("responsive, focus, and reduced-motion contracts cover compact review", async () => {
  const css = await readStyles();

  assert.match(css, /min-inline-size:\s*0/);
  assert.match(css, /overflow:\s*clip/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 58rem\)/);
  assert.match(css, /@media \(max-width: 42rem\)/);
  assert.match(css, /@media \(max-width: 30rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /min-width:\s*(?:3[2-9][1-9]|[4-9]\d{2,})px/);
  assert.doesNotMatch(css, /white-space:\s*nowrap/);
});

test("the adoption note preserves Fabric-first production ownership and order", async () => {
  const docs = await read("docs/greenways-platform-homepage.md");

  assert.match(docs, /Greenways Fabric[\s\S]*Storage you host[\s\S]*Identity you carry[\s\S]*Agents you direct[\s\S]*Same Fabric, different windows[\s\S]*Applications on top[\s\S]*Private Fabric and optional Platform[\s\S]*Open by construction/);
  assert.match(docs, /does not change the production homepage/i);
  assert.match(docs, /no literal colour palette/i);
  assert.match(docs, /Production installation, storage, identity, authority, agents, application runtime, hosted connections, and deployment remain outside/);
  assert.match(docs, /The application is a view\. The Fabric is the OS\./);
});
