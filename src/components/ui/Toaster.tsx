import { useToastStore } from "@/store/toast";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 rounded-xl bg-white shadow-pop border border-line p-3.5 pr-9 animate-fade-in relative",
          )}
        >
          {t.variant === "error" ? (
            <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="size-5 text-brand shrink-0 mt-0.5" />
          )}
          <div>
            <div className="text-sm font-medium">{t.title}</div>
            {t.description ? (
              <div className="text-xs text-ink-muted mt-0.5">{t.description}</div>
            ) : null}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="absolute top-2 right-2 text-ink-subtle hover:text-ink"
            aria-label="Schließen"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
