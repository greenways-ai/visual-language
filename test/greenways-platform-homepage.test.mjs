import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  GREENWAYS_PLATFORM_HOMEPAGE_VERSION,
  greenwaysPlatformHomepage,
} from "../src/v2/greenways-platform-homepage.js";
import {
  getCatalogueGroup,
  getCatalogueRoute,
} from "../src/v2/catalogue-manifest.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const homepage = greenwaysPlatformHomepage;
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

test("the homepage contract is closed, versioned, and publication-led", () => {
  assert.equal(GREENWAYS_PLATFORM_HOMEPAGE_VERSION, "greenways-platform-homepage/1");
  assert.ok(Object.isFrozen(homepage));
  assert.ok(Object.isFrozen(homepage.hero));
  assert.equal(homepage.hero.headline, "Make a place on the web.");
  assert.match(homepage.hero.introduction, /world.*book.*site/i);
  assert.deepEqual(homepage.sequence.map((step) => step.id), ["gather", "shape", "release"]);
  assert.deepEqual(homepage.publicationForms.map((form) => form.id), ["world", "book", "document", "site"]);
  assert.deepEqual(homepage.featuredWork.forms.map((form) => form.id), ["world", "book", "document", "site"]);
});

test("the first public story does not collapse into infrastructure or generic SaaS language", () => {
  const firstStory = walkStrings({
    navigation: homepage.navigation,
    hero: homepage.hero,
    featuredWork: homepage.featuredWork,
    sequence: homepage.sequence,
    publicationForms: homepage.publicationForms,
  }).join(" ");

  assert.doesNotMatch(firstStory, /\b(?:Hara|Hestia|Tahto|Hoplite|Historia|Hodos|Ignatius|MCP|sandbox|provider|open source)\b/i);
  assert.doesNotMatch(firstStory, /\b(?:AI-native|all-in-one|supercharge|solutions|seamless|revolutionary)\b/i);
  assert.doesNotMatch(firstStory, /\bForeman\b/i);
  assert.match(firstStory, /\bpublishing\b/i);
  assert.match(firstStory, /\bwork\b/i);
});

test("Greenways OS and Foreman are disclosed only as supporting layers", () => {
  assert.match(homepage.desk.kicker, /Greenways OS/);
  assert.match(homepage.coordination.introduction, /Foreman/);
  assert.match(homepage.coordination.headline, /without handing over the work/i);
  assert.deepEqual(homepage.coordination.rules.map((rule) => rule.label), ["Named scope", "Human release", "Visible evidence"]);
  assert.match(homepage.meta.truthfulnessNote, /No account, publication, agent, or provider action is performed/);
});

test("the v2 catalogue declares a current Greenways platform family and exact homepage route", () => {
  const family = getCatalogueRoute("/v2/applications/greenways-platform/");
  const route = getCatalogueRoute("/v2/applications/greenways-platform/homepage/");

  assert.ok(family);
  assert.equal(family.label, "Greenways platform");
  assert.equal(family.status, "in-progress");
  assert.equal(family.ownership, "product-laboratory");
  assert.equal(family.issue, 54);
  assert.equal(family.primary, true);

  assert.ok(route);
  assert.equal(route.label, "www.greenways.ai homepage");
  assert.equal(route.status, "ready");
  assert.equal(route.issue, 54);
  assert.equal(route.primary, true);
  assert.equal(getCatalogueGroup(route.path)?.id, "applications");
});

test("the executable route has one truthful, keyboard-addressable homepage composition", async () => {
  const page = await read("src/pages/v2/applications/greenways-platform/homepage.astro");

  assert.match(page, /CatalogueShell/);
  assert.match(page, /MosaicLogo/);
  assert.match(page, /greenwaysPlatformHomepage as homepage/);
  assert.match(page, /data-greenways-platform-homepage=/);
  assert.match(page, /aria-label="Proposed www\.greenways\.ai homepage"/);
  assert.match(page, /role="note"/);
  assert.match(page, /id="publishing-sequence"/);
  assert.match(page, /id="publication-forms"/);
  assert.match(page, /id="publishing-desk"/);
  assert.match(page, /id="release-principles"/);
  assert.match(page, /No publication action is connected/);
  assert.match(page, /Production handoff/);
  assert.doesNotMatch(page, /<button\b/i);
  assert.doesNotMatch(page, /<form\b/i);
  assert.doesNotMatch(page, /href=["']\/(?:login|signup|publish)/i);
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

test("the adoption note preserves production ownership and the intended disclosure order", async () => {
  const docs = await read("docs/greenways-platform-homepage.md");

  assert.match(docs, /The work[\s\S]*The publishing sequence[\s\S]*The public forms[\s\S]*Greenways OS[\s\S]*Foreman[\s\S]*Open foundations/);
  assert.match(docs, /does not change the production homepage/i);
  assert.match(docs, /no literal colour palette/i);
  assert.match(docs, /Production navigation, authentication, persistence, rendering, publication, coordination, and deployment remain outside/);
});
