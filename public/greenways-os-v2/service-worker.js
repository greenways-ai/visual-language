import { DEFAULT_STATE, mergeState } from "./assets/model.js";

const STORAGE_KEY = "greenways-os-v2-state";

async function readState() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return mergeState(result[STORAGE_KEY]);
}

async function writeState(state) {
  const normalized = mergeState(state);
  await chrome.storage.local.set({ [STORAGE_KEY]: normalized });
  return normalized;
}

async function ensureState() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  if (!result[STORAGE_KEY]) await writeState(DEFAULT_STATE);
}

async function writeReceipt(input) {
  const state = await readState();
  const receipt = {
    id: `rcpt_${Date.now().toString(36).toUpperCase()}`,
    at: new Date().toISOString(),
    actor: input.actor || "Chris Zheng",
    operation: input.operation || "unknown/operation",
    object: input.object || "Unknown object",
    outcome: input.outcome || "completed",
    evidence: Number.isFinite(input.evidence) ? input.evidence : 1,
  };
  state.receipts.unshift(receipt);
  state.receipts = state.receipts.slice(0, 100);
  await writeState(state);
  return receipt;
}

async function captureTab(tab) {
  if (!tab) throw new Error("No active tab is available");
  const receipt = await writeReceipt({
    actor: "Chris Zheng",
    operation: "browser/capture",
    object: tab.title || tab.url || "Current page",
    outcome: "completed",
    evidence: 3,
  });
  return {
    source: {
      title: tab.title || "Untitled page",
      url: tab.url || "",
      favIconUrl: tab.favIconUrl || "",
      capturedAt: receipt.at,
    },
    receipt,
  };
}

chrome.runtime.onInstalled.addListener(async () => {
  await ensureState();
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: "greenways-save-page", title: "Save page to Greenways", contexts: ["page", "link", "selection"] });
    chrome.contextMenus.create({ id: "greenways-open-panel", title: "Open Greenways side panel", contexts: ["page"] });
    chrome.contextMenus.create({ id: "greenways-open-desktop", title: "Open Greenways desktop", contexts: ["page"] });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "greenways-open-desktop") {
    await chrome.tabs.create({ url: chrome.runtime.getURL("desktop.html") });
    return;
  }
  if (info.menuItemId === "greenways-open-panel" && tab?.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    return;
  }
  if (info.menuItemId === "greenways-save-page") {
    await captureTab(tab);
    if (tab?.windowId) await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-desktop") {
    await chrome.tabs.create({ url: chrome.runtime.getURL("desktop.html") });
    return;
  }
  if (command === "capture-page") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await captureTab(tab);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const run = async () => {
    switch (message?.type) {
      case "greenways:get-state":
        return { ok: true, state: await readState() };
      case "greenways:set-state":
        return { ok: true, state: await writeState(message.state) };
      case "greenways:record-receipt":
        return { ok: true, receipt: await writeReceipt(message.receipt || {}) };
      case "greenways:capture-page": {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return { ok: true, ...(await captureTab(tab)) };
      }
      case "greenways:open-desktop": {
        const tab = await chrome.tabs.create({ url: chrome.runtime.getURL("desktop.html") });
        return { ok: true, tabId: tab.id };
      }
      case "greenways:resolve-approval": {
        const state = await readState();
        const approval = state.approvals.find((item) => item.id === message.id);
        if (!approval) return { ok: false, error: "Approval not found" };
        approval.status = message.decision === "approve" ? "approved" : "denied";
        const receipt = await writeReceipt({
          operation: `grant/${approval.status}`,
          object: approval.grant,
          outcome: "completed",
          evidence: 4,
        });
        const latest = await readState();
        const latestApproval = latest.approvals.find((item) => item.id === message.id);
        if (latestApproval) latestApproval.status = approval.status;
        await writeState(latest);
        return { ok: true, approval: latestApproval, receipt };
      }
      default:
        return { ok: false, error: "Unsupported Greenways message" };
    }
  };

  run().then(sendResponse).catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
