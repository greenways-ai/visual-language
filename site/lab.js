const projects = {
  greenways: { label: "Greenways", motif: "Peacock" },
  hara: { label: "Hara", motif: "Evaluation knot" },
  hestia: { label: "Hestia", motif: "Fire" },
  hoplite: { label: "Hoplite", motif: "Air" },
  historia: { label: "Historia", motif: "Cyan eye" },
  hodos: { label: "Hodos", motif: "Moth" },
};

const greenwaysConcepts = [
  "celestial-promenade",
  "peacock-garden",
  "jeweled-sky-temple",
  "floating-lotus-court",
  "cosmic-ocean-terrace",
  "iridescent-observatory",
  "living-architecture",
  "constellation-orchard",
  "aurora-pavilion",
  "planetary-threshold",
];

const concepts = {
  hestia: [
    "sovereign-hearth",
    "protected-threshold",
    "recovery-room",
    "household-archive",
    "secure-correspondence",
    "provision-chamber",
    "sheltered-courtyard",
    "watchful-window",
    "private-sanctuary",
    "fireside-rest",
  ],
  hoplite: [
    "rabbit-courtyard",
    "open-gate",
    "branching-paths",
    "wind-arcade",
    "rapid-garden-route",
    "interconnected-habitats",
    "distributed-pavilions",
    "open-horizon",
    "lightweight-infrastructure",
    "moonlit-resting-ground",
  ],
  historia: [
    "raven-library",
    "evidence-chamber",
    "index-gallery",
    "inquiry-desk",
    "archive-vault",
    "constellation-of-sources",
    "comparison-corridor",
    "illuminated-manuscript-room",
    "observation-balcony",
    "nocturnal-roost",
  ],
  hodos: [
    "moth-theatre",
    "mirrored-passage",
    "veiled-stage",
    "optical-garden",
    "impossible-staircase",
    "lantern-chamber",
    "shadow-gallery",
    "reflecting-pool",
    "hidden-doorway",
    "transformation-pavilion",
  ],
};

const sigil = (project) =>
  `<img class="demo-sigil" style="display:block;padding:0" src="./favicons/${project}.svg" alt="${projects[project].motif} sigil">`;

const header = (project) => `
  <article class="header-proof" data-project="${project}">
    <div class="gw-header">
      <a class="gw-brand">${sigil(project)}<span>${projects[project].label}</span></a>
      <button class="gw-search-trigger" data-lab-search-open><span>⌕</span><span>Search</span><kbd>⌘ K</kbd></button>
      <nav class="gw-header__desktop">
        <a>Overview</a><a>Guides</a>
        <details><summary>Projects</summary><div class="gw-popover"><a>Hara</a><a>Hestia</a><a>Hoplite</a><a>Historia</a><a>Hodos</a></div></details>
        <a>GitHub ↗</a>
      </nav>
      <details class="gw-theme-menu"><summary class="gw-control">◐</summary><div class="gw-popover"><button>Automatic ✓</button><button>Light</button><button>Dark</button></div></details>
      <button class="gw-control gw-menu-trigger">☰</button>
    </div>
    <p>${projects[project].motif} · ${project}</p>
  </article>`;

document.querySelector("[data-header-matrix]").innerHTML = Object.keys(projects)
  .map(header)
  .join("");

const dialog = document.querySelector("[data-lab-search]");
document
  .querySelectorAll("[data-lab-search-open]")
  .forEach((button) => button.addEventListener("click", () => dialog.showModal()));
window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    dialog.showModal();
  }
});

document.querySelectorAll("[data-preview-mode]").forEach((button) =>
  button.addEventListener("click", () => {
    document.documentElement.dataset.theme = button.dataset.previewMode;
  }),
);

concepts.greenways = greenwaysConcepts;
let active = "greenways";
const tabs = document.querySelector("[data-project-tabs]");
const grid = document.querySelector("[data-artwork-grid]");
tabs.innerHTML = Object.keys(concepts)
  .map((project) => `<button data-project-tab="${project}">${projects[project].label}</button>`)
  .join("");

function render() {
  document.documentElement.dataset.project = active;
  tabs.querySelectorAll("button").forEach((button) => {
    button.ariaPressed = String(button.dataset.projectTab === active);
  });
  grid.innerHTML = concepts[active]
    .map(
      (concept) => `
        <article>
          <picture><source media="(max-width:600px)" srcset="./artwork/${active}/${concept}-day-mobile.svg"><img src="./artwork/${active}/${concept}-day.svg" alt="${concept.replaceAll("-", " ")} by day"></picture>
          <picture><source media="(max-width:600px)" srcset="./artwork/${active}/${concept}-night-mobile.svg"><img src="./artwork/${active}/${concept}-night.svg" alt="${concept.replaceAll("-", " ")} by night"></picture>
          <h3>${concept.replaceAll("-", " ")}</h3>
        </article>`,
    )
    .join("");
}

tabs.addEventListener("click", (event) => {
  if (event.target.dataset.projectTab) {
    active = event.target.dataset.projectTab;
    render();
  }
});

render();
