import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, Heart, ShoppingBag, Package, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { useMounted } from "@/hooks/useMounted";
import { useT } from "@/hooks/useT";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_NAVBAR, DEFAULT_NAVBAR_EN, type NavbarContent } from "@/types/content";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  onMenuOpen: () => void;
}

export function SiteHeader({ onMenuOpen }: Props) {
  const cartCount = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const user = useAuthStore((s) => s.user);
  const mounted = useMounted();
  const t = useT();
  const c = useSiteContent<NavbarContent>("site_navbar", DEFAULT_NAVBAR, DEFAULT_NAVBAR_EN);
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const [desktopSearch, setDesktopSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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
  const getFilteredProducts = (query: string) => {
    if (!query.trim()) return [];
    
    const scored = products.map((product) => {
      const titleScore = fuzzyMatch(product.title, query);
      const descScore = product.description ? fuzzyMatch(product.description, query) * 0.5 : 0;
      const categoryScore = fuzzyMatch(product.category, query) * 0.7;
      const subcategoryScore = product.subcategory ? fuzzyMatch(product.subcategory, query) * 0.7 : 0;
      
      const totalScore = Math.max(titleScore, descScore, categoryScore, subcategoryScore);
      
      return {
        product,
        score: totalScore
      };
    });
    
    return scored
      .filter(item => item.score > 20) // Only show results with reasonable match
      .sort((a, b) => b.score - a.score) // Sort by relevance
      .slice(0, 5) // Show max 5 results
      .map(item => item.product);
  };

  const desktopResults = getFilteredProducts(desktopSearch);
  const mobileResults = getFilteredProducts(mobileSearch);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setShowDesktopDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(desktopSearch.trim())}`);
      setDesktopSearch("");
      setShowDesktopDropdown(false);
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearch.trim())}`);
      setMobileSearch("");
      setShowMobileDropdown(false);
    }
  };

  const handleDesktopInputChange = (value: string) => {
    setDesktopSearch(value);
    setShowDesktopDropdown(value.trim().length > 0);
  };

  const handleMobileInputChange = (value: string) => {
    setMobileSearch(value);
    setShowMobileDropdown(value.trim().length > 0);
  };

  const handleProductClick = (slug: string, isMobile: boolean) => {
    navigate(`/products/${slug}`);
    if (isMobile) {
      setMobileSearch("");
      setShowMobileDropdown(false);
    } else {
      setDesktopSearch("");
      setShowDesktopDropdown(false);
    }
  };

  const handleViewAllResults = (query: string, isMobile: boolean) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    if (isMobile) {
      setMobileSearch("");
      setShowMobileDropdown(false);
    } else {
      setDesktopSearch("");
      setShowDesktopDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-line">
      {/* Top utility row */}
      <div className="hidden md:block bg-surface-alt border-b border-line">
        <div className="container flex items-center justify-between py-1.5 text-xs text-ink-muted">
          <div className="flex items-center gap-5">
            <span>{c.utilShipping}</span>
            <span>{c.utilSameday}</span>
            <span>{c.utilGuarantee}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help/faq" className="hover:text-ink">{c.helpText}</Link>
            <Link to="/contact" className="hover:text-ink">{c.contactText}</Link>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="container py-3 lg:py-4">
        <div className="flex items-center gap-3 lg:gap-6">
          <button
            onClick={onMenuOpen}
            className="lg:hidden size-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
            aria-label={t("header.openMenu")}
          >
            <Menu className="size-5" />
          </button>

          <Logo />

          <form
            role="search"
            className="hidden md:flex flex-1 max-w-2xl mx-2 lg:mx-6 relative"
            onSubmit={handleDesktopSearch}
            ref={desktopSearchRef}
          >
            <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface-alt focus-within:bg-white focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-colors">
              <Search className="size-4 ml-3.5 text-ink-subtle shrink-0" />
              <input
                type="search"
                value={desktopSearch}
                onChange={(e) => handleDesktopInputChange(e.target.value)}
                placeholder={c.searchPlaceholder}
                className="flex-1 bg-transparent py-2.5 pr-2 text-sm outline-none placeholder:text-ink-subtle"
              />
              <button
                type="submit"
                className="m-1 rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 hover:bg-brand-600 transition-colors"
              >
                {c.searchBtnText}
              </button>
            </div>

            {/* Desktop Dropdown */}
            {showDesktopDropdown && desktopResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-line shadow-lg z-50 overflow-hidden">
                {desktopResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.slug, false)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-surface-alt transition-colors text-left"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm truncate">{product.title}</p>
                      <p className="text-xs text-ink-muted truncate">{product.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink">{formatCurrency(product.basePrice)}</p>
                  </button>
                ))}
                {desktopResults.length >= 5 && (
                  <button
                    onClick={() => handleViewAllResults(desktopSearch, false)}
                    className="w-full p-3 text-center text-sm font-medium text-brand hover:bg-surface-alt transition-colors border-t border-line"
                  >
                    Alle Ergebnisse anzeigen
                  </button>
                )}
              </div>
            )}
          </form>

          <div className="ml-auto flex items-center gap-0 md:gap-2">
            <Link
              to="/order/track"
              className="relative inline-flex items-center gap-2 px-1.5 md:px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt group overflow-hidden"
              aria-label="Bestellungen verfolgen"
            >
              <Package className="size-5 shrink-0" />
              <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                Bestellungen
              </span>
            </Link>
            
            {mounted && user && (
              <Link
                to="/account"
                className="relative inline-flex items-center gap-2 px-1.5 md:px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt group overflow-hidden"
                aria-label="Mein Konto"
              >
                <User className="size-5 shrink-0" />
                <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                  Mein Konto
                </span>
              </Link>
            )}
            
            {mounted && !user && (
              <Link
                to="/login"
                className="relative inline-flex items-center gap-2 px-1.5 md:px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt group overflow-hidden"
                aria-label="Anmelden"
              >
                <User className="size-5 shrink-0" />
                <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                  Anmelden
                </span>
              </Link>
            )}
            
            <Link
              to="/wishlist"
              className="relative inline-flex items-center gap-2 px-1.5 md:px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt group overflow-hidden"
              aria-label="Merkliste"
            >
              <Heart className="size-5 shrink-0" />
              {mounted && wishlistCount > 0 ? (
                <span className="absolute -top-0.5 left-5 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[10px] font-medium inline-flex items-center justify-center">
                  {wishlistCount}
                </span>
              ) : null}
              <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                Merkliste
              </span>
            </Link>
            
            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-2 px-1.5 md:px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt group overflow-hidden"
              aria-label="Warenkorb"
            >
              <ShoppingBag className="size-5 shrink-0" />
              {mounted && cartCount > 0 ? (
                <span className="absolute -top-0.5 left-5 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[10px] font-medium inline-flex items-center justify-center">
                  {cartCount}
                </span>
              ) : null}
              <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                Warenkorb
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3 relative" ref={mobileSearchRef}>
          <form onSubmit={handleMobileSearch}>
            <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface-alt focus-within:bg-white focus-within:border-brand transition-colors">
              <Search className="size-4 ml-3.5 text-ink-subtle shrink-0" />
              <input
                type="search"
                value={mobileSearch}
                onChange={(e) => handleMobileInputChange(e.target.value)}
                placeholder={c.searchPlaceholder}
                className="flex-1 bg-transparent py-2.5 pr-3 text-sm outline-none placeholder:text-ink-subtle"
              />
            </div>
          </form>

          {/* Mobile Dropdown */}
          {showMobileDropdown && mobileResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-line shadow-lg z-50 overflow-hidden">
              {mobileResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.slug, true)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-surface-alt transition-colors text-left"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">{product.title}</p>
                    <p className="text-xs text-ink-muted truncate">{product.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatCurrency(product.basePrice)}</p>
                </button>
              ))}
              {mobileResults.length >= 5 && (
                <button
                  onClick={() => handleViewAllResults(mobileSearch, true)}
                  className="w-full p-3 text-center text-sm font-medium text-brand hover:bg-surface-alt transition-colors border-t border-line"
                >
                  Alle Ergebnisse anzeigen
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <DesktopNav />
    </header>
  );
}
