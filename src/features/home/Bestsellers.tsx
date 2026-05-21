import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
        </div>
        <Swiper
          modules={[Navigation]}
          navigation
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
      </div>
    </section>
  );
}
