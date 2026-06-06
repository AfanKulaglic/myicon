import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const { products, loading } = useProducts();

  // Update input when URL changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({});
  };

  // Fuzzy search - tolerant to typos and partial matches
  const fuzzyMatch = (text: string, query: string): number => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match gets highest score
    if (textLower.includes(queryLower)) return 100;
    
    // Split query into words and check each word
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
    let matchScore = 0;
    
    for (const word of queryWords) {
      // Check if any part of text contains the word
      if (textLower.includes(word)) {
        matchScore += 50;
        continue;
      }
      
      // Check character overlap (fuzzy matching)
      let overlap = 0;
      for (let i = 0; i < word.length; i++) {
        if (textLower.includes(word[i])) {
          overlap++;
        }
      }
      
      // If most characters match, give partial score
      const overlapRatio = overlap / word.length;
      if (overlapRatio > 0.5) {
        matchScore += Math.floor(overlapRatio * 30);
      }
    }
    
    return matchScore;
  };

  // Filter products based on fuzzy search
  const filteredProducts = query
    ? products
        .map((product) => {
          const titleScore = fuzzyMatch(product.title, query);
          const descScore = product.description ? fuzzyMatch(product.description, query) * 0.5 : 0;
          const categoryScore = fuzzyMatch(product.category, query) * 0.7;
          const subcategoryScore = product.subcategory ? fuzzyMatch(product.subcategory, query) * 0.7 : 0;
          
          const totalScore = Math.max(titleScore, descScore, categoryScore, subcategoryScore);
          
          return {
            product,
            score: totalScore
          };
        })
        .filter(item => item.score > 20) // Only show results with reasonable match
        .sort((a, b) => b.score - a.score) // Sort by relevance
        .map(item => item.product)
    : [];

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="container py-8 lg:py-12">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-ink mb-6">
            Suche
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex items-center gap-2 rounded-xl border-2 border-line bg-white focus-within:border-brand transition-colors shadow-sm">
              <Search className="size-5 ml-4 text-ink-subtle shrink-0" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Suche nach Produkten, Kategorien..."
                className="flex-1 bg-transparent py-3.5 pr-2 text-base outline-none placeholder:text-ink-subtle"
                autoFocus
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt text-ink-subtle hover:text-ink mr-1"
                  aria-label="Suche löschen"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="submit"
                className="m-1.5 rounded-lg bg-brand text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-600 transition-colors"
              >
                Suchen
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {query ? (
          <div>
            <div className="mb-6">
              <p className="text-lg text-ink-muted">
                {loading ? (
                  "Suche läuft..."
                ) : (
                  <>
                    <span className="font-semibold text-ink">{filteredProducts.length}</span>{" "}
                    {filteredProducts.length === 1 ? "Ergebnis" : "Ergebnisse"} für{" "}
                    <span className="font-semibold text-ink">"{query}"</span>
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-alt mb-6">
                  <Search className="size-10 text-ink-subtle" />
                </div>
                <h2 className="text-2xl font-bold text-ink mb-3">
                  Keine Ergebnisse gefunden
                </h2>
                <p className="text-lg text-ink-muted mb-8 max-w-md mx-auto">
                  Wir konnten keine Produkte finden, die zu "{query}" passen. Versuchen Sie es mit anderen Suchbegriffen.
                </p>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
                >
                  Alle Kategorien durchsuchen
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-alt mb-6">
              <Search className="size-10 text-ink-subtle" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-3">
              Wonach suchen Sie?
            </h2>
            <p className="text-lg text-ink-muted max-w-md mx-auto">
              Geben Sie einen Suchbegriff ein, um Produkte zu finden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
