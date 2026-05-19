import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatCurrency } from "@/lib/utils";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_CART, DEFAULT_CART_EN, type CartContent } from "@/types/content";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const c = useSiteContent<CartContent>("page_cart", DEFAULT_CART, DEFAULT_CART_EN);

  if (items.length === 0) {
    return (
      <div className="container py-16 lg:py-24 text-center">
        <div className="mx-auto size-16 rounded-full bg-surface-alt grid place-items-center mb-5">
          <ShoppingBag className="size-7 text-ink-muted" />
        </div>
        <h1 className="h-section">{c.emptyTitle}</h1>
        <p className="mt-2 text-ink-muted">{c.emptySubtitle}</p>
        <Link to="/categories" className="btn btn-primary mt-6 inline-flex">{c.emptyCtaText}</Link>
      </div>
    );
  }

  const sub = subtotal();
  const vat = sub * 0.19;
  const total = sub + vat;

  return (
    <div className="container py-10 lg:py-14">
      <h1 className="h-display mb-8">{c.pageTitle}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="card p-4 flex gap-4">
              <div className="size-24 rounded-lg overflow-hidden bg-surface-alt flex-shrink-0">
                <img src={i.image} alt={i.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-ink">{i.title}</h3>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {[i.variant?.color, i.variant?.size].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(i.id)}
                    className="text-ink-muted hover:text-red-500"
                    aria-label="Entfernen"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <QuantitySelector
                    value={i.quantity}
                    onChange={(q) => updateQuantity(i.id, q)}
                    min={1}
                  />
                  <span className="font-semibold">{formatCurrency(i.price * i.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-4 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-semibold text-ink mb-4">{c.summaryTitle}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-ink-muted">{c.labelSubtotal}</dt><dd>{formatCurrency(sub)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">{c.labelVat}</dt><dd>{formatCurrency(vat)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">{c.labelShipping}</dt><dd className="text-success">{c.labelShippingFree}</dd></div>
          </dl>
          <div className="border-t border-line my-4" />
          <div className="flex justify-between text-base font-semibold">
            <span>{c.labelTotal}</span><span>{formatCurrency(total)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary w-full mt-5 justify-center">
            {c.checkoutBtnText}
          </Link>
          <Link to="/categories" className="block text-center text-sm text-ink-muted hover:text-ink mt-3">
            {c.continueBtnText}
          </Link>
        </aside>
      </div>
    </div>
  );
}
