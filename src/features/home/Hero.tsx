import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_HERO, DEFAULT_HERO_EN, type HeroContent } from "@/types/content";

export function Hero() {
  const c = useSiteContent<HeroContent>("home_hero", DEFAULT_HERO, DEFAULT_HERO_EN);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative bg-gradient-to-b from-surface-alt to-white border-b border-line overflow-hidden">
      <div className="container py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
          <div className="max-w-xl">
            <span className="chip bg-brand/10 text-brand mb-4 sm:mb-5">
              <Sparkles className="size-3.5" /> {c.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ink leading-tight">
              {c.title.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}{" "}
              <span className="text-brand">{c.titleHighlight}</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-ink-muted leading-relaxed">
              {c.subtitle}
            </p>
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to={c.ctaPrimaryUrl} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  {c.ctaPrimaryText} <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to={c.ctaSecondaryUrl} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {c.ctaSecondaryText}
                </Button>
              </Link>
            </div>

            <dl className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-md">
              {(c.stats ?? []).map(({ value, label }) => (
                <div key={value}>
                  <dt className="text-xl sm:text-2xl font-semibold text-ink font-display">{value}</dt>
                  <dd className="text-[10px] sm:text-xs text-ink-muted mt-0.5 sm:mt-1 leading-tight">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="aspect-[4/3] sm:aspect-[5/4] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-line shadow-card relative">
              {/* Skeleton loader - shows when no image or while loading */}
              {(!c.imageUrl || !imageLoaded) && (
                <div className="absolute inset-0 bg-gradient-to-br from-surface-alt via-white to-surface-alt animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 px-6">
                      {/* Animated logo placeholder */}
                      <div className="w-32 h-32 mx-auto bg-brand/10 rounded-2xl animate-pulse" />
                      {/* Text placeholder */}
                      <div className="space-y-2">
                        <div className="h-3 bg-line rounded-full w-48 mx-auto" />
                        <div className="h-3 bg-line rounded-full w-36 mx-auto" />
                      </div>
                      {/* Loading indicator */}
                      <div className="flex items-center justify-center gap-1.5 pt-2">
                        <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      {!c.imageUrl && (
                        <p className="text-xs text-ink-muted mt-4">
                          Kein Bild konfiguriert
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actual image - only renders if imageUrl is provided */}
              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt="Hero image"
                  width="800"
                  height="600"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  className={`size-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
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
