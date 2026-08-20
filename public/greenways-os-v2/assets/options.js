import { cloneDefaultState } from "./model.js";
import { getState, recordReceipt, setState, showToast, updateState } from "./core.js";

const status = document.querySelector("[data-options-status]");

function setStatus(text, kind = "good") {
  if (!status) return;
  status.className = `status-pill status-pill--${kind}`;
  status.innerHTML = `<span class="status-light status-light--${kind}"></span>${text}`;
}

async function hydrate() {
  const state = await getState();
  document.querySelectorAll("[data-setting]").forEach((input) => {
    input.checked = Boolean(state.settings[input.dataset.setting]);
  });
  state.providers.forEach((provider) => {
    const card = document.querySelector(`[data-provider="${provider.id}"]`);
    if (!card) return;
    const button = card.querySelector("[data-provider-toggle]");
    if (button) {
      button.textContent = provider.status === "connected" ? "Connected" : provider.id === "provider/greenwaysd" ? "Connect native companion" : "Connect";
      button.classList.toggle("btn--quiet", provider.status === "connected");
    }
  });
  setStatus("All changes saved", "good");
}

async function updateSetting(input) {
  setStatus("Saving…", "good");
  await updateState((state) => {
    state.settings[input.dataset.setting] = input.checked;
    if (input.dataset.setting === "nativeCustody") {
      const provider = state.providers.find((item) => item.id === "provider/greenwaysd");
      if (provider && input.checked) provider.status = "connected";
      if (provider && !input.checked) provider.status = "optional";
    }
    return state;
  });
  window.setTimeout(() => setStatus("All changes saved", "good"), 180);
  showToast("Setting updated", `${input.closest(".setting-row")?.querySelector("strong")?.textContent || "Preference"} is now ${input.checked ? "on" : "off"}.`);
  await hydrate();
}

async function toggleProvider(id) {
  let connected = false;
  await updateState((state) => {
    const provider = state.providers.find((item) => item.id === id);
    if (!provider) return state;
    connected = provider.status !== "connected";
    provider.status = connected ? "connected" : id === "provider/greenwaysd" ? "optional" : "disconnected";
    if (id === "provider/greenwaysd") state.settings.nativeCustody = connected;
    return state;
  });
  await recordReceipt({ operation: connected ? "provider/connect" : "provider/disconnect", object: id, evidence: 2 });
  showToast(connected ? "Provider connected" : "Provider disconnected", `${id.replace("provider/", "")} authority remains scoped by named grants.`);
  await hydrate();
}

async function exportState() {
  const state = await getState();
  const blob = new Blob([`${JSON.stringify(state, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "greenways-os-v2-state.json";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  await recordReceipt({ operation: "workspace/export", object: state.activeWorkspace, evidence: 1 });
  showToast("Workspace state exported", "The JSON contains prototype metadata and receipt summaries, not secret key material.");
}

async function resetState() {
  await setState(cloneDefaultState());
  showToast("Prototype fixture restored", "Workspaces, providers, approvals and sample receipts returned to the reviewed state.");
  await hydrate();
}

document.querySelectorAll("[data-setting]").forEach((input) => input.addEventListener("change", () => updateSetting(input)));
document.querySelectorAll("[data-provider-toggle]").forEach((button) => button.addEventListener("click", () => toggleProvider(button.dataset.providerToggle)));
document.querySelector("[data-options-action='export']")?.addEventListener("click", exportState);
document.querySelector("[data-options-action='reset']")?.addEventListener("click", resetState);

const sections = [...document.querySelectorAll(".settings-section")];
const navLinks = [...document.querySelectorAll(".options-nav a")];
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
}, { rootMargin: "-15% 0px -70%", threshold: [0.01, 0.25, 0.5] });
sections.forEach((section) => observer.observe(section));

await hydrate();
