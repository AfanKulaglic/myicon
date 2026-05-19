/**
 * Seed categories into Firebase RTDB.
 * Run with: node scripts/seed-categories.mjs
 */

const RTDB_URL = "https://wlab-40444-default-rtdb.firebaseio.com";

const categories = {
  textilien: {
    slug: "textilien",
    title: "Textilien",
    titleEn: "Textiles",
    titleLocal: "Tekstil",
    description: "Premium bedruckbare Textilien — T-Shirts, Polos, Hoodies & mehr.",
    descriptionEn: "Premium printable textiles — T-Shirts, Polos, Hoodies & more.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop",
    subcategories: [
      { slug: "polo-shirts",       title: "Polo-Shirts",                   titleEn: "Polo Shirts" },
      { slug: "t-shirts",          title: "T-Shirts",                      titleEn: "T-Shirts" },
      { slug: "damen-polo-shirts", title: "Damen Polo-Shirts",             titleEn: "Women's Polo Shirts" },
      { slug: "damen-t-shirts",    title: "Damen T-Shirts",                titleEn: "Women's T-Shirts" },
      { slug: "hoodies",           title: "Hoodies mit Kapuze",            titleEn: "Hoodies with Hood" },
      { slug: "caps",              title: "Caps",                          titleEn: "Caps" },
      { slug: "schuerzen",         title: "Schürzen",                      titleEn: "Aprons" },
    ],
  },
  flyer: {
    slug: "flyer",
    title: "Flyer",
    titleEn: "Flyers",
    titleLocal: "Flajeri",
    description: "Hochwertige Flyer in allen DIN-Formaten — schnell & günstig.",
    descriptionEn: "High-quality flyers in all DIN formats — fast & affordable.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80&auto=format&fit=crop",
    subcategories: [
      { slug: "flyer-a6",         title: "Flyer A6",                      titleEn: "A6 Flyers" },
      { slug: "flyer-a5",         title: "Flyer A5",                      titleEn: "A5 Flyers" },
      { slug: "flyer-a4",         title: "Flyer A4",                      titleEn: "A4 Flyers" },
      { slug: "gefaltete-flyer",  title: "Gefaltete Flyer",               titleEn: "Folded Flyers" },
      { slug: "express-flyer",    title: "Express-Flyer",                 titleEn: "Express Flyers" },
      { slug: "beidseitig-flyer", title: "Beidseitig bedruckte Flyer",    titleEn: "Double-Sided Printed Flyers" },
    ],
  },
  broschueren: {
    slug: "broschueren",
    title: "Broschüren",
    titleEn: "Brochures",
    titleLocal: "Brošure",
    description: "Professionelle Broschüren, geheftet oder gefaltet — für jeden Anlass.",
    descriptionEn: "Professional brochures, stapled or folded — for every occasion.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&q=80&auto=format&fit=crop",
    subcategories: [
      { slug: "broschueren-a6",         title: "Broschüren A6",            titleEn: "A6 Brochures" },
      { slug: "broschueren-a5",         title: "Broschüren A5",            titleEn: "A5 Brochures" },
      { slug: "broschueren-a4",         title: "Broschüren A4",            titleEn: "A4 Brochures" },
      { slug: "broschueren-a3",         title: "Broschüren A3",            titleEn: "A3 Brochures" },
      { slug: "gefaltete-broschueren",  title: "Gefaltete Broschüren",     titleEn: "Folded Brochures" },
      { slug: "broschueren-heftung",    title: "Broschüren mit Heftung",   titleEn: "Stapled Brochures" },
    ],
  },
  visitenkarten: {
    slug: "visitenkarten",
    title: "Visitenkarten",
    titleEn: "Business Cards",
    titleLocal: "Vizitke",
    description: "Premium Visitenkarten — laminiert, matt oder glänzend.",
    descriptionEn: "Premium business cards — laminated, matte or glossy.",
    image: "https://images.unsplash.com/photo-1606293459339-aa5dd9b48049?w=900&q=80&auto=format&fit=crop",
    subcategories: [
      { slug: "standard",       title: "Standard-Visitenkarten",                      titleEn: "Standard Business Cards" },
      { slug: "doppelseitig",   title: "Doppelseitig bedruckte Visitenkarten",        titleEn: "Double-Sided Printed Business Cards" },
      { slug: "laminiert",      title: "Laminierte Visitenkarten",                    titleEn: "Laminated Business Cards" },
      { slug: "matt-laminiert", title: "Matt laminierte Visitenkarten",               titleEn: "Matte Laminated Business Cards" },
      { slug: "glanz-laminiert",title: "Glanz laminierte Visitenkarten",              titleEn: "Gloss Laminated Business Cards" },
    ],
  },
  plakate: {
    slug: "plakate",
    title: "Plakate",
    titleEn: "Posters",
    titleLocal: "Posters",
    description: "Plakate in Premium-Qualität — bis A0, glanz oder matt.",
    descriptionEn: "Premium quality posters — up to A0, gloss or matte.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=900&q=80&auto=format&fit=crop",
    subcategories: [
      { slug: "plakate-a4",        title: "Plakate A4",         titleEn: "A4 Posters" },
      { slug: "plakate-a3",        title: "Plakate A3",         titleEn: "A3 Posters" },
      { slug: "werbeplakate",      title: "Werbeplakate",       titleEn: "Advertising Posters" },
      { slug: "hochglanz-plakate", title: "Hochglanz-Plakate",  titleEn: "High-Gloss Posters" },
    ],
  },
  werbematerial: {
    slug: "werbematerial",
    title: "Werbematerial",
    titleEn: "Promotional Material",
    titleLocal: "Reklamni materijal",
    description: "Werbeartikel mit Ihrem Logo — Tassen, Taschen, Schirme & mehr.",
    descriptionEn: "Promotional items with your logo — mugs, bags, umbrellas & more.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80&auto=format&fit=crop",
    subcategories: [
      { slug: "schluesselanhaenger", title: "Schlüsselanhänger", titleEn: "Keychains" },
      { slug: "eiskratzer",          title: "Eiskratzer",        titleEn: "Ice Scrapers" },
      { slug: "caps",                title: "Caps",              titleEn: "Caps" },
      { slug: "mousepads",           title: "Mousepads",         titleEn: "Mouse Pads" },
      { slug: "regenschirme",        title: "Regenschirme",      titleEn: "Umbrellas" },
      { slug: "stofftaschen",        title: "Stofftaschen",      titleEn: "Tote Bags" },
    ],
  },
};

console.log("Seeding categories to Firebase RTDB…");

const res = await fetch(`${RTDB_URL}/categories.json`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(categories),
});

if (!res.ok) {
  console.error(`Error: HTTP ${res.status}`);
  const body = await res.text();
  console.error(body);
  process.exit(1);
}

const result = await res.json();
console.log(`Done! Wrote ${Object.keys(result).length} categories:`);
Object.values(result).forEach((cat) => {
  console.log(`  ✓ ${cat.slug} (${cat.subcategories?.length ?? 0} subcategories)`);
});
