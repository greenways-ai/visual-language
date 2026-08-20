# Greenways v2 migration map

This map records the additive migration boundary established by issue #31 and extended by the reusable component follow-up to issue #34. Treatments mean: **retain** unchanged, **adapt** through a new opt-in contract, **replace** as the preferred v2 equivalent without removing v1, **deprecate** for compatibility-only use, and **laboratory-only** for executable site specimens that must not be package exports.

## Ownership rules

- `package` is stable consumer-facing material and requires an explicit export, catalogue mapping, semantic tests, theme parity and compatibility coverage.
- `site` is executable documentation or product-study material. It may consume package contracts but cannot define them implicitly.
- `historical` routes remain reachable while their product status is labelled truthfully.
- `tooling` produces or verifies assets and site output; it is not runtime UI.

The authoritative shared inventory is `src/v2/component-catalogue.js`. The adapter `src/v2/component-contract.js` maps selected catalogue records to reusable Astro implementations. It does not create a parallel component taxonomy.

## Existing package exports

| Export | Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- | --- |
| `./theme.css` | `src/theme.css` | retain | package | Keep the v1 theme and aliases unchanged. |
| `./typography.css` | `src/typography.css` | retain | package | Keep protected display, sans and mono families. |
| `./theme.js` | `src/theme.js` | retain | package | Keep the shared preference and cookie contract. |
| `./ThemeToggle.astro` | `src/ThemeToggle.astro` | retain | package | Legacy compatibility export. |
| `./ThemeMenu.astro` | `src/ThemeMenu.astro` | retain | package | Legacy compatibility export. |
| `./ThemeButton.astro` | `src/ThemeButton.astro` | retain | package | Stable one-press theme control. |
| `./SharedHeader.astro` | `src/SharedHeader.astro` | adapt | package | Retain while v2 consumers compose through new contracts. |
| `./DocumentationHeader.astro` | `src/DocumentationHeader.astro` | adapt | package | Retain while v2 documentation adopts semantic tokens. |
| `./DocumentationSearch.astro` | `src/DocumentationSearch.astro` | retain | package | Stable documentation control. |
| `./ProjectSwitcher.astro` | `src/ProjectSwitcher.astro` | retain | package | Stable project navigation contract. |
| `./CodePanel.astro` | `src/CodePanel.astro` | adapt | package | Future v2 code specimen candidate. |
| `./DocumentationCard.astro` | `src/DocumentationCard.astro` | adapt | package | Future v2 content primitive candidate. |
| `./Sigil.astro` | `src/Sigil.astro` | retain | package | Protected semantic sigil contract. |
| `./projects.js` | `src/projects.js` | retain | package | Stable project metadata. |
| `./MosaicLogo.astro` | `src/MosaicLogo.astro` | retain | package | Protected mosaic identity entry point. |
| `./ThemedArtwork.astro` | `src/ThemedArtwork.astro` | retain | package | Stable adaptive artwork wrapper. |
| `./statstrade.css` | `src/statstrade.css` | deprecate | package | Compatibility-only product CSS. |
| `./statstrade-world.js` | `src/statstrade-world.js` | deprecate | package | Compatibility-only product data. |
| `./StatstradeS.astro` | `src/StatstradeS.astro` | deprecate | package | Compatibility-only product identity. |
| `./StatstradeGateway.astro` | `src/StatstradeGateway.astro` | deprecate | package | Compatibility-only product presentation. |

## New opt-in v2 contracts

| Export | Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- | --- |
| `./v2/tokens.css` | `src/v2/tokens.css` | replace | package | Complete semantic token source. |
| `./v2/document.css` | `src/v2/document.css` | replace | package | Calm document and product foundation. |
| `./v2/workbench.css` | `src/v2/workbench.css` | replace | package | Dense six-region workbench foundation. |
| `./v2/components.css` | `src/v2/components.css` | replace | package | Product-neutral presentation for reusable implementations. |
| `./v2/contract.js` | `src/v2/contract.js` | replace | package | Machine-readable visual, identity and entry contract. |
| `./v2/component-catalogue.js` | `src/v2/component-catalogue.js` | replace | package | Authoritative component, workflow-state and workbench inventory. |
| `./v2/component-contract.js` | `src/v2/component-contract.js` | replace | package | Adapter from catalogue records to reusable implementations. |
| `./v2/astro/Navigation.astro` | `src/v2/astro/Navigation.astro` | replace | package | Native navigation mapped to `primary-navigation`. |
| `./v2/astro/Action.astro` | `src/v2/astro/Action.astro` | replace | package | Host-owned action mapped to `button`. |
| `./v2/astro/Toggle.astro` | `src/v2/astro/Toggle.astro` | replace | package | Requested-versus-actual switch mapped to `toggle`. |
| `./v2/astro/Field.astro` | `src/v2/astro/Field.astro` | replace | package | Labelled field mapped to `text-field`. |
| `./v2/astro/Tabs.astro` | `src/v2/astro/Tabs.astro` | replace | package | Tab semantics mapped to `tabs`. |
| `./v2/astro/FilterBar.astro` | `src/v2/astro/FilterBar.astro` | replace | package | Search and filter intent mapped to `text-field` and `filter-chip`. |
| `./v2/astro/List.astro` | `src/v2/astro/List.astro` | replace | package | Supplied record list mapped to `list`. |
| `./v2/astro/Card.astro` | `src/v2/astro/Card.astro` | replace | package | Bounded content object mapped to `card`. |
| `./v2/astro/DataTable.astro` | `src/v2/astro/DataTable.astro` | replace | package | Responsive comparison table mapped to `table`. |
| `./v2/astro/Panel.astro` | `src/v2/astro/Panel.astro` | replace | package | Region and native disclosure mapped to `panel`. |
| `./v2/astro/Dialog.astro` | `src/v2/astro/Dialog.astro` | replace | package | Dialog structure mapped to `dialog`. |
| `./v2/astro/Status.astro` | `src/v2/astro/Status.astro` | replace | package | Text, shape and colour state mapped to `status`. |
| `./v2/astro/ActivityList.astro` | `src/v2/astro/ActivityList.astro` | replace | package | Actor, time and evidence list mapped to `activity-item` and `activity-region`. |
| `./v2/astro/ApprovalCard.astro` | `src/v2/astro/ApprovalCard.astro` | replace | package | Scope and authority presentation mapped to `approval-card`. |
| `./v2/astro/Receipt.astro` | `src/v2/astro/Receipt.astro` | replace | package | Supplied evidence presentation mapped to `receipt-card`. |
| `./v2/astro/WorkbenchShell.astro` | `src/v2/astro/WorkbenchShell.astro` | replace | package | Six-region shell mapped to command bar, rail, inspector, activity and status records. |

Supporting type material:

| Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- |
| `src/v2/component-contract.d.ts` | retain | package | Declaration paired with the reusable adapter. |

## Executable v2 laboratories

The routes `src/pages/v2/library/components/index.astro` and `src/pages/v2/library/workflows/index.astro` remain site-owned executable specimens. Their data, page layout and product-like compositions are not exports. The package implementations above are reusable because they map to the authoritative catalogue and exclude application data, commands, persistence, provider access and evidence creation.

## Site-only components, layouts, styles, assets and data

| Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- |
| `src/site/components/AdoptionPath.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/ArtworkCatalogue.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/AssetCatalogue.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/CaseStudyIndex.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/CatalogueDoors.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/DayNightExplorer.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/FoundationMatrix.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/GreenwaysControlPlaneArt.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/GreenwaysOsV2ExtensionDesktop.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysOsV2NativeDesktop.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysOsV2Popup.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysOsV2SidePanel.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysOsV2Surface.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysOsV2Web.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysProductView.astro` | laboratory-only | site | Historical product study. |
| `src/site/components/GreenwaysThemeProvider.astro` | laboratory-only | site | Site theme integration. |
| `src/site/components/GreenwaysThemeSelect.astro` | laboratory-only | site | Site theme integration. |
| `src/site/components/HomeDayNight.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/HomeHero.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/IntegrityPanel.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/MarkLab3D.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/SharedSiteHeader.astro` | laboratory-only | site | Site shell only. |
| `src/site/components/SigilCatalogue.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/StatstradeFeedArt.astro` | laboratory-only | site | Product study only. |
| `src/site/components/StatstradeSurfaceStudy.astro` | laboratory-only | site | Product study only. |
| `src/site/components/SystemProof.astro` | laboratory-only | site | Site presentation only. |
| `src/site/components/WorldDistrictGrid.astro` | laboratory-only | site | Site presentation only. |
| `src/site/layouts/ConceptShell.astro` | laboratory-only | site | Concept shell. |
| `src/site/layouts/GreenwaysOsV2Shell.astro` | laboratory-only | site | Historical product shell. |
| `src/site/layouts/GreenwaysProductShell.astro` | laboratory-only | site | Historical product shell. |
| `src/site/styles/concept-page.css` | laboratory-only | site | Site CSS. |
| `src/site/styles/custom.css` | laboratory-only | site | Site CSS. |
| `src/site/styles/greenways-control-plane.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-hara-v2.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-foundation.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-overview.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-popup.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-responsive.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-side-panel.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-web.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-workbench-browser.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2-workbench-native.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os-v2.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-os.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/greenways-product.css` | laboratory-only | site | Product-study CSS. |
| `src/site/styles/site-overrides.css` | laboratory-only | site | Site CSS. |
| `src/site/styles/starlight-shell.css` | laboratory-only | site | Site CSS. |
| `src/site/assets/peacock-feather.svg` | laboratory-only | site | Documentation shell asset. |
| `src/artwork-catalog.js` | laboratory-only | site | Site data. |
| `src/content.config.ts` | laboratory-only | site | Content configuration. |
| `src/greenways-os-v2-surfaces.ts` | laboratory-only | site | Historical product data. |
| `src/greenways-product-screens.ts` | laboratory-only | site | Historical product data. |
| `src/scene-language.js` | laboratory-only | site | Site concept data. |

## Historical concept route sources

| Source | Treatment | Owner | Intended treatment |
| --- | --- | --- | --- |
| `src/pages/concepts/[world]/[scene].astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/greenways-v2/[surface].astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/greenways-v2/index.astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/greenways/[screen].astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/greenways/control-plane.astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/greenways/index.astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/index.astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/statstrade/arena.astro` | retain | historical | Keep reachable as exploration. |
| `src/pages/concepts/statstrade/feed.astro` | retain | historical | Keep reachable as exploration. |

## Generated-asset and validation dependencies

| Source | Treatment | Owner |
| --- | --- | --- |
| `bin/build-raster-artwork.mjs` | retain | tooling |
| `bin/compose-scene-prompts.mjs` | retain | tooling |
| `bin/generate-artwork.mjs` | retain | tooling |
| `bin/generate-favicons.mjs` | retain | tooling |
| `bin/generate-og-images.mjs` | retain | tooling |
| `bin/generate-sigil-explorations.mjs` | retain | tooling |
| `bin/generate-v3-favicons.mjs` | retain | tooling |
| `bin/gw-sync-favicon.mjs` | retain | tooling |
| `bin/gw-visual-audit.mjs` | retain | tooling |
| `bin/optimize-og-images.mjs` | retain | tooling |
| `bin/sigil-studies.mjs` | retain | tooling |
| `bin/smalti.mjs` | retain | tooling |
| `scripts/asset-catalogue-lib.mjs` | retain | tooling |
| `scripts/bootstrap-asset-catalogue.mjs` | retain | tooling |
| `scripts/build-asset-catalogue.mjs` | retain | tooling |
| `scripts/copy-static-assets.mjs` | retain | tooling |
| `scripts/stage-asset-catalogue-bundle.mjs` | retain | tooling |
| `scripts/stage-asset-catalogue-seed.mjs` | retain | tooling |
| `scripts/verify-asset-catalogue-bootstrap-merge.mjs` | retain | tooling |
| `scripts/verify-asset-catalogue.mjs` | retain | tooling |
| `scripts/verify-greenways-os-v2-output.mjs` | retain | tooling |
| `scripts/verify-site-output.mjs` | retain | tooling |

## Route and generated-output notes

- `src/pages/concepts/[world]/[scene].astro` expands the scene manifest into historical environment routes; the route source remains laboratory-owned.
- Dynamic Greenways product and surface routes continue to derive their paths from `src/greenways-product-screens.ts` and `src/greenways-os-v2-surfaces.ts`.
- Generated favicons, Open Graph images, catalogue indexes and copied static assets remain build products.
- The v2 catalogue introduced by issue #32 remains an executable site concern.
- The component and workflow laboratories introduced by issue #34 are the review source for shared semantics; only explicitly mapped, product-neutral implementations become package exports.
