import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);
const manifestUrl = new URL(
  "artwork/manifests/greenways/peacock-ballroom.render-plates.json",
  root,
);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.byteLength}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

function exactKeys(value, keys, label) {
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label} fields`);
}

test("publishes a closed rights-clean Peacock render-plate provenance manifest", () => {
  exactKeys(
    manifest,
    ["format", "id", "title", "rights", "assets", "consumers"],
    "manifest",
  );
  assert.equal(manifest.format, "visual-language.render-plate-provenance/1");
  assert.equal(manifest.id, "greenways/peacock-ballroom");
  assert.equal(manifest.title, "Peacock Ballroom");
  assert.deepEqual(manifest.rights, {
    owner: "greenways-ai",
    status: "project-owned",
    usage: [
      "visual-language-publication",
      "alumbra-render-plate",
      "hodos-provider-world",
    ],
  });
  assert.equal(manifest.assets.length, 2);
  assert.deepEqual(manifest.assets.map(({appearance}) => appearance), ["day", "night"]);
  assert.equal(JSON.stringify(manifest).includes("http://"), false);
  assert.equal(JSON.stringify(manifest).includes("https://"), false);
});

test("matches every declared master Git blob to the exact checked-in PNG bytes", async () => {
  for (const asset of manifest.assets) {
    exactKeys(
      asset,
      [
        "id", "appearance", "masterPath", "masterBlob", "masterMediaType",
        "deliveryPath", "deliveryMediaType", "width", "height",
      ],
      asset.id,
    );
    assert.equal(asset.id, `visual-language/greenways/peacock-ballroom-${asset.appearance}`);
    assert.equal(
      asset.masterPath,
      `artwork/masters/greenways/peacock-ballroom-${asset.appearance}.png`,
    );
    assert.equal(
      asset.deliveryPath,
      `artwork/greenways/peacock-ballroom-${asset.appearance}.webp`,
    );
    assert.equal(asset.masterMediaType, "image/png");
    assert.equal(asset.deliveryMediaType, "image/webp");
    assert.equal(asset.width, 1536);
    assert.equal(asset.height, 1024);
    assert.match(asset.masterBlob, /^[0-9a-f]{40}$/);

    const masterUrl = new URL(asset.masterPath, root);
    const bytes = await readFile(masterUrl);
    assert.equal(gitBlobSha(bytes), asset.masterBlob, `${asset.appearance} master Git blob`);
    assert.ok(fileURLToPath(masterUrl).startsWith(fileURLToPath(root)));
  }
});

test("binds the render masters to the Alumbra and Hodos semantic identities", () => {
  assert.deepEqual(manifest.consumers, [{
    repository: "greenways-ai/alumbra",
    contract: "alumbra.render-plate-set/1",
    world: "greenways/alumbra",
    provider: "alumbra/world",
    activity: "alumbra-hara/peacock-ballroom",
  }]);
  const serialized = JSON.stringify(manifest.consumers);
  assert.doesNotMatch(serialized, /canvas|mesh|shader|callback|credential|token/i);
});
