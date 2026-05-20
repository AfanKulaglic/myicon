import { useRef, useState } from "react";
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Layers as LayersIcon,
  Upload,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Lock,
  Unlock,
  Minus,
} from "lucide-react";
import { useCustomizer } from "../state/CustomizerContext";
import { cn } from "@/lib/utils";

/**
 * Resolve the print area in canvas-coordinate pixels for the currently selected
 * view. Mirrors the math in `DesignerCanvas` so that newly-added layers land
 * inside the visible printable region. For products with `placements`, the area
 * is derived from `printArea` percentages of the mockup dimensions. For
 * legacy products with only `views`, the absolute `area` is used.
 *
 * Without this, single-zone products like caps end up placing layers at the
 * legacy `view.area` pixel coordinates, which are in a completely different
 * coordinate space from the placement-rendered canvas — so uploaded images and
 * text appear far outside the visible printable region.
 */
const CANVAS_REF_WIDTH = 1000;
function useActiveArea() {
  const { product, viewId } = useCustomizer();
  const view = product.views.find((v) => v.id === viewId) ?? product.views[0];
  const placement = product.placements?.find((p) => p.id === viewId) ?? null;
  if (placement) {
    const refW = placement.mockupWidth ?? CANVAS_REF_WIDTH;
    const refH = placement.mockupHeight ?? CANVAS_REF_WIDTH;
    const { leftPct, topPct, widthPct, heightPct } = placement.printArea;
    return {
      x: (leftPct / 100) * refW,
      y: (topPct / 100) * refH,
      width: (widthPct / 100) * refW,
      height: (heightPct / 100) * refH,
    };
  }
  return view.area;
}


type Tab = "upload" | "text" | "shapes" | "layers";
export type LeftSidebarTab = Tab;

export const LEFT_TABS: { id: Tab; label: string; Icon: typeof Upload }[] = [
  { id: "upload", label: "Bilder", Icon: Upload },
  { id: "text", label: "Text", Icon: Type },
  { id: "shapes", label: "Formen", Icon: Square },
  { id: "layers", label: "Ebenen", Icon: LayersIcon },
];

export function LeftSidebarPanel({ tab }: { tab: Tab }) {
  return (
    <div className="p-4">
      {tab === "upload" && <UploadPanel />}
      {tab === "text" && <TextPanel />}
      {tab === "shapes" && <ShapesPanel />}
      {tab === "layers" && <LayersPanel />}
    </div>
  );
}

export function LeftSidebar() {
  const [tab, setTab] = useState<Tab>("upload");

  return (
    <div className="flex w-full">
      <nav className="w-14 bg-surface-alt border-r border-line flex flex-col items-center py-3 gap-1">
        {LEFT_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-1 w-12 rounded-lg text-[10px] font-medium transition-colors",
              tab === id ? "bg-brand text-white" : "text-ink-muted hover:bg-white hover:text-ink"
            )}
            aria-label={label}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto">
        <LeftSidebarPanel tab={tab} />
      </div>
    </div>
  );
}

function UploadPanel() {
  const { addLayer } = useCustomizer();
  const inputRef = useRef<HTMLInputElement>(null);
  const area = useActiveArea();

  const onPick = () => inputRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const max = Math.min(area.width * 0.6, 400);
        const ratio = img.width / img.height;
        const w = max, h = max / ratio;
        addLayer({
          type: "image",
          src,
          x: area.x + (area.width - w) / 2,
          y: area.y + (area.height - h) / 2,
          width: w, height: h, rotation: 0, opacity: 1,
        } as never);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Bild hochladen</h3>
      <button
        onClick={onPick}
        className="w-full border-2 border-dashed border-line rounded-xl py-8 text-center hover:border-brand hover:bg-brand/5 transition-colors"
      >
        <Upload className="size-5 mx-auto text-ink-muted" />
        <div className="mt-2 text-sm font-medium">Bild hochladen</div>
        <div className="text-xs text-ink-muted mt-1">PNG, JPG, SVG · max. 10 MB</div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div className="mt-5 text-xs text-ink-muted leading-relaxed">
        Tipp: Für besten Druck Bilder mit mindestens 300 DPI verwenden.
      </div>
    </div>
  );
}

function TextPanel() {
  const { addLayer } = useCustomizer();
  const area = useActiveArea();

  const presets = [
    { label: "Überschrift", size: 64, weight: "bold" as const },
    { label: "Untertitel", size: 36, weight: "normal" as const },
    { label: "Fließtext", size: 22, weight: "normal" as const },
  ];

  const add = (size: number, fontStyle: "normal" | "bold") => {
    const w = Math.min(320, area.width * 0.8);
    addLayer({
      type: "text",
      text: "Ihr Text hier",
      fontFamily: "Inter",
      fontSize: size,
      fontStyle,
      align: "center",
      fill: "#111111",
      x: area.x + (area.width - w) / 2,
      y: area.y + area.height / 2 - size / 2,
      width: w,
      height: size * 1.2,
      rotation: 0,
      opacity: 1,
    } as never);
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Text hinzufügen</h3>
      <div className="space-y-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => add(p.size, p.weight)}
            className="w-full text-left p-3 rounded-lg border border-line hover:border-brand hover:bg-brand/5"
          >
            <div
              className="font-display"
              style={{ fontSize: Math.min(p.size, 22), fontWeight: p.weight === "bold" ? 700 : 400 }}
            >
              {p.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ShapesPanel() {
  const { addLayer } = useCustomizer();
  const area = useActiveArea();
  const size = Math.min(200, area.width * 0.5);
  const cx = area.x + area.width / 2 - size / 2;
  const cy = area.y + area.height / 2 - size / 2;

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Formen</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() =>
            addLayer({
              type: "rect", fill: "#1E5AA8",
              x: cx, y: cy, width: size, height: size, rotation: 0, opacity: 1,
            } as never)
          }
          className="aspect-square rounded-lg border border-line hover:border-brand flex items-center justify-center"
        >
          <Square className="size-7 text-brand" />
        </button>
        <button
          onClick={() =>
            addLayer({
              type: "circle", fill: "#1E5AA8",
              x: cx, y: cy, width: size, height: size, rotation: 0, opacity: 1,
            } as never)
          }
          className="aspect-square rounded-lg border border-line hover:border-brand flex items-center justify-center"
        >
          <Circle className="size-7 text-brand" />
        </button>
        <button
          onClick={() =>
            addLayer({
              type: "line", stroke: "#111111", strokeWidth: 4,
              x: cx, y: cy + size / 2, width: size, height: 0, rotation: 0, opacity: 1, locked: true,
            } as never)
          }
          className="aspect-square rounded-lg border border-line hover:border-brand flex items-center justify-center"
        >
          <Minus className="size-7 text-brand" />
        </button>
      </div>
      <div className="mt-3 text-xs text-ink-muted leading-relaxed">
        <strong>Tipp:</strong> Linien sind standardmäßig gesperrt. Entsperren Sie sie, um sie diagonal zu drehen und zu verschieben.
      </div>
    </div>
  );
}

function LayersPanel() {
  const {
    layers, viewId, selectedId, setSelectedId,
    removeLayer, duplicateLayer, bringForward, sendBackward,
    bringToFront, sendToBack, updateLayer,
  } = useCustomizer();
  const list = layers.filter((l) => l.viewId === viewId).slice().reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Ebenen</h3>
        <span className="text-[10px] text-ink-subtle uppercase tracking-wide">{list.length}</span>
      </div>
      {list.length === 0 ? (
        <div className="text-xs text-ink-muted bg-surface-alt rounded-lg p-4 text-center border border-dashed border-line">
          Noch keine Ebenen.<br />
          <span className="text-ink-subtle">Lade ein Bild hoch oder füge Text hinzu.</span>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {list.map((l) => {
            const isSelected = selectedId === l.id;
            const isLocked = !!l.locked;
            const Icon =
              l.type === "text" ? Type :
              l.type === "image" ? ImageIcon :
              l.type === "line" ? Minus :
              l.type === "circle" ? Circle : Square;
            const name =
              l.type === "text" ? ((l as { text: string }).text || "Text") :
              l.type === "image" ? "Bild" :
              l.type === "line" ? "Linie" :
              l.type === "rect" ? "Rechteck" : "Kreis";
            return (
              <li
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={cn(
                  "group flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                  isSelected
                    ? "border-brand bg-brand/5 shadow-sm"
                    : "border-line bg-white hover:border-ink-subtle hover:bg-surface-alt"
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0",
                    isSelected ? "bg-brand text-white" : "bg-surface-alt text-ink-muted"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-ink truncate">{name}</span>
                  <span className="block text-[10px] text-ink-subtle uppercase tracking-wide">
                    {l.type}
                  </span>
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { locked: !isLocked }); }}
                  title={isLocked ? "Entsperren" : "Sperren"}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isLocked
                      ? "text-brand bg-brand/10"
                      : "text-ink-subtle hover:text-ink hover:bg-white opacity-0 group-hover:opacity-100"
                  )}
                >
                  {isLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                </button>
                <div className={cn("flex items-center gap-0.5 transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                  <button onClick={(e) => { e.stopPropagation(); bringToFront(l.id); }} title="Ganz nach vorne" className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-white"><ChevronsUp className="size-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); bringForward(l.id); }} title="Eine nach vorne" className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-white"><ChevronUp className="size-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); sendBackward(l.id); }} title="Eine nach hinten" className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-white"><ChevronDown className="size-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); sendToBack(l.id); }} title="Ganz nach hinten" className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-white"><ChevronsDown className="size-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); duplicateLayer(l.id); }} title="Duplizieren" className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-white"><Copy className="size-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeLayer(l.id); }} title="Löschen" className="p-1.5 rounded-md text-ink-subtle hover:text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
