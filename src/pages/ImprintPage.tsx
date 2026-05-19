import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_IMPRINT, DEFAULT_IMPRINT_EN, type ImprintContent } from "@/types/content";

export default function ImprintPage() {
  const { title, body } = useSiteContent<ImprintContent>("legal_imprint", DEFAULT_IMPRINT, DEFAULT_IMPRINT_EN);
  return (
    <div className="container py-12 lg:py-16 max-w-3xl">
      <h1 className="h-display">{title}</h1>
      <div className="mt-8 text-sm text-ink-muted leading-relaxed whitespace-pre-line">{body}</div>
    </div>
  );
}
