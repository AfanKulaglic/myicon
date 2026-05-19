import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/product/CategoryCard";

export default function CategoriesPage() {
  const { categories } = useCategories();
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="h-display">Alle Kategorien</h1>
        <p className="mt-3 text-ink-muted">
          Entdecken Sie unser komplettes Sortiment an Druck- und Werbeprodukten in
          professioneller Qualität.
        </p>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </div>
  );
}
