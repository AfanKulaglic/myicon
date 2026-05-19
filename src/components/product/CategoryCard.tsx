import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group card overflow-hidden flex flex-col hover:shadow-elevated transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-surface-alt overflow-hidden">
        <img
          src={category.image}
          alt={category.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-ink">{category.title}</h3>
        <p className="mt-1 text-sm text-ink-muted line-clamp-2">{category.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand group-hover:gap-2.5 transition-all">
          Kategorie ansehen <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
