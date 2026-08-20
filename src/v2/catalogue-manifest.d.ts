export type GreenwaysV2CatalogueStatus = "ready" | "in-progress" | "planned" | "exploration";
export type GreenwaysV2CatalogueOwnership = "shared-contract" | "product-laboratory" | "historical-exploration";

export interface GreenwaysV2CatalogueRoute {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly summary: string;
  readonly status: GreenwaysV2CatalogueStatus;
  readonly ownership: GreenwaysV2CatalogueOwnership;
  readonly issue?: number;
  readonly primary?: boolean;
  readonly implemented?: boolean;
  readonly children?: readonly GreenwaysV2CatalogueRoute[];
}

export interface GreenwaysV2CatalogueGroup {
  readonly id: "foundations" | "library" | "applications";
  readonly label: string;
  readonly summary: string;
  readonly routes: readonly GreenwaysV2CatalogueRoute[];
}

export const catalogueStatusLabels: Readonly<Record<GreenwaysV2CatalogueStatus, string>>;
export const catalogueOwnershipLabels: Readonly<Record<GreenwaysV2CatalogueOwnership, string>>;
export const greenwaysV2CatalogueHome: Readonly<GreenwaysV2CatalogueRoute>;
export const greenwaysV2Catalogue: readonly GreenwaysV2CatalogueGroup[];

export function flattenCatalogueRoutes(groups?: readonly GreenwaysV2CatalogueGroup[]): readonly GreenwaysV2CatalogueRoute[];
export function normaliseCataloguePath(value: string, basePath?: string): string;
export function catalogueHref(path: string, basePath?: string): string;
export function isCatalogueRouteCurrent(routePath: string, currentPath: string, basePath?: string): boolean;
export function isCatalogueRouteActive(routePath: string, currentPath: string, basePath?: string): boolean;
export function getCatalogueRoute(path: string): GreenwaysV2CatalogueRoute | undefined;
export function getCatalogueGroup(path: string): GreenwaysV2CatalogueGroup | undefined;
export function getCatalogueStaticRoutes(): readonly GreenwaysV2CatalogueRoute[];
export function getCataloguePlaceholderRoutes(): readonly GreenwaysV2CatalogueRoute[];
