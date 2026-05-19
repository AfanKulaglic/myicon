import { ZoomIn, ZoomOut, Ruler } from "lucide-react";
import { useCustomizer } from "../state/CustomizerContext";
import { cn } from "@/lib/utils";

export function ZoomControls() {
  const { zoom, setZoom, showBleed, toggleBleed } = useCustomizer();
  return (
    <div className="absolute top-3 right-3 md:bottom-3 md:top-auto md:right-3 flex items-center gap-0.5 bg-white border border-line rounded-xl shadow-card px-1 py-1">
      <button
        onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
        className="size-8 inline-flex items-center justify-center rounded-md hover:bg-surface-alt"
        aria-label="Verkleinern"
      >
        <ZoomOut className="size-4" />
      </button>
      <button
        onClick={() => setZoom(1)}
        className="text-xs font-semibold w-11 text-center text-ink hover:bg-surface-alt rounded-md py-1"
        aria-label="Zoom zurücksetzen"
        title="Zoom zurücksetzen"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={() => setZoom(Math.min(2.5, zoom + 0.1))}
        className="size-8 inline-flex items-center justify-center rounded-md hover:bg-surface-alt"
        aria-label="Vergrößern"
      >
        <ZoomIn className="size-4" />
      </button>
      <div className="w-px h-5 bg-line mx-0.5" />
      <button
        onClick={toggleBleed}
        className={cn(
          "size-8 inline-flex items-center justify-center rounded-md",
          showBleed ? "text-brand bg-brand/10" : "hover:bg-surface-alt text-ink-muted"
        )}
        aria-label="Beschnittzone"
        title="Beschnittzone anzeigen"
      >
        <Ruler className="size-4" />
      </button>
    </div>
  );
}
