import { APPS, COMMANDS } from "./model.js";
import { getState, updateState, recordReceipt, showToast, toggleTheme, initialiseClock, initialiseTheme, escapeHtml } from "./core.js";

const root = document.documentElement;
const appButtons = [...document.querySelectorAll("[data-app]")];
const appViews = [...document.querySelectorAll("[data-app-view]")];
const commandLayer = document.querySelector("[data-command-layer]");
const commandInput = document.querySelector("[data-command-input]");
const commandResults = document.querySelector("[data-command-results]");
let state = await getState();

function activateApp(id, persist = true) {
  const app = APPS.find((item) => item.id === id) || APPS[0];
  appButtons.forEach((button) => {
    const active = button.dataset.app === app.id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  appViews.forEach((view) => { view.hidden = view.dataset.appView !== app.id; });
  document.querySelector("[data-active-app-title]").textContent = app.label;
  document.querySelector("[data-status-app]").textContent = app.label;
  document.querySelector("[data-active-location]").textContent = `${app.id}/${state.activeBuffer.split("/").pop()}`;
  state.activeApp = app.id;
  if (persist) updateState((next) => ({ ...next, activeApp: app.id }));
}

function renderCommands(query = "") {
  const value = query.trim().toLowerCase();
  const items = COMMANDS.filter((command) => !value || `${command.label} ${command.detail}`.toLowerCase().includes(value));
  commandResults.innerHTML = items.map((command) => `<button class="command-result" data-command-id="${command.id}"><span><strong>${escapeHtml(command.label)}</strong><small>${escapeHtml(command.detail)}</small></span><kbd>${command.shortcut || "↵"}</kbd></button>`).join("") || `<p class="empty-state">No matching command.</p>`;
}

function openCommands() {
  commandLayer.hidden = false;
  renderCommands(commandInput.value);
  requestAnimationFrame(() => commandInput.focus());
}
function closeCommands() { commandLayer.hidden = true; commandInput.value = ""; }

async function runCommand(command) {
  if (!command) return;
  closeCommands();
  if (command.app) return activateApp(command.app);
  if (command.action === "switch-theme") return toggleTheme();
  if (command.action === "toggle-inspector") return root.toggleAttribute("data-inspector-closed");
  if (command.action === "open-approvals") return window.location.assign("./approval.html");
  if (command.action === "capture-page") {
    const receipt = await recordReceipt({ operation: "browser/capture", object: "current page", evidence: 2 });
    showToast("Page captured", receipt.id);
  }
}

appButtons.forEach((button) => button.addEventListener("click", () => activateApp(button.dataset.app)));
document.querySelectorAll("[data-workspace]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-workspace]").forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); });
  state.activeWorkspace = button.dataset.workspace;
  updateState((next) => ({ ...next, activeWorkspace: state.activeWorkspace }));
  showToast("Workspace changed", button.textContent.trim());
}));
document.querySelectorAll("[data-buffer]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-buffer]").forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-selected", String(active)); });
  state.activeBuffer = button.dataset.buffer;
  document.querySelector("[data-active-location]").textContent = `${state.activeApp}/${state.activeBuffer.split("/").pop()}`;
  updateState((next) => ({ ...next, activeBuffer: state.activeBuffer }));
}));
document.querySelectorAll("[data-toggle-inspector]").forEach((button) => button.addEventListener("click", () => root.toggleAttribute("data-inspector-closed")));
document.querySelectorAll("[data-inspector-tab]").forEach((button) => button.addEventListener("click", () => {
  const id = button.dataset.inspectorTab;
  document.querySelectorAll("[data-inspector-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
  document.querySelectorAll("[data-inspector-panel]").forEach((panel) => { panel.hidden = panel.dataset.inspectorPanel !== id; });
}));
document.querySelectorAll("[data-command-open]").forEach((button) => button.addEventListener("click", openCommands));
document.querySelectorAll("[data-command-close]").forEach((button) => button.addEventListener("click", closeCommands));
commandInput.addEventListener("input", () => renderCommands(commandInput.value));
commandResults.addEventListener("click", (event) => runCommand(COMMANDS.find((command) => command.id === event.target.closest("[data-command-id]")?.dataset.commandId)));
document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", async () => {
  const action = button.dataset.action;
  const receipt = await recordReceipt({ operation: action.replaceAll("-", "/"), object: state.activeBuffer, evidence: action === "publish-release" ? 4 : 2 });
  showToast(action === "publish-release" ? "Publishing approval requested" : "Action completed", receipt.id);
  state = await getState();
  document.querySelectorAll("[data-receipt-count]").forEach((node) => { node.textContent = `${state.receipts.length} receipts`; });
}));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openCommands(); }
  if (event.key === "Escape") closeCommands();
  if ((event.metaKey || event.ctrlKey) && /^[1-7]$/.test(event.key)) activateApp(APPS[Number(event.key) - 1].id);
});

initialiseClock();
initialiseTheme();
activateApp(state.activeApp, false);
renderCommands();
