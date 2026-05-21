import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/product/CategoryCard";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_HOME_CATEGORIES, DEFAULT_HOME_CATEGORIES_EN, type HomeCategoriesContent } from "@/types/content";

export function CategoryGrid() {
  const { categories } = useCategories();
  const { title, subtitle, linkText } = useSiteContent<HomeCategoriesContent>("home_categories", DEFAULT_HOME_CATEGORIES, DEFAULT_HOME_CATEGORIES_EN);
  
  // Limit categories on mobile for better performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const displayCategories = isMobile ? categories.slice(0, 6) : categories;
  
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h2 className="h-section text-ink">{title}</h2>
            <p className="text-ink-muted mt-2 max-w-xl text-sm lg:text-base">{subtitle}</p>
          </div>
          <Link to="/categories" className="hidden md:inline text-sm font-medium text-brand hover:underline">
            {linkText}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayCategories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
        {isMobile && categories.length > 6 && (
          <div className="mt-6 text-center">
            <Link to="/categories" className="text-sm font-medium text-brand hover:underline">
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
