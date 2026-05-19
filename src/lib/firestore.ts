import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  onValue,
} from "firebase/database";
import { rtdb } from "./firebase";
import type { Product, Category, Order } from "@/types";
import { PRODUCTS } from "@/mock-data/products";
import { CATEGORIES } from "@/mock-data/categories";

// ─── Products ─────────────────────────────────────────────────────────────────

export function subscribeToProducts(cb: (products: Product[]) => void, fallbackToMock = true) {
  // Merge a Firebase product with local mock data so that canvas-critical fields
  // (views with SVG paths, placements) always reflect the latest code while still
  // allowing admins to override price/description/etc. via Firebase.
  const mergeWithLocal = (fbProduct: Product): Product => {
    const local = PRODUCTS.find((p) => p.id === fbProduct.id);
    if (!local) return fbProduct;
    const fbImage = fbProduct.image?.startsWith("http") ? fbProduct.image : undefined;
    const fbGallery = (fbProduct.gallery ?? []).filter(
      (g): g is string => typeof g === "string" && g.startsWith("http")
    );

    return {
      ...local,        // base: local mock (has SVG views, placements, colors, sizes)
      ...fbProduct,    // overlay: Firebase wins on admin-editable fields
      // Always keep SVG-based views from local mock — Firebase may have old Unsplash paths
      views: local.views,
      zones: local.zones,
      // Use Firebase placements if an admin explicitly saved them; else use local mock
      placements: fbProduct.placements?.length ? fbProduct.placements : local.placements,
      // Only use Firebase image/gallery if they are external URLs.
      // If Firebase has none, leave fields empty — do NOT fall back to hardcoded
      // local mock images (those are for development only).
      image: fbImage ?? "",
      // Always put fbImage first so gallery[0] === image (the category card and the
      // detail page main slot both show the same photo).  Extra gallery shots follow.
      gallery: fbImage
        ? [fbImage, ...fbGallery.filter((g) => g !== fbImage)]
        : fbGallery.length > 0
          ? fbGallery
          : [],
    };
  };

  return onValue(
    ref(rtdb, "products"),
    (snap) => {
      const val = snap.val() as Record<string, Product> | null;
      if (val) {
        const fbIds = new Set(Object.keys(val));
        const fromFirebase = Object.entries(val).map(([id, data]) =>
          mergeWithLocal({ ...data, id } as Product)
        );
        // Include mock-only products not yet seeded to Firebase (e.g. newly added ones).
        // Strip image/gallery so no hardcoded mock images ever show in the storefront.
        const localOnly = PRODUCTS
          .filter((p) => !fbIds.has(p.id))
          .map((p) => ({ ...p, image: "", gallery: [] as string[] }));
        const combined = [...fromFirebase, ...localOnly];
        cb(combined.length > 0 ? combined : fallbackToMock ? PRODUCTS.map((p) => ({ ...p, image: "", gallery: [] as string[] })) : []);
      } else {
        cb(fallbackToMock ? PRODUCTS.map((p) => ({ ...p, image: "", gallery: [] as string[] })) : []);
      }
    },
    () => cb(fallbackToMock ? PRODUCTS.map((p) => ({ ...p, image: "", gallery: [] as string[] })) : [])
  );
}

function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<string> {
  const { id, ...data } = product;
  if (id) {
    await set(ref(rtdb, `products/${id}`), stripUndefined({ ...data, updatedAt: Date.now() }));
    return id;
  }
  const newRef = push(ref(rtdb, "products"));
  await set(newRef, stripUndefined({ ...data, createdAt: Date.now() }));
  return newRef.key!;
}

export async function deleteProduct(id: string) {
  await remove(ref(rtdb, `products/${id}`));
}

export async function seedProductsFromMock() {
  for (const p of PRODUCTS) {
    await set(ref(rtdb, `products/${p.id}`), { ...p, createdAt: Date.now() });
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function subscribeToCategories(cb: (categories: Category[]) => void, fallbackToMock = true) {
  const mockOrder = CATEGORIES.map((c) => c.slug);
  return onValue(
    ref(rtdb, "categories"),
    (snap) => {
      const val = snap.val() as Record<string, Category> | null;
      const list = val ? (Object.values(val) as Category[]) : [];
      const sorted = list.slice().sort((a, b) => {
        const ai = mockOrder.indexOf(a.slug);
        const bi = mockOrder.indexOf(b.slug);
        return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi);
      });
      cb(sorted.length > 0 ? sorted : fallbackToMock ? CATEGORIES : []);
    },
    () => cb(fallbackToMock ? CATEGORIES : [])
  );
}

export async function seedCategoriesFromMock() {
  for (const c of CATEGORIES) {
    await set(ref(rtdb, `categories/${c.slug}`), { ...c, createdAt: Date.now() });
  }
}

export async function saveCategory(category: Category): Promise<void> {
  await set(ref(rtdb, `categories/${category.slug}`), { ...category });
}

export async function deleteCategory(slug: string): Promise<void> {
  await remove(ref(rtdb, `categories/${slug}`));
}

// ─── Orders ───────────────────────────────────────────────────────────────────

/**
 * Firebase RTDB rejects `undefined` values inside the payload passed to `set()`
 * — and even a single `undefined` somewhere in the tree (e.g. a missing
 * `variant.size` or a `customDesigns[].uploadedImages: undefined`) throws and
 * aborts the whole write, which is exactly how an order can silently fail to
 * land in RTDB. `stripUndefined` (defined above) drops them recursively.
 */
export async function saveOrderToFirestore(order: Order) {
  const payload = stripUndefined({
    ...order,
    createdAt: Date.now(),
  });
  await set(ref(rtdb, `orders/${order.id}`), payload);
}

export function subscribeToOrders(cb: (orders: Order[]) => void) {
  return onValue(
    ref(rtdb, "orders"),
    (snap) => {
      const val = snap.val() as Record<string, Order> | null;
      if (!val) { cb([]); return; }
      const list = Object.values(val) as Order[];
      // Sort newest first (RTDB has no server-side desc ordering)
      list.sort((a, b) => ((b as unknown as Record<string, number>).createdAt ?? 0) - ((a as unknown as Record<string, number>).createdAt ?? 0));
      cb(list);
    },
    (err) => { console.error(err); cb([]); }
  );
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  await update(ref(rtdb, `orders/${orderId}`), { status });
}

export async function deleteOrder(orderId: string) {
  const { remove } = await import("firebase/database");
  await remove(ref(rtdb, `orders/${orderId}`));
}

/**
 * Live-subscribe to a single order by id (for customer tracking page).
 * Calls back with `null` if the order does not exist.
 */
export function subscribeToOrder(id: string, cb: (order: Order | null) => void) {
  return onValue(
    ref(rtdb, `orders/${id}`),
    (snap) => cb(snap.exists() ? ({ ...(snap.val() as Order), id } as Order) : null),
    (err) => { console.error(err); cb(null); }
  );
}

// ─── Site Content ─────────────────────────────────────────────────────────────
// Structure: siteContent/{sectionId}/{locale} = { ...fields }

export function subscribeSiteContent(
  sectionId: string,
  cb: (data: Record<string, unknown> | null) => void
) {
  return onValue(
    ref(rtdb, `siteContent/${sectionId}`),
    (snap) => cb(snap.val() as Record<string, unknown> | null),
    () => cb(null)
  );
}

/**
 * Save content for a specific locale.
 * Path: siteContent/{sectionId}/{locale}
 */
export async function updateSiteContent(sectionId: string, locale: string, data: object) {
  await set(ref(rtdb, `siteContent/${sectionId}/${locale}`), data);
}

/**
 * Get content for a specific locale once (for admin editors).
 */
export async function getSiteContentLocale<T>(sectionId: string, locale: string): Promise<T | null> {
  try {
    const snap = await get(ref(rtdb, `siteContent/${sectionId}/${locale}`));
    return snap.exists() ? (snap.val() as T) : null;
  } catch {
    return null;
  }
}

export async function getSiteContentOnce(sectionId: string): Promise<Record<string, unknown> | null> {
  const snap = await get(ref(rtdb, `siteContent/${sectionId}`));
  return snap.exists() ? (snap.val() as Record<string, unknown>) : null;
}

// ─── Admin Config ─────────────────────────────────────────────────────────────

export async function getAdminCode(): Promise<string | null> {
  try {
    const snap = await get(ref(rtdb, "adminConfig/settings/code"));
    return snap.exists() ? (snap.val() as string) : null;
  } catch {
    return null;
  }
}

export async function setAdminCode(code: string) {
  await set(ref(rtdb, "adminConfig/settings/code"), code);
}
