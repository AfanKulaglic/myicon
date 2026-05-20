import { useEffect, useState, lazy, Suspense } from "react";
import type { Product } from "@/types";
import { CustomizerProvider, useCustomizer } from "./state/CustomizerContext";
import { CustomizerTopBar } from "./panels/CustomizerTopBar";
import { LeftSidebar, LeftSidebarPanel, LEFT_TABS, type LeftSidebarTab } from "./panels/LeftSidebar";
import { RightSidebar } from "./panels/RightSidebar";
import { ZoomControls } from "./panels/ZoomControls";

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

  return (
    <div
      className="fixed inset-x-0 top-[var(--header-h,0)] bottom-0 bg-surface-alt flex flex-col"
      style={{ ["--header-h" as string]: "0px" }}
    >
      <CustomizerTopBar />

      {/* Main content area */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Desktop left sidebar */}
        <div className="hidden md:flex w-64 lg:w-72 border-r border-line bg-white">
          <LeftSidebar />
        </div>

        {/* Canvas area */}
        <div className="relative flex-1 min-w-0 bg-surface-alt">
          <Suspense fallback={<CanvasFallback />}>
            <DesignerCanvas />
          </Suspense>
          <ZoomControls />
        </div>

        {/* Desktop right sidebar */}
        <div className="hidden lg:flex w-80 border-l border-line bg-white">
          <RightSidebar />
        </div>

        {/* Mobile tools panel - always visible at bottom, split screen */}
        <div className="md:hidden flex-shrink-0 h-[45vh] border-t-2 border-line bg-white flex flex-col overflow-hidden">
          <MobileToolsPanel hasSelection={!!selectedId} />
        </div>
      </div>
    </div>
  );
}
