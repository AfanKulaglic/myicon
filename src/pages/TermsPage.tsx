import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_TERMS, DEFAULT_TERMS_EN, type LegalPageContent } from "@/types/content";

export default function TermsPage() {
  const { title, sections } = useSiteContent<LegalPageContent>("legal_terms", DEFAULT_TERMS, DEFAULT_TERMS_EN);
  return (
    <div className="container py-12 lg:py-16 max-w-3xl">
      <h1 className="h-display">{title}</h1>
      <div className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-semibold text-ink">{s.h}</h2>
            <p className="mt-2 text-ink-muted text-sm leading-relaxed whitespace-pre-line">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
