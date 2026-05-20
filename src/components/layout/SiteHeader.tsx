import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, Heart, ShoppingBag, Package, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
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

  // Filter products based on search query
  const getFilteredProducts = (query: string) => {
    if (!query.trim()) return [];
    const searchLower = query.toLowerCase();
    return products
      .filter((product) => {
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.subcategory?.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 5); // Show max 5 results
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
            className="hidden md:flex flex-1 max-w-2xl mx-2 lg:mx-6"
            onSubmit={handleDesktopSearch}
          >
            <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface-alt focus-within:bg-white focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-colors">
              <Search className="size-4 ml-3.5 text-ink-subtle shrink-0" />
              <input
                type="search"
                value={desktopSearch}
                onChange={(e) => setDesktopSearch(e.target.value)}
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
          </form>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Link
              to="/order/track"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt"
              title="Bestellungen verfolgen"
            >
              <Package className="size-5" />
              <span className="hidden lg:inline">Bestellungen</span>
            </Link>
            <Link
              to="/wishlist"
              className="relative size-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
              aria-label="Merkliste"
            >
              <Heart className="size-5" />
              {mounted && wishlistCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[10px] font-medium inline-flex items-center justify-center">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              onClick={openCart}
              className="relative size-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
              aria-label="Warenkorb"
            >
              <ShoppingBag className="size-5" />
              {mounted && cartCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[10px] font-medium inline-flex items-center justify-center">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form className="md:hidden mt-3" onSubmit={handleMobileSearch}>
          <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface-alt focus-within:bg-white focus-within:border-brand transition-colors">
            <Search className="size-4 ml-3.5 text-ink-subtle shrink-0" />
            <input
              type="search"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder={c.searchPlaceholder}
              className="flex-1 bg-transparent py-2.5 pr-3 text-sm outline-none placeholder:text-ink-subtle"
            />
          </div>
        </form>
      </div>

      <DesktopNav />
    </header>
  );
}
