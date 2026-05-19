import { useParams, Link, Navigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { ChevronRight } from "lucide-react";

export default function SubcategoryPage() {
  const { slug = "", sub = "" } = useParams<{ slug: string; sub: string }>();
  const { categories, loading: catLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  const category = categories.find((c) => c.slug === slug);
  const subcategory = category?.subcategories.find((s) => s.slug === sub);

  if (!catLoading && (!category || !subcategory)) return <Navigate to="/categories" replace />;
  if (!category || !subcategory) return null; // still loading

  const filtered = products.filter(
    (p) => p.category === slug && (!p.subcategory || p.subcategory === sub)
  );

  return (
    <div className="container py-10 lg:py-14">
      <nav className="text-sm text-ink-muted mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-ink">Start</Link>
        <ChevronRight className="size-3.5" />
        <Link to="/categories" className="hover:text-ink">Kategorien</Link>
        <ChevronRight className="size-3.5" />
        <Link to={`/categories/${category.slug}`} className="hover:text-ink">
          {category.title}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink">{subcategory.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="h-display">{subcategory.title}</h1>
      </header>

      {productsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-ink-muted">Bald verfügbar.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
