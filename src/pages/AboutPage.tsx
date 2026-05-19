import { Award, Truck, Leaf, Users, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_ABOUT, DEFAULT_ABOUT_EN, type AboutContent } from "@/types/content";

const ICON_MAP: Record<string, LucideIcon> = { Award, Truck, Leaf, Users };

export default function AboutPage() {
  const c = useSiteContent<AboutContent>("about", DEFAULT_ABOUT, DEFAULT_ABOUT_EN);

  return (
    <div>
      <section className="container py-14 lg:py-20 max-w-3xl">
        <span className="chip">Über MYICON</span>
        <h1 className="h-display mt-4">{c.heroTitle}</h1>
        <p className="mt-5 text-lg text-ink-muted">{c.heroSubtitle}</p>
      </section>

      <section className="bg-surface-alt border-y border-line">
        <div className="container py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {c.features.map((f) => {
            const Icon = ICON_MAP[f.icon] ?? Award;
            return (
              <div key={f.label}>
                <Icon className="size-6 text-brand" />
                <h3 className="mt-3 font-semibold">{f.label}</h3>
                <p className="text-sm text-ink-muted mt-1">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container py-14 lg:py-20 max-w-3xl">
        <h2 className="h-section">{c.storyTitle}</h2>
        <div className="mt-4 space-y-4 text-ink-muted">
          {c.storyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
    </div>
  );
}
