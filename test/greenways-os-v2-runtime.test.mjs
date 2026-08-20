import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, "..");
const root = path.join(project, "public", "greenways-os-v2");
const read = (relative) => readFile(path.join(root, relative), "utf8");

const pages = [
  "index.html",
  "desktop.html",
  "web.html",
  "popup.html",
  "sidepanel.html",
  "options.html",
  "approval.html",
  "sandbox.html",
];

const scripts = [
  "service-worker.js",
  "sandbox.js",
  "assets/model.js",
  "assets/core.js",
  "assets/desktop.js",
  "assets/web.js",
  "assets/popup.js",
  "assets/sidepanel.js",
  "assets/options.js",
  "assets/approval.js",
];

async function exists(file) {
  await access(path.join(root, file), constants.R_OK);
}

function localReferences(source) {
  return [...source.matchAll(/\b(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("./") && !value.endsWith("/"))
    .map((value) => value.replace(/^\.\//, "").split(/[?#]/)[0])
    .filter(Boolean);
}

test("the complete Greenways v2 interface suite is present", async () => {
  for (const file of [...pages, ...scripts, "manifest.json", "assets/greenways-os-v2.css", "README.md"]) {
    await exists(file);
  }
  for (const size of [16, 32, 48, 128]) await exists(`assets/icon-${size}.png`);
});

test("the manifest is a restrained, loadable Manifest V3 extension", async () => {
  const manifest = JSON.parse(await read("manifest.json"));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.action.default_popup, "popup.html");
  assert.equal(manifest.side_panel.default_path, "sidepanel.html");
  assert.equal(manifest.options_page, "options.html");
  assert.deepEqual(manifest.background, { service_worker: "service-worker.js", type: "module" });
  assert.deepEqual(manifest.sandbox.pages, ["sandbox.html"]);
  assert.equal(manifest.chrome_url_overrides, undefined, "v2 must not take over the New Tab page");
  assert.equal(manifest.host_permissions, undefined, "the prototype must not request broad host access");
  assert.ok(!JSON.stringify(manifest).includes("<all_urls>"));
  assert.deepEqual([...manifest.permissions].sort(), ["activeTab", "contextMenus", "sidePanel", "storage"].sort());
  assert.match(manifest.content_security_policy.extension_pages, /script-src 'self'/);
});

test("one portable product model backs all seven applications", async () => {
  const model = await import(pathToFileURL(path.join(root, "assets", "model.js")));
  assert.deepEqual(model.APPS.map((app) => app.id), ["today", "workrooms", "studio", "campaigns", "packages", "keyring", "receipts"]);
  assert.equal(model.DEFAULT_STATE.workspaces.length, 3);
  assert.equal(model.DEFAULT_STATE.buffers.length, 4);
  assert.equal(model.DEFAULT_STATE.providers.length, 3);
  assert.equal(model.DEFAULT_STATE.approvals.length, 3);
  assert.ok(model.COMMANDS.some((command) => command.action === "toggle-inspector"));
  assert.ok(model.COMMANDS.some((command) => command.action === "capture-page"));
});

test("the desktop implements the Frame → Workspace → Buffer → Pane contract", async () => {
  const source = await read("desktop.html");
  assert.match(source, /class="frame-bar"/);
  assert.match(source, /class="workspace-switcher"/);
  assert.match(source, /class="buffer-strip"/);
  assert.match(source, /class="pane-layout"/);
  assert.match(source, /class="inspector-pane"/);
  assert.match(source, /class="status-line"/);
  assert.match(source, /data-command-layer/);
  for (const id of ["today", "workrooms", "studio", "campaigns", "packages", "keyring", "receipts"]) {
    assert.match(source, new RegExp(`data-app-view="${id}"`));
    assert.match(source, new RegExp(`data-app="${id}"`));
  }
});

test("the web surface includes distinct reader and publisher modes", async () => {
  const [html, script] = await Promise.all([read("web.html"), read("assets/web.js")]);
  assert.match(html, /data-reader-view/);
  assert.match(html, /data-publisher-view/);
  assert.match(html, /Portable publication · verified/);
  assert.match(html, /Receipts, not surveillance/);
  assert.match(script, /setMode\("publisher"\)/);
  assert.match(script, /approval\/request/);
});

test("the browser surfaces remain context-specific instead of shrinking the desktop", async () => {
  const [popup, sidepanel, options, approval] = await Promise.all(pages.slice(3, 7).map(read));
  assert.match(popup, /Open side panel/);
  assert.match(popup, /Save this page/);
  assert.doesNotMatch(popup, /pane-layout/);
  assert.match(sidepanel, /Current page/);
  assert.match(sidepanel, /Ask an agent/);
  assert.match(sidepanel, /data-side-panel="approvals"/);
  assert.match(options, /Runtime providers/);
  assert.match(options, /Browser custody/);
  assert.match(options, /Native custody/);
  assert.match(approval, /Human decision required/);
  assert.match(approval, /Receipt preview/);
  assert.match(approval, /One effect · this exact digest/);
});

test("the service worker is a durable capability broker", async () => {
  const source = await read("service-worker.js");
  assert.match(source, /chrome\.storage\.local/);
  assert.match(source, /greenways:get-state/);
  assert.match(source, /greenways:capture-page/);
  assert.match(source, /greenways:resolve-approval/);
  assert.match(source, /browser\/capture/);
  assert.match(source, /grant\/\$\{approval\.status\}/);
  assert.doesNotMatch(source, /setInterval|setTimeout/, "the worker must not depend on staying alive");
});

test("the service worker survives restart and resolves an approval through durable state", async () => {
  let onInstalled;
  let onMessage;
  const storage = {};
  const menus = [];

  globalThis.chrome = {
    storage: {
      local: {
        async get(key) {
          return { [key]: storage[key] };
        },
        async set(values) {
          Object.assign(storage, values);
        },
      },
    },
    runtime: {
      onInstalled: { addListener(listener) { onInstalled = listener; } },
      onMessage: { addListener(listener) { onMessage = listener; } },
      getURL(value) { return `chrome-extension://greenways/${value}`; },
    },
    sidePanel: {
      async setPanelBehavior() {},
      async open() {},
    },
    contextMenus: {
      removeAll(callback) { callback(); },
      create(item) { menus.push(item); },
      onClicked: { addListener() {} },
    },
    commands: { onCommand: { addListener() {} } },
    tabs: {
      async query() { return [{ id: 9, windowId: 4, title: "Current source", url: "https://example.test/source" }]; },
      async create(input) { return { id: 10, ...input }; },
    },
  };

  try {
    const workerUrl = `${pathToFileURL(path.join(root, "service-worker.js")).href}?worker-test=${Date.now()}`;
    await import(workerUrl);
    assert.equal(typeof onInstalled, "function");
    assert.equal(typeof onMessage, "function");
    await onInstalled();
    assert.equal(menus.length, 3);

    const send = (message) => new Promise((resolve, reject) => {
      const handled = onMessage(message, {}, resolve);
      assert.equal(handled, true);
      setTimeout(() => reject(new Error(`Timed out handling ${message.type}`)), 1_000).unref();
    });

    const initial = await send({ type: "greenways:get-state" });
    assert.equal(initial.ok, true);
    assert.equal(initial.state.approvals.filter((item) => item.status === "waiting").length, 3);

    const captured = await send({ type: "greenways:capture-page" });
    assert.equal(captured.ok, true);
    assert.equal(captured.receipt.operation, "browser/capture");
    assert.equal(captured.source.title, "Current source");

    const resolved = await send({
      type: "greenways:resolve-approval",
      id: "approval/publish-atlas",
      decision: "approve",
    });
    assert.equal(resolved.ok, true);
    assert.equal(resolved.approval.status, "approved");
    assert.equal(resolved.receipt.operation, "grant/approved");

    const rehydrated = await send({ type: "greenways:get-state" });
    assert.equal(rehydrated.state.approvals.find((item) => item.id === "approval/publish-atlas").status, "approved");
    assert.ok(rehydrated.state.receipts.some((item) => item.operation === "browser/capture"));
    assert.ok(rehydrated.state.receipts.some((item) => item.operation === "grant/approved"));
  } finally {
    delete globalThis.chrome;
  }
});

test("the package sandbox accepts only pure declared operations", async () => {
  const [html, source] = await Promise.all([read("sandbox.html"), read("sandbox.js")]);
  assert.match(html, /no privileged APIs/i);
  assert.match(source, /document\/transform/);
  assert.match(source, /package\/inspect/);
  assert.match(source, /text\/summarise/);
  assert.match(source, /unsupported-operation/);
  assert.doesNotMatch(source, /\bchrome\s*\./, "sandbox code must never call a privileged extension API");
});

test("all static local links and scripts resolve", async () => {
  for (const page of pages) {
    const source = await read(page);
    assert.match(source, /<meta name="viewport"/);
    assert.match(source, /<title>[^<]+<\/title>/);
    assert.doesNotMatch(source, /<script[^>]+src="https?:/);
    for (const reference of localReferences(source)) await exists(reference);
  }
});

test("the runtime route exposes the loadable v2 suite without replacing the interface atlas", async () => {
  const route = await readFile(path.join(project, "src", "pages", "concepts", "greenways-v2", "runtime.astro"), "utf8");
  assert.match(route, /greenways-os-v2/);
  assert.match(route, /window\.location\.replace/);
  assert.match(route, /rel="canonical"/);
});

test("documentation records the execution, custody and storage boundaries", async () => {
  const doc = await readFile(path.join(project, "docs", "greenways-os-v2.md"), "utf8");
  assert.match(doc, /Chrome extension.*browser shell/s);
  assert.match(doc, /Frame[\s\S]*Workspaces[\s\S]*Buffers[\s\S]*Split panes/);
  assert.match(doc, /Browser custody/);
  assert.match(doc, /Native custody/);
  assert.match(doc, /no New Tab override/);
  assert.match(doc, /IndexedDB \/ Hestia/);
});
