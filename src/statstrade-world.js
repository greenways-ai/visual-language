export const statstradeIdentity = {
  id: "statstrade",
  label: "Statstrade",
  motif: "Angular S",
  accent: "red",
  mark: "./assets/favicons/statstrade.svg",
  smallMark: "./assets/favicons/statstrade-small.svg",
};

export const statstradeSurfaces = {
  feed: {
    id: "feed",
    label: "Feed",
    role: "default",
    rendering: "dom",
    description: "A fast, ranked, community-led stream for posts, predictions and discussion.",
    modules: ["community rail", "ranked posts", "nested discussion", "live arenas", "resolution rail"],
  },
  world: {
    id: "world",
    label: "World",
    role: "immersive",
    rendering: "gaussian-splat",
    description: "An opt-in civic arena where the same markets and posts become spatial.",
    title: "The Arena of Conviction",
    poster: "/statstrade/assets/arena-splat-concept.svg",
  },
};

export const statstradeFeedPostKinds = [
  { id: "discussion", label: "Discussion" },
  { id: "prediction", label: "Prediction" },
  { id: "moment", label: "Live moment" },
  { id: "evidence", label: "Evidence" },
  { id: "result", label: "Resolved result" },
];

export const statstradeWorld = {
  id: "arena-of-conviction",
  label: "The Arena of Conviction",
  architecture: "intact Roman civic-military amphitheatre",
  palette: ["legion red", "oxblood", "black basalt", "travertine", "porphyry", "weathered bronze"],
  materials: ["red glass smalti", "black basalt", "pale limestone", "porphyry", "bronze", "woven red standards"],
  subject: "human civic life at believable scale",
  zones: [
    { id: "threshold", label: "Muster Gate", purpose: "entry and orientation" },
    { id: "tribune", label: "Command Tribune", purpose: "live market overview" },
    { id: "arena", label: "Arena Floor", purpose: "spatial market positions" },
    { id: "standards", label: "Hall of Standards", purpose: "communities and campaigns" },
    { id: "hypogeum", label: "Signal Hypogeum", purpose: "data, settlement and infrastructure" },
  ],
  cameraBookmarks: ["threshold", "tribune", "arena"],
};

export const statstradeSplatRuntime = {
  implementation: "@playcanvas/supersplat-viewer",
  selfHosted: true,
  compactContent: "scene.sog",
  streamedContent: "lod-meta.json",
  fallback: "static poster",
  boundary: {
    applicationOwns: ["identity", "posts", "comments", "market state", "navigation"],
    viewerOwns: ["rendering", "camera", "hotspot selection"],
  },
};

export const statstradeForbiddenImagery = [
  "robots",
  "androids",
  "mechs",
  "powered armour",
  "AI avatars",
  "chrome humanoid heads",
  "neural-network brains",
  "cyberpunk control rooms",
  "blue hologram people",
  "robot gladiators",
];
