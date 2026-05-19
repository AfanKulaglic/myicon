import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_CTA, DEFAULT_CTA_EN, type CTAContent } from "@/types/content";

export function CTASection() {
  const c = useSiteContent<CTAContent>("home_cta", DEFAULT_CTA, DEFAULT_CTA_EN);

  return (
    <section className="pb-16 lg:pb-20">
      <div className="container">
        <div className="rounded-2xl bg-brand text-white p-8 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-semibold font-display">{c.title}</h2>
            <p className="mt-3 text-white/85 text-sm lg:text-base">{c.description}</p>
          </div>
          <div className="flex gap-3">
            <Link to={c.primaryUrl}>
              <Button variant="secondary" size="lg" className="bg-white text-brand hover:bg-white/90">
                {c.primaryText}
              </Button>
            </Link>
            <Link to={c.secondaryUrl}>
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white border border-white/20">
                {c.secondaryText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
