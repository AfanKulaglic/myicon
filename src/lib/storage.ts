/**
 * Image upload pipeline — catbox.moe.
 *
 * catbox.moe is a 100 % free, anonymous file host:
 *   - No account, no API key, no signup
 *   - No upload count limit, no bandwidth cap
 *   - Permanent storage (files don't expire) for the main `catbox.moe` host
 *   - 200 MB per file limit (we compress well below that)
 *   - Returns a plain-text URL on `https://files.catbox.moe/<id>.<ext>`
 *
 * Why catbox over imgbb/Cloudinary/etc:
 *   - imgbb requires an API key and a free account
 *   - Cloudinary has a 25 GB storage cap on its free tier
 *   - catbox is genuinely no-strings-attached
 *
 * Flow:
 *   1. Compress the image in the browser (downscale + WebP/JPEG).
 *   2. POST as multipart/form-data to https://catbox.moe/user/api.php
 *      with `reqtype=fileupload` and `fileToUpload=<Blob>`.
 *   3. Response body is the bare URL.
 */

const MAX_PX = 1600;
const TARGET_BYTES = 1_500 * 1024; // 1.5 MB
const QUALITY_START = 0.9;
const QUALITY_STEP = 0.08;
const QUALITY_MIN = 0.4;

// Catbox doesn't send CORS headers, so we never hit it from the browser
// directly. Instead we POST to a same-origin path that Vite's dev server
// (see vite.config.ts `server.proxy`) forwards server-side to
// https://catbox.moe/user/api.php. For production deployment, add an
// equivalent rewrite on your host:
//   • Vercel  → vercel.json: { "rewrites": [{ "source": "/api/catbox-upload",
//                "destination": "https://catbox.moe/user/api.php" }] }
//   • Netlify → netlify.toml: [[redirects]] from="/api/catbox-upload"
//                to="https://catbox.moe/user/api.php" status=200 force=true
const CATBOX_ENDPOINT = "/api/catbox-upload";

/** Returns true when the browser's canvas can produce WebP output. */
function supportsWebP(): boolean {
  try {
    return document
      .createElement("canvas")
      .toDataURL("image/webp")
      .startsWith("data:image/webp");
  } catch {
    return false;
  }
}

const USE_WEBP = supportsWebP();

/** Convert a data URL to a Blob (for FormData uploads). */
function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(head)?.[1] ?? "application/octet-stream";
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Pick an extension that matches the Blob's MIME for catbox's URL. */
function extForMime(mime: string): string {
  if (mime.includes("webp")) return "webp";
  if (mime.includes("png")) return "png";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

/**
 * Compress an image file in the browser and return a base64 data URL.
 * PNG files with transparency are preserved as lossless PNG.
 * All other formats are compressed as WebP (or JPEG as fallback).
 */
export function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden."));
      img.onload = () => {
        const { naturalWidth: w, naturalHeight: h } = img;
        const scale = Math.min(1, MAX_PX / Math.max(w, h));

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (file.type === "image/png") {
          resolve(canvas.toDataURL("image/png"));
          return;
        }

        const mimeType = USE_WEBP ? "image/webp" : "image/jpeg";
        let quality = QUALITY_START;
        let dataUrl: string;

        do {
          dataUrl = canvas.toDataURL(mimeType, quality);
          if (dataUrl.length <= TARGET_BYTES) break;
          quality = parseFloat((quality - QUALITY_STEP).toFixed(2));
        } while (quality >= QUALITY_MIN);

        resolve(dataUrl);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/** Upload a Blob to catbox.moe and return the resulting public URL. */
async function uploadToCatbox(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  const filename = `upload.${extForMime(blob.type)}`;
  form.append("fileToUpload", blob, filename);

  const res = await fetch(CATBOX_ENDPOINT, { method: "POST", body: form });
  if (!res.ok) {
    throw new Error(`Bild-Upload fehlgeschlagen (HTTP ${res.status}).`);
  }

  const url = (await res.text()).trim();
  if (!url.startsWith("http")) {
    throw new Error(url || "Bild-Upload fehlgeschlagen.");
  }
  return url;
}

/** Remote hosting is always available with catbox (no key required). */
export function isRemoteUploadEnabled(): boolean {
  return true;
}

/**
 * Compress a file, upload to catbox.moe (free, anonymous, unlimited),
 * and return the resulting permanent URL.
 */
export async function uploadImage(file: File, _folder?: string): Promise<string> {
  const dataUrl = await compressImageToDataUrl(file);
  const blob = dataUrlToBlob(dataUrl);
  return uploadToCatbox(blob);
}

/**
 * Upload an already-rendered `data:image/...` URL (e.g. the output of
 * `stage.toDataURL()` from the customizer) directly to catbox and return
 * the hosted URL. Skips re-compression — the canvas already controls size.
 */
export async function uploadDataUrl(dataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  return uploadToCatbox(blob);
}

/**
 * No-op. Catbox has a separate authenticated delete flow that we don't
 * use — orphaned uploads stay on catbox at no cost.
 */
export function deleteImage(_url: string): void {
  // Intentionally empty.
}
