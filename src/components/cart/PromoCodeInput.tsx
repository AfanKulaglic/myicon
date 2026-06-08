import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { findPromoByCode } from "@/lib/firestore";
import { validatePromo, promoErrorMessage } from "@/lib/promo";
import { formatCurrency } from "@/lib/utils";

/**
 * Customer-facing promo code entry. Validates against Firebase,
 * applies the discount to the shared cart store, and shows status.
 */
export function PromoCodeInput() {
  const { items, subtotal, promo, applyPromo, removePromo, discount } = useCartStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const found = await findPromoByCode(code);
      const result = validatePromo(found, items, subtotal());
      if (!result.ok || !result.applied) {
        setError(promoErrorMessage(result.error!, found?.minOrderValue));
        return;
      }
      applyPromo(result.applied);
      setCode("");
    } catch {
      setError("Code konnte nicht geprüft werden. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  if (promo) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
              <Check className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-900 truncate">{promo.code}</p>
              <p className="text-xs text-green-700">
                −{formatCurrency(discount())} Rabatt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removePromo}
            className="text-green-700 hover:text-red-600 p-1 shrink-0"
            aria-label="Code entfernen"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <label className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
        <Tag className="size-3.5" /> Rabattcode
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
          placeholder="z.B. SOMMER20"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-line bg-white uppercase placeholder:normal-case placeholder:text-ink-subtle focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all outline-none"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Anwenden
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </form>
  );
}
