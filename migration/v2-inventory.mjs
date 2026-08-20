const freeze = (value) => Object.freeze(value);
const record = (path, treatment, owner, note, exportKey) =>
  freeze({ path, treatment, owner, note, ...(exportKey ? { exportKey } : {}) });
const records = (prefix, paths, treatment, owner, note) =>
  freeze(paths.map((path) => record(`${prefix}${path}`, treatment, owner, note)));

export const migrationTreatments = freeze([
  "retain",
  "adapt",
  "replace",
  "deprecate",
  "laboratory-only",
]);

export const legacyPackageExports = freeze([
  record("src/theme.css", "retain", "package", "Keep the v1 theme and component aliases unchanged.", "./theme.css"),
  record("src/typography.css", "retain", "package", "Keep the protected display, sans and mono families.", "./typography.css"),
  record("src/theme.js", "retain", "package", "Keep the shared preference and cookie contract.", "./theme.js"),
  record("src/ThemeToggle.astro", "retain", "package", "Legacy compatibility export.", "./ThemeToggle.astro"),
  record("src/ThemeMenu.astro", "retain", "package", "Legacy compatibility export.", "./ThemeMenu.astro"),
  record("src/ThemeButton.astro", "retain", "package", "Stable one-press theme control.", "./ThemeButton.astro"),
  record("src/SharedHeader.astro", "adapt", "package", "Retain now; compose through v2 surfaces rather than restyling in place.", "./SharedHeader.astro"),
  record("src/DocumentationHeader.astro", "adapt", "package", "Retain now; future v2 documentation uses the new semantic tokens.", "./DocumentationHeader.astro"),
  record("src/DocumentationSearch.astro", "retain", "package", "Stable shared documentation control.", "./DocumentationSearch.astro"),
  record("src/ProjectSwitcher.astro", "retain", "package", "Stable project navigation contract.", "./ProjectSwitcher.astro"),
  record("src/CodePanel.astro", "adapt", "package", "Candidate for a future v2 shared code specimen without in-place drift.", "./CodePanel.astro"),
  record("src/DocumentationCard.astro", "adapt", "package", "Candidate for a future v2 content primitive.", "./DocumentationCard.astro"),
  record("src/Sigil.astro", "retain", "package", "Protected semantic sigil and adaptive asset contract.", "./Sigil.astro"),
  record("src/projects.js", "retain", "package", "Stable project metadata.", "./projects.js"),
  record("src/MosaicLogo.astro", "retain", "package", "Protected mosaic identity entry point.", "./MosaicLogo.astro"),
  record("src/ThemedArtwork.astro", "retain", "package", "Stable adaptive artwork wrapper.", "./ThemedArtwork.astro"),
  record("src/statstrade.css", "deprecate", "package", "Compatibility-only product CSS; do not use in new shared v2 work.", "./statstrade.css"),
  record("src/statstrade-world.js", "deprecate", "package", "Compatibility-only product data.", "./statstrade-world.js"),
  record("src/StatstradeS.astro", "deprecate", "package", "Compatibility-only product identity export.", "./StatstradeS.astro"),
  record("src/StatstradeGateway.astro", "deprecate", "package", "Compatibility-only product presentation export.", "./StatstradeGateway.astro"),
]);

export const v2PackageContracts = freeze([
  record("src/v2/tokens.css", "replace", "package", "Semantic v2 token source; opt-in and theme-complete.", "./v2/tokens.css"),
  record("src/v2/document.css", "replace", "package", "Calm document and product foundation.", "./v2/document.css"),
  record("src/v2/workbench.css", "replace", "package", "Dense layer importing the document foundation.", "./v2/workbench.css"),
  record("src/v2/contract.js", "replace", "package", "Machine-readable entry, identity and token-family contract.", "./v2/contract.js"),
]);

const componentFiles = [
  "AdoptionPath.astro",
  "ArtworkCatalogue.astro",
  "AssetCatalogue.astro",
  "CaseStudyIndex.astro",
  "CatalogueDoors.astro",
  "DayNightExplorer.astro",
  "FoundationMatrix.astro",
  "GreenwaysControlPlaneArt.astro",
  "GreenwaysOsV2ExtensionDesktop.astro",
  "GreenwaysOsV2NativeDesktop.astro",
  "GreenwaysOsV2Popup.astro",
  "GreenwaysOsV2SidePanel.astro",
  "GreenwaysOsV2Surface.astro",
  "GreenwaysOsV2Web.astro",
  "GreenwaysProductView.astro",
  "GreenwaysThemeProvider.astro",
  "GreenwaysThemeSelect.astro",
  "HomeDayNight.astro",
  "HomeHero.astro",
  "IntegrityPanel.astro",
  "MarkLab3D.astro",
  "SharedSiteHeader.astro",
  "SigilCatalogue.astro",
  "StatstradeFeedArt.astro",
  "StatstradeSurfaceStudy.astro",
  "SystemProof.astro",
  "WorldDistrictGrid.astro",
];
const layoutFiles = ["ConceptShell.astro", "GreenwaysOsV2Shell.astro", "GreenwaysProductShell.astro"];
const styleFiles = [
  "concept-page.css",
  "custom.css",
  "greenways-control-plane.css",
  "greenways-hara-v2.css",
  "greenways-os-v2-foundation.css",
  "greenways-os-v2-overview.css",
  "greenways-os-v2-popup.css",
  "greenways-os-v2-responsive.css",
  "greenways-os-v2-side-panel.css",
  "greenways-os-v2-web.css",
  "greenways-os-v2-workbench-browser.css",
  "greenways-os-v2-workbench-native.css",
  "greenways-os-v2.css",
  "greenways-os.css",
  "greenways-product.css",
  "site-overrides.css",
  "starlight-shell.css",
];

export const siteOnlySources = freeze([
  ...records("src/site/components/", componentFiles, "laboratory-only", "site", "Specimen or site presentation; never package-exported."),
  ...records("src/site/layouts/", layoutFiles, "laboratory-only", "site", "Concept or product laboratory shell."),
  ...records("src/site/styles/", styleFiles, "laboratory-only", "site", "Site and concept presentation CSS; not a shared contract."),
  record("src/site/assets/peacock-feather.svg", "laboratory-only", "site", "Documentation shell asset."),
  ...[
    "src/artwork-catalog.js",
    "src/content.config.ts",
    "src/greenways-os-v2-surfaces.ts",
    "src/greenways-product-screens.ts",
    "src/scene-language.js",
  ].map((path) => record(path, "laboratory-only", "site", "Site data or content configuration; not a package contract.")),
]);

export const conceptRouteSources = freeze([
  "src/pages/concepts/[world]/[scene].astro",
  "src/pages/concepts/greenways-v2/[surface].astro",
  "src/pages/concepts/greenways-v2/index.astro",
  "src/pages/concepts/greenways/[screen].astro",
  "src/pages/concepts/greenways/control-plane.astro",
  "src/pages/concepts/greenways/index.astro",
  "src/pages/concepts/index.astro",
  "src/pages/concepts/statstrade/arena.astro",
  "src/pages/concepts/statstrade/feed.astro",
].map((path) => record(path, "retain", "historical", "Existing concept route remains reachable and is labelled as an exploration in v2 navigation.")));

const binFiles = [
  "build-raster-artwork.mjs",
  "compose-scene-prompts.mjs",
  "generate-artwork.mjs",
  "generate-favicons.mjs",
  "generate-og-images.mjs",
  "generate-sigil-explorations.mjs",
  "generate-v3-favicons.mjs",
  "gw-sync-favicon.mjs",
  "gw-visual-audit.mjs",
  "optimize-og-images.mjs",
  "sigil-studies.mjs",
  "smalti.mjs",
];
const scriptFiles = [
  "asset-catalogue-lib.mjs",
  "bootstrap-asset-catalogue.mjs",
  "build-asset-catalogue.mjs",
  "copy-static-assets.mjs",
  "stage-asset-catalogue-bundle.mjs",
  "stage-asset-catalogue-seed.mjs",
  "verify-asset-catalogue-bootstrap-merge.mjs",
  "verify-asset-catalogue.mjs",
  "verify-greenways-os-v2-output.mjs",
  "verify-site-output.mjs",
];

export const generatedAssetSources = freeze([
  ...records("bin/", binFiles, "retain", "tooling", "Generated-asset or visual-audit tooling retained outside the runtime contract."),
  ...records("scripts/", scriptFiles, "retain", "tooling", "Build, catalogue or output-verification dependency retained outside runtime exports."),
]);

export const greenwaysV2MigrationInventory = freeze([
  ...legacyPackageExports,
  ...v2PackageContracts,
  ...siteOnlySources,
  ...conceptRouteSources,
  ...generatedAssetSources,
]);
