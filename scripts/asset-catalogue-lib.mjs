import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleRepositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

export const repositoryRoot = resolve(
  process.env.GREENWAYS_ASSET_REPOSITORY_ROOT ?? moduleRepositoryRoot,
);
export const catalogueRoot = resolve(
  process.env.GREENWAYS_ASSET_CATALOGUE_ROOT ?? resolve(repositoryRoot, "catalogue"),
);
export const publicCatalogueRoot = resolve(
  process.env.GREENWAYS_ASSET_PUBLIC_CATALOGUE_ROOT
    ?? resolve(repositoryRoot, "public/assets/catalogue"),
);
export const siteBase = process.env.GREENWAYS_ASSET_SITE_BASE ?? "/visual-language";

const DIGEST = /^[0-9a-f]{64}$/;
const LFS_SPEC = "https://git-lfs.github.com/spec/v1";

function normalize(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(normalize);
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, normalize(entry)]),
  );
}

export function canonicalJson(value) {
  return `${JSON.stringify(normalize(value), null, 2)}\n`;
}

const EDN_KEYWORD = /^[A-Za-z*+!_?<>=$%&.-][A-Za-z0-9*+!_?<>=$%&.\/-]*$/;

export function encodeEdn(value) {
  if (value === null || value === undefined) return "nil";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Cannot encode a non-finite EDN number");
    return String(value);
  }
  if (Array.isArray(value)) return `[${value.map(encodeEdn).join(" ")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${EDN_KEYWORD.test(key) ? `:${key}` : JSON.stringify(key)} ${encodeEdn(entry)}`)
      .join(" ")}}`;
  }
  throw new Error(`Cannot encode ${typeof value} as EDN`);
}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeText(path, source) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, source, "utf8");
}

export async function writeJson(path, value) {
  await writeText(path, canonicalJson(value));
}

export async function writeHal(path, value) {
  await writeText(path, `${encodeEdn(value)}\n`);
}

export async function writeAtomic(path, source) {
  const temporary = `${path}.tmp-${process.pid}`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(temporary, source, "utf8");
  await rename(temporary, path);
}

export async function resetDirectory(path) {
  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

export function parseGitLfsPointer(input) {
  const bytes = Buffer.isBuffer(input) ? input : Buffer.from(input);
  if (bytes.length === 0 || bytes.length > 1024 || bytes.includes(0)) return null;
  const source = bytes.toString("utf8").replace(/\r\n/g, "\n");
  const lines = (source.endsWith("\n") ? source.slice(0, -1) : source).split("\n");
  if (lines[0] !== `version ${LFS_SPEC}`) return null;
  let digest = null;
  let size = null;
  for (const line of lines.slice(1)) {
    const oid = /^oid sha256:([0-9a-f]{64})$/.exec(line);
    if (oid) {
      if (digest !== null) throw new Error("Git LFS pointer contains duplicate oid lines");
      digest = oid[1];
      continue;
    }
    const sizeLine = /^size ([0-9]+)$/.exec(line);
    if (sizeLine) {
      if (size !== null) throw new Error("Git LFS pointer contains duplicate size lines");
      size = Number(sizeLine[1]);
      continue;
    }
    if (/^ext-[0-9]+-[A-Za-z0-9][A-Za-z0-9._-]* [A-Za-z0-9][A-Za-z0-9._-]*:[^\r\n]+$/.test(line)) continue;
    throw new Error(`Invalid Git LFS pointer line: ${JSON.stringify(line)}`);
  }
  if (!DIGEST.test(digest ?? "") || !Number.isSafeInteger(size) || size < 0) {
    throw new Error("Git LFS pointer is missing a valid oid or size");
  }
  return { digest, size };
}

export function inspectPng(bytes) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) {
    throw new Error("Expected a hydrated PNG image");
  }
  if (bytes.toString("ascii", 12, 16) !== "IHDR") throw new Error("PNG is missing IHDR");
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (!width || !height) throw new Error("PNG dimensions are invalid");
  return { width, height, mime: "image/png" };
}

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function publicUrl(relativePath) {
  return `${siteBase}/${relativePath.replace(/^\/+/, "")}`;
}
