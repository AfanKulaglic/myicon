import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_HOME_BESTSELLERS, DEFAULT_HOME_BESTSELLERS_EN, type HomeBestsellersContent } from "@/types/content";

export function Bestsellers() {
  const { products, loading } = useProducts();
  
  // Limit bestsellers on mobile for better performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const allBestsellers = products.filter((p) => p.bestseller);
  const bestsellers = isMobile ? allBestsellers.slice(0, 6) : allBestsellers;
  
  const { title, subtitle } = useSiteContent<HomeBestsellersContent>("home_bestsellers", DEFAULT_HOME_BESTSELLERS, DEFAULT_HOME_BESTSELLERS_EN);
  return (
    <section className="section bg-surface-alt border-y border-line">
      <div className="container">
        <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h2 className="h-section text-ink">{title}</h2>
            <p className="text-ink-muted mt-2 text-sm lg:text-base">{subtitle}</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Alle anzeigen
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.bestsellers-swiper-button-prev',
              nextEl: '.bestsellers-swiper-button-next',
            }}
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 1.4 },
              640: { slidesPerView: 2.4 },
              1024: { slidesPerView: 3.4 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-2"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SwiperSlide key={i} className="h-auto">
                    <ProductCardSkeleton />
                  </SwiperSlide>
                ))
              : bestsellers.map((p) => (
                  <SwiperSlide key={p.id} className="h-auto">
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
          </Swiper>
          {/* Custom navigation buttons positioned outside cards */}
          <button
            className="bestsellers-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="bestsellers-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
