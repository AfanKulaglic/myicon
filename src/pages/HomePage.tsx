import { lazy, Suspense } from "react";
import { Hero } from "@/features/home/Hero";
import { TrustStrip } from "@/features/home/TrustStrip";
import { CategoryGrid } from "@/features/home/CategoryGrid";

// Lazy load below-the-fold sections for better mobile performance
const Bestsellers = lazy(() => import("@/features/home/Bestsellers").then(m => ({ default: m.Bestsellers })));
const HowItWorks = lazy(() => import("@/features/home/HowItWorks").then(m => ({ default: m.HowItWorks })));
const CTASection = lazy(() => import("@/features/home/CTASection").then(m => ({ default: m.CTASection })));

export default function HomePage() {
  return (
    <>
      {/* Above the fold - load immediately */}
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      
      {/* Below the fold - lazy load for better mobile performance */}
      <Suspense fallback={<div className="h-96" />}>
        <Bestsellers />
      </Suspense>
      
      <Suspense fallback={<div className="h-96" />}>
        <HowItWorks />
      </Suspense>
      
      <Suspense fallback={<div className="h-64" />}>
        <CTASection />
      </Suspense>
    </>
  );
}
