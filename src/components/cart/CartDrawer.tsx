import { X, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/Button";
import { useMounted } from "@/hooks/useMounted";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal } = useCartStore();
  const mounted = useMounted();

  if (!mounted || !isOpen) return null;

  const sub = subtotal();

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={closeCart}
        aria-hidden
      />
      <aside className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-pop flex flex-col animate-fade-in">
        <header className="flex items-center justify-between p-5 border-b border-line">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            <h2 className="font-semibold">Warenkorb</h2>
            <span className="chip">{items.length} Artikel</span>
          </div>
          <button
            onClick={closeCart}
            className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
            aria-label="Schließen"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="size-16 rounded-full bg-surface-alt inline-flex items-center justify-center text-ink-subtle">
                <ShoppingBag className="size-7" />
              </div>
              <h3 className="mt-4 font-semibold">Ihr Warenkorb ist leer</h3>
              <p className="text-sm text-ink-muted mt-1">
                Stöbern Sie durch unser Sortiment.
              </p>
              <Link to="/categories" onClick={closeCart}>
                <Button className="mt-5">Produkte entdecken</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <div
                    className="size-20 rounded-lg bg-surface-alt bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${it.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-1">{it.title}</div>
                    <div className="text-xs text-ink-muted mt-0.5 flex gap-2">
                      {it.variant.color ? <span>{it.variant.color}</span> : null}
                      {it.variant.size ? <span>· {it.variant.size}</span> : null}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantitySelector
                        value={it.quantity}
                        onChange={(v) => updateQuantity(it.id, v)}
                      />
                      <div className="text-sm font-semibold">
                        {formatCurrency(it.price * it.quantity)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="size-8 inline-flex items-center justify-center rounded-lg text-ink-subtle hover:text-red-500 hover:bg-red-50 shrink-0"
                    aria-label="Entfernen"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Zwischensumme</span>
              <span className="font-medium">{formatCurrency(sub)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Versand</span>
              <span className="font-medium">{sub >= 99 ? "Kostenlos" : formatCurrency(4.9)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-line">
              <span className="font-semibold">Gesamt</span>
              <span className="font-semibold text-lg">
                {formatCurrency(sub + (sub >= 99 ? 0 : 4.9))}
              </span>
            </div>
            <Link to="/checkout" onClick={closeCart}>
              <Button className="w-full" size="lg">
                Zur Kasse
              </Button>
            </Link>
            <Link to="/cart" onClick={closeCart}>
              <Button variant="outline" className="w-full">
                Warenkorb ansehen
              </Button>
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
