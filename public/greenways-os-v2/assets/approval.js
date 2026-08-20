import { getState, recordReceipt, showToast, updateState } from "./core.js";

const isExtension = typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);
let currentApproval = null;

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function providerFor(operation) {
  if (operation.startsWith("keyring/")) return "Browser Keyring · encrypted local custody";
  if (operation.startsWith("browser/")) return "Chrome browser capability provider";
  if (operation.startsWith("filesystem/")) return "greenwaysd · native file provider";
  return "Greenways capability broker";
}

function render(approval) {
  currentApproval = approval;
  if (!approval) {
    document.querySelector("[data-approval-request]").innerHTML = `<p class="eyebrow">Approval queue</p><h1>No decisions waiting.</h1><p>The next named capability request will appear here with its exact actor, operation, object, scope and receipt preview.</p><div class="approval-actions"><a class="btn btn--primary" href="./desktop.html">Return to desktop</a></div>`;
    document.querySelector(".approval-preview").hidden = true;
    return;
  }
  setText("[data-approval-risk]", `${approval.risk} risk`);
  setText("[data-approval-actor]", approval.actor);
  setText("[data-approval-operation]", approval.operation);
  setText("[data-approval-scope]", approval.scope);
  setText("[data-approval-grant]", approval.grant);
  setText("[data-approval-provider]", providerFor(approval.operation));
  setText("[data-receipt-preview-request]", approval.id);
  setText("[data-receipt-preview-operation]", approval.operation);
  setText("[data-receipt-preview-grant]", approval.grant);
  setText("[data-receipt-preview-scope]", approval.scope.includes("sha256:") ? approval.scope : `exact object · ${approval.scope}`);
  document.querySelector("[data-approval-request]").hidden = false;
  document.querySelector("[data-approval-result]").hidden = true;
  document.querySelector(".approval-preview").hidden = false;
}

async function loadApproval(preferredId) {
  const state = await getState();
  const preferred = state.approvals.find((approval) => approval.id === preferredId && approval.status === "waiting");
  render(preferred || state.approvals.find((approval) => approval.status === "waiting") || null);
}

async function decide(decision) {
  if (!currentApproval) return;
  const id = currentApproval.id;
  let receipt = null;
  let approval = null;

  if (isExtension) {
    try {
      const response = await chrome.runtime.sendMessage({ type: "greenways:resolve-approval", id, decision });
      if (response?.ok) {
        receipt = response.receipt;
        approval = response.approval;
      }
    } catch {
      // Static preview fallback below.
    }
  }

  if (!approval) {
    await updateState((state) => {
      approval = state.approvals.find((item) => item.id === id);
      if (approval) approval.status = decision === "approve" ? "approved" : "denied";
      return state;
    });
    if (approval) receipt = await recordReceipt({ operation: `grant/${approval.status}`, object: approval.grant, evidence: 4 });
  }

  if (!approval) return;
  const approved = approval.status === "approved";
  document.querySelector("[data-approval-request]").hidden = true;
  document.querySelector("[data-approval-result]").hidden = false;
  setText("[data-approval-result-title]", approved ? "Action approved." : "Action denied.");
  setText("[data-approval-result-copy]", approved
    ? "The provider may perform this exact effect. The decision and provider result share one receipt trail."
    : "The provider will not run this effect. The denied request remains visible as a compact receipt.");
  setText("[data-receipt-preview-op]", `grant/${approval.status}`);
  setText("[data-receipt-preview-request]", receipt?.id || id);
  showToast(approved ? "Scoped effect approved" : "Scoped effect denied", `${approval.operation} · ${approval.scope}`);
}

document.querySelectorAll("[data-approval-decision]").forEach((button) => button.addEventListener("click", () => decide(button.dataset.approvalDecision)));
document.querySelector("[data-approval-next]")?.addEventListener("click", () => loadApproval());

const query = new URLSearchParams(location.search);
await loadApproval(query.get("id"));
