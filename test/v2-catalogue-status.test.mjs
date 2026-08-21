import test from "node:test";
import assert from "node:assert/strict";
import { getCatalogueRoute } from "../src/v2/catalogue-manifest.js";

test("merged shared laboratories are ready", () => {
  for (const path of [
    "/v2/foundations/",
    "/v2/library/",
    "/v2/library/components/",
    "/v2/library/workflows/",
  ]) {
    assert.equal(getCatalogueRoute(path)?.status, "ready", path);
  }
});

test("Foreman distinguishes completed, active, and planned work", () => {
  assert.equal(getCatalogueRoute("/v2/applications/foreman/")?.status, "in-progress");
  assert.equal(getCatalogueRoute("/v2/applications/foreman/model/")?.status, "ready");
  assert.equal(getCatalogueRoute("/v2/applications/foreman/tools/")?.status, "in-progress");
  assert.equal(getCatalogueRoute("/v2/applications/foreman/projects/")?.status, "in-progress");
  for (const path of [
    "/v2/applications/foreman/handoffs/",
    "/v2/applications/foreman/surfaces/",
  ]) {
    assert.equal(getCatalogueRoute(path)?.status, "planned", path);
  }
});