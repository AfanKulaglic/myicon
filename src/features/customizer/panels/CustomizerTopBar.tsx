import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Undo2, Redo2, Eye, ShoppingCart, MoreVertical, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { useCustomizer } from "../state/CustomizerContext";
import { useDraftsStore } from "@/store/drafts";
import { useCartStore } from "@/store/cart";
import { toast } from "@/store/toast";
import { uploadDataUrl } from "@/lib/storage";

export function CustomizerTopBar() {
  const c = useCustomizer();
  const saveDraft = useDraftsStore((s) => s.saveDraft);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ label: string; pct: number } | null>(null);

  const onSave = () => {
    const thumb = c.exportRef.current?.() ?? undefined;
    saveDraft({
      productId: c.product.id,
      productSlug: c.product.slug,
      productTitle: c.product.title,
      thumbnail: thumb,
      data: c.serialize(),
    });
    toast({ title: "Entwurf gespeichert", description: "Sie finden ihn unter Designs." });
  };

  const onPreview = () => {
    const url = c.exportRef.current?.();
    if (!url) return;
    const w = window.open();
    w?.document.write(`<title>Vorschau</title><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${url}" style="max-width:100%;max-height:100vh"/></body>`);
  };

  /** Wait for two animation frames so React can render the swapped view. */
  const nextFrame = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

  const hasEdits = c.layers.length > 0;

  const onAddToCart = async () => {
    if (adding) return;
    if (!hasEdits) {
      toast({
        title: "Noch nichts bearbeitet",
        description: "Fügen Sie ein Bild, einen Text oder eine Form hinzu, bevor Sie bestellen.",
      });
      return;
    }
    setAdding(true);
    const originalViewId = c.viewId;
    const originalSelection = c.selectedId;

    try {
      // Collect every viewId that has at least one layer — these are the
      // "edited" views. Un-edited views are skipped so the admin only sees
      // what the customer actually designed.
      const editedViewIds = Array.from(new Set(c.layers.map((l) => l.viewId)));

      // Look up a human label for each placement / view (used in admin UI).
      const labelFor = (id: string): string => {
        const p = c.product.placements?.find((x) => x.id === id);
        if (p) return p.label;
        const v = c.product.views.find((x) => x.id === id);
        return v?.label ?? id;
      };

      // For each edited view: switch the canvas to it, wait for re-render,
      // capture the dataURL, upload to catbox, store the URL.
      c.setSelectedId(null);
      const customDesigns: { viewId: string; viewLabel: string; imageUrl: string }[] = [];

      for (const vid of editedViewIds) {
        c.setViewId(vid);
        await nextFrame();
        const dataUrl = c.exportRef.current?.();
        if (!dataUrl) continue;
        try {
          const imageUrl = await uploadDataUrl(dataUrl);
          customDesigns.push({ viewId: vid, viewLabel: labelFor(vid), imageUrl });
        } catch (err) {
          console.error("Design upload failed for view", vid, err);
        }
      }

      // Restore original view + selection so the user sees no flicker after
      // the operation completes (besides the brief view-switching during
      // capture).
      c.setViewId(originalViewId);
      c.setSelectedId(originalSelection);
      await nextFrame();

      // Re-capture the original view for the cart thumbnail / draft preview.
      const thumb =
        customDesigns.find((d) => d.viewId === originalViewId)?.imageUrl ??
        customDesigns[0]?.imageUrl ??
        c.exportRef.current?.() ??
        undefined;

      const draftId = saveDraft({
        productId: c.product.id,
        productSlug: c.product.slug,
        productTitle: c.product.title,
        thumbnail: thumb,
        data: c.serialize(),
      });

      addItem({
        productId: c.product.id,
        title: c.product.title,
        image: thumb ?? c.product.image,
        price: c.product.basePrice,
        quantity: 50,
        variant: { color: c.productColor, size: c.productSize },
        designId: draftId,
        customDesigns: customDesigns.length > 0 ? customDesigns : undefined,
      });

      if (customDesigns.length > 0) {
        toast({
          title: "In den Warenkorb gelegt",
          description: `${customDesigns.length} bearbeitete Ansicht${customDesigns.length === 1 ? "" : "en"} hochgeladen.`,
        });
      } else {
        toast({
          title: "In den Warenkorb gelegt",
          description: "Kein Design hinzugefügt — Standardprodukt.",
        });
      }
      openCart();
    } catch (err) {
      console.error(err);
      toast({
        title: "Fehler beim Hinzufügen",
        description: err instanceof Error ? err.message : "Unbekannter Fehler.",
      });
    } finally {
      setAdding(false);
      setUploadProgress(null);
    }
  };

  return (
    <>
      {uploadProgress && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-elevated p-6 w-full max-w-xs mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="size-5 text-brand animate-spin flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Design wird verarbeitet</p>
                <p className="text-xs text-ink-muted mt-0.5 truncate">{uploadProgress.label}</p>
              </div>
            </div>
            <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${uploadProgress.pct}%` }}
              />
            </div>
            <p className="text-[11px] text-ink-muted text-right mt-1.5">{uploadProgress.pct}%</p>
          </div>
        </div>
      )}
      <div className="h-14 border-b border-line bg-white flex items-center px-2 sm:px-3 lg:px-5 gap-2 sm:gap-3">
      <button
        onClick={() => navigate(-1)}
        className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt flex-shrink-0"
        aria-label="Zurück"
      >
        <ArrowLeft className="size-5" />
      </button>
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="hidden md:block h-6 w-px bg-line mx-1" />
      <div className="min-w-0 flex-1 md:flex-initial">
        <div className="text-sm font-medium truncate">{c.product.title}</div>
        <div className="text-[11px] text-ink-muted truncate hidden sm:block">Designer · {c.viewId}</div>
      </div>

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <button
          onClick={c.undo}
          className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
          aria-label="Rückgängig"
          title="Rückgängig"
        >
          <Undo2 className="size-4" />
        </button>
        <button
          onClick={c.redo}
          className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
          aria-label="Wiederholen"
          title="Wiederholen"
        >
          <Redo2 className="size-4" />
        </button>
        <div className="hidden sm:block h-6 w-px bg-line mx-1" />

        {/* Desktop: full Save/Preview buttons */}
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="size-4" /> <span className="hidden md:inline">Speichern</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="size-4" /> <span className="hidden md:inline">Vorschau</span>
          </Button>
        </div>

        {/* Mobile: collapse Save/Preview into overflow menu */}
        <MobileOverflowMenu onSave={onSave} onPreview={onPreview} />

        {hasEdits && (
          <Button size="sm" onClick={onAddToCart} disabled={adding} className="px-2.5 sm:px-5">
            <ShoppingCart className="size-4" />{" "}
            <span className="hidden md:inline">In den Warenkorb</span>
          </Button>
        )}
      </div>
    </div>
    </>
  );
}

function MobileOverflowMenu({ onSave, onPreview }: { onSave: () => void; onPreview: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="sm:hidden relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
        aria-label="Mehr"
      >
        <MoreVertical className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-line rounded-lg shadow-pop min-w-[160px] py-1 z-50 animate-fade-in">
          <button
            onClick={() => {
              setOpen(false);
              onSave();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-alt text-left"
          >
            <Save className="size-4" /> Speichern
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onPreview();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-alt text-left"
          >
            <Eye className="size-4" /> Vorschau
          </button>
        </div>
      )}
    </div>
  );
}
