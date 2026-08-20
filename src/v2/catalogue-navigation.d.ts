import type {
  GreenwaysV2CatalogueGroup,
  GreenwaysV2CatalogueRoute,
} from "./catalogue-manifest";

export interface GreenwaysV2CatalogueLocation {
  readonly group: GreenwaysV2CatalogueGroup;
  readonly item: GreenwaysV2CatalogueRoute;
  readonly parent?: GreenwaysV2CatalogueRoute;
}

export interface GreenwaysV2CatalogueBreadcrumb {
  readonly label: string;
  readonly path?: string;
  readonly current: boolean;
  readonly kind: "catalogue" | "group" | "route";
}

export interface GreenwaysV2CatalogueRouteContext extends GreenwaysV2CatalogueLocation {
  readonly parentTarget: GreenwaysV2CatalogueRoute;
  readonly familyLabel: string;
  readonly siblings: readonly GreenwaysV2CatalogueRoute[];
  readonly breadcrumbs: readonly GreenwaysV2CatalogueBreadcrumb[];
  readonly previous?: GreenwaysV2CatalogueRoute;
  readonly next?: GreenwaysV2CatalogueRoute;
  readonly statusLabel: string;
  readonly ownershipLabel: string;
}

export function findCatalogueLocation(path: string, basePath?: string): GreenwaysV2CatalogueLocation | undefined;
export function getCatalogueRouteSequence(): readonly GreenwaysV2CatalogueRoute[];
export function getCatalogueRouteContext(path: string, basePath?: string): GreenwaysV2CatalogueRouteContext | undefined;
