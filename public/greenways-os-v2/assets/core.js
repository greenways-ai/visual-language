import { DEFAULT_STATE, mergeState } from "./model.js";

const STORAGE_KEY = "greenways-os-v2-state";
const hasChromeStorage = () => typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
const hasChromeRuntime = () => typeof chrome !== "undefined" && Boolean(chrome.runtime?.sendMessage);

export async function getState() {
  if (hasChromeRuntime()) {
    try {
      const response = await chrome.runtime.sendMessage({ type: "greenways:get-state" });
      if (response?.ok && response.state) return mergeState(response.state);
    } catch {
      // Previewed extension pages fall back to browser-local state.
    }
  }

  if (hasChromeStorage()) {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return mergeState(result[STORAGE_KEY]);
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return mergeState(stored);
  } catch {
    return mergeState(DEFAULT_STATE);
  }
}

export async function setState(nextState) {
  const state = mergeState(nextState);
  if (hasChromeRuntime()) {
    try {
      const response = await chrome.runtime.sendMessage({ type: "greenways:set-state", state });
      if (response?.ok) return response.state;
    } catch {
      // Fall through to local persistence in website previews.
    }
  }

  if (hasChromeStorage()) {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  return state;
}

export async function updateState(mutator) {
  const current = await getState();
  const draft = mergeState(current);
  const result = await mutator(draft);
  return setState(result || draft);
}

export async function recordReceipt({ operation, object, actor = "Chris Zheng", outcome = "completed", evidence = 1 }) {
  if (hasChromeRuntime()) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "greenways:record-receipt",
        receipt: { operation, object, actor, outcome, evidence },
      });
      if (response?.ok) return response.receipt;
    } catch {
      // Static preview fallback follows.
    }
  }

  let created;
  await updateState((state) => {
    created = {
      id: `rcpt_${Date.now().toString(36).toUpperCase()}`,
      at: new Date().toISOString(),
      actor,
      operation,
      object,
      outcome,
      evidence,
    };
    state.receipts.unshift(created);
    state.receipts = state.receipts.slice(0, 50);
    return state;
  });
  return created;
}

export function showToast(title, detail = "A receipt was written to the workspace.") {
  let region = document.querySelector("[data-toast-region]");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.dataset.toastRegion = "";
    region.setAttribute("aria-live", "polite");
    document.body.append(region);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="status-light status-light--good" aria-hidden="true"></span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div>`;
  region.append(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 220);
  }, 3600);
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatRelativeTime(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "now";
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60_000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const isDark = document.documentElement.dataset.theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  });
}

export async function toggleTheme() {
  const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  await updateState((state) => {
    state.settings.theme = next;
    return state;
  });
  return next;
}

export function initialiseClock() {
  const clocks = document.querySelectorAll("[data-clock]");
  if (!clocks.length) return;
  const update = () => {
    const now = new Date();
    const text = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(now);
    clocks.forEach((clock) => {
      clock.textContent = text;
      clock.setAttribute("datetime", now.toISOString());
    });
  };
  update();
  window.setInterval(update, 30_000);
}

export function initialiseTheme() {
  getState().then((state) => applyTheme(state.settings.theme));
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });
}

export function initialiseDisclosure() {
  document.querySelectorAll("[data-disclosure]").forEach((button) => {
    const target = document.querySelector(button.getAttribute("data-disclosure"));
    if (!target) return;
    button.addEventListener("click", () => {
      const open = target.hasAttribute("hidden");
      target.toggleAttribute("hidden", !open);
      button.setAttribute("aria-expanded", String(open));
    });
  });
}

export function initialiseCore() {
  initialiseClock();
  initialiseTheme();
  initialiseDisclosure();
}

export function isExtensionPage() {
  return typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);
}

export async function openDesktop() {
  if (isExtensionPage()) {
    await chrome.tabs.create({ url: chrome.runtime.getURL("desktop.html") });
    return;
  }
  window.location.href = "./desktop.html";
}

export async function openApproval() {
  if (isExtensionPage()) {
    await chrome.tabs.create({ url: chrome.runtime.getURL("approval.html") });
    return;
  }
  window.location.href = "./approval.html";
}

initialiseCore();
