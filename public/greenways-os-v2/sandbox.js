const OPERATIONS = new Set([
  "document/transform",
  "package/inspect",
  "text/summarise",
]);

function digest(value) {
  let hash = 2166136261;
  const text = JSON.stringify(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function runWork(message) {
  if (!message || message.type !== "greenways:sandbox:run") return null;
  if (!OPERATIONS.has(message.work?.op)) {
    return {
      type: "greenways:sandbox:result",
      requestId: message.requestId,
      ok: false,
      error: { code: "unsupported-operation", message: "The sandbox only accepts declared pure operations." },
    };
  }

  const input = message.work.input || {};
  const output = message.work.op === "text/summarise"
    ? { summary: String(input.text || "").trim().split(/\s+/).slice(0, 18).join(" "), truncated: true }
    : { accepted: true, inputDigest: digest(input), value: input };

  return {
    type: "greenways:sandbox:result",
    requestId: message.requestId,
    ok: true,
    result: output,
    evidence: { workDigest: digest(message.work), runtime: "hara-sandbox-preview" },
  };
}

window.addEventListener("message", (event) => {
  if (event.source !== window.parent) return;
  const result = runWork(event.data);
  if (result) event.source.postMessage(result, "*");
});

const form = document.querySelector("[data-sandbox-form]");
const output = document.querySelector("[data-sandbox-output]");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = String(new FormData(form).get("text") || "");
  const result = runWork({
    type: "greenways:sandbox:run",
    requestId: "preview",
    work: { op: "text/summarise", input: { text } },
  });
  if (output) output.textContent = JSON.stringify(result, null, 2);
});
