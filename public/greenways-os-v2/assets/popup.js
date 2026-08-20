import { getState, openApproval, openDesktop, recordReceipt, showToast } from "./core.js";

const isExtension = typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);

async function activeTab() {
  if (!isExtension || !chrome.tabs?.query) return null;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab || null;
  } catch {
    return null;
  }
}

async function hydrate() {
  const [state, tab] = await Promise.all([getState(), activeTab()]);
  const workspace = state.workspaces.find((item) => item.id === state.activeWorkspace);
  const waiting = state.approvals.filter((item) => item.status === "waiting");
  const activeAgents = state.agents.filter((item) => item.state === "working");
  const first = waiting[0];

  document.querySelector("[data-popup-workspace]").textContent = `${workspace?.label || "Publishing"} ${workspace?.code || "01"}`;
  document.querySelector("[data-popup-page-title]").textContent = tab?.title || "Current page ready.";
  document.querySelector("[data-popup-page-url]").textContent = tab?.url || "Open the side panel to capture, inspect or hand this page to a workroom.";
  document.querySelector("[data-popup-approval-count]").textContent = String(waiting.length);
  document.querySelector("[data-popup-agent-count]").textContent = String(activeAgents.length);
  document.querySelector("[data-popup-receipt-count]").textContent = String(state.receipts.length);
  if (first) {
    document.querySelector("[data-popup-approval-operation]").textContent = first.operation;
    document.querySelector("[data-popup-approval-scope]").textContent = first.scope;
  }
}

async function openSidePanel() {
  if (isExtension && chrome.sidePanel?.open) {
    const tab = await activeTab();
    if (tab?.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      window.close();
      return;
    }
  }
  window.location.href = "./sidepanel.html";
}

async function savePage() {
  if (isExtension) {
    try {
      const response = await chrome.runtime.sendMessage({ type: "greenways:capture-page" });
      if (response?.ok) {
        showToast("Page saved", "The source, provenance and receipt were added to Greenways.");
        await hydrate();
        return;
      }
    } catch {
      // Static-style fallback below.
    }
  }
  const tab = await activeTab();
  await recordReceipt({ operation: "browser/capture", object: tab?.title || "Current preview page", evidence: 3 });
  showToast("Page saved", "The preview wrote a browser/capture receipt.");
  await hydrate();
}

async function openOptions() {
  if (isExtension && chrome.runtime?.openOptionsPage) {
    await chrome.runtime.openOptionsPage();
    return;
  }
  window.location.href = "./options.html";
}

async function handleAction(action) {
  switch (action) {
    case "open-sidepanel":
      await openSidePanel();
      break;
    case "open-desktop":
      await openDesktop();
      break;
    case "open-studio":
      if (isExtension) await chrome.tabs.create({ url: `${chrome.runtime.getURL("desktop.html")}#studio` });
      else window.location.href = "./desktop.html#studio";
      break;
    case "save-page":
      await savePage();
      break;
    case "review-approval":
      await openApproval();
      break;
    case "open-options":
      await openOptions();
      break;
    default:
      break;
  }
}

document.querySelectorAll("[data-popup-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.popupAction)));
await hydrate();
