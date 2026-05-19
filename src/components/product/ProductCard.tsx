import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import { useMounted } from "@/hooks/useMounted";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlistStore();
  const mounted = useMounted();
  const liked = mounted && has(product.id);
  const badgeText = product.badge || (product.bestseller ? "Bestseller" : undefined);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col card hover:shadow-elevated transition-shadow overflow-hidden"
    >
      <div className="relative aspect-square bg-surface-alt overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {badgeText ? (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-brand text-white text-[11px] font-medium px-2 py-1">
            {badgeText}
          </span>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 size-9 inline-flex items-center justify-center rounded-full bg-white/95 border border-line hover:border-brand"
          aria-label="Zur Merkliste"
        >
          <Heart
            className={cn("size-4", liked ? "text-red-500 fill-red-500" : "text-ink-muted")}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-ink line-clamp-2">{product.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
          <span>· {product.reviews.toLocaleString("de-DE")}</span>
        </div>
        <div className="mt-auto pt-3 flex items-baseline justify-between">
          <span className="text-xs text-ink-muted">ab</span>
          <span className="text-base font-semibold text-ink">
            {formatCurrency(product.priceFrom)}
          </span>
        </div>
      </div>
    </Link>
  );
}
