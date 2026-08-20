# Greenways v2 migration map

This map records the additive migration boundary for issue #31. Treatments mean: **retain** unchanged, **adapt** only through a new opt-in contract, **replace** as the preferred v2 equivalent without removing v1, **deprecate** for compatibility-only use, and **laboratory-only** for executable site specimens that must not be package exports.

## Ownership rules

- `package` is stable consumer-facing material and requires export, identity, theme-parity and compatibility tests.
- `site` is executable documentation or product study material. It may consume package contracts but cannot define them implicitly.
- `historical` routes remain reachable while their product status is labelled truthfully.
- `tooling` produces or verifies assets and site output; it is not runtime UI.

## Existing package exports

| Export | Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- | --- |
| `./theme.css` | `src/theme.css` | retain | package | Keep the v1 theme and component aliases unchanged. |
| `./typography.css` | `src/typography.css` | retain | package | Keep the protected display, sans and mono families. |
| `./theme.js` | `src/theme.js` | retain | package | Keep the shared preference and cookie contract. |
| `./ThemeToggle.astro` | `src/ThemeToggle.astro` | retain | package | Legacy compatibility export. |
| `./ThemeMenu.astro` | `src/ThemeMenu.astro` | retain | package | Legacy compatibility export. |
| `./ThemeButton.astro` | `src/ThemeButton.astro` | retain | package | Stable one-press theme control. |
| `./SharedHeader.astro` | `src/SharedHeader.astro` | adapt | package | Retain now; compose through v2 surfaces rather than restyling in place. |
| `./DocumentationHeader.astro` | `src/DocumentationHeader.astro` | adapt | package | Retain now; future v2 documentation uses the new semantic tokens. |
| `./DocumentationSearch.astro` | `src/DocumentationSearch.astro` | retain | package | Stable shared documentation control. |
| `./ProjectSwitcher.astro` | `src/ProjectSwitcher.astro` | retain | package | Stable project navigation contract. |
| `./CodePanel.astro` | `src/CodePanel.astro` | adapt | package | Candidate for a future v2 shared code specimen without in-place drift. |
| `./DocumentationCard.astro` | `src/DocumentationCard.astro` | adapt | package | Candidate for a future v2 content primitive. |
| `./Sigil.astro` | `src/Sigil.astro` | retain | package | Protected semantic sigil and adaptive asset contract. |
| `./projects.js` | `src/projects.js` | retain | package | Stable project metadata. |
| `./MosaicLogo.astro` | `src/MosaicLogo.astro` | retain | package | Protected mosaic identity entry point. |
| `./ThemedArtwork.astro` | `src/ThemedArtwork.astro` | retain | package | Stable adaptive artwork wrapper. |
| `./statstrade.css` | `src/statstrade.css` | deprecate | package | Compatibility-only product CSS; do not use in new shared v2 work. |
| `./statstrade-world.js` | `src/statstrade-world.js` | deprecate | package | Compatibility-only product data. |
| `./StatstradeS.astro` | `src/StatstradeS.astro` | deprecate | package | Compatibility-only product identity export. |
| `./StatstradeGateway.astro` | `src/StatstradeGateway.astro` | deprecate | package | Compatibility-only product presentation export. |

## New opt-in v2 contracts

| Export | Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- | --- |
| `./v2/tokens.css` | `src/v2/tokens.css` | replace | package | Semantic v2 token source; opt-in and theme-complete. |
| `./v2/document.css` | `src/v2/document.css` | replace | package | Calm document and product foundation. |
| `./v2/workbench.css` | `src/v2/workbench.css` | replace | package | Dense layer importing the document foundation. |
| `./v2/contract.js` | `src/v2/contract.js` | replace | package | Machine-readable entry, identity and token-family contract. |

## Site-only components, layouts, styles, assets and data

| Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- |
| `src/site/components/AdoptionPath.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/ArtworkCatalogue.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/AssetCatalogue.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/CaseStudyIndex.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/CatalogueDoors.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/DayNightExplorer.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/FoundationMatrix.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysControlPlaneArt.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2AppLauncher.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2ApplicationContinuity.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2ExtensionDesktop.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2NativeDesktop.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2Popup.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2SidePanel.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2Surface.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysOsV2Web.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysProductView.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysThemeProvider.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/GreenwaysThemeSelect.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/HomeDayNight.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/HomeHero.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/IntegrityPanel.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/MarkLab3D.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/SharedSiteHeader.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/SigilCatalogue.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/StatstradeFeedArt.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/StatstradeSurfaceStudy.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/SystemProof.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/components/WorldDistrictGrid.astro` | laboratory-only | site | Specimen or site presentation; never package-exported. |
| `src/site/layouts/ConceptShell.astro` | laboratory-only | site | Concept or product laboratory shell. |
| `src/site/layouts/GreenwaysOsV2Shell.astro` | laboratory-only | site | Concept or product laboratory shell. |
| `src/site/layouts/GreenwaysProductShell.astro` | laboratory-only | site | Concept or product laboratory shell. |
| `src/site/styles/concept-page.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/custom.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-control-plane.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-hara-v2.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-applications.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-foundation.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-overview.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-popup.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-responsive.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-side-panel.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-web.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-workbench-browser.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2-workbench-native.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os-v2.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-os.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/greenways-product.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/site-overrides.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/styles/starlight-shell.css` | laboratory-only | site | Site and concept presentation CSS; not a shared contract. |
| `src/site/assets/peacock-feather.svg` | laboratory-only | site | Documentation shell asset. |
| `src/artwork-catalog.js` | laboratory-only | site | Site data or content configuration; not a package contract. |
| `src/content.config.ts` | laboratory-only | site | Site data or content configuration; not a package contract. |
| `src/greenways-os-v2-surfaces.ts` | laboratory-only | site | Site data or content configuration; not a package contract. |
| `src/greenways-product-screens.ts` | laboratory-only | site | Site data or content configuration; not a package contract. |
| `src/scene-language.js` | laboratory-only | site | Site data or content configuration; not a package contract. |

## Historical concept route sources

| Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- |
| `src/pages/concepts/[world]/[scene].astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/greenways-v2/[surface].astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/greenways-v2/index.astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/greenways/[screen].astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/greenways/control-plane.astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/greenways/index.astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/index.astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/statstrade/arena.astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |
| `src/pages/concepts/statstrade/feed.astro` | retain | historical | Existing concept route remains reachable and is labelled as an exploration in v2 navigation. |

## Generated-asset and validation dependencies

| Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- |
| `bin/build-raster-artwork.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/compose-scene-prompts.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/generate-artwork.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/generate-favicons.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/generate-og-images.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/generate-sigil-explorations.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/generate-v3-favicons.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/gw-sync-favicon.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/gw-visual-audit.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/optimize-og-images.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/sigil-studies.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `bin/smalti.mjs` | retain | tooling | Generated-asset or visual-audit tooling retained outside the runtime contract. |
| `scripts/asset-catalogue-lib.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/bootstrap-asset-catalogue.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/build-asset-catalogue.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/copy-static-assets.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/stage-asset-catalogue-bundle.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/stage-asset-catalogue-seed.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/verify-asset-catalogue-bootstrap-merge.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/verify-asset-catalogue.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/verify-greenways-os-v2-output.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |
| `scripts/verify-site-output.mjs` | retain | tooling | Build, catalogue or output-verification dependency retained outside runtime exports. |

## Route and generated-output notes

- `src/pages/concepts/[world]/[scene].astro` expands the current scene manifest into 68 historical environment routes; the route source and its manifest remain laboratory-owned.
- Dynamic Greenways product and surface routes continue to derive their concrete paths from `src/greenways-product-screens.ts` and `src/greenways-os-v2-surfaces.ts`.
- Generated favicons, Open Graph images, catalogue indexes and copied static assets remain build products. Canonical source media and catalogue records keep their existing ownership and provenance rules.
- The v2 catalogue introduced by issue #32 consumes the exported document contract but remains an executable site concern unless a later issue explicitly promotes a product-neutral component.
