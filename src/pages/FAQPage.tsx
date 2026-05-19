import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_FAQ, DEFAULT_FAQ_EN, type FAQContent } from "@/types/content";

export default function FAQPage() {
  const c = useSiteContent<FAQContent>("faq", DEFAULT_FAQ, DEFAULT_FAQ_EN);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container py-10 lg:py-16 max-w-3xl">
      <h1 className="h-display">{c.title}</h1>
      <p className="mt-3 text-ink-muted">{c.subtitle}</p>
      <div className="mt-10 space-y-3">
        {c.items.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-medium hover:bg-surface-alt"
            >
              {f.q}
              <ChevronDown className={cn("size-4 transition-transform flex-shrink-0", open === i && "rotate-180")} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-ink-muted border-t border-line pt-4">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
