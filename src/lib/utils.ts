import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "EUR", locale = "de-DE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Image optimization via Weserv Images (https://wsrv.nl — free, no API key).
 * Remote images (ImgBB etc.) are resized and converted to WebP on the fly,
 * cutting mobile data from multi-MB PNGs down to tens of KB. Local assets
 * (starting with "/") and already-optimized URLs are returned unchanged.
 */
export function optimizeImage(src: string, width = 800, quality = 80): string {
  if (!src) return src;
  if (src.startsWith("/")) return src; // local asset — serve as-is
  if (src.includes("wsrv.nl")) return src; // already optimized
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&output=webp&q=${quality}`;
}
