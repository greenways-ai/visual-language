import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const screenIds = [
  "today",
  "workrooms",
  "studio",
  "campaigns",
  "packages",
  "keyring",
  "receipts",
];

test("the Greenways product model defines exactly seven connected applications", async () => {
  const source = await read("src/greenways-product-screens.ts");
  const definitions = [...source.matchAll(/^\s{4}id: "([a-z-]+)",$/gm)].map((match) => match[1]);

  assert.deepEqual(definitions, screenIds);
  assert.match(source, /human-readable place to manage personal keys/i);
  assert.match(source, /Accountability without surveillance/);
  assert.match(source, /portable publication/);
});

test("the dynamic route statically expands every Greenways application", async () => {
  const source = await read("src/pages/concepts/greenways/[screen].astro");

  assert.match(source, /export function getStaticPaths\(\)/);
  assert.match(source, /greenwaysProductScreens\.map\(\(screen, position\)/);
  assert.match(source, /params: \{ screen: screen\.id \}/);
  assert.match(source, /<GreenwaysProductView screen=\{screen\} position=\{position\} \/>/);
});

test("the shared shell is an operating environment rather than website navigation", async () => {
  const source = await read("src/site/layouts/GreenwaysProductShell.astro");

  assert.match(source, /data-greenways-environment="os"/);
  assert.match(source, /data-greenways-os-shell/);
  assert.match(source, /aria-label="Greenways system menu bar"/);
  assert.match(source, /class="gw-os-dock"/);
  assert.match(source, /data-os-window/);
  assert.match(source, /data-os-desktop-home/);
  assert.match(source, /data-command-layer/);
  assert.match(source, /data-window-minimise/);
  assert.match(source, /data-window-maximise/);
  assert.doesNotMatch(source, /class="gw-sidebar"/);
  assert.doesNotMatch(source, /class="gw-breadcrumbs"/);
});

test("the Greenways environment carries theme, command and window interactions", async () => {
  const source = await read("src/site/layouts/GreenwaysProductShell.astro");

  assert.match(source, /data-theme-toggle/);
  assert.match(source, /greenways-product-theme/);
  assert.match(source, /data-system-menu-open/);
  assert.match(source, /data-command-input/);
  assert.match(source, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(source, /data-window-minimized/);
  assert.match(source, /data-window-maximized/);
  assert.match(source, /Intl\.DateTimeFormat/);
  assert.match(source, /gw-skip-link/);
});

test("the OS shell keeps the Hara calm-surface foundation", async () => {
  const [shell, surface, os] = await Promise.all([
    read("src/site/layouts/GreenwaysProductShell.astro"),
    read("src/site/styles/greenways-hara-v2.css"),
    read("src/site/styles/greenways-os.css"),
  ]);

  assert.match(shell, /greenways-hara-v2\.css/);
  assert.match(shell, /greenways-os\.css/);
  assert.match(shell, /gw-body gw-hara-v2 gw-os/);
  assert.match(shell, /rel="canonical"/);
  assert.match(surface, /precision without armour/i);
  assert.match(surface, /--gw-hara-signal: #4d9cff/);
  assert.match(os, /persistent menu bar, desktop, dock, application window/i);
  assert.match(os, /\.gw-os-menubar/);
  assert.match(os, /\.gw-os-window/);
  assert.match(os, /\.gw-os-dock/);
  assert.match(os, /\.gw-os-command-palette/);
});

test("each Greenways application contains a purpose-built workflow", async () => {
  const source = await read("src/site/components/GreenwaysProductView.astro");

  for (const id of screenIds) {
    assert.match(source, new RegExp(`screen\\.id === "${id}"`));
  }

  assert.match(source, /Snippet of the day/);
  assert.match(source, /People and agents/);
  assert.match(source, /Source relationship/);
  assert.match(source, /Distribution channels/);
  assert.match(source, /Namespace maintainers/);
  assert.match(source, /Recovery circle/);
  assert.match(source, /Action trace/);
});

test("the operating environment adapts without falling back to a web sidebar", async () => {
  const [product, surface, os] = await Promise.all([
    read("src/site/styles/greenways-product.css"),
    read("src/site/styles/greenways-hara-v2.css"),
    read("src/site/styles/greenways-os.css"),
  ]);

  assert.match(product, /html\[data-theme="dark"\]/);
  assert.match(product, /\.gw-workrooms-layout/);
  assert.match(product, /\.gw-studio-shell/);
  assert.match(product, /\.gw-receipts-layout/);
  assert.match(surface, /html\[data-theme="dark"\] \.gw-hara-v2/);
  assert.match(os, /html\[data-window-maximized\] \.gw-os-window/);
  assert.match(os, /html\[data-window-minimized\] \.gw-os-window/);
  assert.match(os, /@media \(max-width: 980px\)/);
  assert.match(os, /@media \(max-width: 720px\)/);
  assert.match(os, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(os, /\.gw-sidebar/);
});

test("the overview is the Greenways desktop rather than a marketing page", async () => {
  const source = await read("src/pages/concepts/greenways/index.astro");

  assert.match(source, /data-os-home/);
  assert.match(source, /Greenways OS\./);
  assert.match(source, /aria-label="Greenways desktop applications"/);
  assert.match(source, /data-os-widget-window/);
  assert.match(source, /Three decisions will unblock the rest of the week/);
  assert.match(source, /These seven screens form the product spine/);
  assert.doesNotMatch(source, /gw-overview-hero/);
  assert.doesNotMatch(source, /screen-card-grid/);
});
