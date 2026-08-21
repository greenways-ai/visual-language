import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/greenways-os-v2-surfaces.ts", import.meta.url), "utf8");

test("the product model exposes five primary Greenways OS surfaces", () => {
  for (const id of ["fabric", "search", "timeline", "cowork", "spaces"]) {
    assert.match(source, new RegExp(`id: "${id}"`), id);
  }
  for (const field of ["purpose", "abstraction", "environments", "systemBoundary", "states"]) {
    assert.match(source, new RegExp(`${field}:`), field);
  }
});

test("Tahto and Hestia abstractions run through Hara environments", () => {
  assert.match(source, /greenwaysOsAbstractionOwners/);
  assert.match(source, /id: "tahto"/);
  assert.match(source, /id: "hestia"/);
  assert.match(source, /builtWith: "Hara/);
  assert.match(source, /greenwaysOsExecutionEnvironments/);
  for (const id of ["hara", "hoplite", "ignatius", "hodos"]) assert.match(source, new RegExp(`id: "${id}"`), id);
  assert.match(source, /role:/);
  assert.match(source, /authority:/);
});

test("the product model keeps execution optional by surface", () => {
  const fabric = source.slice(source.indexOf('id: "fabric"'), source.indexOf('id: "search"'));
  const search = source.slice(source.indexOf('id: "search"'), source.indexOf('id: "timeline"'));
  const cowork = source.slice(source.indexOf('id: "cowork"'), source.indexOf('id: "spaces"'));
  assert.doesNotMatch(fabric, /Ignatius/);
  assert.match(cowork, /Ignatius/);
  assert.doesNotMatch(search, /Ignatius/);
});
