import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";
import { CustomizerProvider, useCustomizer } from "./state/CustomizerContext";
import { CustomizerTopBar } from "./panels/CustomizerTopBar";
import { LeftSidebar, LeftSidebarPanel, LEFT_TABS, type LeftSidebarTab } from "./panels/LeftSidebar";
import { RightSidebar } from "./panels/RightSidebar";
import { ZoomControls } from "./panels/ZoomControls";
import { cn } from "@/lib/utils";

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

type MobileSheet = LeftSidebarTab | "properties" | null;

export function CustomizerShell({ product, children }: { product: Product; children?: React.ReactNode }) {
  // Lock body scroll while in designer
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <CustomizerProvider product={product}>
      {children}
      <ShellInner />
    </CustomizerProvider>
  );
}

function ShellInner() {
  const { selectedId } = useCustomizer();
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);
  // Auto-open Properties sheet on mobile on the very first selection of the
  // session — gives the user immediate visibility of text/color/etc controls.
  // After that, they manage the sheet manually so it doesn't pop up every
  // time they click a layer.
  const hasAutoOpened = useRef(false);
  useEffect(() => {
    if (
      selectedId &&
      !hasAutoOpened.current &&
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      hasAutoOpened.current = true;
      setMobileSheet("properties");
    }
  }, [selectedId]);

  const closeSheet = () => setMobileSheet(null);

  return (
    <div
      className="fixed inset-x-0 top-[var(--header-h,0)] bottom-0 bg-surface-alt flex flex-col"
      style={{ ["--header-h" as string]: "0px" }}
    >
      <CustomizerTopBar />

      <div className="flex-1 min-h-0 flex">
        {/* Desktop left */}
        <div className="hidden md:flex w-64 lg:w-72 border-r border-line bg-white">
          <LeftSidebar />
        </div>

        <div className="relative flex-1 min-w-0 bg-surface-alt">
          <Suspense fallback={<CanvasFallback />}>
            <DesignerCanvas />
          </Suspense>
          <ZoomControls />
        </div>

        <div className="hidden lg:flex w-80 border-l border-line bg-white">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile bottom dock */}
      <MobileDock active={mobileSheet} onChange={setMobileSheet} hasSelection={!!selectedId} />

      {/* Mobile bottom sheet */}
      <MobileSheetView sheet={mobileSheet} onClose={closeSheet} />
    </div>
  );
}

function MobileDock({
  active,
  onChange,
  hasSelection,
}: {
  active: MobileSheet;
  onChange: (s: MobileSheet) => void;
  hasSelection: boolean;
}) {
  const tabs: {
    id: Exclude<MobileSheet, null>;
    label: string;
    Icon: typeof SlidersHorizontal;
    disabled?: boolean;
  }[] = [
    ...LEFT_TABS.map((t) => ({ id: t.id, label: t.label, Icon: t.Icon })),
    {
      id: "properties" as const,
      label: "Stil",
      Icon: SlidersHorizontal,
      disabled: !hasSelection,
    },
  ];

  return (
    <nav className="md:hidden flex border-t border-line bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.04)] z-30 pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ id, label, Icon, disabled }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => !disabled && onChange(isActive ? null : id)}
            disabled={disabled}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors relative",
              isActive
                ? "text-brand"
                : disabled
                  ? "text-ink-subtle/50"
                  : "text-ink-muted hover:text-ink active:bg-surface-alt"
            )}
            aria-label={label}
          >
            <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
            <span>{label}</span>
            {isActive && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-brand rounded-b-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function MobileSheetView({ sheet, onClose }: { sheet: MobileSheet; onClose: () => void }) {
  if (!sheet) return null;
  const title =
    sheet === "properties"
      ? "Eigenschaften"
      : LEFT_TABS.find((t) => t.id === sheet)?.label ?? "";

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/30 z-40 animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-pop max-h-[78vh] flex flex-col animate-slide-up"
        role="dialog"
        aria-label={title}
      >
        {/* Drag handle */}
        <button
          onClick={onClose}
          className="pt-2 pb-1 flex justify-center"
          aria-label="Schließen"
        >
          <span className="block h-1 w-10 rounded-full bg-line" />
        </button>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-line">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
            aria-label="Schließen"
          >
            <X className="size-4" />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-4">
          {sheet === "properties" ? (
            <RightSidebar />
          ) : (
            <LeftSidebarPanel tab={sheet} />
          )}
        </div>
      </div>
    </>
  );
}
