import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the Visual Language website is an Astro Starlight application", async () => {
  const [pkg, config, collection] = await Promise.all([
    read("package.json"),
    read("astro.config.mjs"),
    read("src/content.config.ts"),
  ]);
  assert.match(pkg, /"version": "5\.1\.0"/);
  assert.match(pkg, /"astro": "\^7\.1\.6"/);
  assert.match(pkg, /"@astrojs\/starlight"/);
  assert.match(pkg, /"build": "npm run assets/);
  assert.match(config, /base: "\/visual-language"/);
  assert.match(config, /SharedSiteHeader\.astro/);
  assert.match(config, /GreenwaysThemeProvider\.astro/);
  assert.match(config, /site-overrides\.css/);
  assert.match(config, /logo: \{ src: "\.\/src\/site\/assets\/lotus\.svg"/);
  assert.match(collection, /docsLoader/);
});

test("the static page shells were removed instead of being copied into the Astro build", async () => {
  for (const path of [
    "site/index.html",
    "site/lab.html",
    "site/lab.js",
    "site/statstrade/index.html",
    "bin/build-site.mjs",
  ]) {
    await assert.rejects(access(new URL(`../${path}`, import.meta.url)), path);
  }
  const copy = await read("scripts/copy-static-assets.mjs");
  assert.match(copy, /site\/artwork/);
  assert.match(copy, /site\/sigils/);
  assert.doesNotMatch(copy, /site\/index\.html/);
});

test("the purple three-petal lotus is the canonical and locally versioned site identity", async () => {
  const [generator, projects, logo, compact, header, sigil] = await Promise.all([
    read("bin/generate-v3-favicons.mjs"),
    read("src/projects.js"),
    read("src/MosaicLogo.astro"),
    read("src/site/assets/lotus.svg"),
    read("src/site/components/SharedSiteHeader.astro"),
    read("src/Sigil.astro"),
  ]);
  assert.match(generator, /"visual-language": \{ study: "lotus-three"/);
  for (const colour of ["#452a5e", "#5e3680", "#764a98", "#9367c5", "#b899da"]) assert.match(generator, new RegExp(colour));
  assert.match(projects, /motif: "Lotus · three petals"/);
  assert.match(projects, /accent: "purple"/);
  assert.doesNotMatch(logo, /project === "visual-language" \? "greenways"/);
  assert.match(compact, /--p1:#452a5e/);
  assert.ok((compact.match(/<path/g) || []).length >= 12, "compact lotus should retain mosaic facets");
  assert.match(header, /logoAssetBase=\{`\$\{base\}favicons`\}/);
  assert.match(header, /logoAssetVersion="lotus-concepts-20260805"/);
  assert.match(sigil, /assetVersion/);
  assert.match(sigil, /encodeURIComponent/);
});

test("the sidebar and header menus keep visible labels", async () => {
  const [css, header, config] = await Promise.all([
    read("src/site/styles/site-overrides.css"),
    read("src/DocumentationHeader.astro"),
    read("astro.config.mjs"),
  ]);
  assert.match(css, /a\[aria-current="page"\]/);
  assert.match(css, /color: #fff !important/);
  assert.match(css, /a\[aria-current="page"\] :is\(span, strong, small\)/);
  assert.match(header, /nav\?: NavItem\[\]/);
  assert.match(header, /nav\.map/);
  assert.match(config, /collapsed: false/);
  assert.match(config, /Concept pages ↗/);
});

test("day and night are explicit comparison states across the site", async () => {
  const [home, explorer, catalogue, page] = await Promise.all([
    read("src/content/docs/index.mdx"),
    read("src/site/components/DayNightExplorer.astro"),
    read("src/site/components/ArtworkCatalogue.astro"),
    read("src/content/docs/identity/day-night.mdx"),
  ]);
  assert.match(home, /HomeDayNight/);
  for (const view of ["pair", "day", "night"]) assert.match(explorer, new RegExp(`"${view}"`));
  assert.match(explorer, /Open concept/);
  for (const view of ["pair", "day", "night", "theme"]) assert.match(catalogue, new RegExp(`data-display-target="${view}"`));
  assert.ok((page.match(/<DayNightExplorer/g) || []).length >= 3);
});

test("dimensional marks preserve canonical SVG identity in a dependency-free shader lab", async () => {
  const [pkg, config, system, page, lab] = await Promise.all([
    read("package.json"),
    read("astro.config.mjs"),
    read("src/content/docs/identity/3d-marks.mdx"),
    read("src/content/docs/identity/3d-mark-lab.mdx"),
    read("src/site/components/MarkLab3D.astro"),
  ]);
  assert.doesNotMatch(pkg, /"three"\s*:/);
  assert.match(config, /3D mark system/);
  assert.match(config, /3D Mark Lab/);
  assert.match(system, /canonical generated SVG remains the source of truth/);
  assert.match(system, /React Three Fiber/);
  assert.match(page, /<MarkLab3D \/>/);
  assert.match(lab, /getContext\("webgl2"/);
  assert.match(lab, /#version 300 es/);
  assert.match(lab, /prefers-reduced-motion/);
  assert.match(lab, /IntersectionObserver/);
  for (const mark of ["greenways", "hestia", "hoplite", "hodos", "historia", "tahto", "ignatius", "visual-language", "statstrade"]) {
    assert.match(lab, new RegExp(`${mark}\\.svg`));
  }
});

test("both requested worlds have visual case-study explorations", async () => {
  const [config, index, statstrade, greenways, statStudy, districts] = await Promise.all([
    read("astro.config.mjs"),
    read("src/content/docs/case-studies/index.mdx"),
    read("src/content/docs/case-studies/statstrade.mdx"),
    read("src/content/docs/case-studies/greenways-world.mdx"),
    read("src/site/components/StatstradeSurfaceStudy.astro"),
    read("src/site/components/WorldDistrictGrid.astro"),
  ]);
  assert.match(config, /Greenways\.ai world/);
  assert.match(index, /CaseStudyIndex/);
  assert.match(statstrade, /StatstradeSurfaceStudy/);
  assert.match(statstrade, /arena-day-study\.svg/);
  assert.match(greenways, /WorldDistrictGrid/);
  assert.match(greenways, /World Confluence/);
  assert.match(statStudy, /The feed is home/);
  assert.match(districts, /aurora-conservatory-belt/);
});

test("the homepage and documentation cover the complete system", async () => {
  const [home, sigils, artwork, adoption, caseStudy] = await Promise.all([
    read("src/content/docs/index.mdx"),
    read("src/content/docs/identity/sigils.mdx"),
    read("src/content/docs/identity/artwork-worlds.mdx"),
    read("src/content/docs/adoption/getting-started.md"),
    read("src/content/docs/case-studies/statstrade.mdx"),
  ]);
  for (const component of ["HomeHero", "FoundationMatrix", "SystemProof", "HomeDayNight", "CatalogueDoors", "AdoptionPath", "IntegrityPanel"]) assert.match(home, new RegExp(component));
  assert.match(sigils, /SigilCatalogue/);
  assert.match(artwork, /ArtworkCatalogue/);
  assert.match(adoption, /DocumentationHeader/);
  assert.match(caseStudy, /Arena of Conviction/);
});

test("GitHub Pages installs, builds, and deploys the Astro dist directory", async () => {
  const [ci, pages, verify] = await Promise.all([
    read(".github/workflows/ci.yml"),
    read(".github/workflows/pages.yml"),
    read("scripts/verify-site-output.mjs"),
  ]);
  assert.match(ci, /npm install --no-audit --no-fund/);
  assert.match(ci, /npm run build/);
  assert.match(pages, /path: dist/);
  assert.match(verify, /dist\/identity\/day-night\/index\.html/);
  assert.match(verify, /dist\/identity\/3d-mark-lab\/index\.html/);
  assert.match(verify, /dist\/case-studies\/greenways-world\/index\.html/);
  assert.match(verify, /dist\/concepts\/index\.html/);
});
