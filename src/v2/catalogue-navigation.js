// @ts-check

import {
  catalogueOwnershipLabels,
  catalogueStatusLabels,
  greenwaysV2Catalogue,
  greenwaysV2CatalogueHome,
  normaliseCataloguePath,
} from "./catalogue-manifest.js";

/** @typedef {import("./catalogue-manifest.js").GreenwaysV2CatalogueRoute} GreenwaysV2CatalogueRoute */
/** @typedef {import("./catalogue-manifest.js").GreenwaysV2CatalogueGroup} GreenwaysV2CatalogueGroup */

/**
 * @typedef {object} GreenwaysV2CatalogueLocation
 * @property {GreenwaysV2CatalogueGroup} group
 * @property {GreenwaysV2CatalogueRoute} item
 * @property {GreenwaysV2CatalogueRoute | undefined} parent
 */

/**
 * @typedef {object} GreenwaysV2CatalogueBreadcrumb
 * @property {string} label
 * @property {string=} path
 * @property {boolean} current
 * @property {"catalogue" | "group" | "route"} kind
 */

/**
 * @typedef {object} GreenwaysV2CatalogueRouteContext
 * @property {GreenwaysV2CatalogueGroup} group
 * @property {GreenwaysV2CatalogueRoute} item
 * @property {GreenwaysV2CatalogueRoute | undefined} parent
 * @property {GreenwaysV2CatalogueRoute} parentTarget
 * @property {string} familyLabel
 * @property {readonly GreenwaysV2CatalogueRoute[]} siblings
 * @property {readonly GreenwaysV2CatalogueBreadcrumb[]} breadcrumbs
 * @property {GreenwaysV2CatalogueRoute | undefined} previous
 * @property {GreenwaysV2CatalogueRoute | undefined} next
 * @property {string} statusLabel
 * @property {string} ownershipLabel
 */

/** @param {GreenwaysV2CatalogueRoute} route */
const isCurrentV2Route = (route) => route.path.startsWith("/v2/") && route.primary !== false;

/**
 * @param {string} path
 * @param {string} [basePath]
 * @returns {GreenwaysV2CatalogueLocation | undefined}
 */
export function findCatalogueLocation(path, basePath = "/") {
  const target = normaliseCataloguePath(path, basePath);
  for (const group of greenwaysV2Catalogue) {
    for (const route of group.routes) {
      if (normaliseCataloguePath(route.path) === target) return { group, item: route, parent: undefined };
      const child = route.children?.find((candidate) => normaliseCataloguePath(candidate.path) === target);
      if (child) return { group, item: child, parent: route };
    }
  }
  return undefined;
}

/** @returns {readonly GreenwaysV2CatalogueRoute[]} */
export function getCatalogueRouteSequence() {
  const sequence = [];
  const seen = new Set();
  for (const group of greenwaysV2Catalogue) {
    for (const route of group.routes) {
      for (const candidate of [route, ...(route.children ?? [])]) {
        const path = normaliseCataloguePath(candidate.path);
        if (!isCurrentV2Route(candidate) || seen.has(path)) continue;
        seen.add(path);
        sequence.push(candidate);
      }
    }
  }
  return Object.freeze(sequence);
}

/**
 * @param {GreenwaysV2CatalogueLocation} location
 * @returns {readonly GreenwaysV2CatalogueRoute[]}
 */
const familyRoutes = (location) => {
  if (location.parent) return Object.freeze([location.parent, ...(location.parent.children ?? [])]);
  if (location.item.children?.length) return Object.freeze([location.item, ...location.item.children]);
  return Object.freeze(location.group.routes.filter(isCurrentV2Route));
};

/**
 * @param {GreenwaysV2CatalogueLocation} location
 * @returns {readonly GreenwaysV2CatalogueBreadcrumb[]}
 */
const breadcrumbsFor = (location) => Object.freeze([
  { label: "Catalogue", path: greenwaysV2CatalogueHome.path, current: false, kind: /** @type {const} */ ("catalogue") },
  { label: location.group.label, current: false, kind: /** @type {const} */ ("group") },
  ...(location.parent
    ? [{ label: location.parent.label, path: location.parent.path, current: false, kind: /** @type {const} */ ("route") }]
    : []),
  { label: location.item.label, path: location.item.path, current: true, kind: /** @type {const} */ ("route") },
]);

/**
 * @param {string} path
 * @param {string} [basePath]
 * @returns {GreenwaysV2CatalogueRouteContext | undefined}
 */
export function getCatalogueRouteContext(path, basePath = "/") {
  const location = findCatalogueLocation(path, basePath);
  if (!location || !isCurrentV2Route(location.item)) return undefined;

  const sequence = getCatalogueRouteSequence();
  const target = normaliseCataloguePath(location.item.path);
  const index = sequence.findIndex((route) => normaliseCataloguePath(route.path) === target);
  const siblings = familyRoutes(location);

  return Object.freeze({
    ...location,
    parentTarget: location.parent ?? greenwaysV2CatalogueHome,
    familyLabel: location.parent?.label ?? (location.item.children?.length ? location.item.label : location.group.label),
    siblings,
    breadcrumbs: breadcrumbsFor(location),
    previous: index > 0 ? sequence[index - 1] : undefined,
    next: index >= 0 && index < sequence.length - 1 ? sequence[index + 1] : undefined,
    statusLabel: catalogueStatusLabels[location.item.status],
    ownershipLabel: catalogueOwnershipLabels[location.item.ownership],
  });
}
