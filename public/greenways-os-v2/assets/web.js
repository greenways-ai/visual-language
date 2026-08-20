import { openApproval, recordReceipt, showToast } from "./core.js";

const root = document.documentElement;
const modeButtons = [...document.querySelectorAll("[data-web-mode]")];
const readerView = document.querySelector("[data-reader-view]");
const publisherView = document.querySelector("[data-publisher-view]");
const path = document.querySelector("[data-web-path]");

function setMode(mode) {
  const publisher = mode === "publisher";
  root.dataset.webMode = publisher ? "publisher" : "reader";
  if (readerView) readerView.hidden = publisher;
  if (publisherView) publisherView.hidden = !publisher;
  if (path) path.textContent = publisher ? "publisher / release-desk" : "chris-zheng / atlas-of-quiet-machines";
  modeButtons.forEach((button) => {
    const active = button.dataset.webMode === (publisher ? "publisher" : "reader");
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  history.replaceState(null, "", publisher ? "#publisher" : "#article");
}

async function completeAction(action) {
  const definitions = {
    "follow-author": ["profile/follow", "profile/chris-zheng", "Following Field Notes", "New publications will appear in your Greenways library."],
    "save-clipping": ["clipping/save", "publication/atlas-of-quiet-machines", "Clipping saved", "The passage, source digest and publication receipt were retained."],
    "add-workroom": ["workroom/source-add", "workroom/atlas-release", "Added to Atlas release room", "People and agents can now cite the publication source."],
    "inspect-receipt": ["receipt/inspect", "release/atlas-of-quiet-machines@0.8.0", "Publication receipt opened", "The publisher signature and derivation chain are verified."],
    "open-analytics": ["publication/signals-read", "release/peacock-garden-studies@1.2.3", "Signals loaded", "Reader activity remains aggregate and privacy-preserving."],
  };
  if (action === "request-publish") {
    await recordReceipt({ operation: "approval/request", object: "release/atlas-of-quiet-machines@0.8.0", outcome: "waiting", evidence: 5 });
    showToast("Publisher signature requested", "The release is held until grant/publish-release is approved.");
    window.setTimeout(() => openApproval(), 520);
    return;
  }
  const definition = definitions[action];
  if (!definition) return;
  const [operation, object, title, detail] = definition;
  await recordReceipt({ operation, object, evidence: action === "inspect-receipt" ? 4 : 2 });
  showToast(title, detail);
}

modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.webMode)));
document.querySelectorAll("[data-mode-link='publisher']").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  setMode("publisher");
}));
document.querySelectorAll("[data-web-action]").forEach((button) => button.addEventListener("click", () => completeAction(button.dataset.webAction)));

setMode(location.hash === "#publisher" ? "publisher" : "reader");
