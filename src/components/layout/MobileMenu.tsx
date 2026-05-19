import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { X, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const { categories } = useCategories();

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-pop flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <Logo />
          <button
            onClick={onClose}
            className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
            aria-label="Menü schließen"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {active ? (
            <div>
              <button
                onClick={() => setActive(null)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-ink-muted border-b border-line w-full text-left"
              >
                <ChevronRight className="size-4 rotate-180" />
                Zurück
              </button>
              {categories.find((c) => c.slug === active)?.subcategories.map((s) => (
                <Link
                  key={s.slug}
                  to={`/categories/${active}/${s.slug}`}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm border-b border-line hover:bg-surface-alt"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          ) : (
            <ul>
              <li>
                <Link
                  to="/categories"
                  onClick={onClose}
                  className="block px-4 py-3.5 text-sm font-medium border-b border-line"
                >
                  Alle Produkte
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => setActive(c.slug)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium border-b border-line hover:bg-surface-alt text-left"
                    )}
                  >
                    {c.title}
                    <ChevronRight className="size-4 text-ink-subtle" />
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/account"
                  onClick={onClose}
                  className="block px-4 py-3.5 text-sm border-b border-line"
                >
                  Mein Konto
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="block px-4 py-3.5 text-sm border-b border-line"
                >
                  Merkliste
                </Link>
              </li>
              <li>
                <Link
                  to="/help/faq"
                  onClick={onClose}
                  className="block px-4 py-3.5 text-sm border-b border-line"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="block px-4 py-3.5 text-sm border-b border-line"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
