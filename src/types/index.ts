export type CategorySlug =
  | "textilien"
  | "flyer"
  | "broschueren"
  | "visitenkarten"
  | "plakate"
  | "werbematerial";

export interface Category {
  slug: CategorySlug;
  title: string;
  titleEn?: string;
  titleLocal?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  slug: string;
  title: string;
  titleEn?: string;
  image?: string;
}

export type ProductType =
  | "tshirt"
  | "polo"
  | "hoodie"
  | "cap"
  | "apron"
  | "flyer"
  | "brochure"
  | "businesscard"
  | "poster"
  | "promo";

export interface PrintZone {
  id: string;
  label: string;
  width: number; // mm
  height: number; // mm
  bleed?: number; // mm
}

export interface ProductView {
  id: string;
  label: string;       // "Front", "Back"
  image: string;       // mockup image
  // print area in pixels relative to the mockup image (1000 px reference width)
  area: { x: number; y: number; width: number; height: number };
}

/**
 * Industry-standard print placement (modeled after Printful's API).
 * A product has one or more named placements (front, back, left chest, etc.).
 * Each placement owns its mockup image and a print-area rectangle defined as
 * percentages of the mockup — so it stays resolution-independent.
 */
export type PlacementKey =
  | "front"
  | "back"
  | "front_large"
  | "chest_left"
  | "chest_right"
  | "chest_center"
  | "sleeve_left"
  | "sleeve_right"
  | "label_outside"
  | "label_inside"
  | "hood"
  | "pocket"
  | "front_top"
  | "front_bottom"
  | "default";

export interface PrintPlacement {
  id: string;
  key: PlacementKey;        // semantic identifier (used for pricing logic etc.)
  label: string;            // German label, e.g. "Vorderseite"
  labelEn?: string;         // English label

  // The mockup background image (product photo, transparent PNG/SVG)
  mockup: string;
  mockupWidth: number;      // intrinsic px width of the mockup image
  mockupHeight: number;     // intrinsic px height

  // Print-area rectangle expressed as percentages of the mockup (0–100).
  // (left, top, width, height) — resolution-independent.
  printArea: {
    leftPct: number;
    topPct: number;
    widthPct: number;
    heightPct: number;
  };

  // Real-world physical print dimensions for DPI calc + customer info
  widthMm: number;
  heightMm: number;
  recommendedDpi?: number;  // default 150

  // Safe zone: inset inside print area (percentage of print area). Content
  // outside safe zone may be cut. Typical 5%.
  safePct?: number;
  // Bleed: extension outside print area (percentage). Typical 0–3%.
  bleedPct?: number;

  // Mockup compositing — does the mockup image render ABOVE the design
  // (e.g. wrinkled fabric overlay) or BEHIND it (most flat mockups)?
  mockupOnTop?: boolean;

  // Optional surcharge in EUR for using this placement
  additionalPrice?: number;
  // Optional placement-specific tint/background (e.g. dark t-shirt color)
  backgroundColor?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  category: CategorySlug;
  subcategory: string;
  type: ProductType;
  priceFrom: number;
  basePrice: number;
  rating: number;
  reviews: number;
  description: string;
  descriptionEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  views: ProductView[];
  zones: PrintZone[];
  /** New: industry-standard placements (front/back/sleeve_left/...).
   *  When present, the customizer should prefer this over `views`/`zones`. */
  placements?: PrintPlacement[];
  image: string;
  gallery: string[];
  badge?: string;
  bestseller?: boolean;
}

export interface CartItem {
  id: string;          // cart row id
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  variant: {
    color?: string;
    size?: string;
  };
  designId?: string;   // reference to saved draft
  /**
   * Per-view design previews uploaded to remote hosting (catbox).
   * Populated only for items the user actually customized — and only for
   * the views where they placed at least one layer. Untouched views are
   * omitted entirely so the admin only sees what was actually edited.
   */
  customDesigns?: {
    viewId: string;
    viewLabel: string;
    /** Composed PNG (mockup + user layers) rendered from the Konva stage. */
    imageUrl: string;
    /**
     * The raw, user-uploaded images on this view — full quality, never re-rendered
     * through the canvas. Each entry is a catbox URL pointing to the exact file the
     * user picked. The admin needs these for production-quality printing because the
     * composed `imageUrl` is rasterised at the canvas resolution.
     */
    uploadedImages?: {
      url: string;
      fileName?: string;
    }[];
    /**
     * The text layers the user placed on this view, captured verbatim with their
     * styling so the admin can re-typeset cleanly instead of having to read it out
     * of the composed PNG.
     */
    texts?: {
      text: string;
      fontFamily: string;
      fontSize: number;
      fontStyle: string;
      fill: string;
    }[];
  }[];
}

export interface DesignDraft {
  id: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  thumbnail?: string;  // dataURL preview
  updatedAt: number;
  data: unknown;       // serialized canvas state
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address: Address;
}
