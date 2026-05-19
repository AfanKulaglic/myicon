/**
 * Patch English translations into every product in Firebase RTDB.
 *
 * Uses HTTP PATCH so existing fields on each product are preserved — only the
 * EN fields are written/overwritten. Run with:
 *
 *   node scripts/seed-product-translations.mjs
 */

const RTDB_URL = "https://wlab-40444-default-rtdb.firebaseio.com";

/**
 * Each entry is keyed by the product `id` in `src/mock-data/products.ts`.
 * Only the four EN translation fields are written. Anything else (price,
 * placements, gallery, etc.) is left untouched by Firebase's PATCH semantics.
 */
const translations = {
  p_tshirt_classic: {
    titleEn: "Premium T-Shirt — Organic Cotton",
    descriptionEn:
      "High-quality T-shirt made from 100% organic cotton, 180 g/m². Perfect for custom printing — from a single piece to large runs.",
    highlightsEn: [
      "100% organic cotton, 180 g/m²",
      "Premium print quality (DTG / screen printing)",
      "OEKO-TEX® certified",
      "Front and back printing available",
    ],
    badgeEn: "Bestseller",
  },
  p_polo_classic: {
    titleEn: "Classic Polo Shirt",
    descriptionEn:
      "Elegant polo shirt for business and events. High-quality piqué fabric, 200 g/m².",
    highlightsEn: [
      "Piqué 200 g/m²",
      "Button placket with 3 buttons",
      "Embroidery or print available",
      "Premium brand quality",
    ],
    badgeEn: "",
  },
  p_hoodie: {
    titleEn: "Premium Hoodie with Hood",
    descriptionEn:
      "Heavy premium hoodie, 320 g/m². Brushed inside. Perfect for brand merchandise.",
    highlightsEn: [
      "320 g/m² cotton blend",
      "Double-layered hood seam",
      "Kangaroo pocket",
      "Unisex fit",
    ],
    badgeEn: "New",
  },
  p_cap: {
    titleEn: "Snapback Cap — embroiderable",
    descriptionEn:
      "Classic snapback cap with a flat brim. Ideal for embroidery or patch printing.",
    highlightsEn: [
      "6-panel design",
      "Adjustable snap closure",
      "One size fits all",
      "Embroidery available",
    ],
    badgeEn: "",
  },
  p_flyer_a5: {
    titleEn: "A5 Flyer — Premium",
    descriptionEn:
      "Premium A5 flyer, 135 g/m² gloss art paper. Brilliant colors, razor-sharp print.",
    highlightsEn: [
      "Format: 148 × 210 mm",
      "135 g/m² gloss art paper",
      "4/4 color (both sides)",
      "From 250 pieces",
    ],
    badgeEn: "",
  },
  p_visitenkarte_standard: {
    titleEn: "Standard Business Card 85 × 55 mm",
    descriptionEn: "Premium business cards in standard format. 350 g/m² art paper.",
    highlightsEn: [
      "Format: 85 × 55 mm",
      "350 g/m² premium card stock",
      "4/4 color",
      "From 100 pieces",
    ],
    badgeEn: "",
  },
  p_poster_a3: {
    titleEn: "A3 Poster — High-Gloss",
    descriptionEn:
      "High-gloss A3 poster, 170 g/m². Perfect for events and advertising.",
    highlightsEn: [
      "Format: 297 × 420 mm",
      "170 g/m² art paper",
      "Gloss or matte finish",
    ],
    badgeEn: "",
  },
  p_broschuere_a5: {
    titleEn: "A5 Brochure with Saddle Stitching",
    descriptionEn:
      "High-quality A5 brochure with saddle-stitch binding. 16 pages, 135 g/m².",
    highlightsEn: [
      "Format: 148 × 210 mm",
      "16 pages standard",
      "Saddle-stitch binding",
      "135 g/m² gloss art paper",
    ],
    badgeEn: "",
  },
  p_stofftasche: {
    titleEn: "Organic Cotton Tote Bag",
    descriptionEn:
      "Sustainable organic cotton tote bag with logo print. Ideal as a promotional gift.",
    highlightsEn: [
      "100% organic cotton",
      "Long handles",
      "1- or 4-color printable",
    ],
    badgeEn: "",
  },
  p_mousepad: {
    titleEn: "Mousepad with Full-Surface Print",
    descriptionEn:
      "Mousepad with custom printing. Non-slip underside.",
    highlightsEn: [
      "220 × 180 mm",
      "Full-surface print",
      "Non-slip",
    ],
    badgeEn: "",
  },
  p_regenschirm: {
    titleEn: "Umbrella with Logo Print",
    descriptionEn:
      "Premium stick umbrella with wooden handle and custom logo print.",
    highlightsEn: [
      "8 panels",
      "Wooden handle",
      "Windproof",
      "Logo print included",
    ],
    badgeEn: "",
  },
};

console.log("Patching English product translations into Firebase RTDB…");

let written = 0;
let failed = 0;

for (const [id, fields] of Object.entries(translations)) {
  const res = await fetch(`${RTDB_URL}/products/${id}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`  ✗ ${id} — HTTP ${res.status}: ${body}`);
    failed++;
    continue;
  }

  console.log(`  ✓ ${id} — ${fields.titleEn}`);
  written++;
}

console.log(`\nDone. ${written} updated, ${failed} failed.`);
if (failed > 0) process.exit(1);
