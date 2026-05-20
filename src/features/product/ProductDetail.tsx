import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, Truck, Save, ChevronRight, Star, X } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useMounted } from "@/hooks/useMounted";
import { toast } from "@/store/toast";
import { EmbeddedCustomizer } from "@/features/customizer/EmbeddedCustomizer";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";

interface Props {
  product: Product;
}

export function ProductDetail({ product }: Props) {
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(50);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"details" | "specs" | "faq">("details");
  const [designerOpen, setDesignerOpen] = useState(false);
  const designerRef = useRef<HTMLDivElement>(null);

  const openDesigner = () => {
    setDesignerOpen(true);
    // wait a tick so the section is mounted before scrolling
    requestAnimationFrame(() => {
      designerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { has, toggle } = useWishlistStore();
  const mounted = useMounted();
  const liked = mounted && has(product.id);

  const price = product.basePrice;
  const total = price * qty;

  const onAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      price,
      quantity: qty,
      variant: { color, size },
    });
    toast({ title: "Zum Warenkorb hinzugefügt", description: product.title });
    openCart();
  };

  return (
    <div className="container py-8 lg:py-12">
      <nav className="text-sm text-ink-muted mb-6">
        <Link to="/" className="hover:text-ink">Startseite</Link>
        <span className="mx-2">/</span>
        <Link to={`/categories/${product.category}`} className="hover:text-ink capitalize">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-line">
            {(product.gallery[activeImg] ?? product.image) ? (
              <ImageWithSkeleton
                src={product.gallery[activeImg] ?? product.image}
                alt={product.title}
                aspectRatio="auto"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-alt text-ink-muted">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-xs">Kein Bild hinterlegt</span>
              </div>
            )}
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {product.gallery.map((g, i) => (
                <button
                  key={g}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                    activeImg === i ? "border-brand" : "border-line hover:border-ink-subtle"
                  )}
                >
                  <ImageWithSkeleton
                    src={g}
                    alt=""
                    aspectRatio="auto"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-1 text-sm text-ink-muted">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
            <span>· {product.reviews.toLocaleString("de-DE")} Bewertungen</span>
          </div>
          <h1 className="mt-2 text-2xl lg:text-3xl font-display font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="mt-3 text-ink-muted">{product.description}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-sm text-ink-muted">ab</span>
            <span className="text-3xl font-semibold text-ink">
              {formatCurrency(price)}
            </span>
            <span className="text-sm text-ink-muted">pro Stück</span>
          </div>

          {product.colors && product.colors.length > 0 ? (
            <div className="mt-6">
              <label className="label">Farbe: <span className="font-normal text-ink-muted">{color}</span></label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={cn(
                      "size-9 rounded-full border-2 transition",
                      color === c.name ? "border-brand" : "border-line hover:border-ink-subtle"
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes && product.sizes.length > 0 ? (
            <div className="mt-6">
              <label className="label">Größe</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 h-10 px-3 rounded-lg border text-sm font-medium transition-colors",
                      size === s
                        ? "border-brand bg-brand text-white"
                        : "border-line hover:border-ink"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <label className="label">Stückzahl</label>
            <div className="flex items-center gap-4">
              <QuantitySelector value={qty} onChange={setQty} />
              <div className="text-sm text-ink-muted">
                Gesamt: <span className="font-semibold text-ink">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" className="flex-1 min-w-[200px]" onClick={openDesigner}>
              {designerOpen ? "Zum Designer scrollen" : "Jetzt gestalten"}
            </Button>
            <Button size="lg" variant="outline" onClick={onAddToCart}>
              In den Warenkorb
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => toggle(product.id)}
              aria-label="Zur Merkliste"
            >
              <Heart className={cn("size-5", liked && "text-red-500 fill-red-500")} />
            </Button>
          </div>

          {/* Trust badges */}
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Versand 2–4 Werktage" },
              { icon: ShieldCheck, label: "Tiefpreis-Garantie" },
              { icon: Save, label: "Design speichern" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-xs text-ink-muted">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          {/* Print zones */}
          <div className="mt-7 card p-5">
            <div className="text-sm font-semibold text-ink mb-2">
              Druckbereiche
            </div>
            <ul className="space-y-2 text-sm">
              {product.zones.map((z) => (
                <li key={z.id} className="flex items-center justify-between text-ink-muted">
                  <span className="flex items-center gap-2">
                    <ChevronRight className="size-3.5 text-brand" /> {z.label}
                  </span>
                  <span>{z.width} × {z.height} mm</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Embedded designer */}
      {designerOpen && (
        <section ref={designerRef} className="mt-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl lg:text-2xl font-display font-semibold">Design erstellen</h2>
              <p className="text-sm text-ink-muted mt-0.5">
                Laden Sie Ihr Logo hoch, fügen Sie Text hinzu oder wählen Sie aus den Formen. Ihre Auswahl (Farbe · Größe · Stückzahl) bleibt erhalten.
              </p>
            </div>
            <button
              onClick={() => setDesignerOpen(false)}
              className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt text-ink-muted"
              aria-label="Designer schließen"
            >
              <X className="size-5" />
            </button>
          </div>
          <EmbeddedCustomizer product={product} initialColor={color} />
        </section>
      )}

      {/* Tabs */}
      <div className="mt-14">
        <div className="border-b border-line flex items-center gap-1">
          {[
            { id: "details", label: "Details" },
            { id: "specs", label: "Spezifikation" },
            { id: "faq", label: "FAQ" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.id
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6 max-w-3xl">
          {tab === "details" && (
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-ink-muted">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 rounded-full bg-brand shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          {tab === "specs" && (
            <table className="w-full text-sm">
              <tbody>
                {product.zones.map((z) => (
                  <tr key={z.id} className="border-b border-line">
                    <td className="py-2.5 text-ink-muted">Druckbereich {z.label}</td>
                    <td className="py-2.5 font-medium text-ink">{z.width} × {z.height} mm</td>
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <td className="py-2.5 text-ink-muted">Lieferzeit</td>
                  <td className="py-2.5 font-medium text-ink">2–4 Werktage</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-ink-muted">Produktion</td>
                  <td className="py-2.5 font-medium text-ink">Deutschland</td>
                </tr>
              </tbody>
            </table>
          )}
          {tab === "faq" && (
            <div className="space-y-3 text-sm">
              {[
                ["Kann ich Designs speichern?", "Ja, alle Designs werden lokal gespeichert. Mit Konto auch in der Cloud."],
                ["Wie lange dauert die Produktion?", "In der Regel 24–48 h, Express-Optionen verfügbar."],
                ["Welche Druckverfahren werden verwendet?", "DTG, Siebdruck, Stickerei und Digitaldruck."],
              ].map(([q, a]) => (
                <details key={q} className="card p-4">
                  <summary className="font-medium cursor-pointer">{q}</summary>
                  <p className="mt-2 text-ink-muted">{a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
