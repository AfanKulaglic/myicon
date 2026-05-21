import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import { useMounted } from "@/hooks/useMounted";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";

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
      <div className="relative aspect-square overflow-hidden">
        {product.image ? (
          <ImageWithSkeleton
            src={product.image}
            alt={product.title}
            aspectRatio="auto"
            width={400}
            height={400}
            className="group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-alt text-ink-muted opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {badgeText ? (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-brand text-white text-[11px] font-medium px-2 py-1 z-10">
            {badgeText}
          </span>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 size-9 inline-flex items-center justify-center rounded-full bg-white/95 border border-line hover:border-brand z-10"
          aria-label="Zur Merkliste"
        >
          <Heart
            className={cn("size-4", liked ? "text-red-500 fill-red-500" : "text-ink-muted")}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-ink line-clamp-2 flex-1">{product.title}</h3>
          <span className="text-base font-semibold text-ink whitespace-nowrap">
            {formatCurrency(product.priceFrom)}
          </span>
        </div>
        
        <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
          <span>· {product.reviews.toLocaleString("de-DE")}</span>
        </div>
        
        {/* Color swatches - max 3 colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((color) => (
              <div
                key={color.name}
                className="size-5 rounded-full border border-line shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-ink-muted font-medium">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
