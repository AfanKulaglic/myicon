import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_HERO, DEFAULT_HERO_EN, type HeroContent } from "@/types/content";

export function Hero() {
  const c = useSiteContent<HeroContent>("home_hero", DEFAULT_HERO, DEFAULT_HERO_EN);

  return (
    <section className="relative bg-gradient-to-b from-surface-alt to-white border-b border-line overflow-hidden">
      <div className="container py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="max-w-xl">
            <span className="chip bg-brand/10 text-brand mb-5">
              <Sparkles className="size-3.5" /> {c.badge}
            </span>
            <h1 className="h-display text-ink">
              {c.title.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}{" "}
              <span className="text-brand">{c.titleHighlight}</span>
            </h1>
            <p className="mt-5 text-base lg:text-lg text-ink-muted leading-relaxed">
              {c.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={c.ctaPrimaryUrl}>
                <Button size="lg">
                  {c.ctaPrimaryText} <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to={c.ctaSecondaryUrl}>
                <Button size="lg" variant="outline">
                  {c.ctaSecondaryText}
                </Button>
              </Link>
            </div>

            <dl className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-md">
              {(c.stats ?? []).map(({ value, label }) => (
                <div key={value}>
                  <dt className="text-2xl font-semibold text-ink font-display">{value}</dt>
                  <dd className="text-xs text-ink-muted mt-1">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="aspect-[5/4] rounded-2xl overflow-hidden bg-white border border-line shadow-card">
              <img
                src={c.imageUrl || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=80&auto=format&fit=crop"}
                alt=""
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                className="size-full object-cover"
              />
            </div>
            <div className="absolute -left-4 -bottom-4 lg:-left-6 lg:-bottom-6 hidden md:block">
              <div className="card p-4 shadow-elevated bg-white w-64">
                <div className="text-xs text-ink-muted">{c.promoCard?.tag ?? "Tiefpreis-Garantie"}</div>
                <div className="mt-1 font-semibold text-ink">{c.promoCard?.title ?? "30 Tage erstattet"}</div>
                <div className="mt-2 text-xs text-ink-muted">
                  {c.promoCard?.text ?? "Sollten Sie einen günstigeren Preis finden, erstatten wir die Differenz."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
