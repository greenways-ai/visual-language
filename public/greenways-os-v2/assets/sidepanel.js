import {
  escapeHtml,
  formatRelativeTime,
  getState,
  openDesktop,
  recordReceipt,
  showToast,
  updateState,
} from "./core.js";

const isExtension = typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);
const tabButtons = [...document.querySelectorAll("[data-side-tab]")];
const tabPanels = [...document.querySelectorAll("[data-side-panel]")];
let currentTab = null;

async function getActiveTab() {
  if (!isExtension || !chrome.tabs?.query) return null;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab || null;
  } catch {
    return null;
  }
}

function selectTab(id) {
  tabButtons.forEach((button) => {
    const active = button.dataset.sideTab === id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.sidePanel !== id;
  });
}

function approvalsMarkup(approvals) {
  if (!approvals.length) {
    return `<div class="sidepanel-approval"><div class="sidepanel-approval__head"><span class="status-pill status-pill--good">clear</span></div><h3>No decisions waiting.</h3><p>Requested effects appear here with their actor, operation, scope and grant.</p></div>`;
  }
  return approvals.map((approval) => `<article class="sidepanel-approval">
    <div class="sidepanel-approval__head"><span class="status-pill status-pill--warn">${escapeHtml(approval.risk)} risk</span><code>${escapeHtml(approval.operation)}</code></div>
    <h3>${escapeHtml(approval.actor)}</h3>
    <p>${escapeHtml(approval.scope)}<br /><strong>${escapeHtml(approval.grant)}</strong></p>
    <div class="sidepanel-approval__actions">
      <button class="btn btn--quiet" type="button" data-approval-id="${escapeHtml(approval.id)}" data-approval-decision="deny">Deny</button>
      <button class="btn btn--primary" type="button" data-approval-id="${escapeHtml(approval.id)}" data-approval-decision="approve">Approve</button>
    </div>
  </article>`).join("");
}

function agentsMarkup(agents) {
  return agents.map((agent) => `<div class="provider-card">
    <span class="avatar avatar--agent">A</span>
    <span><strong>${escapeHtml(agent.label)}</strong><small>${escapeHtml(agent.task)}</small></span>
    <span class="status-pill${agent.state === "blocked" ? " status-pill--warn" : agent.state === "working" ? " status-pill--good" : ""}">${escapeHtml(agent.state)}</span>
  </div>`).join("");
}

function receiptsMarkup(receipts) {
  if (!receipts.length) return `<div class="trace-item"><span><strong>No receipts yet</strong><small>Capture or approve an effect to create one.</small></span></div>`;
  return receipts.slice(0, 8).map((receipt) => `<div class="trace-item"><i class="trace-item__dot"></i><span><strong>${escapeHtml(receipt.operation)}</strong><small>${escapeHtml(receipt.object)} · ${formatRelativeTime(receipt.at)}</small></span></div>`).join("");
}

async function hydrate() {
  const state = await getState();
  currentTab = await getActiveTab();
  const waiting = state.approvals.filter((approval) => approval.status === "waiting");
  document.querySelector("[data-side-page-title]").textContent = currentTab?.title || "Greenways OS v2 interface system";
  document.querySelector("[data-side-page-url]").textContent = currentTab?.url || "oss.greenways.ai/visual-language/greenways-os-v2";
  document.querySelector("[data-side-approval-count]").textContent = String(waiting.length);
  document.querySelector("[data-side-agent-count]").textContent = String(state.agents.length);
  const currentObject = currentTab?.title || "Greenways OS v2 interface system";
  document.querySelector("[data-side-page-receipts]").textContent = String(state.receipts.filter((receipt) => receipt.object === currentObject).length);
  document.querySelector("[data-side-approvals]").innerHTML = approvalsMarkup(waiting);
  document.querySelector("[data-side-agents]").innerHTML = agentsMarkup(state.agents);
  document.querySelector("[data-side-receipts]").innerHTML = receiptsMarkup(state.receipts);
}

async function resolveApproval(id, decision) {
  if (isExtension) {
    try {
      const response = await chrome.runtime.sendMessage({ type: "greenways:resolve-approval", id, decision });
      if (response?.ok) {
        showToast(decision === "approve" ? "Action approved" : "Action denied", `${response.approval.operation} was resolved and receipted.`);
        await hydrate();
        return;
      }
    } catch {
      // Static preview fallback below.
    }
  }
  let resolved;
  await updateState((state) => {
    resolved = state.approvals.find((approval) => approval.id === id);
    if (resolved) resolved.status = decision === "approve" ? "approved" : "denied";
    return state;
  });
  if (resolved) {
    await recordReceipt({ operation: `grant/${resolved.status}`, object: resolved.grant, evidence: 4 });
    showToast(decision === "approve" ? "Action approved" : "Action denied", `${resolved.operation} was resolved and receipted.`);
  }
  await hydrate();
}

async function capturePage() {
  if (isExtension) {
    try {
      const response = await chrome.runtime.sendMessage({ type: "greenways:capture-page" });
      if (response?.ok) {
        showToast("Page saved", "Source bytes, page metadata and a capture receipt were retained.");
        await hydrate();
        return;
      }
    } catch {
      // Static preview fallback below.
    }
  }
  await recordReceipt({ operation: "browser/capture", object: currentTab?.title || "Greenways OS v2 interface system", evidence: 3 });
  showToast("Page saved", "The static preview wrote a browser/capture receipt.");
  await hydrate();
}

async function runAction(action) {
  switch (action) {
    case "capture":
      await capturePage();
      break;
    case "open-desktop":
      await openDesktop();
      break;
    case "open-studio":
      if (isExtension) await chrome.tabs.create({ url: `${chrome.runtime.getURL("desktop.html")}#studio` });
      else window.location.href = "./desktop.html#studio";
      break;
    case "add-workroom":
      await recordReceipt({ operation: "workroom/source-add", object: currentTab?.title || "Current page", evidence: 2 });
      showToast("Added to Atlas release room", "The source and its capture context are now available to room participants.");
      await hydrate();
      break;
    case "ask-agent":
      await updateState((state) => {
        const agent = state.agents.find((item) => item.id === "agent/source-curator");
        if (agent) {
          agent.state = "working";
          agent.task = `Inspecting ${currentTab?.title || "current page"}`;
        }
        return state;
      });
      await recordReceipt({ operation: "agent/work-submit", object: currentTab?.title || "Current page", actor: "Chris Zheng", evidence: 2 });
      showToast("Source curator started", "The agent received the source object, not direct browser authority.");
      await hydrate();
      selectTab("agents");
      break;
    case "inspect-source":
      await recordReceipt({ operation: "source/inspect", object: currentTab?.title || "Current page", evidence: 1 });
      showToast("Source inspection complete", "Page metadata, origin and capture status are available.");
      await hydrate();
      selectTab("receipts");
      break;
    case "view-receipts":
      selectTab("receipts");
      break;
    default:
      break;
  }
}

tabButtons.forEach((button) => button.addEventListener("click", () => selectTab(button.dataset.sideTab)));
document.querySelectorAll("[data-side-action]").forEach((button) => button.addEventListener("click", () => runAction(button.dataset.sideAction)));
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-approval-decision]");
  if (!button) return;
  resolveApproval(button.dataset.approvalId, button.dataset.approvalDecision);
});

selectTab("approvals");
await hydrate();
