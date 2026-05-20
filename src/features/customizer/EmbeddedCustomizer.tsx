import { lazy, Suspense, useState, useEffect } from "react";
import { Maximize2, Minimize2, Save, Eye, Undo2, Redo2, ShoppingCart, Loader2, X } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { CustomizerProvider, useCustomizer } from "./state/CustomizerContext";
import { LeftSidebar, LeftSidebarPanel, LEFT_TABS, type LeftSidebarTab } from "./panels/LeftSidebar";
import { RightSidebar } from "./panels/RightSidebar";
import { ZoomControls } from "./panels/ZoomControls";
import { useDraftsStore } from "@/store/drafts";
import { useCartStore } from "@/store/cart";
import { toast } from "@/store/toast";
import { uploadDataUrl } from "@/lib/storage";

const DesignerCanvas = lazy(() =>
  import("./canvas/DesignerCanvas").then((m) => ({ default: m.DesignerCanvas }))
);

function CanvasFallback() {
  return (
    <div className="size-full flex items-center justify-center text-ink-muted text-sm">
      Designer wird geladen…
    </div>
  );
}

function InlineToolbar({ slug, onToggleFullscreen, isFullscreen }: { slug: string; onToggleFullscreen: () => void; isFullscreen: boolean }) {
  const c = useCustomizer();
  const saveDraft = useDraftsStore((s) => s.saveDraft);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [adding, setAdding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ label: string; pct: number } | null>(null);
  const hasEdits = c.layers.length > 0;

  const onSave = () => {
    const thumb = c.exportRef.current?.() ?? undefined;
    saveDraft({
      productId: c.product.id,
      productSlug: c.product.slug,
      productTitle: c.product.title,
      thumbnail: thumb,
      data: c.serialize(),
    });
    toast({ title: "Entwurf gespeichert" });
  };

  const onPreview = () => {
    const url = c.exportRef.current?.();
    if (!url) return;
    const w = window.open();
    w?.document.write(
      `<title>Vorschau</title><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${url}" style="max-width:100%;max-height:100vh"/></body>`,
    );
  };

  const nextFrame = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

  /**
   * Pre-decode an image so a later `useImage(src)` on the canvas resolves
   * synchronously from the HTTP cache instead of returning `null` for a few
   * frames. Without this, `stage.toDataURL()` can fire while `<KImage>`
   * components have `image={undefined}` and the export only contains the
   * placement outline.
   */
  const preloadImage = (src: string) =>
    new Promise<void>((resolve) => {
      if (!src) return resolve();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve();
      img.onerror = () => resolve(); // never block the cart on a broken layer
      img.src = src;
    });

  const onAddToCart = async () => {
    if (adding || !hasEdits) return;
    setAdding(true);
    const originalViewId = c.viewId;
    const originalSelection = c.selectedId;
    try {
      const editedViewIds = Array.from(new Set(c.layers.map((l) => l.viewId)));
      const labelFor = (id: string): string => {
        const p = c.product.placements?.find((x) => x.id === id);
        if (p) return p.label;
        const v = c.product.views.find((x) => x.id === id);
        return v?.label ?? id;
      };
      c.setSelectedId(null);
      // Warm the browser image cache for every image layer before switching
      // views so `toDataURL()` sees the actual bitmap, not an empty placeholder.
      await Promise.all(
        c.layers
          .filter((l): l is typeof l & { type: "image" } => l.type === "image")
          .map((l) => preloadImage(l.src)),
      );

      type DesignEntry = NonNullable<
        Parameters<typeof addItem>[0]["customDesigns"]
      >[number];
      const customDesigns: DesignEntry[] = [];

      const totalSteps = editedViewIds.length * 2;
      for (let i = 0; i < editedViewIds.length; i++) {
        const vid = editedViewIds[i];
        const viewLabel = labelFor(vid);
        setUploadProgress({ label: `${viewLabel}: Exportieren…`, pct: Math.round((i * 2 / totalSteps) * 90) });
        c.setViewId(vid);
        // Two animation frames is enough after the pre-loop image priming above.
        await nextFrame();
        const dataUrl = c.exportRef.current?.();
        if (!dataUrl) continue;
        setUploadProgress({ label: `${viewLabel}: Hochladen…`, pct: Math.round(((i * 2 + 1) / totalSteps) * 90) });
        try {
          const imageUrl = await uploadDataUrl(dataUrl);
          const layersOnView = c.layers.filter((l) => l.viewId === vid);
          const texts: NonNullable<DesignEntry["texts"]> = layersOnView
            .filter((l): l is typeof l & { type: "text" } => l.type === "text")
            .map((l) => ({
              text: l.text,
              fontFamily: l.fontFamily,
              fontSize: l.fontSize,
              fontStyle: l.fontStyle,
              fill: l.fill,
            }));
          customDesigns.push({
            viewId: vid,
            viewLabel,
            imageUrl,
            texts: texts.length > 0 ? texts : undefined,
          });
        } catch (err) {
          console.error("Design upload failed for view", vid, err);
        }
      }
      setUploadProgress({ label: "Wird abgeschlossen…", pct: 95 });
      c.setViewId(originalViewId);
      c.setSelectedId(originalSelection);
      await nextFrame();
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
      toast({
        title: "In den Warenkorb gelegt",
        description: `${customDesigns.length} bearbeitete Ansicht${customDesigns.length === 1 ? "" : "en"} hochgeladen.`,
      });
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
      <div className="h-12 border-b border-line bg-white flex items-center px-3 gap-1">
      <div className="text-sm font-medium truncate">{c.product.title}</div>
      <div className="text-[11px] text-ink-muted ml-2 truncate">Designer · {c.viewId}</div>
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={c.undo}
          disabled={!c.canUndo}
          className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt disabled:opacity-40"
          aria-label="Rückgängig"
        >
          <Undo2 className="size-4" />
        </button>
        <button
          onClick={c.redo}
          disabled={!c.canRedo}
          className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt disabled:opacity-40"
          aria-label="Wiederholen"
        >
          <Redo2 className="size-4" />
        </button>
        <div className="h-6 w-px bg-line mx-1" />
        <Button variant="ghost" size="sm" onClick={onSave}>
          <Save className="size-4" /> <span className="hidden sm:inline">Speichern</span>
        </Button>
        {hasEdits && (
          <Button size="sm" onClick={onAddToCart} disabled={adding}>
            <ShoppingCart className="size-4" />{" "}
            <span className="hidden sm:inline">In den Warenkorb</span>
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="size-4" /> <span className="hidden sm:inline">Vorschau</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Schließen' : 'Vollbild'}</span>
        </Button>
      </div>
    </div>
    </>
  );
}

// Mobile tools panel with tabs for left sidebar tools and properties
function MobileToolsPanel({ hasSelection }: { hasSelection: boolean }) {
  const [activeTab, setActiveTab] = useState<LeftSidebarTab | "properties">("upload");

  return (
    <>
      {/* Tab bar */}
      <div className="flex border-b border-line bg-white overflow-x-auto">
        {LEFT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 text-[11px] font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-brand"
                : "text-ink-muted"
            }`}
          >
            <tab.Icon className="size-5" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-brand rounded-t-full" />
            )}
          </button>
        ))}
        <button
          onClick={() => setActiveTab("properties")}
          disabled={!hasSelection}
          className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 text-[11px] font-medium transition-colors relative ${
            activeTab === "properties"
              ? "text-brand"
              : hasSelection
                ? "text-ink-muted"
                : "text-ink-subtle/50"
          }`}
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === "properties" ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <span>Eigenschaften</span>
          {activeTab === "properties" && (
            <span className="absolute bottom-0 inset-x-2 h-0.5 bg-brand rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "properties" ? (
          <RightSidebar />
        ) : (
          <LeftSidebarPanel tab={activeTab} />
        )}
      </div>
    </>
  );
}

/**
 * Inline customizer — meant to be embedded directly inside a product page.
 * Renders LeftSidebar + Canvas + RightSidebar in a constrained-height container.
 * No body scroll lock, no fixed positioning — flows naturally with the page.
 * Can be toggled to fullscreen mode.
 */
export function EmbeddedCustomizer({ product, initialColor }: { product: Product; initialColor?: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isFullscreen]);

  // ESC key to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  return (
    <CustomizerProvider product={product} initialColor={initialColor}>
      <EmbeddedCustomizerInner 
        slug={product.slug} 
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />
    </CustomizerProvider>
  );
}

function EmbeddedCustomizerInner({ slug, isFullscreen, onToggleFullscreen }: { slug: string; isFullscreen: boolean; onToggleFullscreen: () => void }) {
  const { selectedId } = useCustomizer();

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-surface-alt flex flex-col">
        <InlineToolbar slug={slug} onToggleFullscreen={onToggleFullscreen} isFullscreen={isFullscreen} />

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          {/* Desktop left sidebar */}
          <div className="hidden md:flex w-64 lg:w-72 border-r border-line bg-white">
            <LeftSidebar />
          </div>

          {/* Canvas area - 55% height on mobile, full on desktop */}
          <div className="relative flex-1 min-w-0 bg-surface-alt md:h-auto h-[55%]">
            <Suspense fallback={<CanvasFallback />}>
              <DesignerCanvas />
            </Suspense>
            <ZoomControls />
          </div>

          {/* Desktop right sidebar */}
          <div className="hidden lg:flex w-80 border-l border-line bg-white">
            <RightSidebar />
          </div>

          {/* Mobile tools panel - always visible at bottom, split screen (45% height) */}
          <div className="md:hidden flex-shrink-0 h-[45%] border-t-2 border-line bg-white flex flex-col overflow-hidden">
            <MobileToolsPanel hasSelection={!!selectedId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-card">
      <InlineToolbar slug={slug} onToggleFullscreen={onToggleFullscreen} isFullscreen={isFullscreen} />

      <div className="flex flex-col md:flex-row" style={{ height: "min(75vh, 720px)" }}>
        {/* Desktop left sidebar */}
        <div className="hidden md:flex w-60 lg:w-64 border-r border-line bg-white">
          <LeftSidebar />
        </div>

        {/* Canvas area - 55% height on mobile, full on desktop */}
        <div className="relative flex-1 min-w-0 bg-surface-alt md:h-auto h-[55%]">
          <Suspense fallback={<CanvasFallback />}>
            <DesignerCanvas />
          </Suspense>
          <ZoomControls />
        </div>

        {/* Desktop right sidebar */}
        <div className="hidden lg:flex w-72 xl:w-80 border-l border-line bg-white">
          <RightSidebar />
        </div>

        {/* Mobile tools panel - always visible at bottom, split screen (45% height) */}
        <div className="md:hidden flex-shrink-0 h-[45%] border-t-2 border-line bg-white flex flex-col overflow-hidden">
          <MobileToolsPanel hasSelection={!!selectedId} />
        </div>
      </div>
    </div>
  );
}
