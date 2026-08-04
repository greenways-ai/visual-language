const root = document.documentElement;
const panels = [...document.querySelectorAll("[data-surface-panel]")];
const surfaceButtons = [...document.querySelectorAll("[data-surface-target]")];
const worldStage = document.querySelector("[data-world-stage]");
const bookmarkButtons = [...document.querySelectorAll("[data-bookmark-target]")];
let feedScroll = 0;

function setBookmark(bookmark = "threshold") {
  if (!worldStage) return;
  worldStage.dataset.bookmark = bookmark;
  bookmarkButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.bookmarkTarget === bookmark)));
}

function setSurface(surface, bookmark) {
  if (surface === "world") {
    feedScroll = window.scrollY;
    setBookmark(bookmark);
  }
  root.dataset.surface = surface;
  panels.forEach((panel) => { panel.hidden = panel.dataset.surfacePanel !== surface; });
  surfaceButtons.forEach((button) => {
    if (button.matches("button")) button.setAttribute("aria-pressed", String(button.dataset.surfaceTarget === surface));
  });
  if (surface === "world") window.scrollTo({ top: 0, behavior: "instant" });
  else requestAnimationFrame(() => window.scrollTo({ top: feedScroll, behavior: "instant" }));
  history.replaceState(null, "", surface === "world" ? `#world/${bookmark || "threshold"}` : "#feed");
}

surfaceButtons.forEach((control) => control.addEventListener("click", (event) => {
  event.preventDefault();
  setSurface(control.dataset.surfaceTarget, control.dataset.bookmark);
}));
bookmarkButtons.forEach((button) => button.addEventListener("click", () => setBookmark(button.dataset.bookmarkTarget)));

const initial = location.hash.startsWith("#world") ? "world" : "feed";
const initialBookmark = location.hash.split("/")[1] || "threshold";
setSurface(initial, initialBookmark);

if (!matchMedia("(prefers-reduced-motion: reduce)").matches && worldStage) {
  worldStage.addEventListener("pointermove", (event) => {
    const x = (event.clientX / innerWidth - 0.5) * 10;
    const y = (event.clientY / innerHeight - 0.5) * 7;
    worldStage.style.setProperty("--world-x", `${x}px`);
    worldStage.style.setProperty("--world-y", `${y}px`);
  });
}
