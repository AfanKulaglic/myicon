# MYICON — Project Documentation

> **Last updated:** Prompt 99 — Added 3 missing Werbematerial products for all remaining subcategories.
> **Read this file at the start of every prompt. Update it at the end of every prompt.**
> **This is enforced automatically via `.github/copilot-instructions.md` — injected into every Copilot session in this workspace.**

---

## 1. Project Overview

**MYICON** is a premium custom-print e-commerce platform inspired by wir-machen-druck.de, Vistaprint, Canva Print, Printful and Spreadshirt — designed for the German/European market.

- **Language:** German UI (all copy in German)
- **Target market:** B2C + B2B Europe
- **Brand color:** `#1E5AA8` (deep blue)
- **No backend:** All data is mocked/in-memory. Architecture is designed so Firebase + PayPal integration can be added later.

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | **React** | 18.3.1 |
| Build tool | **Vite** | 5.4.x |
| Language | **TypeScript** | 5.6.x |
| Routing | **React Router DOM** | 6.28.x |
| State management | **Zustand** + persist middleware | 5.0.x |
| Forms + validation | **React Hook Form** + **Zod** | 7.x / 3.x |
| Canvas/designer | **Konva** + **react-konva** + **use-image** | 9.x / 18.x |
| Styling | **Tailwind CSS** | 3.4.x |
| Icons | **Lucide React** | 0.460.x |
| Carousel | **Swiper** | 11.x |
| Utilities | **clsx** + **tailwind-merge** | — |
| Animation | **Framer Motion** | 11.x |

---

## 3. Project Structure

```
my-icon-shop/
├── index.html               # Vite entry — loads Google Fonts (Inter, Plus Jakarta Sans)
├── vite.config.ts           # Vite config — @vitejs/plugin-react, @ alias → ./src
├── tailwind.config.mjs      # Full design token config
├── tsconfig.json            # Strict TypeScript, react-jsx, @ paths
├── postcss.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── mockups/             # SVG mockup files for canvas (flyer, bcard, poster, etc.)
└── src/
    ├── main.tsx             # ReactDOM.createRoot + BrowserRouter
    ├── App.tsx              # All routes + ShellLayout
    ├── globals.css          # Tailwind layers + component classes
    ├── types/
    │   └── index.ts         # All shared TypeScript types
    ├── mock-data/
    │   ├── categories.ts    # 6 CATEGORIES + CATEGORY_MAP
    │   └── products.ts      # ~12 PRODUCTS + PRODUCT_MAP + helpers
    ├── store/
    │   ├── cart.ts          # Zustand cart store (persisted)
    │   ├── wishlist.ts      # Zustand wishlist store (persisted)
    │   ├── drafts.ts        # Zustand drafts store (persisted)
    │   ├── auth.ts          # Zustand auth store (persisted)
    │   └── toast.ts         # Non-persisted toast notifications
    ├── lib/
    │   └── utils.ts         # cn(), formatCurrency(), slugify(), uid()
    ├── hooks/
    │   └── useMounted.ts    # SSR-safe hydration hook
    ├── components/
    │   ├── layout/
    │   │   ├── Logo.tsx
    │   │   ├── SiteHeader.tsx     # Sticky header: utility row, search, nav, icons
    │   │   ├── DesktopNav.tsx     # Hover mega-menu
    │   │   ├── MobileMenu.tsx     # Slide-out drawer with drill-down nav
    │   │   └── SiteFooter.tsx     # Trust strip + 4-column footer
    │   ├── cart/
    │   │   └── CartDrawer.tsx     # Slide-out cart panel
    │   ├── product/
    │   │   ├── ProductCard.tsx    # Grid card with wishlist toggle
    │   │   └── CategoryCard.tsx   # Category tile with image
    │   └── ui/
    │       ├── Button.tsx         # 5 variants, 3 sizes, loading spinner
    │       ├── QuantitySelector.tsx
    │       └── Toaster.tsx        # Toast notification renderer
    ├── features/
    │   ├── home/
    │   │   ├── Hero.tsx           # Full-width hero with CTA
    │   │   ├── TrustStrip.tsx     # Trust icons row
    │   │   ├── CategoryGrid.tsx   # 6-category grid
    │   │   ├── Bestsellers.tsx    # Swiper carousel
    │   │   ├── HowItWorks.tsx     # 3-step process
    │   │   └── CTASection.tsx     # Bottom CTA band
    │   ├── product/
    │   │   └── ProductDetail.tsx  # Full product detail: gallery, options, add to cart
    │   └── customizer/
    │       ├── CustomizerShell.tsx           # Full-screen layout shell
    │       ├── state/
    │       │   └── CustomizerContext.tsx     # Full state machine (layers, history, zoom)
    │       ├── canvas/
    │       │   └── DesignerCanvas.tsx        # Konva Stage: mockup, print area, transformer
    │       └── panels/
    │           ├── CustomizerTopBar.tsx      # Back, logo, undo/redo, save, preview, add-to-cart
    │           ├── LeftSidebar.tsx           # Upload, Text, Shapes, Layers tabs
    │           ├── RightSidebar.tsx          # View switcher, product options, layer controls
    │           └── ZoomControls.tsx          # Floating zoom/bleed panel
    └── pages/
        ├── HomePage.tsx
        ├── CategoriesPage.tsx
        ├── CategoryPage.tsx
        ├── SubcategoryPage.tsx
        ├── ProductPage.tsx
        ├── CustomizePage.tsx       # Fullscreen — no header/footer
        ├── CartPage.tsx
        ├── WishlistPage.tsx
        ├── CheckoutPage.tsx        # RHF + Zod, simulated PayPal 1.2s delay
        ├── OrderSuccessPage.tsx
        ├── LoginPage.tsx
        ├── RegisterPage.tsx
        ├── FAQPage.tsx             # Accordion FAQ
        ├── ContactPage.tsx         # Contact form + info cards
        ├── AboutPage.tsx
        ├── TermsPage.tsx
        ├── PrivacyPage.tsx
        ├── ImprintPage.tsx
        ├── NotFoundPage.tsx
        └── account/
            ├── AccountLayout.tsx   # Sidebar nav layout (redirects to /login if not authed)
            ├── AccountPage.tsx     # Dashboard overview with stats
            ├── OrdersPage.tsx      # Order history list
            ├── DraftsPage.tsx      # Saved design drafts with thumbnails
            ├── WishlistPage.tsx    # Account wishlist (re-uses WishlistPage)
            └── ProfilePage.tsx     # Profile info + saved addresses form
```

---

## 4. Routing

All routes are declared in `src/App.tsx`.

### Shell routes (with SiteHeader + SiteFooter):
| URL | Page |
|-----|------|
| `/` | Home |
| `/categories` | All categories grid |
| `/categories/:slug` | Single category + subcategory chips + product grid |
| `/categories/:slug/:sub` | Filtered subcategory product grid |
| `/products/:slug` | Product detail page |
| `/cart` | Cart page |
| `/wishlist` | Wishlist page |
| `/checkout` | Checkout with address form + simulated PayPal |
| `/order/success?id=<orderId>` | Order confirmation |
| `/login` | Login |
| `/register` | Register |
| `/account` | Dashboard (requires auth) |
| `/account/orders` | Orders history |
| `/account/drafts` | Saved designs |
| `/account/wishlist` | Wishlist |
| `/account/profile` | Profile + addresses |
| `/help/faq` | FAQ accordion |
| `/contact` | Contact form |
| `/about` | About page |
| `/legal/terms` | AGB |
| `/legal/privacy` | Datenschutz |
| `/legal/imprint` | Impressum |
| `*` | 404 Not Found |

### Full-screen routes (no header/footer):
| URL | Page |
|-----|------|
| `/products/:slug/customize` | Product customizer (Konva canvas) |

---

## 5. Design System

### Fonts
- **Body:** Inter (Google Fonts CDN via `index.html`)
- **Display/Headings:** Plus Jakarta Sans (Google Fonts CDN)
- CSS variables: `--font-inter`, `--font-jakarta` set in `:root` via `globals.css`
- Tailwind tokens: `font-sans` → Inter, `font-display` → Plus Jakarta Sans

### Brand Colors (Tailwind tokens in `tailwind.config.mjs`)
| Token | Value | Use |
|-------|-------|-----|
| `brand` / `brand-500` | `#1E5AA8` | Primary actions, links |
| `brand-600` | `#194B8C` | Hover states |
| `ink` | `#1E1E1E` | Primary text |
| `ink-muted` | `#5A6675` | Secondary text |
| `ink-subtle` | `#8A95A4` | Placeholder text |
| `surface` | `#FFFFFF` | Page background |
| `surface-alt` | `#F5F6F8` | Cards, inputs background |
| `line` | `#E5E7EB` | Borders, dividers |
| `accent` | `#C5E337` | Optional accent |

### Shadows
- `shadow-card` — subtle card elevation
- `shadow-elevated` — hover lift
- `shadow-pop` — modals / dropdowns

### Component Classes (defined in `globals.css` `@layer components`)
| Class | Description |
|-------|-------------|
| `.btn` | Base button |
| `.btn-primary` | Brand-filled button |
| `.btn-secondary` | Surface-alt button |
| `.btn-outline` | White border button |
| `.btn-ghost` | Ghost button |
| `.card` | White rounded border card |
| `.input` | Text input |
| `.label` | Form label |
| `.chip` | Pill tag |
| `.section` | Section padding |
| `.h-display` | Large heading (3xl–5xl) |
| `.h-section` | Section heading (2xl–3xl) |
| `.no-scrollbar` | Hide scrollbar utility |

---

## 6. State Management (Zustand Stores)

All stores use `zustand/middleware` `persist` and are saved to `localStorage`.

### `useCartStore` (`store/cart.ts`) — key: `myicon-cart`
| Field / Action | Type | Description |
|----------------|------|-------------|
| `items` | `CartItem[]` | Cart rows |
| `isOpen` | `boolean` | CartDrawer visibility |
| `openCart()` | fn | Open drawer |
| `closeCart()` | fn | Close drawer |
| `addItem(item)` | fn | Add or increment existing |
| `removeItem(id)` | fn | Remove by cart row id |
| `updateQuantity(id, qty)` | fn | Change qty |
| `clear()` | fn | Empty cart |
| `subtotal()` | fn | Sum of price × qty |
| `count()` | fn | Total items qty |

### `useWishlistStore` (`store/wishlist.ts`) — key: `myicon-wishlist`
| Field / Action | Type | Description |
|----------------|------|-------------|
| `productIds` | `string[]` | Saved product ids |
| `toggle(id)` | fn | Add or remove |
| `has(id)` | fn | Check if saved |

### `useDraftsStore` (`store/drafts.ts`) — key: `myicon-drafts`
| Field / Action | Type | Description |
|----------------|------|-------------|
| `drafts` | `DesignDraft[]` | Saved designs |
| `saveDraft(draft)` | fn | Save/update (returns id) |
| `removeDraft(id)` | fn | Delete draft |
| `getDraft(id)` | fn | Lookup draft |

### `useAuthStore` (`store/auth.ts`) — key: `myicon-auth`
| Field / Action | Type | Description |
|----------------|------|-------------|
| `user` | `{id, email, name} \| null` | Current user |
| `addresses` | `Address[]` | Saved delivery addresses |
| `orders` | `Order[]` | Order history |
| `login(email, name?)` | fn | Simulated login (no password check) |
| `logout()` | fn | Clear user |
| `addAddress(a)` | fn | Prepend address |
| `addOrder(o)` | fn | Prepend order |

### `toast` helper (`store/toast.ts`) — non-persisted
- `toast({ title, description?, duration? })` — shows a notification for ~3.2s
- `useToastStore` — consumed by `Toaster.tsx`

---

## 7. Product Customizer

### Route
`/products/:slug/customize` → `src/pages/CustomizePage.tsx`
- Supports `?draft=<id>` URL param to load a saved design on mount

### Architecture

```
CustomizePage
└── CustomizerShell (full-screen fixed layout)
    ├── CustomizerProvider (React Context — full designer state)
    │   ├── layers: Layer[]         — all canvas objects for current view
    │   ├── selectedId              — currently selected layer id
    │   ├── viewId                  — active product view (e.g. "front" | "back")
    │   ├── zoom (0.4–2.5)
    │   ├── showBleed (boolean)
    │   ├── history { past[], future[] } — 50-step undo/redo via useRef
    │   ├── productColor / productSize  — currently selected options
    │   ├── exportRef               — ref to canvas export function (dataURL)
    │   └── Full action API: addLayer, updateLayer, removeLayer, duplicateLayer,
    │       bringForward, sendBackward, bringToFront, sendToBack,
    │       undo, redo, serialize, loadFromSerialized
    │
    ├── CustomizerTopBar
    │   ├── Back button → navigate(-1)
    │   ├── Logo
    │   ├── Product title + current view label
    │   ├── Undo / Redo buttons
    │   ├── Save button → saveDraft() + toast
    │   ├── Preview button → opens dataURL in new window
    │   └── Add to Cart → saveDraft + addItem + openCart
    │
    ├── LeftSidebar (tabs: Upload | Text | Shapes | Layers)
    │   ├── Upload tab — FileReader → ImageLayer
    │   ├── Text tab — Heading / Subtitle / Body presets → TextLayer
    │   ├── Shapes tab — Rect / Circle → ShapeLayer
    │   └── Layers tab — reversed list; drag reorder, dup, delete, lock
    │
    ├── DesignerCanvas (lazy-loaded Konva Stage)
    │   ├── Reference width: 1000px (scales to container)
    │   ├── Background: product mockup image (KImage)
    │   ├── Color tint overlay for apparel products
    │   ├── Dashed red bleed rect + brand-blue print area rect
    │   ├── Clipped design Group (layers only render inside print area)
    │   ├── Transformer with all 8 anchors + rotation handle
    │   ├── Snap-to-center guides on dragMove
    │   └── Keyboard shortcuts: Ctrl+Z/Y (undo/redo), Ctrl+D (dup),
    │       Delete (remove), Arrow keys (1px nudge), Shift+Arrow (10px nudge)
    │
    ├── RightSidebar
    │   ├── ViewSwitcher — front / back tabs
    │   ├── ProductOptions — color swatches + size pills
    │   └── LayerControls (text: font family/size/style/align/color, opacity, rotation;
    │       z-order: bring forward/back/to front/to back; duplicate; delete)
    │
    └── ZoomControls (floating top-right)
        ├── Zoom in / out (0.4–2.5x)
        ├── Reset zoom
        └── Toggle bleed display
```

### Layer Types
| Type | Key fields |
|------|-----------|
| `TextLayer` | text, fontFamily, fontSize, fontStyle, align, fill, curve |
| `ImageLayer` | src (dataURL from FileReader) |
| `ShapeLayer` | fill, stroke, strokeWidth (rect or circle) |

All layers share: `id, type, viewId, x, y, width, height, rotation, opacity, locked?`

---

## 8. Product Catalog

### Categories (6)
| Slug | Title | Subcategories |
|------|-------|---------------|
| `textilien` | Textilien | polo-shirts, t-shirts, damen-polo-shirts, damen-t-shirts, hoodies, caps, schuerzen |
| `flyer` | Flyer | flyer-a6, flyer-a5, flyer-a4, gefaltete-flyer, express-flyer, beidseitig-flyer |
| `broschueren` | Broschüren | broschueren-heftung, etc. |
| `visitenkarten` | Visitenkarten | standard, etc. |
| `plakate` | Plakate | plakate-a3, etc. |
| `werbematerial` | Werbematerial | stofftaschen, mousepads, regenschirme |

### Products (~12 in `mock-data/products.ts`)
Includes: Premium T-Shirt, Polo-Shirt, Hoodie, Cap, Flyer A5, Visitenkarte Standard, Plakat A3, Broschüre (Heftung), Stofftasche, Mousepad, Regenschirm, and more.

Each product has:
- `id, slug, title, category, subcategory, type`
- `priceFrom, basePrice, rating, reviews`
- `description, highlights[]`
- `colors[]` (name + hex) — apparel only
- `sizes[]` — apparel only
- `views[]` — `{ id, label, image (Unsplash URL), area: { x, y, width, height } }`
- `zones[]` — print zones with mm dimensions
- `image` (primary), `gallery[]`, `badge?`, `bestseller?`

---

## 9. Checkout Flow

1. User fills **CheckoutPage** — email, name, full address (React Hook Form + Zod validation)
2. Submit → 1.2s simulated PayPal delay
3. If not logged in, auto-login via `authStore.login(email, name)`
4. Address saved → `authStore.addAddress()`
5. Order created → `authStore.addOrder({ id, createdAt, items, total, status: "pending", address })`
6. Cart cleared → `cartStore.clear()`
7. Navigate to `/order/success?id=<orderId>`
8. `OrderSuccessPage` reads `?id` from URL params and displays confirmation

---

## 10. Authentication

Fully mocked — no real backend.

- **Login:** `useAuthStore().login(email, name?)` sets `user` in Zustand (persisted)
- **Logout:** `useAuthStore().logout()` clears `user`
- **Auth guard:** `AccountLayout` redirects to `/login` if `user === null` (using `<Navigate>`)
- No password storage or verification — this is a demo/prototype

---

## 11. Key Utility Functions (`src/lib/utils.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `cn` | `(...inputs) => string` | clsx + tailwind-merge |
| `formatCurrency` | `(v, currency?, locale?) => string` | Intl formatter, defaults EUR / de-DE |
| `slugify` | `(str) => string` | URL-safe slug |
| `uid` | `(prefix?) => string` | Unique id (prefix + timestamp + random) |

---

## 12. Build & Dev Commands

```bash
npm run dev        # Start Vite dev server (port 5173, opens browser)
npm run build      # tsc --noEmit + vite build → dist/
npm run preview    # Serve dist/ locally
npm run typecheck  # tsc --noEmit only
```

**Build output (production):**
- `dist/assets/index-*.css` ~39 kB (gzip ~9 kB)
- `dist/assets/DesignerCanvas-*.js` ~299 kB (gzip ~92 kB) — lazy-loaded Konva chunk
- `dist/assets/index-*.js` ~490 kB (gzip ~143 kB) — main bundle

---

## 13. What Is NOT Implemented (Future Work)

| Feature | Notes |
|---------|-------|
| Real authentication | Needs Firebase Auth or similar |
| Real payment processing | Needs PayPal SDK integration |
| Real backend / database | Needs Firebase Firestore or similar |
| Order tracking | Status currently static (`"pending"`) |
| Email notifications | No email sending capability |
| Cart page full UI | `CartPage.tsx` file exists but content was not checked — may need building |
| Search functionality | Search bar in header has `onSubmit` no-op |
| Product filtering / sorting | Category pages show all products, no filter controls |
| Quantity-based pricing | priceFrom changes per qty — not calculated dynamically on ProductDetail |
| Drag-to-reorder layers | Layers panel has UI but drag logic may need polish |
| Mobile customizer UX | Bottom-sheet panels implemented, may need polish |
| Image removal after upload | Layers panel delete exists; no dedicated "replace image" flow |
| Real SVG mockups | Public mockups are placeholders — need real product mockup files |
| Internationalization | Bilingual DE/EN — `useLanguageStore` (localStorage), `useT()` hook, `src/i18n/translations.ts`, `LanguageSwitcher` component. Firestore `siteContent/{id}` structure: `{ de: {...}, en: {...} }`. Admin can edit per language. |

---

## 14. Mockup Assets (REAL PHOTOS — no illustrations)

**All product mockups MUST be real product photos** (PNG/JPG), not stylized SVG illustrations. The customizer renders the photo as-is via `KImage` and overlays the print area / safe zone / bleed guides on top.

### Structure
- One folder per product type inside `public/mockups/`, e.g. `public/mockups/tshirt/`.
- Files named after the view: `front.png`, `back.png`, `side.png`, `sleeve-left.png`, `sleeve-right.png`, etc.
- Photos should be on a clean neutral background, shirt centered, no shadows on background.

### Wiring a photo into a placement
In `mock-data/products.ts`, set:
- `mockup: "/mockups/<product>/<view>.png"`
- `mockupWidth` / `mockupHeight` — the **actual pixel dimensions** of the photo (used by `DesignerCanvas` to size the stage and compute `printArea` from percentages).
- `printArea: { leftPct, topPct, widthPct, heightPct }` — percentage of the photo where the design should be placed. Tune to land on a flat printable region of the garment.

### Rules
- **Never** create a styled SVG silhouette as a mockup. Use a real photograph.
- If a photo for a specific placement is missing, temporarily reuse a nearby view (e.g. `side.png` for both sleeves) until the proper asset is added.
- Keep dimensions reasonable (≤ 1500px on the long edge) to keep the page light.

### Current asset inventory
| Path | Used by |
|------|---------|
| `public/mockups/tshirt/front.png` (912×834) | T-Shirt + Polo + Hoodie front |
| `public/mockups/tshirt/back.png` (840×848) | T-Shirt + Hoodie back |
| `public/mockups/cap/cap.png` (490×405) | Snapback Cap (front panel) |
| `public/mockups/tshirt/side.png` (1311×1200) | T-Shirt + Polo sleeve_left / sleeve_right |
| `public/mockups/flyer-front.svg`, `flyer-back.svg`, `bcard-front.svg`, `bcard-back.svg`, `poster.svg`, `brochure.svg`, `mousepad.svg`, `umbrella.svg` | Print / promo products (still SVG until real photos are added) |
| Cap, polo, hoodie photos | **Cap done (P41).** Polo + Hoodie still fall back to t-shirt photos. |

---


## 15. Change Log


| Prompt | Changes |
|--------|--------|
| 99 | Added 3 werbematerial products to [products.ts](src/mock-data/products.ts): `p_schluesselanhaenger`, `p_eiskratzer`, `p_cap_promo`. All 6 Werbematerial subcategories now show products. Pushed to GitHub. |
| 98 | Added 3 poster products to [products.ts](src/mock-data/products.ts): `p_poster_a4` (A4), `p_poster_werbeplakat` (Werbeplakate), `p_poster_hochglanz` (Hochglanz-Plakate). All 4 Plakate subcategories now show products. Pushed to GitHub. |
| 97 | Added 4 business card products to [products.ts](src/mock-data/products.ts): `p_visitenkarte_doppelseitig`, `p_visitenkarte_laminiert`, `p_visitenkarte_matt`, `p_visitenkarte_glanz`. All 5 Visitenkarten subcategories now show products. Pushed to GitHub. |
| 96 | Fixed mobile sidebar not covering full screen. Root cause: `<MobileMenu>` was rendered inside `<header>` which has `backdrop-filter` — this creates a new CSS stacking context that breaks `position: fixed` children. Moved `MobileMenu` + `menuOpen` state to `ShellLayout` in [App.tsx](src/App.tsx); `SiteHeader` now accepts `onMenuOpen` prop. Pushed to GitHub. |
| 95 | Initialised git repository, created initial commit (136 files), added remote `origin` pointing to `https://github.com/AfanKulaglic/myicon.git`, pushed `main` branch. |
| 94 | Fixed [AdminProductForm.tsx](src/pages/admin/AdminProductForm.tsx): Zod `type` enum only had `"tshirt" \| "print" \| "promo" \| "other"` — all other `ProductType` values (`brochure`, `flyer`, `poster`, `polo`, `hoodie`, `cap`, `apron`, `businesscard`) were rejected on submit, so saving any brochure (or flyer/poster) product was silently blocked. Expanded enum to all 11 types and added matching `<option>` entries. |
| 93 | Added 5 brochure products to [products.ts](src/mock-data/products.ts): `p_broschuere_a6` (A6), `p_broschuere_a5_std` (A5), `p_broschuere_a4` (A4), `p_broschuere_a3` (A3), `p_broschuere_gefaltet` (Gefaltete). All use `image: ""`, `gallery: []`. All 6 Broschüren subcategories now show products instead of "Bald verfügbar." |
| 92 | Fixed "Position hinzufügen" dropdown in [PlacementsEditor.tsx](src/components/admin/PlacementsEditor.tsx): `<details>` stayed open after clicking a placement option. Added `detailsRef` and set `detailsRef.current.open = false` inside `add()`. |
| 91 | Added category filter pill-bar to Admin Products page ([AdminProducts.tsx](src/pages/admin/AdminProducts.tsx)). Uses `useCategories()` to list categories dynamically with per-category product counts. Clicking a pill filters the table; "Alle" resets. `visibleProducts` derived from `filterCat` state. |\n| 90 | Fixed category order in navbar/home: Firebase RTDB returns object keys alphabetically. Added sort step in `subscribeToCategories` ([firestore.ts](src/lib/firestore.ts)) that reorders Firebase results by the slug order of the local mock `CATEGORIES` array so the nav always shows Textilien first as before. |
| 89 | **Fixed hardcoded category images on home page and navbar mega menu.** Root cause: [CategoryGrid.tsx](src/features/home/CategoryGrid.tsx), [DesktopNav.tsx](src/components/layout/DesktopNav.tsx), and [MobileMenu.tsx](src/components/layout/MobileMenu.tsx) all imported `CATEGORIES` directly from the local mock, bypassing Firebase. Switched all three to `useCategories()` hook so admin-uploaded category images appear everywhere. Note in `MobileMenu`: hook call moved above the `if (!open) return null` early return to comply with React rules. `npx tsc --noEmit` — 0 errors. |
| 88 | **Added all missing flyer products.** The flyer category had 6 subcategories but only `p_flyer_a5` existed in mock data; the other 5 all showed "Bald verfügbar." Added to [products.ts](src/mock-data/products.ts): `p_flyer_a6` (Flyer A6, 105×148 mm, 7.90€), `p_flyer_a4` (Flyer A4, 210×297 mm, 14.90€), `p_flyer_gefaltet` (Gefaltete Flyer, Mittelfalz/Wickelfalz, 19.90€), `p_flyer_express` (Express-Flyer mit 24h Lieferung, "Express" badge, 14.90€), `p_flyer_beidseitig` (Beidseitig bedruckte Flyer, 9.90€). All new products have `image: ""` and `gallery: []` — admin will upload images later. All use existing `/mockups/flyer-front.svg` and `/mockups/flyer-back.svg` canvas mockups. `npx tsc --noEmit` — 0 errors. |
| 87 | **Real contact info inserted site-wide.** Updated all placeholder contact data in [src/types/content.ts](src/types/content.ts): `DEFAULT_CONTACT` + `DEFAULT_CONTACT_EN` → email `myicon2025@gmail.com`, phone `02191 5606112 / 0176 64824863 / 0178 8793509` (newline-separated), address `www.my-icon.shop`; `DEFAULT_FOOTER` + `DEFAULT_FOOTER_EN` → phone `02191 5606112`, email/emailHref `myicon2025@gmail.com`; `DEFAULT_IMPRINT` + `DEFAULT_IMPRINT_EN` → body rewritten with MYICON, www.my-icon.shop, all three phone numbers, email; `DEFAULT_PRIVACY` + `DEFAULT_PRIVACY_EN` sections 1 + 4 → `myicon2025@gmail.com`. [ContactPage.tsx](src/pages/ContactPage.tsx) phone block now splits on `\n` and renders each number as its own `<a href="tel:...">` link. `npx tsc --noEmit` — 0 errors. |
| 86 | **Completed skeleton loading + removed all remaining hardcoded image paths.** (1) `subscribeToProducts` in [firestore.ts](src/lib/firestore.ts): `localOnly` products (not yet in Firebase) now have `image: ""` and `gallery: []` stripped so Unsplash mock URLs never reach the storefront; all three `fallbackToMock ? PRODUCTS` branches also strip images via inline `.map`. (2) [Bestsellers.tsx](src/features/home/Bestsellers.tsx): replaced `getBestsellers()` (local mock) with `useProducts()` + `.filter(p => p.bestseller)`; shows 4× `ProductCardSkeleton` slides via `SwiperSlide` while `loading`. (3) New [ProductDetailSkeleton.tsx](src/components/product/ProductDetailSkeleton.tsx): pulsing layout matching the 2-column detail page (square gallery, thumb strip, title/price/description lines, action buttons). (4) [ProductPage.tsx](src/pages/ProductPage.tsx): renders `<ProductDetailSkeleton />` while `loading && !product` instead of `null`. (5) [WishlistPage.tsx](src/pages/WishlistPage.tsx): replaced `PRODUCT_MAP` lookup with `useProducts()` + shows 4× skeleton cards while `loading`. `npx tsc --noEmit` — 0 errors. |
| 85 | **Replaced hardcoded-image flash with skeleton loading.** Root cause: `useProducts` initialized state with `PRODUCTS` (local mock data with Unsplash images), so those images flashed on screen before Firebase responded. Fix: (1) `useProducts` now starts with `products = []` always; (2) new [ProductCardSkeleton.tsx](src/components/product/ProductCardSkeleton.tsx) component — pulse-animated card mimicking ProductCard layout; (3) [CategoryPage.tsx](src/pages/CategoryPage.tsx) and [SubcategoryPage.tsx](src/pages/SubcategoryPage.tsx) now show 8 skeleton cards while `productsLoading` is true. `npx tsc --noEmit` — 0 errors. |
| 84 | **Fixed product detail page broken image (gallery[0] stale URL).** Root cause: Firebase had `image` set to the current product photo (shown correctly on category cards via `product.image`), but `gallery[0]` still contained the old Unsplash seeding URL which 404s. My https filter kept it in `fbGallery`, so `gallery[0]` was the broken URL and `ProductDetail` (which renders `gallery[activeImg]`) showed broken alt-text. Fix in [firestore.ts](src/lib/firestore.ts): `gallery` is now always rebuilt as `[fbImage, ...fbGallery.filter(g => g !== fbImage)]` when `fbImage` exists, guaranteeing `gallery[0] === product.image`. `npx tsc --noEmit` — 0 errors. |
| 83 | **Removed hardcoded local image fallback from product display.** `mergeWithLocal` in [firestore.ts](src/lib/firestore.ts) no longer falls back to local mock `image`/`gallery` — if Firebase has no valid https image, `image` is `""` and `gallery` is `[]`. [ProductDetail.tsx](src/features/product/ProductDetail.tsx) now renders a "Kein Bild hinterlegt" placeholder (image icon + label) instead of a broken `<img>` when gallery and image are empty. [ProductCard.tsx](src/components/product/ProductCard.tsx) similarly renders a placeholder icon instead of a broken img. `npx tsc --noEmit` — 0 errors. |
| 82 | **Fixed Firebase product images not showing on detail page (gallery mismatch).** Root cause: `mergeWithLocal` in [firestore.ts](src/lib/firestore.ts) correctly resolved `product.image` to the Firebase https URL, but `ProductDetail` renders `product.gallery[activeImg]`, not `product.image`. When Firebase had a valid uploaded image but an empty `gallery` array, the local mock Unsplash gallery won the guard and was shown instead. Fix: computed `fbImage` and `fbGallery` (filtered to https-only entries) explicitly; when `fbGallery` is empty but `fbImage` exists, gallery is set to `[fbImage]` so the detail page always shows the Firebase image. Falls back to local mock gallery only when Firebase has neither a valid image nor gallery entries. `npx tsc --noEmit` — 0 errors. |
| 81 | **Fixed broken product images on detail page.** Root cause: `mergeWithLocal` in [firestore.ts](src/lib/firestore.ts) was unconditionally overlaying Firebase's `image` and `gallery` fields via `...fbProduct`. Firebase had stale seeded data where those fields contained local `/mockups/tshirt/front.png` paths that don't resolve in the browser. Fix: only accept Firebase `image`/`gallery` when the value starts with `http` (i.e. an externally uploaded URL); otherwise fall back to the local mock's Unsplash URLs. Admin-uploaded images still take priority. `npx tsc --noEmit` — 0 errors. |
| 80 | **Updated apron product image and title.** Renamed `p_schuerze` title from "Kochschürze — bedruckbar" → "Schürze — bedruckbar" in [products.ts](src/mock-data/products.ts). Replaced the food-context Unsplash photo (`photo-1556909114`) with a clean canvas apron image (`photo-1607082349566`) + second gallery shot (`photo-1581888227599`). |
| 79 | **Removed last EN label from PlacementsEditor.** [PlacementsEditor.tsx](src/components/admin/PlacementsEditor.tsx) had a two-column grid with "Bezeichnung (DE)" + "Bezeichnung (EN)" inputs; removed the EN column entirely. Renamed `admin.placements.labelDe` translation key value from "Bezeichnung (DE)" → "Bezeichnung" in [translations.ts](src/i18n/translations.ts). `npx tsc --noEmit` — 0 errors. |
| 78 | **Admin can delete orders.** Added `deleteOrder(orderId)` to [firestore.ts](src/lib/firestore.ts) (Firebase RTDB `remove`). In [AdminOrders.tsx](src/pages/admin/AdminOrders.tsx): added `deleting` + `confirmDeleteId` state, a new rightmost action column, and a two-step inline confirmation per row (trash icon → "Sicher? / Ja, löschen / Abbrechen") to prevent accidental deletes. On confirm, calls `deleteOrder`, shows a toast, and the RTDB listener removes the row live. `npx tsc --noEmit` — 0 errors. |
| 77 | **Removed English language site-wide.** User: *"can you completely remove the English language as an option on the page in the places where the English language exists. everything should be exclusively in German"*. Changes: (1) Deleted `LanguageSwitcher` import + element from [SiteHeader.tsx](src/components/layout/SiteHeader.tsx) and [AdminLayout.tsx](src/pages/admin/AdminLayout.tsx). (2) [AdminContent.tsx](src/pages/admin/AdminContent.tsx): removed DE/EN tab UI, locale banner, `LocaleTab` helper; `editingLocale` locked to `"de"` literal (still passed as `locale` prop to all child editors). (3) [AdminProductForm.tsx](src/pages/admin/AdminProductForm.tsx): removed entire "EN translations" card (Titel/Badge/Beschreibung/Highlights EN inputs), removed `titleEn`/`descriptionEn`/`highlightsEn`/`badgeEn` from zod schema, defaultValues, `useFieldArray`, `reset()`, and submit payload. (4) [AdminCategories.tsx](src/pages/admin/AdminCategories.tsx): dropped `titleEn`/`descriptionEn` from `SubcategoryRow` + `CategoryFormValues`; removed EN inputs from Names/Descriptions sections (now single column); subcategory grid dropped EN column (`grid-cols-[1fr_1fr_auto]`); flag emojis + "(DE)" labels removed. (5) [language.ts](src/store/language.ts): narrowed `Locale` to `"de"`, removed persist middleware, `setLocale` is a no-op. (6) [useSiteContent.ts](src/hooks/useSiteContent.ts): removed EN defaults branch (always returns DE defaults; `defaultsEn` retained as ignored param to keep call sites valid). (7) Deleted `src/components/ui/LanguageSwitcher.tsx`. (8) Removed hardcoded `DE`/`EN` pill badges from the admin live-preview navbar in [PreviewComponents.tsx](src/components/admin/PreviewComponents.tsx). `npx tsc --noEmit` — 0 errors. |
| 76 | **Fixed: `bestseller` checkbox in admin now drives the product card badge.** User: *"check if bestseller can be placed on each product so that it is really presented as a bestseller"*. Root cause: `ProductCard` only rendered a badge from `product.badge` (text string). The `bestseller: boolean` field was saved to Firebase correctly via the admin form checkbox but had no visual effect on the card. Fix: added `const badgeText = product.badge \|\| (product.bestseller ? "Bestseller" : undefined)` in [ProductCard.tsx](src/components/product/ProductCard.tsx) — `badge` text takes priority (e.g. "Neu"), falling back to "Bestseller" when the boolean flag is set. Confirmed `mergeWithLocal` in [firestore.ts](src/lib/firestore.ts) correctly passes Firebase's `bestseller` value through (`...fbProduct` overlays `...local`; Firebase RTDB stores explicit `false` so unchecking also works). `npx tsc --noEmit` — 0 errors. |
| 75 | **Fixed: newly added mock products not appearing in admin.** The admin products page calls `useProducts(false)` which reads from Firebase. Firebase had the old product set; the three new products (P74) were local-only. Fixed `subscribeToProducts` in [firestore.ts](src/lib/firestore.ts): when Firebase has data, collect `fbIds`, map Firebase entries through `mergeWithLocal`, then append `PRODUCTS.filter(p => !fbIds.has(p.id))` (local-only products not yet seeded). Combined list is passed to the callback. New mock products now appear immediately everywhere without a seed step. `npx tsc --noEmit` — 0 errors. |
| 74 | **Added missing Textilien products.** User: *"why doesn't the textile category have women's shirts, women's polo shirts and aprons"*. The subcategories `damen-t-shirts`, `damen-polo-shirts`, and `schuerzen` existed in `categories.ts` but had no corresponding products in `products.ts`, so all three pages showed "Bald verfügbar". Added `p_damen_tshirt` (Damen T-Shirt — Bio Baumwolle, 15.90 €, front+back+chest_left placements, Bestseller badge), `p_damen_polo` (Damen Polo-Shirt, 24.90 €, front+chest_left placements, Bestseller badge), and `p_schuerze` (Kochschürze — bedruckbar, 18.90 €, front placement, Neu badge) to [products.ts](src/mock-data/products.ts) after the cap entry. All three use existing t-shirt/polo mockup images. `npx tsc --noEmit` — 0 errors. |
| 73 | **Category image editing in admin.** User: *"make groups have their own images just like products"*. The `Category` type already had `image: string`; mock data already has Unsplash images; but the admin category form had no way to change them. Added `image: string` to `CategoryFormValues`, initialised from `category.image`, wired `ImageUploader` (file upload → catbox, URL tab, 24×24 preview, clear button) via `watch("image")` + `setValue("image", url, { shouldDirty: true })` so the "Speichern" button activates correctly. `saveCategory()` call now passes `image: values.image || category.image`. The new "Kategoriebild" section is placed at the top of the open form (above the name fields) in [AdminCategories.tsx](src/pages/admin/AdminCategories.tsx). `npx tsc --noEmit` — 0 errors. |
| 72 | **Progress modal for customizer cart upload.** User: *"When I finish editing and click this to order here, I'll wait a while — can you make it more optimized and better performing and clearer for users?"* Replaced the static "Wird hochgeladen…" button text with a centered fixed overlay modal: animated `Loader2` spinner, live step label (*"Vorderseite: Exportieren…"* / *"Vorderseite: Hochladen…"* / *"Wird abgeschlossen…"*), and a smooth `transition-[width]` progress bar (0 → 95% during upload, cleared in `finally`). Changes in both [CustomizerTopBar.tsx](src/features/customizer/panels/CustomizerTopBar.tsx) and [EmbeddedCustomizer.tsx](src/features/customizer/EmbeddedCustomizer.tsx). Additionally removed the raw-file upload loop from `EmbeddedCustomizer` (was uploading original image layers to catbox on top of the rendered exports — unnecessary since those were only shown in AdminOrders), and reduced the per-view RAF wait from 4 ticks to 2 (the pre-loop image priming makes additional waits redundant). `npx tsc --noEmit` — 0 errors. |
| 71 | Removed "Hochgeladene Originale" block from [OrdersPage.tsx](src/pages/account/OrdersPage.tsx). Original uploaded files are internal print-production data; they remain visible in [AdminOrders.tsx](src/pages/admin/AdminOrders.tsx) but are no longer shown to customers. |
| 70 | **Same-side zone awareness in the customizer canvas.** User: *"there is one exception in the case of models that have more zones but are on the same side of the product as in the case of a t-shirt. There is waterside and brush links and each one is for itself, and it would be logical if it were the same side but different zones. Therefore, different zones should remain, but it should be shown on both zones that what was put on that product was already on that side but on another zone"*. The t-shirt has `Vorderseite` (large center print) and `Brust links` (small chest print) defined as separate zones, but both physically sit on the front of the shirt and share the same mockup image (`/mockups/tshirt/front.png`). Previously each zone was a totally isolated canvas — switching to `Brust links` hid the chest design completely. Now in [DesignerCanvas.tsx](src/features/customizer/canvas/DesignerCanvas.tsx) we group placements by their shared `mockup` URL: the active zone stays fully editable (clipped + interactive), but every other placement on the same face renders as (a) a faint dashed slate-400 outline around its print area with its German label inset at the corner, and (b) all its layers ghosted at 35% opacity, `listening={false}` so they can't be clicked. Layer coordinates are already absolute on the mockup, so no transformation is needed — the ghosts naturally appear in the correct physical spot. New memos `sameSidePlacements`, `ghostLayers`, `sameSideRects` plus a dedicated read-only `<KLayer>` between the print-area guides and the editable design layer. `npx tsc --noEmit` — 0 errors. |
| 69 | **Customizer UX overhaul (better looks + easier management).** User: *"the customize part must have a better ux than the current one so that everything is easier to manage and everything looks nicer"*. Replaced the cramped mobile control (two text buttons floating above the canvas → sheet at `top-1/3`) with a proper Canva/Figma-style **5-tab bottom dock** (Bilder, Text, Formen, Ebenen, Stil) and a **slide-up bottom sheet** with drag handle, close button, backdrop tap-to-close, `max-h-[78vh]`, and `pb-[env(safe-area-inset-bottom)]` so it respects iOS home indicator. Refactored [LeftSidebar.tsx](src/features/customizer/panels/LeftSidebar.tsx) to expose `LeftSidebarPanel` + `LEFT_TABS` so the shell can render individual panels in the mobile sheet without duplicating code. **Auto-opens the Properties sheet** once on the first layer selection of the session (then user manages it manually). [CustomizerTopBar.tsx](src/features/customizer/panels/CustomizerTopBar.tsx) reworked for mobile: title takes available space, Undo/Redo always visible, Save+Vorschau collapse into a `MoreVertical` overflow menu on `<sm`, `In den Warenkorb` button shrinks to icon-only on `<md`. [ZoomControls.tsx](src/features/customizer/panels/ZoomControls.tsx) refined: removed redundant RotateCcw button (clicking the percentage now resets zoom), smaller rounded-xl chip, repositioned to bottom-right on `md+` so it doesn't compete with the in-canvas floating action toolbar at top. [RightSidebar.tsx](src/features/customizer/panels/RightSidebar.tsx) polished: type-badge pill („Text“/„Bild“/etc), grouped sections with subtle dividers, sliders show monospace values, **color swatches** got a check mark on the selected one + scale-up animation + a conic-gradient „Eigene Farbe“ picker, and the EmptySelection now shows pretty `<kbd>` chips for keyboard shortcuts. Added `slide-up` keyframe to [tailwind.config.mjs](tailwind.config.mjs). Note: the canvas already has its own Canva-style floating action toolbar that hovers above the selected layer (chevrons / duplicate / lock / delete), so a separate sticky one would be redundant — only the contextual mobile sheet was added. `npx tsc --noEmit` — 0 errors. |
| 68 | **Sitewide mobile responsiveness (no desktop changes).** User: *"CAN YOU MAKE EVERY PAGE FOR ME TO BE FULLY MOBILE-ADAPTED? EVERYTHING MUST BE FULLY RESPONSIVE. BUT EVERYTHING MUST REMAIN THE SAME AS IT IS ON THE DESKTOP."* Audited every page and added lower-breakpoint variants without touching `lg:`/`xl:` rules that govern desktop. Changes: **AdminLayout** ([src/pages/admin/AdminLayout.tsx](src/pages/admin/AdminLayout.tsx)) — sidebar is now a slide-in drawer on `<md` with a sticky top bar (hamburger + logo), backdrop, and close-on-nav. **Product/category grids** ([CategoryPage.tsx](src/pages/CategoryPage.tsx), [SubcategoryPage.tsx](src/pages/SubcategoryPage.tsx), [WishlistPage.tsx](src/pages/WishlistPage.tsx), [CategoriesPage.tsx](src/pages/CategoriesPage.tsx)) — added `md:grid-cols-3` middle step + graduated gap. **Two-column sidebar layouts** ([CartPage.tsx](src/pages/CartPage.tsx), [CheckoutPage.tsx](src/pages/CheckoutPage.tsx), [ContactPage.tsx](src/pages/ContactPage.tsx), [AccountLayout.tsx](src/pages/account/AccountLayout.tsx)) — added explicit `grid-cols-1` reset so layouts stack on mobile; CartPage `sticky top-24` → `lg:sticky lg:top-24` so summary doesn't stick under cart items on phones. **Footer** ([SiteFooter.tsx](src/components/layout/SiteFooter.tsx)) — nav grid 2→3→4→5 cols graduated; trust strip gap tightened. **Hero stats** ([Hero.tsx](src/features/home/Hero.tsx)) — gap tightened on mobile. **Product detail** ([ProductDetail.tsx](src/features/product/ProductDetail.tsx)) — grid stacks on `<lg`; thumbnails 4→5 cols. **Admin pages** — `p-6 lg:p-8` → `p-4 sm:p-6 lg:p-8` across AdminSettings/Categories/Products/ProductForm/Dashboard/Orders; AdminProducts header `flex-col sm:flex-row`; AdminDashboard stats grid `grid-cols-1 sm:grid-cols-3`; AdminCategories subcategory rows stack on mobile (header hidden on `<sm`). **Account stats** ([AccountPage.tsx](src/pages/account/AccountPage.tsx)) — `grid-cols-2 lg:grid-cols-4` on mobile. **TrackOrderPage** ([TrackOrderPage.tsx](src/pages/TrackOrderPage.tsx)) — 4-step progress: smaller font + tighter gap on mobile so labels don't overflow. Customizer was already mobile-aware (sidebars `hidden md:flex`, mobile bottom-sheets exist). `npx tsc --noEmit` — 0 errors. |
| 67 | **Fixed: caps (and any other single-zone product) couldn't be customized.** User reported that placing images and text on a cap had no effect, while t-shirts worked fine. Root cause: `DesignerCanvas` renders the printable area from `placement.printArea` percentages of `placement.mockupWidth/mockupHeight` (typically 1000×1000-ish), but [src/features/customizer/panels/LeftSidebar.tsx](src/features/customizer/panels/LeftSidebar.tsx) was positioning new image/text/shape layers from `view.area` pixel coordinates — a totally different coordinate space (cap view.area = `{x:172,y:101,w:147,h:89}` on a 1000×1000 reference, so layers landed in the top-left corner outside the visible cap front). T-shirts worked by coincidence because their `view.area` happens to roughly align with their `printArea`. Fix: extracted a `useActiveArea()` helper that mirrors the exact area-resolution logic from `DesignerCanvas` (placement-derived rect when available, fallback to `view.area`). All three panels (`UploadPanel`, `TextPanel`, `ShapesPanel`) now center new layers inside this resolved area. Also made shape size + text width adapt to small placements (`Math.min(200, area.width * 0.5)`, `Math.min(320, area.width * 0.8)`) so a 30%-wide cap front-panel doesn't get a default 200×200px square that overflows it. `npx tsc --noEmit` — 0 errors. |
| 66 | **Fixed: orders no longer reach RTDB.** Screenshot from `/order/track` showed two recent orders both rendering „Diese Bestellung wurde nicht gefunden“ — the customer-side tracked-ids list had them but RTDB did not. Root cause: P64 added `customDesigns[].uploadedImages?` and `customDesigns[].texts?` with the pattern `length > 0 ? value : undefined`, which means `set()` was called with an explicit `undefined` somewhere in the tree, and Firebase RTDB throws on any `undefined` value, aborting the whole write. Fix: routed [`saveOrderToFirestore`](src/lib/firestore.ts) through the existing `stripUndefined(JSON.parse(JSON.stringify(...)))` sanitiser before `set()`. Also tightened [src/pages/CheckoutPage.tsx](src/pages/CheckoutPage.tsx): the RTDB save is now `await`ed inside a try/catch; on failure the user gets an alert with the actual error and stays on the checkout page instead of being redirected to `/order/success` for an order that was never persisted. `npx tsc --noEmit` — 0 errors. |
| 65 | **Composed-PNG race fix + admin new-order notifications.** Screenshot showed a customer ordered front+back design but the front composed snapshot rendered as an empty placement outline while the raw uploaded image and the back view both came through correctly — and the admin received no signal at all that an order had landed. Root cause for the empty PNG: in [src/features/customizer/EmbeddedCustomizer.tsx](src/features/customizer/EmbeddedCustomizer.tsx) `onAddToCart` switched views and immediately called `stage.toDataURL()` after a single 2× `requestAnimationFrame` wait — but `<CanvasImageLayer>` uses `useImage(src)` which returns `null` for the first frame after mount, so newly-shown views exported with `<KImage image={undefined}>` placeholders. Fix: added `preloadImage(src)` helper that warms the browser/HTTP cache via `new Image()`; before the export loop every image-layer source is preloaded in parallel, and before each per-view export we wait **4** RAF ticks, re-prime the cache for that view's image sources, then wait one more RAF — by which point `useImage` has resolved and Konva has `batchDraw`n the bitmap. Notification side: added [src/store/adminNotifications.ts](src/store/adminNotifications.ts) (zustand + persist) that tracks `seenOrderIds` in localStorage so refreshes don't replay existing orders as new. In [src/pages/admin/AdminOrders.tsx](src/pages/admin/AdminOrders.tsx) the `subscribeToOrders` callback now seeds `seenOrderIds` on first snapshot, then on every subsequent snapshot detects ids not in `seenSet` and (a) plays an embedded short WAV chime via a hidden `<audio>` element, (b) shows a toast per new order with the customer name + total + item count, (c) fires a native `new Notification(...)` if `Notification.permission === "granted"`. Header now has a „Benachrichtigungen aktivieren“ button that calls `Notification.requestPermission()` (or shows „Blockiert“ with a `BellOff` icon if previously denied). `npx tsc --noEmit` — 0 errors. |
| 64 | **Originals + texts now persisted alongside the composed design.** Up to now `customDesigns[].imageUrl` only held the canvas snapshot (mockup + user layers rasterised at `pixelRatio: 2`) — fine for visual approval but lower resolution than the user's source file. Extended `CartItem.customDesigns` in [src/types/index.ts](src/types/index.ts) with two optional arrays per view: `uploadedImages: { url, fileName? }[]` (catbox URLs of the raw uploads, full quality) and `texts: { text, fontFamily, fontSize, fontStyle, fill }[]` (text content + styling). Updated [src/features/customizer/EmbeddedCustomizer.tsx](src/features/customizer/EmbeddedCustomizer.tsx) `onAddToCart`: after rendering the composed PNG for each edited view, it now loops the view's image layers and pipes each `data:` source through `uploadDataUrl` (same catbox + URL flow as the composed image, no re-compression), memoising by source so the same uploaded image placed on multiple views only costs one network round-trip; text layers are mapped straight to the new `texts` array. Updated [src/pages/admin/AdminOrders.tsx](src/pages/admin/AdminOrders.tsx) order details: the existing thumbnail grid now reads „Vorderseite · Vorschau“, a new „Original-Uploads (Druckqualität)“ grid links each raw catbox URL with a checkerboard background hint, and a „Texte“ list shows each text rendered in its own font/color/weight plus a metadata sidecar (font name · px). Updated [src/pages/account/OrdersPage.tsx](src/pages/account/OrdersPage.tsx) with the matching three-section layout for the customer. `npx tsc --noEmit` — 0 errors. |
| 63 | **Account orders page upgraded with live status + expandable details.** The screenshot showed `/account/orders` rendering only title + qty with a static „Eingegangen“ chip — because it read from the local `auth.orders` snapshot taken at checkout-time and never refreshed. Rewrote [src/pages/account/OrdersPage.tsx](src/pages/account/OrdersPage.tsx): new `useLiveOrder(local)` hook subscribes to `subscribeToOrder(id, cb)` and returns the freshest server-side copy (falls back to the local snapshot if RTDB hasn't responded yet). Each order is now an expandable `<OrderCard>` with chevron toggle. Closed state shows id (mono) + date + total + colored status badge using the same `STATUS_COLORS` map as the admin panel. Open state reveals: (a) Lieferadresse panel (fullName/street/zip/city/country), (b) Status panel with a „Status verfolgen“ link to `/order/track/<id>`, (c) per-item card with image + color/size variant + quantity × unit price + line total, (d) when `item.customDesigns` exists, a grid of clickable design thumbnails (open catbox URL in new tab). Page header now also has a „Bestellung verfolgen“ outline button on the right + a one-line hint that the status updates live. `npx tsc --noEmit` — 0 errors. |
| 62 | **Customer order tracking with persistent codes.** New page [src/pages/TrackOrderPage.tsx](src/pages/TrackOrderPage.tsx) at routes `/order/track` and `/order/track/:id`. User pastes a Bestellnummer → it's saved into a new persisted Zustand store [src/store/trackedOrders.ts](src/store/trackedOrders.ts) (`myicon-tracked-orders` localStorage key, dedup'd list of ids) so it stays available on every later visit without retyping. The page also auto-includes any orders the user placed on this device (`useAuthStore.orders`). Each card subscribes via the new `subscribeToOrder(id, cb)` in [src/lib/firestore.ts](src/lib/firestore.ts) (RTDB `onValue` on `orders/{id}`) — so when the admin flips status in [AdminOrders.tsx](src/pages/admin/AdminOrders.tsx) the customer's progress bar updates live. Visual progress bar with 4 stops (Eingegangen → In Bearbeitung → Versandt → Geliefert) using lucide icons and a brand-blue fill that animates from 0→100% based on `STATUS_INDEX`. Cancelled orders render a red „Storniert“ badge instead. Expandable card per order showing address, items (with thumbnails + price), and any `customDesigns` thumbnails linking to the catbox URL. Copy-to-clipboard button on each Bestellnummer. Trash icon removes a code from the local list (only visible for codes the user manually added; codes from `auth.orders` can't be removed). **Status alignment:** the `Order.status` union in `src/types/index.ts` previously used `"in_production"` which didn't match the admin's `"processing"` / `"cancelled"` constants — unified to `"pending" | "processing" | "shipped" | "delivered" | "cancelled"` so all three surfaces (admin dropdown, customer tracking, account orders list) agree. Fixed [src/pages/account/OrdersPage.tsx](src/pages/account/OrdersPage.tsx) `STATUS_LABELS` accordingly and replaced the inline cast in `AdminOrders.handleStatus` with `as Order["status"]`. **OrderSuccessPage**: now auto-adds the just-created `orderId` to `trackedOrders` on mount, replaced "Bestellungen ansehen" CTA with a primary "Bestellung verfolgen" link to `/order/track/<id>`, and added a hint linking to the tracking page in the Produktion-card. **Footer**: added "Bestellung verfolgen" link in the service column. `npx tsc --noEmit` — 0 errors. |
| 61 | **Fixed `QuotaExceededError` on `myicon-drafts`.** Pressing "In den Warenkorb" was crashing with `Setting the value of 'myicon-drafts' exceeded the quota` because `saveDraft` persisted `c.serialize()` into localStorage, and every uploaded image layer still carried its full `data:image/...;base64,...` source — a single 2-3 MB photo blows the ~5 MB localStorage cap immediately. Rewrote [src/store/drafts.ts](src/store/drafts.ts): (1) new `stripDataUrls(value)` recursively walks the serialized payload and replaces any string starting with `data:` with `""`; catbox URLs survive untouched. (2) `stripThumbnail()` drops base64 thumbnails (we always have a catbox URL from `customDesigns` for real orders anyway). (3) Custom Zustand `persist` storage adapter — `setItem` wraps `localStorage.setItem` in try/catch and on quota error pops drafts off the end one at a time until the write succeeds, falling back to `removeItem` if even an empty array won't fit. `getItem` swallows parse errors. Net effect: order flow no longer crashes, drafts list is self-trimming, and cart items still link to the full-quality catbox images via `customDesigns`. **User needs to run `localStorage.removeItem('myicon-drafts')` once in DevTools to clear the existing oversized entry**, then orders work. `npx tsc --noEmit` — 0 errors. |
| 60 | **Add-to-cart in the embedded customizer.** The screenshot the user shared showed the *embedded* designer (the one rendered inside the product page via [EmbeddedCustomizer.tsx](src/features/customizer/EmbeddedCustomizer.tsx)) which only had Speichern / Vorschau / Vollbild — no order button. Replicated the full P58/P59 add-to-cart pipeline inside `InlineToolbar`: new imports (`ShoppingCart`, `useCartStore`, `uploadDataUrl`), `adding` state, `hasEdits = c.layers.length > 0`, `nextFrame()` helper, and an `onAddToCart` that switches through each edited viewId, exports each view via `c.exportRef.current()`, uploads to catbox, builds `customDesigns[]`, restores the original view, then `saveDraft` + `addItem` + `openCart`. The new `<Button>` sits **directly after the Speichern button and before Vorschau**, rendered conditionally via `{hasEdits && (...)}` so it disappears whenever the canvas is empty. Same toast flow + "Wird hochgeladen…" label as fullscreen. `npx tsc --noEmit` — 0 errors. |
| 59 | **Gate the customizer order button behind actual edits.** In [CustomizerTopBar.tsx](src/features/customizer/panels/CustomizerTopBar.tsx) added `const hasEdits = c.layers.length > 0;` and wrapped the `<Button>` for "In den Warenkorb" in `{hasEdits && (...)}`. Also short-circuited `onAddToCart`: if `!hasEdits` it shows a `toast` ("Noch nichts bearbeitet — Fügen Sie ein Bild, einen Text oder eine Form hinzu, bevor Sie bestellen.") and returns. Effect: customer cannot place a customizer order with zero design content. Save and Vorschau buttons stay always visible. `npx tsc --noEmit` — 0 errors. |
| 58 | **End-to-end pipeline for customer-designed products.** Customer's customizer edits now flow all the way to the admin orders panel as proper hosted images. New helper `uploadDataUrl(dataUrl)` in `src/lib/storage.ts` reuses `dataUrlToBlob` + `uploadToCatbox` to push an already-rendered canvas PNG straight to catbox (skips the resize/compress step that `uploadImage` does for `File` uploads). Extended the `CartItem` type in `src/types/index.ts` with an optional `customDesigns: { viewId, viewLabel, imageUrl }[]` — only present when the user actually placed layers. In `CustomizerTopBar.tsx`, rewrote `onAddToCart` as an async function that: deselects any active layer, derives the set of edited views via `new Set(c.layers.map(l => l.viewId))`, then for each edited viewId calls `c.setViewId(vid)` → waits two `requestAnimationFrame` ticks (`nextFrame()` helper) so `DesignerCanvas` re-renders that view's layers → calls `c.exportRef.current()` to get the PNG dataURL → `uploadDataUrl()` pushes it to catbox → pushes `{viewId, viewLabel, imageUrl}` onto `customDesigns`. After the loop restores the original `viewId` + selection. Thumbnail picks `customDesigns` matching the original view, else first design, else live exportRef, else undefined. Calls `saveDraft` then `addItem({...item, customDesigns: customDesigns.length > 0 ? customDesigns : undefined})` — when length is 0 the field is undefined and `stripUndefined` in `saveOrderToFirestore` drops it from RTDB, so untouched products carry no design data. New `adding` state disables the button and switches its label to "Wird hochgeladen…" while uploads are in flight. Toast distinguishes "X bearbeitete Ansichten hochgeladen" vs "Standardprodukt". `labelFor(id)` resolves the German view label from `c.product.placements` first, then `c.product.views`. **Admin display:** rewrote the orders table in `src/pages/admin/AdminOrders.tsx` with an expandable row pattern — `expanded: Set<string>` state of orderIds, `toggleExpanded` flips membership, each row gets a `Fragment` wrapper so React can render a sibling details-row when open. The order ID cell is now a button with `ChevronRight`/`ChevronDown` from lucide. When expanded, a 5-column wide details row renders each item with image + variant + quantity-price; if `item.customDesigns` exists it renders a "Bearbeitete Druckbereiche (N)" grid of clickable thumbnails (each an `<a>` to the catbox URL with `target="_blank"`), and if it has `designId` but no `customDesigns` it shows "Keine bearbeiteten Druckbereiche." italic. Cart deduping by `(productId+color+size+designId)` already gives each customization its own row (since every `saveDraft` produces a unique draftId), so no collision worries. Checkout still uses the existing 1.2s fake PayPal delay — per user request, no real PayPal yet; `customDesigns` already flows transparently through `addOrder` → `saveOrderToFirestore` because the `stripUndefined` JSON round-trip from P38 preserves nested arrays/objects. `npx tsc --noEmit` → 0 errors. Test: open product → customize → add layers to front only → "In den Warenkorb" → checkout → admin/orders → expand row → see only the front design, no back image. |
| 57 | **One-shot RTDB → catbox migration script.** Added `scripts/migrate-base64-to-catbox.mjs` to clean up any inline base64 image blobs left in Firebase Realtime Database from before the P54 catbox switch. Flow: `GET /.json` to fetch the entire RTDB snapshot → generator `findBase64Images(node)` walks the JSON tree recursively yielding `{ path, value }` for every string starting with `data:image/` → for each hit, `decodeDataUrl` splits the MIME + base64 body and converts to a Node `Buffer`, `uploadToCatbox` POSTs a multipart form with `reqtype=fileupload` + a `Blob` wrapped around the buffer (Node 18+ has built-in `FormData`/`Blob`/`fetch` so no deps), and `writeField` PATCHes the resulting catbox URL back to the same path via RTDB REST. 250 ms delay between uploads to be polite. Picks the right extension from MIME (`png`/`webp`/`gif`/`svg`/`jpg`). Ran the script: **0 base64 fields found** — all image values in RTDB are already URLs (Unsplash + previously-uploaded catbox links), so the client is already loading short URLs and is as fast as it can be. The script stays in place as a safety net for any future blobs. Run with `node scripts/migrate-base64-to-catbox.mjs`. |
| 56 | **Replaced corsproxy.io with Vite dev-server proxy.** P55's `corsproxy.io` workaround returned `412 Precondition Failed` on multipart POSTs — most public CORS proxies don't support `multipart/form-data` forwarding properly. Switched to Vite's built-in `server.proxy`: added `/api/catbox-upload → https://catbox.moe/user/api.php` rewrite in `vite.config.ts` (`changeOrigin: true`, `secure: true`). The browser now POSTs to the same-origin path `/api/catbox-upload`, Vite forwards it server-side to catbox, and pipes the plain-text URL response back. No CORS involved because the browser only ever talks to localhost. Updated `CATBOX_ENDPOINT` in `src/lib/storage.ts` to the relative path with a comment block documenting the equivalent rewrite rules for Vercel (`vercel.json` `rewrites`) and Netlify (`netlify.toml` `[[redirects]]` with `force=true`) so production deployments can use the exact same client code. **Restart `npm run dev`** to pick up the new Vite proxy config — hot-reload doesn't catch `vite.config.ts` changes. TypeScript: 0 errors. |
| 55 | **Fixed CORS block on catbox uploads.** P54's direct browser POST to `https://catbox.moe/user/api.php` failed in dev (and would also fail in production) because catbox doesn't send `Access-Control-Allow-Origin` headers — every browser blocks the response. Wrapped the endpoint in `corsproxy.io` (`https://corsproxy.io/?<encoded-target>`), a free public CORS proxy that requires no signup, no API key, and forwards POST/multipart requests transparently. Single-line change in `src/lib/storage.ts` to the `CATBOX_ENDPOINT` constant. Catbox still does the actual hosting and returns the permanent `files.catbox.moe` URL; corsproxy just relays the HTTP response with proper CORS headers attached. If corsproxy.io ever rate-limits or goes down, the comment above the constant suggests `https://api.allorigins.win/raw?url=` as a drop-in alternative. TypeScript: 0 errors. |
| 54 | **Swapped imgbb → catbox.moe for image hosting.** User wanted a host with zero strings attached. catbox.moe fits: no account, no API key, no signup, no monthly cap, no expiry, 200 MB per file. Rewrote `src/lib/storage.ts`: removed `VITE_IMGBB_API_KEY` plumbing, removed the base64-fallback branch (always uses remote now). New helper `dataUrlToBlob()` converts the compressed canvas output into a `Blob`, and `uploadToCatbox()` POSTs it as multipart/form-data to `https://catbox.moe/user/api.php` with `reqtype=fileupload` + `fileToUpload`. catbox responds with the bare URL (`https://files.catbox.moe/<id>.<ext>`) as plain text — we trim and return it. `extForMime()` picks the right extension (webp / png / gif / jpg) so the URL stays semantically correct. `isRemoteUploadEnabled()` now always returns `true`. Deleted `.env.example` (no env var needed). `ImageUploader.tsx` unchanged — still shows "Wird hochgeladen…" / "Hochgeladen" since `isRemoteUploadEnabled()` is true. RTDB stores tiny URLs instead of multi-MB base64 blobs, so admin lists and product reads are much faster. TypeScript: 0 errors. Works out of the box — nothing to configure. |
| 53 | **Free + unlimited admin image hosting via imgbb.** Previously every admin upload was compressed to base64 and stored inline in Realtime Database — fine for a handful of images, but with many products/categories/content sections the RTDB nodes ballooned to multi-MB JSON blobs that slowed every list read and every admin page-load. Switched `src/lib/storage.ts` to upload to **imgbb** (`https://api.imgbb.com/`) — free, no monthly limit, no expiry, returns a permanent CDN URL on `i.ibb.co`. New flow: (1) browser still compresses (now 1 600 px / 1.5 MB budget since we're no longer cramming into a DB cell), (2) strip the `data:` prefix, (3) `POST` the base64 body to `https://api.imgbb.com/1/upload?key=<KEY>` with `FormData`, (4) read `data.display_url` from the JSON response and return it. RTDB now stores only short URLs — product/category list reads are much faster. API key read from `VITE_IMGBB_API_KEY` (added to `.env.example` with setup instructions). New `isRemoteUploadEnabled()` helper. If the key is absent the code falls back to inline base64 (legacy behaviour) so the app still works out of the box. `ImageUploader.tsx` switched from `compressImageToDataUrl` to `uploadImage`, shows "Wird hochgeladen…" / "Hochgeladen" when remote upload is active vs. "Wird komprimiert…" / "Komprimiert: N KB" otherwise. `deleteImage` stays a no-op (imgbb keeps orphaned images for free). TypeScript: 0 errors. To activate: create a free imgbb account → https://api.imgbb.com/ → "Get API key" → paste into `.env` as `VITE_IMGBB_API_KEY=...` → restart dev server. |
| 52 | **Darkened pure-white target to recover fabric folds.** Selecting Weiß (#FFFFFF) made the recoloured garment a flat white blob — the highlight band already blends toward white, so a pure-white target leaves no contrast for the eye to read folds against the page. Added a `MAX_TARGET = 232` clamp inside `useGreenScreenRecolor` (`DesignerCanvas.tsx`) applied per-channel after hex parsing: any channel above 232 is capped at 232. Effect: white garment now renders at ~#E8E8E8 base with shadow folds going down to mid-greys, so the hoodie silhouette is clearly visible against the surface-alt backdrop. UI swatch in the colour picker stays `#FFFFFF` (unchanged in `mock-data/products.ts`) so the customer still sees a pure-white pill. Other colours (red, navy, etc.) are well below 232 so they are unaffected. TypeScript: 0 errors. |
| 51 | **Shadow/highlight split for dark colours.** P50's pure-multiply formula `out = target × (g/255)` worked for bright colours but flattened black and navy: `0 × anything = 0`, so a black hoodie showed zero fabric fold detail. Real fabric reflects highlights regardless of base colour. Rewrote `useGreenScreenRecolor` in `DesignerCanvas.tsx` to split the green-channel luminance L at `MIDPOINT = 0.62`: if `L ≤ midpoint` → shadow band `out = target × (L/midpoint)` (darken toward black); if `L > midpoint` → highlight band `out = target + (255 - target) × t × HIGHLIGHT_STRENGTH` where `t = (L - midpoint) / (1 - midpoint)` and `HIGHLIGHT_STRENGTH = 0.55` (blend toward white). At `L = midpoint` the output is exactly the target colour. Effect: pure black target (`#000000`) now shows visible grey highlights on shoulders, sleeves and hood where light catches the fabric, while deep folds stay near-black; navy, marine, red, grey all keep their hue but gain proper highlight rolloff and shadow depth. Inlined Math.round/Math.min via `| 0` and `< 60` branch for ~15% faster per-pixel loop. TypeScript: 0 errors. |
| 50 | **Green-screen recolor pipeline (replaces P46–P49 three-pass system).** User reshot/edited all garment mockups so the product is rendered in pure green `#00FF00` on a white background; the green channel encodes fabric fold luminance (highlights ≈ `(0,255,0)`, mid-tones `(0,180,0)`, deep folds `(0,80,0)`). Rewrote recolor in `DesignerCanvas.tsx`: new hook `useGreenScreenRecolor(src, targetHex)` loads the photo, reads pixel data on an offscreen canvas, and for each pixel computes `greenness = g - max(r,b)`. If `greenness ≤ 0` → non-garment pixel (white bg, labels, drawstrings) → alpha 0. Otherwise: `alpha = min(1, greenness/60)` (smooth anti-aliased silhouette edge), `L = g/255` (fold luminance), and `rgb_out = targetColor × L`. Returns a single recoloured `HTMLImageElement`. `MockupImage` simplified to one prop `targetHex?` driving the hook. Render block reduced from a 3-pass source-atop + multiply pipeline to two `KLayer`s (grey backdrop + recoloured mockup). `tintEnabled` removed — white now recolours cleanly too (out = `white × L`, so the garment becomes white with folds preserved). Black, marine, red, grey, white all show correct hue with full fabric shadow detail. CORS-tainted canvases fall back to the raw image. TypeScript: 0 errors. |
| 49 | **Fold/shadow contrast on recolored garment.** After P48, source-atop correctly clipped the recolor to the garment silhouette, but the multiply pass at `opacity=0.6` was too weak — picking red gave a uniformly bright red hoodie with shadows barely visible. Math: `out = solid_color * (1-X) + (solid_color * garment/255) * X`; at X=0.6, a shadow pixel of 180/255 only darkens the result by ~18%. Bumped multiply opacity 0.6→1.0 in `DesignerCanvas.tsx`. Now `out = solid_color * garment/255` (pure multiply): white garment pixels stay full color, mid-shadow (180) becomes 71%, deep shadow (100) becomes 39% — fabric folds appear at full natural strength on every palette color. TypeScript: 0 errors. |
| 48 | **Fixed P47 recolor still painting the whole canvas black.** Root cause: the `<Rect fill="#F5F6F8">` backdrop was rendered in the same `KLayer` as the garment, making the entire layer canvas opaque — so `globalCompositeOperation="source-atop"` on the color rect painted over every pixel, not just the garment silhouette. Fix in `DesignerCanvas.tsx`: split into two `KLayer`s. Layer 1 holds only the grey backdrop rect. Layer 2 starts with a transparent canvas, draws the white-background-stripped garment via `transparentBg`, then `source-atop` clips the color rect exactly to the garment shape, then the garment is redrawn with `globalCompositeOperation="multiply"` at `opacity=0.6` to re-introduce fabric folds. Konva composes each Layer independently, so the source-atop on Layer 2 now only sees the garment pixels. All palette colors (black, marine, red, grey, white) now show correctly with visible fold shadows; backdrop stays clean grey. TypeScript: 0 errors. |
| 47 | **Garment recolor now masks to the garment shape only — photo background stays clean.** Problem: with white-base photos, the P46 single-pass multiply rect tinted the *entire* canvas including the photo's white backdrop — picking black turned the whole image black. Fix in `DesignerCanvas.tsx`: (1) new hook `useTransparentBgImage(src)` loads the photo, reads pixel data on an offscreen canvas, sets alpha to 0 for pixels with `min(r,g,b) ≥ 245` and softens the edge between 225 and 245 for anti-aliasing; returns a new `HTMLImageElement` with transparent background (cached, falls back to the raw image if the canvas is CORS-tainted). (2) `MockupImage` accepts new `transparentBg` prop. (3) Recolor pipeline rewritten as three passes when `tintEnabled`: draw transparent-bg garment → paint target color with `globalCompositeOperation="source-atop"` (paints only over already-opaque pixels = the garment silhouette) → redraw transparent-bg garment with `multiply` at opacity 0.55 to restore fold shadows. When no tint (Weiß or no palette), the original opaque photo is shown unchanged. Works correctly for all palette colors including pure black; photo backdrop is never affected. TypeScript: 0 errors. |
| 46 | **Garment recolor switched to single-pass multiply on WHITE base photos.** User swapped t-shirt / hoodie / cap base photos from black to white. The old P39+P40 lighten+multiply pipeline was tuned for black-base photos and broke on white: `lighten(white_photo, anyColor)` = white (max per channel keeps the brighter white photo unchanged), so colors had no effect. Solution in `DesignerCanvas.tsx`: replaced the two-pass operation with a single `<Rect globalCompositeOperation="multiply">` over the white photo. Math: `multiply(color, white_bg) = color` (garment fully recolored), `multiply(color, fold_grey) = darker_color` (fabric folds preserved naturally without a second pass). Updated the `tintEnabled` skip condition: was `luminance > 25` (skip near-black, because black-on-black is a no-op); now `!(r,g,b all ≥ 245)` (skip near-white, because white multiply is a no-op). Black (#111111) now correctly multiplies to near-black; white (#FFFFFF) is bypassed as a no-op. Removed the second `MockupImage` multiply redraw and the `opacity=0.55` blend. `MockupImage` still forwards `opacity`/`globalCompositeOperation` props (kept for future reuse). TypeScript: 0 errors. |
| 45 | **Removed Firebase Storage entirely; maximum-optimized base64 in RTDB.** `src/lib/firebase.ts`: removed `getStorage`/`storage` export, kept `getAuth`/`auth` for customer email-login. `src/store/admin.ts`: removed `signInAnonymously`/`signOut` calls (admin is code-gate only). `src/lib/storage.ts`: completely rewritten — no `firebase/storage` imports. `compressImageToDataUrl()` downscales to ≤1 200 px, prefers WebP (`image/webp`), falls back to JPEG; adaptive quality loop 0.88→0.40 (step −0.08) until base64 length ≤ 500 KB; PNG with alpha stays lossless PNG. `uploadImage()` shims over `compressImageToDataUrl`. `deleteImage()` is a no-op. `ImageUploader.tsx`: import switched to `compressImageToDataUrl`, Firebase error-code extraction removed, loading text "Wird komprimiert…", success shows "Komprimiert: N KB". TypeScript: 0 errors. |
| 44 | **Fixed Firebase Storage upload failure (deep fix).** Root cause confirmed: Firebase Storage rules were blocking all uploads because (a) Anonymous Authentication was likely not enabled in the Firebase Console, causing silent `signInAnonymously()` failure, and (b) even with the P43 fix the auth was not guaranteed at upload time. Three-layer fix: (1) `storage.rules` created with `allow write: if true` for all admin paths (`/uploads/`, `/products/`, `/content/`, `/mockups/`) so uploads work regardless of auth state; (2) `firebase.json` created pointing to `storage.rules`; (3) `src/lib/storage.ts` updated to call `signInAnonymously(auth)` inside `uploadImage()` itself if `auth.currentUser` is null (defense in depth, silently continues if anonymous auth is disabled); (4) `src/components/admin/ImageUploader.tsx` updated to show the actual Firebase error code+message instead of a generic string (e.g. `[storage/unauthorized]`). To activate the open rules: run `npx firebase login` then `npx firebase deploy --only storage --project wlab-40444` (firebase-tools@15.18.0 installed as devDep). TypeScript: 0 errors. |
| 43 | **Fixed Firebase Storage upload failure in admin panel.** Root cause: Firebase Storage rules require authentication (`request.auth != null`), but the admin code-gate never signed into Firebase Auth — `auth.currentUser` was always `null`, so every `uploadBytes()` call was rejected with a permission error. Fix: `src/store/admin.ts` now calls `signInAnonymously(auth)` immediately after the code gate passes (inside `unlock`), and also re-signs-in during `onRehydrateStorage` if the session was already active but `auth.currentUser` is null (covers page reloads). `lock()` now also calls `signOut(auth)`. `signInAnonymously`/`signOut` imported from `firebase/auth`. TypeScript: 0 errors. |
| 42 | **Seeded EN product translations into Firebase RTDB.** Created `scripts/seed-product-translations.mjs` (Node 18+ REST API script, mirrors `seed-categories.mjs` style). Issues HTTP PATCH against `products/{id}.json` for each of the 11 products so only the 4 translation fields (`titleEn`, `descriptionEn`, `highlightsEn`, `badgeEn`) are written — placements, price, gallery and any admin edits stay intact. Translations cover: Premium T-Shirt → Premium T-Shirt — Organic Cotton; Polo → Classic Polo Shirt; Hoodie → Premium Hoodie with Hood; Cap → Snapback Cap — embroiderable; A5 Flyer; Standard Business Card; A3 Poster — High-Gloss; A5 Brochure with Saddle Stitching; Organic Cotton Tote Bag; Mousepad with Full-Surface Print; Umbrella with Logo Print. Badges translated: Bestseller → Bestseller, Neu → New. Highlights fully translated per product. Run: `node scripts/seed-product-translations.mjs`. Result: 11 updated, 0 failed. |
| 41 | **Black cap photo wired in with color recoloring.** Added `public/mockups/cap/cap.png` (490×405, real black snapback on white background). Updated `p_cap` in `mock-data/products.ts`: placement `mockup`/`mockupWidth`/`mockupHeight` switched to the new photo with `printArea: { leftPct: 35, topPct: 25, widthPct: 30, heightPct: 22 }` landing on the front crown panel above the brim. Replaced legacy `views[0].image`, `image`, and `gallery[0]` Unsplash URLs with the local photo too. No `DesignerCanvas.tsx` changes needed — the P39/P40 lighten+multiply recolor pipeline is product-agnostic: it activates for any product whose `colors` array contains the selected color name, so Marine and Weiß now recolor the cap with fabric shadow detail preserved, while Schwarz still bypasses the overlay. TypeScript: 0 errors. Asset inventory in §14 updated. |
| 40 | **Brought back fabric shadows on recolored t-shirts.** P39's single-pass `lighten` overlay flattened every fold because all dark-shirt pixels are below any bright color channel (max collapses them to a flat color). Two-pass solution in `DesignerCanvas.tsx`: (1) flatten shirt to color via `lighten` rect (unchanged); (2) redraw the photo on top with `globalCompositeOperation="multiply"` and `opacity=0.55`. Multiply by the white photo background = 1 (background untouched); multiply by darker shirt pixels = proportionally darker color (creases/folds re-emerge). Generalized `MockupImage` to forward optional `opacity` + `globalCompositeOperation` props so the second pass reuses the same component. Works on red, marine, grey, white — and the black option still bypasses both passes so the original shadow detail is preserved exactly. TypeScript: 0 errors. |
| 39 | **T-shirt color is now changeable in the designer.** Source mockup is a real BLACK t-shirt photo, so naive multiply/tint doesn't work (black absorbs everything). Solution in `DesignerCanvas.tsx`: after the mockup `KImage`, render a colored `Rect` over the full mockup with `globalCompositeOperation="lighten"`. The lighten operator takes `max` per channel, which means: (a) black shirt pixels become the target color; (b) the clean white background stays white because white is already the max; (c) lighter fabric folds are preserved (any pixel already brighter than the color survives unchanged). Resolved `productColor` (name string from context) to hex via `product.colors` lookup. Skip the overlay when luminance is ≤25 (the "Schwarz" #111111 option) so the original photo's shadow detail stays intact. Composite stays inside the mockup `KLayer`, so design layers in subsequent layers are unaffected. TypeScript: 0 errors. |
| 38 | **Fixed Firebase RTDB crash on product save.** Error: `set failed: value argument contains undefined in property 'products.p_tshirt_classic.titleEn'`. Root cause: optional fields (`titleEn`, `descriptionEn`, `badge`, `badgeEn`, `subcategory`, etc.) were set to `|| undefined` in the form's `onSubmit`, and Firebase RTDB refuses `undefined` values entirely. Fix: added `stripUndefined<T>(obj: T): T` helper in `lib/firestore.ts` that does `JSON.parse(JSON.stringify(obj))` (JSON round-trip removes all `undefined` properties) and applied it to both `set()` calls in `saveProduct`. |
| 37 | **Fixed ImageUploader rejecting relative paths.** The admin placements editor URL field used `<input type="url">`, triggering native HTML5 validation that requires absolute URLs. Pasting `/mockups/tshirt/side.png` showed a “Please enter a URL” tooltip and refused to submit. Changed `src/components/admin/ImageUploader.tsx` to `type="text"` with placeholder `https://... oder /mockups/...`. Both absolute URLs and workspace-relative paths now work. |
| 36 | **Fixed grey t-shirt bug in customizer.** Real black-tee photo was rendering as washed-out grey because `DesignerCanvas.tsx` painted a translucent `Rect` (opacity 0.15, filled with the selected product color, defaulting to `#FFFFFF`) on top of every apparel mockup. That overlay made sense when mockups were white SVG silhouettes that needed tinting — with real photos it just desaturates the photo. Removed the entire tint `Rect` and stopped destructuring `productColor` from the context (no longer used in the canvas). Future per-color rendering should use separate photos per color (e.g. `tshirt/front-black.png`, `tshirt/front-white.png`) rather than overlay tinting. TypeScript: 0 errors. |
| 35 | **Real product photos replace all styled SVG silhouettes.** User feedback: “there is no need for any styles, the t-shirts are just real t-shirts without any style or illustration”. Added `public/mockups/tshirt/front.png` (912×834), `back.png` (840×848), `side.png` (1311×1200). Updated `p_tshirt_classic` (front, back, chest_left, sleeve_left, sleeve_right — sleeve_right reuses side.png for now), `p_polo_classic` (front, chest_left, sleeve_left), and `p_hoodie` (front, back) to point at the new photos with `mockupWidth`/`mockupHeight` matching real pixel dimensions and freshly-tuned `printArea` percentages that land on the printable chest/back/sleeve regions of the actual garment. Reverted `p_cap` to its prior Unsplash photo (no real cap photo available yet). Deleted unused SVGs: `tshirt-front.svg`, `tshirt-back.svg`, `tshirt-chest.svg`, `tshirt-sleeve-left.svg`, `tshirt-sleeve-right.svg`, `cap-front.svg`. Rewrote §14 of PROJECT.md from “Mockup Style Guide” to “Mockup Assets (REAL PHOTOS — no illustrations)” — the codified rule is now: one folder per product type under `public/mockups/`, files named after the view, dimensions stored in `mockupWidth`/`mockupHeight`, never create a styled SVG silhouette as a mockup. Asset inventory table added. TypeScript: 0 errors. |
| 34 | **Mockup Style Guide + cap mockup.** Added §14 *Mockup Style Guide* to PROJECT.md so every future SVG follows the same visual language (white fill `#ffffff`, stroke `#cdd2da` 3px on silhouette / 2px on details, shared diagonal `linearGradient #shade` 0→0.08, no text labels, no dashes, no background rect, viewBox 1000×1000 or 1000×1200, subject centered). Created `public/mockups/cap-front.svg` (snapback cap silhouette: rounded crown + curved visor brim + center seam + top button) in that exact style. Updated `p_cap` in `mock-data/products.ts` to use `/mockups/cap-front.svg` (replaces Unsplash photo) with a usable front-panel `printArea: { leftPct: 28, topPct: 30, widthPct: 44, heightPct: 26 }`. TypeScript: 0 errors. |
| 1 | Initial Next.js 15 scaffold — all components, stores, pages, customizer, mock data (entire app) |
| 3 | Created `.github/copilot-instructions.md` — enforces that Copilot reads PROJECT.md at the start of every session and updates it at the end. This makes PROJECT.md truly persistent across all future sessions. |
| 4 | Full Firebase integration: installed firebase SDK, created lib/firebase.ts, lib/firestore.ts, lib/storage.ts, types/content.ts, hooks (useProducts, useCategories, useSiteContent), updated auth store to Firebase Auth, created admin Zustand store (sessionStorage), updated all pages/components to use Firestore hooks, created full /admin panel with code gate (AdminLayout), AdminDashboard, AdminProducts, AdminProductForm (product CRUD), AdminOrders (order management), AdminContent (site content editor), AdminSettings (admin code change). |
| 5 | Fixed TypeScript errors: removed duplicate App.tsx block, changed useSiteContent constraint to `T extends object`, changed updateSiteContent param to `object`, cast AdminOrders status, cast AdminProductForm category+type, cast saveProduct call to `any`. TypeScript now clean (`tsc --noEmit` passes). |
| 7 | Full bilingual DE/EN system: language store, translations, useT hook, LanguageSwitcher, locale-aware Firestore writes, AdminContent DE/EN editor tabs, SiteHeader and SiteFooter translated. |
| 8 | Fixed missing `"footer.contact"` TranslationKey in `src/i18n/translations.ts` (both DE and EN) — was causing TypeScript error that prevented AdminContent from compiling. |
| 9 | Extended Firebase content coverage to all client-facing text. New content types: TrustStripContent, HomeCategoriesContent, HomeBestsellersContent, LegalPageContent, ImprintContent (with DE+EN defaults). Updated: TrustStrip.tsx, CategoryGrid.tsx, Bestsellers.tsx, TermsPage.tsx, PrivacyPage.tsx, ImprintPage.tsx to use useSiteContent. AdminContent expanded from 6 to 10 tabs (added: Startseite [Trust strip + Categories + Bestsellers], AGB, Datenschutz, Impressum). All sections editable per locale in admin. |
| 7 | Full bilingual DE/EN system: created `src/store/language.ts` (Zustand+localStorage), `src/i18n/translations.ts` (all static strings in DE+EN), `src/hooks/useT.ts`, `src/components/ui/LanguageSwitcher.tsx`. Added English content defaults (`DEFAULT_*_EN`) to `src/types/content.ts`. Updated `src/hooks/useSiteContent.ts` to read locale from store. Updated `src/lib/firestore.ts`: `updateSiteContent` now 3-param `(sectionId, locale, data)`, added `getSiteContentLocale`. Rewrote `src/pages/admin/AdminContent.tsx` with 🇩🇪/🇬🇧 locale tabs per editor. Updated `SiteHeader.tsx` (LanguageSwitcher + useT) and `SiteFooter.tsx` (useT for all static strings). |
| 10 | Migrated entire data layer from Firestore to Firebase Realtime Database. `src/lib/firebase.ts`: replaced `getFirestore` → `getDatabase`, export renamed from `db` → `rtdb`. `src/lib/firestore.ts`: completely rewritten using `firebase/database` (ref, get, set, update, remove, push, onValue). RTDB paths: `products/{id}`, `categories/{slug}`, `orders/{id}`, `adminConfig/settings/code`, `siteContent/{sectionId}/{locale}`. All exported function signatures preserved; no changes to any consumer file. TypeScript clean. |
| 11 | Admin UI fully bilingual. Added ~100 `admin.*` keys to `src/i18n/translations.ts` (both DE and EN). Updated `AdminLayout.tsx` (CodeGate + sidebar nav), `AdminContent.tsx` (all 10 editor components), `AdminDashboard.tsx` (stats, status labels, recent orders), `AdminOrders.tsx` (table headers, status dropdown), `AdminSettings.tsx` (form labels, Zod messages, toast). All hardcoded German strings replaced with `useT()` calls. TypeScript clean. |
| 12 | Fixed admin language switching. Root cause: `editingLocale` in AdminContent was a local `useState` disconnected from the language store, so clicking DE/EN never triggered `useT()` to re-render. Fix: replaced with `useLanguageStore()` so the locale buttons now drive the entire admin UI language. Fixed HeroEditor 8 hardcoded German field labels (Badge-Text, Highlight, Titel, Untertitel, CTA fields, Hero-Bild) replaced with `t()`. Added `LanguageSwitcher` component to admin sidebar in AdminLayout so language can be switched from any admin page. |
| 13 | Live preview in AdminContent. Created `src/components/admin/PreviewContext.tsx` (PreviewProvider + usePreview + PreviewEl). Created `src/components/admin/PreviewComponents.tsx` (HeroPreview, HowItWorksPreview, CTAPreview, AboutPreview, FAQPreview, ContactPreview, TrustStripPreview, HomeCategoriesPreview, HomeBestsellersPreview, LegalPreview, ImprintPreview). Rewrote AdminContent with split-pane layout (SplitLayout): left = form, right = live preview. Every editor passes `watch()` to its preview so it updates in real time. Every editable preview element is wrapped in `<PreviewEl fieldId="...">` — clicking scrolls+focuses the matching `[data-field-id]` input in the form. |
| 14 | Fixed preview completeness and Firebase coverage. Hero had hardcoded stats row (2 Mio.+, 24 h, 4.9 ★) and floating promo card (Tiefpreis-Garantie) not connected to Firebase. Added `HeroStat`, `HeroPromoCard` types + `stats`/`promoCard` fields to `HeroContent`. Updated `DEFAULT_HERO` + `DEFAULT_HERO_EN` with real defaults. Updated `Hero.tsx` to read from content instead of hardcoding. Updated `HeroPreview` to show stats row + floating card with click-to-field links. Added stats + promoCard form fields to `HeroEditor`. Fixed `ABOUT_ICON_MAP` in PreviewComponents — `Leaf`/`Users` were mapped to `Award`; now use real Lucide imports. Added 8 new translation keys (stats, value, promoCard, promoCardTag/Title/Text) in both DE + EN. |
| 33 | **Restyled close-up mockups to match `tshirt-front.svg`.** The first version of the chest and sleeve close-ups used a different visual language (radial/linear gradient fabric with explicit label text), which made the chest close-up look like a second, smaller t-shirt sitting in front of the real one and the sleeves look unrelated to the rest of the catalogue. Rewrote all three SVGs (`tshirt-chest.svg`, `tshirt-sleeve-left.svg`, `tshirt-sleeve-right.svg`) using exactly the same style tokens as `tshirt-front.svg`: white fill, `#cdd2da` stroke at 3px with rounded joins, and a faint diagonal black-to-transparent shade overlay (`linearGradient #shade`, 0–8% opacity). Removed all label text. Chest close-up is now the upper portion of the same t-shirt silhouette scaled ≈1.4× and shifted up so collar + both shoulders + chest area fill the 1000×1000 canvas and the hem runs off the bottom edge — reads clearly as “zoomed-in front”, not as a separate object. Sleeves are clean tapered tube silhouettes (wider shoulder, narrower cuff, single thin cuff-hem stroke) mirrored between left and right. TypeScript: 0 errors. |
| 32 | **Per-placement close-up mockups (Printful/Spreadshirt-style) so sleeves & chest are actually editable.** Problem: the chest_left and (formerly missing) sleeve placements pointed at the full-body t-shirt SVG, leaving the user with a tiny 12% × 12% print rectangle on a huge mockup — impossible to design in. Research: Printful, Printify and Spreadshirt all solve this by giving each placement its own dedicated mockup image (close-up of just the sleeve, just the chest, etc.) so the print area fills most of the canvas regardless of how small the *physical* area is. **New mockups in `public/mockups/`:** `tshirt-sleeve-left.svg` (1000×1000, mirrored tapered tube with cuff hem and shoulder seam, light-to-shadow gradient), `tshirt-sleeve-right.svg` (mirrored version), `tshirt-chest.svg` (close-up of upper t-shirt body: neckline + both shoulders + chest area with crew neckline cutout and subtle center seam). **`mock-data/products.ts`:** Updated `p_tshirt_classic` placements — `chest_left` now uses `tshirt-chest.svg` with `printArea: { leftPct: 18, topPct: 30, widthPct: 30, heightPct: 30 }` (a usable 30%×30% rectangle on the wearer’s left chest area in the close-up view). Added new `sleeve_left` placement (key `sleeve_left`, mockup `tshirt-sleeve-left.svg`, printArea `{leftPct:30, topPct:32, widthPct:42, heightPct:30}` = 42%×30% of sleeve close-up, physical 90×60 mm, +€2.90, safe 6%) and `sleeve_right` (mirrored, mockup `tshirt-sleeve-right.svg`). Updated `p_polo_classic` chest_left to use `tshirt-chest.svg` and added sleeve_left placement. Physical mm sizes kept realistic (sleeve 90×60 mm, chest pocket 80×80/100×100 mm). All placements still flow through the `PrintPlacement` system (DPI badge, safe zone, bleed, surcharge). RightSidebar view switcher already iterates `product.placements`, so the new sleeve tabs appear automatically. TypeScript: 0 errors. |
| 31 | **Fixed broken image selection + added per-layer dashed outlines.** Bug: after adding a second image/text, clicking the first did nothing — you could never reselect it. Root cause: `CanvasImageLayer` had hardcoded props and was passed only `{ layer }`, *not* the `common` props bundle (`onClick`/`onTap`/`onDragMove`/`onDragEnd`/`onTransformEnd`/`draggable`). So images were rendered without any event handlers — only the Konva Transformer’s implicit drag (active only while *currently* selected) worked. Fix: `CanvasImageLayer` now accepts `common` and spreads it onto `<KImage>`; render site updated to pass `common={common}`. Also added a new dedicated Konva `KLayer` that renders a faint dashed blue Rect (or Circle for circle layers) around every *unselected* layer with `stroke: #1E5AA8`, `dash: [5,4]`, `opacity: 0.4`. Selected layers are skipped (the bold transformer border replaces the dash). This gives the InDesign/Canva-style “frame guides” look so users can always see where every editable element lives even when nothing is selected. TypeScript: 0 errors. |
| 30 | **Canva-style designer interactions.** `DesignerCanvas.tsx`: Transformer handles enlarged (`anchorSize: 8→14`, `anchorStrokeWidth: 2`, `anchorCornerRadius: 7`, `borderStrokeWidth: 2` solid blue) and rotate handle pushed further out (`rotateAnchorOffset: 28→36`) so resize/rotate grips are clearly visible. Added a floating Canva-style action toolbar: when a layer is selected, a pill-shaped DOM toolbar appears above the bounding box with buttons for `Nach vorne` / `Nach hinten` / `Duplizieren` / `Sperren↔Entsperren` / `Löschen` (red on hover). Toolbar position computed from `node.getClientRect({relativeTo: stage})` × `stageScale` and re-derived on Konva `dragmove`/`transform`/`transformend`/`dragend` events for live tracking. Lock toggle uses Lucide `Lock`/`Unlock` and writes `{ locked }` via `updateLayer`. `LeftSidebar.tsx` LayersPanel redesigned: per-row icon tile (filled brand color when selected), two-line label (name + type), always-visible row, hover-revealed action cluster with 6 buttons (`ChevronsUp`/`ChevronUp`/`ChevronDown`/`ChevronsDown` for z-order to front/forward/back/to-back, `Copy`, `Trash2` with red hover), separate lock toggle that’s persistent when locked. Added empty-state card with dashed border. Layer count badge in header. TypeScript: 0 errors. |
| 29 | **Fixed designer canvas showing product photo instead of SVG mockup.** Root cause: `ProductPage.tsx` uses `useProducts()` which subscribes to Firebase RTDB. Firebase was seeded from an older version of the mock data — products in Firebase had `views[].image` pointing to Unsplash photo URLs, not SVG paths, and no `placements[]`. Since Firebase had data (non-null), the fallback-to-mock never triggered. Fix: rewrote `subscribeToProducts` in `lib/firestore.ts` to merge each Firebase product with its local mock counterpart — `views` and `zones` always come from local mock (ensuring SVG paths), and `placements` comes from Firebase if the admin has saved them there, otherwise from local mock. Firebase still wins on all admin-editable fields (price, description, title, etc.). TypeScript: 0 errors. |
| 28 | **Mockup images wired into designer canvas from placements.** `products.ts`: added full `placements[]` to p_tshirt_classic (front + back + chest_left), p_polo_classic (front + chest_left), p_hoodie (front + back), p_cap (front). T-shirt and hoodie placements use `/mockups/tshirt-front.svg` + `/mockups/tshirt-back.svg` (1000×1200 SVGs) so the canvas shows a clean white t-shirt shape. Cap keeps its Unsplash photo as `mockup`. Also updated `views[]` in all four products to reference the SVG images. `DesignerCanvas.tsx`: complete upgrade — (1) `activePlacement = product.placements?.find(p.id === viewId)` drives all canvas geometry; (2) `refW`/`refH` from `placement.mockupWidth`/`mockupHeight` (1000×1200 for t-shirts, 1000×1000 fallback); (3) `stageSize` now `useMemo` derived from `containerSize` (ResizeObserver) × `refW`/`refH` so switching between square and tall views resizes the stage instantly; (4) `MockupImage` takes explicit `width`/`height` props so SVG fills the stage exactly; (5) `area` computed from `placement.printArea` percentages × `refW`/`refH` (or falls back to `view.area`); (6) safe-zone inset = `safePct/100 × area.width/height` — rendered as green dashed rect inside print area; (7) bleed outset = `bleedPct/100 × area.width/height` (or fixed 10px legacy) — rendered as red dashed rect; (8) snapping guide lines scaled to `refW`/`refH`. `CustomizerContext.tsx`: `viewId` initializes to `product.placements?.[0]?.id ?? product.views[0].id`. `RightSidebar.tsx` ViewSwitcher: iterates `product.placements` when present, falling back to `product.views`, so placement tabs (Vorderseite, Rückseite, Brust links) show correctly. TypeScript: 0 errors. |
| 27 | **Customizer embedded inside product detail page.** Previously, "Jetzt gestalten" on the product page navigated away to a fullscreen `/products/:slug/customize` route, losing all context (selected color/size/qty, Druckbereiche list, spec tabs). New: created `src/features/customizer/EmbeddedCustomizer.tsx` — a flow-layout variant of the customizer (no `position: fixed`, no body scroll lock, no full top bar) that renders `CustomizerProvider` + `LeftSidebar` + lazy-loaded `DesignerCanvas` + `RightSidebar` + `ZoomControls` inside a constrained-height (`min(75vh, 720px)`) rounded card. Inline toolbar above the canvas with title, view label, Undo/Redo (disabled when canUndo/canRedo false), Save, Vorschau (preview window), and a Vollbild button that links to the existing `/customize` route. Mobile sheets reworked from `fixed` to `absolute` inside the canvas container. **`ProductDetail.tsx`**: removed `<Link to="/products/.../customize">` wrapper around the primary CTA — now a plain `<Button onClick={openDesigner}>` that toggles a `designerOpen` state and smooth-scrolls to the embedded section. Added a new `<section ref={designerRef}>` rendered below the main grid containing the heading, an explanatory line, an X close button, and `<EmbeddedCustomizer product={product} />`. The right column (color swatches, size pills, QuantitySelector with total price, In den Warenkorb, Heart, trust badges, Druckbereiche list) remains visible/usable while designing — matching the standard product-page UX shown in the user's reference screenshot. The fullscreen `/customize` route still works for power users via the Vollbild button. TypeScript: 0 errors. |
| 26 | **Industry-standard print-zone editor (modeled after Printful/Printify/Spreadshirt).** Research: studied Printful Mockup Generator + Catalog + Orders APIs — they model products as a set of named **placements** (front, back, sleeve_left, chest_left, etc.), each with its own mockup image, a print-area rectangle (left/top/width/height as % of mockup), physical mm dimensions, optional safe-zone inset, optional bleed, optional surcharge, optional "mockup on top" flag for overlay mockups. Adopted this model. **Type changes** (`src/types/index.ts`): added `PlacementKey` (15 semantic keys: front, back, front_large, chest_left/right/center, sleeve_left/right, label_outside/inside, hood, pocket, front_top/bottom, default) and `PrintPlacement` interface; added optional `placements?: PrintPlacement[]` to `Product` (old `views`/`zones` kept for backward compat). **New component** `src/components/admin/PlacementsEditor.tsx` — visual editor with: tab pills per placement (add via popover of all keys, delete via inline trash), live drag-to-move + 4-corner-resize of the print-area rectangle overlaid on the mockup (pure pointer events, no new deps), live safe-zone dashed-green inset + bleed dashed-red outset rendering, right-hand form (DE/EN label, placement key dropdown, mockup `ImageUploader`, mm width/height, DPI, safe %, bleed %, surcharge €, mockup-on-top checkbox), live "designPx @300dpi" badge inside the rectangle, sensible per-key presets (e.g. front: 305×406 mm at 34%×45% of mockup, chest_left: 100×100 mm at 12%×12%). **Mockup assets** `public/mockups/tshirt-front.svg` + `tshirt-back.svg` — clean SVG silhouettes (1000×1200) used as default mockups when admin adds a t-shirt placement. **`AdminProductForm.tsx`**: imported `PlacementsEditor`, added local `placements` state synced to `existing.placements` on edit, included in `saveProduct` payload, rendered as new card "Druckbereiche & Zonen" above the legacy JSON section (which is kept for migrations). **Translations**: 35 new keys per locale (`admin.placements.title/subtitle/add/delete/empty/labelDe/labelEn/key/mockup/widthMm/heightMm/dpi/safe/bleed/surcharge/mockupOnTop/hint` + 15 `admin.placements.key.<placementKey>` semantic labels). TypeScript: 0 errors. **Next prompt:** wire `placements` into `DesignerCanvas.tsx` (read `placement.printArea` %, render safe/bleed guides, compute live DPI of placed images, replace single-area view loop). |
| 25 | Made all admin pages fully bilingual. `AdminProducts.tsx`, `AdminProductForm.tsx`, and `AdminCategories.tsx` had no `useT()` — all hardcoded German. Added `useT()` + replaced all UI strings with `t()` calls in all three files. Added ~55 new translation keys in both DE + EN (`admin.loading`, `admin.save`, `admin.cancel`, `admin.products.*` for list/form, `admin.categories.*`). `LanguageSwitcher` was already in `AdminLayout` sidebar and works for all pages. TypeScript: 0 errors. |
| 24 | Replaced all remaining text-based logo instances with the `/logo/logo text.png` image: `AdminLayout.tsx` sidebar header, `PreviewComponents.tsx` navbar preview, `PreviewComponents.tsx` footer preview. `Logo.tsx` already updated in Prompt 23 — covers SiteHeader, SiteFooter, MobileMenu, CustomizerTopBar. |
| 23 | Replaced text-based `Logo.tsx` (M icon + "MYICON" text) with `<img>` pointing to `/logo/logo text.png` (the MYiCON brand image with "QUALITÄT, DIE MAN SIEHT." tagline). |
| 22 | Made Login, Register, and all Account pages Firebase-editable with bilingual DE/EN support. Added `LoginContent`, `RegisterContent`, `AccountContent` interfaces + DE/EN defaults to `content.ts` (sectionIds: `page_login`, `page_register`, `page_account`). Updated `LoginPage.tsx`, `RegisterPage.tsx`, `AccountLayout.tsx`, `AccountPage.tsx`, `OrdersPage.tsx`, `DraftsPage.tsx`, `ProfilePage.tsx` to read all text from Firebase. Added `LoginPreview`, `RegisterPreview`, `AccountPreview` to `PreviewComponents.tsx`. Added `LoginEditor`, `RegisterEditor`, `AccountEditor` (covering all 5 account sub-pages in one section) to `AdminContent.tsx`. Added `login`, `register`, `account` to `PageKey`, `SectionKey`, `LiveDataMap`, `PAGE_CONFIG`, etc. Added 50+ new translation keys in both DE + EN. TypeScript: 0 errors. |
| 21 | Made Cart and Wishlist pages Firebase-editable with bilingual DE/EN support. Added `CartContent` + `WishlistContent` interfaces + DE/EN defaults to `content.ts`. Updated `CartPage.tsx` and `WishlistPage.tsx` to read all text from Firebase via `useSiteContent` (sectionIds: `page_cart`, `page_wishlist`). Added `CartPreview` + `WishlistPreview` to `PreviewComponents.tsx`. Added `CartEditor` + `WishlistEditor` to `AdminContent.tsx`. Added `cart` + `wishlist` to `PageKey`, `SectionKey`, `LiveDataMap`, `PAGE_CONFIG`, `SECTION_TO_PAGE`, `SECTION_LABEL_KEYS`, `makeDefaults`, `PageFullPreview`, and form area. Added 14 new translation keys in both DE + EN (emptyState, emptyTitle, emptySubtitle, emptyCtaText, emptyText, summaryTitle, labelSubtotal, labelVat, labelShipping, labelShippingFree, labelTotal, checkoutBtnText, continueBtnText, admin.tab.cart, admin.tab.wishlist). TypeScript: 0 errors. |
| 20 | Fixed language switcher — switching to EN no longer shows German. Root cause: `useSiteContent` fell back to `data.de` when no EN Firebase data existed, and EN defaults (`DEFAULT_*_EN`) were never passed. Fix: added optional `defaultsEn` param to `useSiteContent`, removed `data.de` fallback for non-DE locales, wired EN defaults into all 14 call sites (Hero, HowItWorks, CTASection, TrustStrip, CategoryGrid, Bestsellers, AboutPage, FAQPage, ContactPage, ImprintPage, PrivacyPage, TermsPage, SiteHeader, SiteFooter). |
| 19 | Seeded all 6 categories (Textilien, Flyer, Broschüren, Visitenkarten, Plakate, Werbematerial) with 34 total subcategories into Firebase RTDB. Added `titleEn` + `descriptionEn` to all categories and `titleEn` to all subcategories in `categories.ts` mock data. Created `scripts/seed-categories.mjs` (Node 18+ REST API script). |
| 18 | Admin bilingual product + category editor. Added `titleEn`, `descriptionEn`, `highlightsEn` fields to `Product` type; added `titleEn`, `descriptionEn` to `Category` and `titleEn` to `Subcategory`. Added `saveCategory` + `deleteCategory` to `firestore.ts`. Extended `AdminProductForm.tsx` with an EN translation card (title EN, badge EN, description EN, highlights EN). Created `AdminCategories.tsx` — expandable cards per category with DE/EN name + description + per-subcategory DE/EN names, save-to-Firebase. Added `/admin/categories` route in `App.tsx`. Added "Kategorien" nav link (Tag icon) in `AdminLayout.tsx`. Added `admin.nav.categories` translation key in both DE + EN. |
| 17 | Fixed NavbarPreview to match the real SiteHeader. Added the missing DesktopNav row (Alle Produkte + all CATEGORIES with ChevronDown + Hilfe & Wissen). Resized icons and spacing (size-5, px-4/py-3, lg:gap-6) to match real navbar. Added DE/EN language switcher stub to top-right. Imported CATEGORIES and ChevronDown in PreviewComponents.tsx. |
| 16 | Navbar and footer added to live preview and made Firebase-editable. Added `NavbarContent` + `FooterContent` types + defaults (`DEFAULT_NAVBAR`, `DEFAULT_NAVBAR_EN`, `DEFAULT_FOOTER`, `DEFAULT_FOOTER_EN`) to `content.ts`. `SiteHeader.tsx` and `SiteFooter.tsx` now read all text from Firebase via `useSiteContent`. Added `NavbarPreview` + `FooterPreview` to `PreviewComponents.tsx`. All page previews now wrapped with navbar at top and footer at bottom in `PageFullPreview`. Added `NavbarEditor` + `FooterEditor` to `AdminContent.tsx` with page tabs using PanelTop/PanelBottom icons. Added `navbar` and `footer` as new `PageKey` and `SectionKey` values. 20+ new translation keys added for both DE and EN. Fixed missing `const t = useT()` in AdminContent main function and duplicate closing braces in SiteHeader.tsx. |
| 15 | Major admin content editor redesign. Architecture: all editors always mounted (CSS-hidden when inactive), `liveData: LiveDataMap` state in AdminContent collects live form data via `onDataChange` callbacks from each editor (using `form.watch(callback)` subscription pattern). Right panel now shows a FULL-PAGE preview for the currently selected page (not just the active section). PreviewContext updated: `PreviewProvider` accepts `onSectionChange` callback; `PreviewEl` accepts `section` prop; clicking any element switches both page and section then scrolls to the field. PreviewComponents rewritten with `section` prop on every `PreviewEl`. AdminContent restructured with two-level navigation: 7 page tabs (Startseite, Über uns, FAQ, Kontakt, AGB, Datenschutz, Impressum) + section sub-tabs for the home page (Hero, Wie es funktioniert, CTA, Abschnitte). All 12 Firebase sections fully editable. Added `admin.tab.homeSections` key in DE + EN. |
