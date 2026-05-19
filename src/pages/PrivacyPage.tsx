import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_PRIVACY, DEFAULT_PRIVACY_EN, type LegalPageContent } from "@/types/content";

export default function PrivacyPage() {
  const { title, sections } = useSiteContent<LegalPageContent>("legal_privacy", DEFAULT_PRIVACY, DEFAULT_PRIVACY_EN);
  return (
    <div className="container py-12 lg:py-16 max-w-3xl">
      <h1 className="h-display">{title}</h1>
      <div className="mt-8 space-y-8 text-sm text-ink-muted leading-relaxed">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-semibold text-ink mb-2">{s.h}</h2>
            <p className="whitespace-pre-line">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
