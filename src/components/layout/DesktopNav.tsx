import { Link } from "react-router-dom";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { ChevronDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null);
  const { categories } = useCategories();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="hidden lg:block border-t border-line bg-white"
      onMouseLeave={() => setOpen(null)}
    >
      <div className="container">
        <ul className="flex items-center gap-1">
          <li>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-ink hover:text-brand"
            >
              Alle Produkte
            </Link>
          </li>
          {categories.map((c) => (
            <li
              key={c.slug}
              className="relative"
              onMouseEnter={() => setOpen(c.slug)}
            >
              <Link
                to={`/categories/${c.slug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-ink hover:text-brand transition-colors",
                  open === c.slug && "text-brand"
                )}
              >
                {c.title}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    open === c.slug && "rotate-180"
                  )}
                />
              </Link>
              {open === c.slug && (
                <div
                  className="absolute left-0 top-full w-[640px] bg-white border border-line rounded-2xl shadow-elevated p-6 z-50 animate-fade-in"
                >
                  <div className="flex gap-6">
                    <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {c.subcategories.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/categories/${c.slug}/${s.slug}`}
                          className="text-sm text-ink-muted hover:text-brand py-1.5 transition-colors"
                          onClick={() => setOpen(null)}
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                    <div className="w-56 shrink-0">
                      <div
                        className="aspect-[4/3] rounded-xl bg-surface-alt bg-cover bg-center"
                        style={{ backgroundImage: `url(${c.image})` }}
                      />
                      <div className="mt-3">
                        <div className="text-sm font-semibold text-ink">{c.title}</div>
                        <p className="text-xs text-ink-muted mt-1 line-clamp-2">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
          <li>
            <Link
              to="/order/track"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-ink hover:text-brand"
            >
              <Package className="size-4" />
              Bestellungen
            </Link>
          </li>
          <li>
            <Link
              to="/help/faq"
              className="inline-flex items-center px-4 py-3.5 text-sm font-medium text-ink hover:text-brand"
            >
              Hilfe & Wissen
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
