import { lazy, Suspense } from "react";
import { Hero } from "@/features/home/Hero";
import { TrustStrip } from "@/features/home/TrustStrip";

// Lazy load sections below the fold for better mobile performance
const CategoryGrid = lazy(() => import("@/features/home/CategoryGrid").then(m => ({ default: m.CategoryGrid })));
const Bestsellers = lazy(() => import("@/features/home/Bestsellers").then(m => ({ default: m.Bestsellers })));
const HowItWorks = lazy(() => import("@/features/home/HowItWorks").then(m => ({ default: m.HowItWorks })));
const CTASection = lazy(() => import("@/features/home/CTASection").then(m => ({ default: m.CTASection })));

export default function HomePage() {
  return (
    <>
      {/* Above the fold - load immediately */}
      <Hero />
      <TrustStrip />
      
      {/* Below the fold - lazy load for better mobile performance */}
      <Suspense fallback={<div className="h-96" />}>
        <CategoryGrid />
      </Suspense>
      
      <Suspense fallback={<div className="h-96" />}>
        <Bestsellers />
      </Suspense>
      
      <Suspense fallback={<div className="h-64" />}>
        <HowItWorks />
      </Suspense>
      
      <Suspense fallback={<div className="h-64" />}>
        <CTASection />
      </Suspense>
    </>
  );
}
