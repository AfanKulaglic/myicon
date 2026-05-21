import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    slug: "textilien",
    title: "Textilien",
    titleEn: "Textiles",
    titleLocal: "Tekstil",
    description: "Premium bedruckbare Textilien — T-Shirts, Polos, Hoodies & mehr.",
    descriptionEn: "Premium printable textiles — T-Shirts, Polos, Hoodies & more.",
    image: "", // Load from Firebase/ImgBB only
    subcategories: [
      { slug: "polo-shirts", title: "Polo-Shirts", titleEn: "Polo Shirts" },
      { slug: "t-shirts", title: "T-Shirts", titleEn: "T-Shirts" },
      { slug: "damen-polo-shirts", title: "Damen Polo-Shirts", titleEn: "Women's Polo Shirts" },
      { slug: "damen-t-shirts", title: "Damen T-Shirts", titleEn: "Women's T-Shirts" },
      { slug: "hoodies", title: "Hoodies mit Kapuze", titleEn: "Hoodies with Hood" },
      { slug: "caps", title: "Caps", titleEn: "Caps" },
      { slug: "schuerzen", title: "Schürzen", titleEn: "Aprons" },
    ],
  },
  {
    slug: "flyer",
    title: "Flyer",
    titleEn: "Flyers",
    titleLocal: "Flajeri",
    description: "Hochwertige Flyer in allen DIN-Formaten — schnell & günstig.",
    descriptionEn: "High-quality flyers in all DIN formats — fast & affordable.",
    image: "", // Load from Firebase/ImgBB only
    subcategories: [
      { slug: "flyer-a6", title: "Flyer A6", titleEn: "A6 Flyers" },
      { slug: "flyer-a5", title: "Flyer A5", titleEn: "A5 Flyers" },
      { slug: "flyer-a4", title: "Flyer A4", titleEn: "A4 Flyers" },
      { slug: "gefaltete-flyer", title: "Gefaltete Flyer", titleEn: "Folded Flyers" },
      { slug: "express-flyer", title: "Express-Flyer", titleEn: "Express Flyers" },
      { slug: "beidseitig-flyer", title: "Beidseitig bedruckte Flyer", titleEn: "Double-Sided Printed Flyers" },
    ],
  },
  {
    slug: "broschueren",
    title: "Broschüren",
    titleEn: "Brochures",
    titleLocal: "Brošure",
    description: "Professionelle Broschüren, geheftet oder gefaltet — für jeden Anlass.",
    descriptionEn: "Professional brochures, stapled or folded — for every occasion.",
    image: "", // Load from Firebase/ImgBB only
    subcategories: [
      { slug: "broschueren-a6", title: "Broschüren A6", titleEn: "A6 Brochures" },
      { slug: "broschueren-a5", title: "Broschüren A5", titleEn: "A5 Brochures" },
      { slug: "broschueren-a4", title: "Broschüren A4", titleEn: "A4 Brochures" },
      { slug: "broschueren-a3", title: "Broschüren A3", titleEn: "A3 Brochures" },
      { slug: "gefaltete-broschueren", title: "Gefaltete Broschüren", titleEn: "Folded Brochures" },
      { slug: "broschueren-heftung", title: "Broschüren mit Heftung", titleEn: "Stapled Brochures" },
    ],
  },
  {
    slug: "visitenkarten",
    title: "Visitenkarten",
    titleEn: "Business Cards",
    titleLocal: "Vizitke",
    description: "Premium Visitenkarten — laminiert, matt oder glänzend.",
    descriptionEn: "Premium business cards — laminated, matte or glossy.",
    image: "", // Load from Firebase/ImgBB only
    subcategories: [
      { slug: "standard", title: "Standard-Visitenkarten", titleEn: "Standard Business Cards" },
      { slug: "doppelseitig", title: "Doppelseitig bedruckte Visitenkarten", titleEn: "Double-Sided Printed Business Cards" },
      { slug: "laminiert", title: "Laminierte Visitenkarten", titleEn: "Laminated Business Cards" },
      { slug: "matt-laminiert", title: "Matt laminierte Visitenkarten", titleEn: "Matte Laminated Business Cards" },
      { slug: "glanz-laminiert", title: "Glanz laminierte Visitenkarten", titleEn: "Gloss Laminated Business Cards" },
    ],
  },
  {
    slug: "plakate",
    title: "Plakate",
    titleEn: "Posters",
    titleLocal: "Posters",
    description: "Plakate in Premium-Qualität — bis A0, glanz oder matt.",
    descriptionEn: "Premium quality posters — up to A0, gloss or matte.",
    image: "", // Load from Firebase/ImgBB only
    subcategories: [
      { slug: "plakate-a4", title: "Plakate A4", titleEn: "A4 Posters" },
      { slug: "plakate-a3", title: "Plakate A3", titleEn: "A3 Posters" },
      { slug: "werbeplakate", title: "Werbeplakate", titleEn: "Advertising Posters" },
      { slug: "hochglanz-plakate", title: "Hochglanz-Plakate", titleEn: "High-Gloss Posters" },
    ],
  },
  {
    slug: "werbematerial",
    title: "Werbematerial",
    titleEn: "Promotional Material",
    titleLocal: "Reklamni materijal",
    description: "Werbeartikel mit Ihrem Logo — Tassen, Taschen, Schirme & mehr.",
    descriptionEn: "Promotional items with your logo — mugs, bags, umbrellas & more.",
    image: "", // Load from Firebase/ImgBB only
    subcategories: [
      { slug: "schluesselanhaenger", title: "Schlüsselanhänger", titleEn: "Keychains" },
      { slug: "eiskratzer", title: "Eiskratzer", titleEn: "Ice Scrapers" },
      { slug: "caps", title: "Caps", titleEn: "Caps" },
      { slug: "mousepads", title: "Mousepads", titleEn: "Mouse Pads" },
      { slug: "regenschirme", title: "Regenschirme", titleEn: "Umbrellas" },
      { slug: "stofftaschen", title: "Stofftaschen", titleEn: "Tote Bags" },
    ],
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<string, Category>;
