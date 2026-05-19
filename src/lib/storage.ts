/**
 * Image upload pipeline — ImgBB.
 *
 * ImgBB is a free image hosting service with:
 *   - Unlimited storage FREE
 *   - Fast CDN delivery
 *   - Works worldwide (including Bosnia and Herzegovina)
 *   - 32 MB per file limit
 *   - Direct image URLs
 */

const MAX_PX = 1600;
const TARGET_BYTES = 1_500 * 1024; // 1.5 MB
const QUALITY_START = 0.9;
const QUALITY_STEP = 0.08;
const QUALITY_MIN = 0.4;

// ImgBB API key - public, safe to expose (read-only upload key)
const IMGBB_API_KEY = "5e1512f1ebee23db7ec7288def30f170";

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

/** Upload a base64 image to ImgBB and return the resulting public URL. */
async function uploadToImgBB(base64Image: string): Promise<string> {
  // Remove data URL prefix if present
  const base64Data = base64Image.includes(',') 
    ? base64Image.split(',')[1] 
    : base64Image;

  const form = new FormData();
  form.append("image", base64Data);

  const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
  const res = await fetch(url, { method: "POST", body: form });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Bild-Upload fehlgeschlagen (HTTP ${res.status}): ${errorText}`);
  }

  const data = await res.json();
  
  if (!data.success || !data.data?.url) {
    throw new Error("Bild-Upload fehlgeschlagen: Keine URL erhalten.");
  }

  // Return the direct image URL (CDN)
  return data.data.url;
}

/** Check if ImgBB is configured. */
export function isRemoteUploadEnabled(): boolean {
  return true; // Always enabled with hardcoded API key
}

/**
 * Compress a file, upload to ImgBB (free unlimited storage with CDN),
 * and return the resulting permanent URL.
 */
export async function uploadImage(file: File, _folder?: string): Promise<string> {
  const dataUrl = await compressImageToDataUrl(file);
  return uploadToImgBB(dataUrl);
}

/**
 * Upload an already-rendered `data:image/...` URL (e.g. the output of
 * `stage.toDataURL()` from the customizer) directly to ImgBB and return
 * the hosted URL. Skips re-compression — the canvas already controls size.
 */
export async function uploadDataUrl(dataUrl: string, _folder?: string): Promise<string> {
  return uploadToImgBB(dataUrl);
}

/**
 * No-op. ImgBB doesn't provide a delete API for free accounts.
 * Images stay on ImgBB at no cost (unlimited storage).
 */
export function deleteImage(_url: string): void {
  // Intentionally empty - ImgBB free tier doesn't support deletion
}
