import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_WISHLIST, DEFAULT_WISHLIST_EN, type WishlistContent } from "@/types/content";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.productIds);
  const { products: allProducts, loading } = useProducts();
  const products = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);
  const c = useSiteContent<WishlistContent>("page_wishlist", DEFAULT_WISHLIST, DEFAULT_WISHLIST_EN);

  return (
    <div className="container py-10 lg:py-14">
      <h1 className="h-display mb-8">{c.pageTitle}</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto size-16 rounded-full bg-surface-alt grid place-items-center mb-5">
            <Heart className="size-7 text-ink-muted" />
          </div>
          <p className="text-ink-muted">{c.emptyText}</p>
          <Link to="/categories" className="btn btn-primary mt-6 inline-flex">{c.emptyCtaText}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {products.map((p) => (
            <ProductCard key={p!.id} product={p!} />
          ))}
        </div>
      )}
    </div>
  );
}
