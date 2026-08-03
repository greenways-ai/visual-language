const host = document.querySelector("[data-hara-lab]");

if (host) {
  const assets = [
    {
      file: "eval-aurora.svg",
      title: "Evaluation aurora",
      description: "Ambient hero field with spectral evaluation traces.",
    },
    {
      file: "ast-field.svg",
      title: "AST field",
      description: "Compiler, macroexpansion, and symbolic architecture imagery.",
    },
    {
      file: "symbol-lattice.svg",
      title: "Symbol lattice",
      description: "A repeatable field texture for sections, posters, and covers.",
    },
    {
      file: "dataflow-orbit.svg",
      title: "Dataflow orbit",
      description: "Observable state, agent coordination, and event movement.",
    },
    {
      file: "kernel-depth.svg",
      title: "Kernel depth",
      description: "Runtime, VM, WASM, and execution-stack material.",
    },
  ];

  const variants = ["aurora", "ast", "lattice", "orbit", "kernel"];
  const mark = `
    <svg class="gw-hara-backdrop__mark" viewBox="0 0 640 960" aria-hidden="true">
      <defs>
        <linearGradient id="gw-hara-lab-spectrum" x1="110" y1="90" x2="540" y2="870" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#36F1DE"/>
          <stop offset=".48" stop-color="#35A8FF"/>
          <stop offset="1" stop-color="#A23CFF"/>
        </linearGradient>
      </defs>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path class="gw-hara-backdrop__mark-cut" d="M320 84C140 84 92 238 207 357c87 90 98 151 0 246C92 722 140 876 320 876"/>
        <path stroke="url(#gw-hara-lab-spectrum)" stroke-width="48" d="M320 84C140 84 92 238 207 357c87 90 98 151 0 246C92 722 140 876 320 876"/>
        <path class="gw-hara-backdrop__mark-cut" d="M320 84c180 0 228 154 113 273-87 90-98 151 0 246 115 119 67 273-113 273"/>
        <path stroke="url(#gw-hara-lab-spectrum)" stroke-width="48" d="M320 84c180 0 228 154 113 273-87 90-98 151 0 246 115 119 67 273-113 273"/>
        <path class="gw-hara-backdrop__mark-cut" d="M151 302c86-92 252-92 338 0"/>
        <path stroke="url(#gw-hara-lab-spectrum)" stroke-width="48" d="M151 302c86-92 252-92 338 0"/>
        <path class="gw-hara-backdrop__mark-cut" d="M151 658c86 92 252 92 338 0"/>
        <path stroke="url(#gw-hara-lab-spectrum)" stroke-width="48" d="M151 658c86 92 252 92 338 0"/>
        <path class="gw-hara-backdrop__mark-cut" d="M320 188v584"/>
        <path stroke="url(#gw-hara-lab-spectrum)" stroke-width="48" d="M320 188v584"/>
      </g>
      <circle cx="320" cy="480" r="23" fill="var(--gw-hara-ground)" stroke="url(#gw-hara-lab-spectrum)" stroke-width="12"/>
    </svg>`;

  host.innerHTML = `
    <div class="hara-live">
      <div class="gw-hara-backdrop" data-hara-backdrop data-variant="aurora" data-density="balanced" data-motion="on" aria-hidden="true">
        <span class="gw-hara-backdrop__field"></span>
        <span class="gw-hara-backdrop__grid"></span>
        <span class="gw-hara-backdrop__trace"></span>
        <span class="gw-hara-backdrop__nodes"></span>
        ${mark}
      </div>
      <div class="hara-live__content">
        <p class="hara-live__eyebrow"><img src="./favicons/hara.svg" alt=""> HARA / SYMBOLIC FIELD KIT</p>
        <h3>Symbolic machinery<br>with calm agency.</h3>
        <p>Five reusable effects turn state, evaluation, AST structure, dataflow, and runtime depth into a coherent interface language.</p>
        <div class="hara-variant-controls" role="group" aria-label="Preview Hara effect">
          ${variants.map((variant, index) => `<button type="button" data-hara-variant="${variant}" aria-pressed="${index === 0}">${variant}</button>`).join("")}
        </div>
      </div>
    </div>
    <div class="hara-palette" aria-label="Hara identity colors">
      <span style="--swatch:#36F1DE"><strong>#36F1DE</strong><small>live state</small></span>
      <span style="--swatch:#35A8FF"><strong>#35A8FF</strong><small>evaluation</small></span>
      <span style="--swatch:#A23CFF"><strong>#A23CFF</strong><small>emergence</small></span>
      <span style="--swatch:#05070E"><strong>#05070E</strong><small>void field</small></span>
    </div>
    <div class="hara-asset-grid">
      ${assets.map((asset) => `
        <article>
          <img src="./assets/hara/backgrounds/${asset.file}" alt="${asset.title} Hara vector background">
          <div><h3>${asset.title}</h3><p>${asset.description}</p><code>3840 × 2160 · SVG</code></div>
        </article>
      `).join("")}
    </div>`;

  const backdrop = host.querySelector("[data-hara-backdrop]");
  host.querySelectorAll("[data-hara-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      backdrop.dataset.variant = button.dataset.haraVariant;
      host.querySelectorAll("[data-hara-variant]").forEach((candidate) => {
        candidate.setAttribute(
          "aria-pressed",
          String(candidate === button),
        );
      });
    });
  });
}
