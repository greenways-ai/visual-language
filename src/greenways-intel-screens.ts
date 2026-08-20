export interface GreenwaysIntelScreen {
  id: "sources" | "search" | "graph" | "evidence" | "document";
  label: string;
  code: string;
  eyebrow: string;
  title: string;
  summary: string;
  focus: string;
  signal: "sage" | "sky" | "violet" | "gold" | "coral";
}

export const greenwaysIntelScreens = [
  {
    id: "sources",
    label: "Sources",
    code: "SO",
    eyebrow: "Provider intake · immutable originals",
    title: "Sources / Intake",
    summary:
      "Register providers, inspect checkpoints and verify that exact original documents entered the archive before any index was built.",
    focus: "providers, acquisition receipts and completeness evidence",
    signal: "sage",
  },
  {
    id: "search",
    label: "Search",
    code: "SE",
    eyebrow: "Unified retrieval · exact trace-back",
    title: "Search / Retrieval",
    summary:
      "Search conversations, GitHub work and code together while every result retains its source document, revision and exact anchor.",
    focus: "mixed retrieval with source-first result inspection",
    signal: "sky",
  },
  {
    id: "graph",
    label: "Graph",
    code: "GR",
    eyebrow: "Typed projections · bounded traversal",
    title: "Graph / Relationships",
    summary:
      "Traverse code, conversation, work and evidence projections without flattening their distinct semantics into one generic graph.",
    focus: "typed nodes, exact links and reviewable candidates",
    signal: "violet",
  },
  {
    id: "evidence",
    label: "Evidence",
    code: "EV",
    eyebrow: "Candidate review · durable assertions",
    title: "Evidence / Review",
    summary:
      "Compare exact source blocks, inspect score components and turn a rebuildable candidate into a durable accepted or rejected assertion.",
    focus: "human review over explainable cross-document links",
    signal: "gold",
  },
  {
    id: "document",
    label: "Document",
    code: "DO",
    eyebrow: "Original record · derived lineage",
    title: "Document / Provenance",
    summary:
      "Read one immutable provider revision beside its blocks, virtual files, analyzer facts and downstream graph links.",
    focus: "byte-level provenance from original to derived fact",
    signal: "coral",
  },
] as const satisfies readonly GreenwaysIntelScreen[];

export type GreenwaysIntelScreenId = (typeof greenwaysIntelScreens)[number]["id"];

export function getGreenwaysIntelScreen(id: string) {
  return greenwaysIntelScreens.find((screen) => screen.id === id);
}
