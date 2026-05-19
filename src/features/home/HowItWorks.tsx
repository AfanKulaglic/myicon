import { MousePointerClick, Brush, PackageCheck, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_HOW_IT_WORKS, DEFAULT_HOW_IT_WORKS_EN, type HowItWorksContent } from "@/types/content";

const ICON_MAP: Record<string, LucideIcon> = {
  MousePointerClick,
  Brush,
  PackageCheck,
};

export function HowItWorks() {
  const c = useSiteContent<HowItWorksContent>("home_how_it_works", DEFAULT_HOW_IT_WORKS, DEFAULT_HOW_IT_WORKS_EN);

  return (
    <section className="section">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
          <h2 className="h-section text-ink">{c.sectionTitle}</h2>
          <p className="mt-2 text-ink-muted text-sm lg:text-base">{c.sectionSubtitle}</p>
        </div>
        <ol className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {c.steps.map(({ icon, title, text }) => {
            const Icon = ICON_MAP[icon] ?? MousePointerClick;
            return (
              <li key={title} className="card p-6 lg:p-8">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
