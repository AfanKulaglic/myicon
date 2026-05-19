import { useParams, Link, Navigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { ChevronRight } from "lucide-react";

export default function CategoryPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { categories, loading: catLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  const category = categories.find((c) => c.slug === slug);
  if (!catLoading && !category) return <Navigate to="/categories" replace />;
  if (!category) return null; // still loading

  const filtered = products.filter((p) => p.category === slug);

  return (
    <div className="container py-10 lg:py-14">
      <nav className="text-sm text-ink-muted mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-ink">Start</Link>
        <ChevronRight className="size-3.5" />
        <Link to="/categories" className="hover:text-ink">Kategorien</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink">{category.title}</span>
      </nav>

      <header className="mb-8 flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
        <div className="max-w-2xl">
          <h1 className="h-display">{category.title}</h1>
          <p className="mt-3 text-ink-muted">{category.description}</p>
        </div>
      </header>

      {category.subcategories.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((s) => (
              <Link
                key={s.slug}
                to={`/categories/${category.slug}/${s.slug}`}
                className="chip hover:border-brand hover:text-brand transition-colors"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {productsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-ink-muted">Bald verfügbar – wir arbeiten an neuen Produkten.</p>
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
