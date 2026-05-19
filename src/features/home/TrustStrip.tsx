import { Truck, ShieldCheck, Save, CreditCard, Zap, Star, Package, Phone, Award, Tag, Clock, Globe } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_TRUST_STRIP, DEFAULT_TRUST_STRIP_EN, type TrustStripContent } from "@/types/content";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Zap, ShieldCheck, Save, CreditCard, Truck, Star, Package, Phone, Award, Tag, Clock, Globe,
};

export function TrustStrip() {
  const { items } = useSiteContent<TrustStripContent>("home_trust_strip", DEFAULT_TRUST_STRIP, DEFAULT_TRUST_STRIP_EN);
  return (
    <section className="bg-white border-y border-line">
      <div className="container py-5">
        <ul className="flex items-center gap-6 lg:gap-10 overflow-x-auto no-scrollbar">
          {items.map(({ icon, label }) => {
            const Icon = ICON_MAP[icon] ?? Zap;
            return (
              <li key={label} className="flex items-center gap-2.5 text-sm text-ink-muted whitespace-nowrap shrink-0">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
