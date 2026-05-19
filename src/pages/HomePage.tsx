import { Hero } from "@/features/home/Hero";
import { TrustStrip } from "@/features/home/TrustStrip";
import { CategoryGrid } from "@/features/home/CategoryGrid";
import { Bestsellers } from "@/features/home/Bestsellers";
import { HowItWorks } from "@/features/home/HowItWorks";
import { CTASection } from "@/features/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <Bestsellers />
      <HowItWorks />
      <CTASection />
    </>
  );
}
