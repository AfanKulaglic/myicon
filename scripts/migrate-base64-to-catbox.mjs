/**
 * One-time migration: find every base64 image (`data:image/...`) sitting
 * inside Firebase Realtime Database, re-upload it to catbox.moe, and
 * write the resulting short URL back to the same field.
 *
 * Why: until P54 the admin panel stored uploaded images inline as base64
 * inside RTDB nodes (products, categories, site content). Every list read
 * now drags multi-MB JSON over the wire. Replacing the blobs with short
 * catbox URLs makes client reads dramatically faster (~10-100x).
 *
 * Run with: node scripts/migrate-base64-to-catbox.mjs
 *
 * Requirements: Node 18+ (built-in fetch + FormData + Blob).
 * No CORS issue from Node — we hit catbox directly.
 */

const RTDB_URL = "https://wlab-40444-default-rtdb.firebaseio.com";
const CATBOX_ENDPOINT = "https://catbox.moe/user/api.php";

/** Walk the JSON tree and yield { path, value } for every base64 image. */
function* findBase64Images(node, path = []) {
  if (typeof node === "string") {
    if (node.startsWith("data:image/")) yield { path, value: node };
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      yield* findBase64Images(v, [...path, k]);
    }
  }
}

/** Decode `data:image/<mime>;base64,<body>` → { mime, ext, bytes }. */
function decodeDataUrl(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid data URL");
  const mime = match[1];
  const body = match[2];
  const bytes = Buffer.from(body, "base64");
  const ext = mime.includes("png") ? "png"
    : mime.includes("webp") ? "webp"
    : mime.includes("gif")  ? "gif"
    : mime.includes("svg")  ? "svg"
    : "jpg";
  return { mime, ext, bytes };
}

/** POST bytes to catbox and return the resulting public URL. */
async function uploadToCatbox(bytes, ext, mime) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", new Blob([bytes], { type: mime }), `upload.${ext}`);

  const res = await fetch(CATBOX_ENDPOINT, { method: "POST", body: form });
  const text = (await res.text()).trim();
  if (!res.ok || !text.startsWith("http")) {
    throw new Error(`Catbox HTTP ${res.status}: ${text || "(empty)"}`);
  }
  return text;
}

/** PATCH a single field via RTDB REST. `path` is an array of keys. */
async function writeField(path, url) {
  const last = path[path.length - 1];
  const parent = path.slice(0, -1).join("/");
  const endpoint = `${RTDB_URL}/${parent}.json`;

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [last]: url }),
  });
  if (!res.ok) {
    throw new Error(`RTDB PATCH ${endpoint} failed (HTTP ${res.status}): ${await res.text()}`);
  }
}

async function main() {
  console.log("→ Fetching RTDB snapshot…");
  const res = await fetch(`${RTDB_URL}/.json`);
  if (!res.ok) throw new Error(`RTDB GET failed (HTTP ${res.status})`);
  const root = await res.json();

  const hits = [...findBase64Images(root)];
  console.log(`→ Found ${hits.length} base64 image field(s).`);

  if (hits.length === 0) {
    console.log("✓ Nothing to migrate. Done.");
    return;
  }

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < hits.length; i++) {
    const { path, value } = hits[i];
    const pathStr = path.join("/");
    const sizeKb = Math.round((value.length * 3) / 4 / 1024);
    process.stdout.write(`[${i + 1}/${hits.length}] ${pathStr} (${sizeKb} KB) … `);

    try {
      const { ext, mime, bytes } = decodeDataUrl(value);
      const url = await uploadToCatbox(bytes, ext, mime);
      await writeField(path, url);
      console.log(`✓ ${url}`);
      ok++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      fail++;
    }

    // Small delay to be polite to catbox.
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\n✓ Migrated: ${ok}   ✗ Failed: ${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
