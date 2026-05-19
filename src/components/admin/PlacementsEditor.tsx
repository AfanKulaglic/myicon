import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Move, Maximize2, Image as ImageIcon } from "lucide-react";
import type { PlacementKey, PrintPlacement } from "@/types";
import { ImageUploader } from "./ImageUploader";
import { useT } from "@/hooks/useT";
import { uid } from "@/lib/utils";

interface Props {
  value: PrintPlacement[];
  onChange: (next: PrintPlacement[]) => void;
}

const PLACEMENT_KEYS: PlacementKey[] = [
  "front",
  "back",
  "front_large",
  "chest_left",
  "chest_right",
  "chest_center",
  "sleeve_left",
  "sleeve_right",
  "label_outside",
  "label_inside",
  "hood",
  "pocket",
  "front_top",
  "front_bottom",
  "default",
];

// Default print-area presets per placement key (sane starting rectangles
// in % of the mockup, matching common t-shirt anatomy).
const PRESETS: Record<PlacementKey, { rect: { leftPct: number; topPct: number; widthPct: number; heightPct: number }; widthMm: number; heightMm: number }> = {
  front:         { rect: { leftPct: 33, topPct: 22, widthPct: 34, heightPct: 45 }, widthMm: 305, heightMm: 406 },
  back:          { rect: { leftPct: 33, topPct: 18, widthPct: 34, heightPct: 50 }, widthMm: 305, heightMm: 406 },
  front_large:   { rect: { leftPct: 25, topPct: 16, widthPct: 50, heightPct: 60 }, widthMm: 380, heightMm: 480 },
  chest_left:    { rect: { leftPct: 56, topPct: 22, widthPct: 12, heightPct: 12 }, widthMm: 100, heightMm: 100 },
  chest_right:   { rect: { leftPct: 32, topPct: 22, widthPct: 12, heightPct: 12 }, widthMm: 100, heightMm: 100 },
  chest_center:  { rect: { leftPct: 40, topPct: 22, widthPct: 20, heightPct: 14 }, widthMm: 180, heightMm: 120 },
  sleeve_left:   { rect: { leftPct: 78, topPct: 22, widthPct: 10, heightPct: 14 }, widthMm: 90,  heightMm: 110 },
  sleeve_right:  { rect: { leftPct: 12, topPct: 22, widthPct: 10, heightPct: 14 }, widthMm: 90,  heightMm: 110 },
  label_outside: { rect: { leftPct: 44, topPct: 12, widthPct: 12, heightPct: 5  }, widthMm: 70,  heightMm: 30  },
  label_inside:  { rect: { leftPct: 44, topPct: 12, widthPct: 12, heightPct: 5  }, widthMm: 70,  heightMm: 30  },
  hood:          { rect: { leftPct: 35, topPct: 8,  widthPct: 30, heightPct: 10 }, widthMm: 200, heightMm: 100 },
  pocket:        { rect: { leftPct: 38, topPct: 40, widthPct: 24, heightPct: 18 }, widthMm: 150, heightMm: 100 },
  front_top:     { rect: { leftPct: 33, topPct: 18, widthPct: 34, heightPct: 18 }, widthMm: 250, heightMm: 130 },
  front_bottom:  { rect: { leftPct: 33, topPct: 55, widthPct: 34, heightPct: 20 }, widthMm: 250, heightMm: 150 },
  default:       { rect: { leftPct: 25, topPct: 25, widthPct: 50, heightPct: 50 }, widthMm: 200, heightMm: 200 },
};

const MOCKUP_PRESETS: Record<PlacementKey, string> = {
  front: "/mockups/tshirt-front.svg",
  back: "/mockups/tshirt-back.svg",
  front_large: "/mockups/tshirt-front.svg",
  chest_left: "/mockups/tshirt-front.svg",
  chest_right: "/mockups/tshirt-front.svg",
  chest_center: "/mockups/tshirt-front.svg",
  sleeve_left: "/mockups/tshirt-front.svg",
  sleeve_right: "/mockups/tshirt-front.svg",
  label_outside: "/mockups/tshirt-back.svg",
  label_inside: "/mockups/tshirt-back.svg",
  hood: "/mockups/tshirt-back.svg",
  pocket: "/mockups/tshirt-front.svg",
  front_top: "/mockups/tshirt-front.svg",
  front_bottom: "/mockups/tshirt-front.svg",
  default: "/mockups/tshirt-front.svg",
};

function newPlacement(key: PlacementKey, label: string): PrintPlacement {
  const p = PRESETS[key];
  return {
    id: uid("place"),
    key,
    label,
    mockup: MOCKUP_PRESETS[key],
    mockupWidth: 1000,
    mockupHeight: 1200,
    printArea: { ...p.rect },
    widthMm: p.widthMm,
    heightMm: p.heightMm,
    recommendedDpi: 150,
    safePct: 5,
    bleedPct: 0,
    additionalPrice: 0,
  };
}

// ─── Visual print-area overlay ───────────────────────────────────────────
type DragMode = null | "move" | "nw" | "ne" | "sw" | "se";

function PrintAreaCanvas({
  placement,
  onChange,
}: {
  placement: PrintPlacement;
  onChange: (next: PrintPlacement) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{
    mode: DragMode;
    startX: number;
    startY: number;
    startRect: PrintPlacement["printArea"];
    boxW: number;
    boxH: number;
  } | null>(null);

  // Detect image intrinsic dimensions
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      if (placement.mockupWidth !== img.naturalWidth || placement.mockupHeight !== img.naturalHeight) {
        onChange({ ...placement, mockupWidth: img.naturalWidth, mockupHeight: img.naturalHeight });
      }
    }
  };

  const startDrag = (mode: DragMode) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setDrag({
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startRect: { ...placement.printArea },
      boxW: box.width,
      boxH: box.height,
    });
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const dxPct = ((e.clientX - drag.startX) / drag.boxW) * 100;
    const dyPct = ((e.clientY - drag.startY) / drag.boxH) * 100;
    let { leftPct, topPct, widthPct, heightPct } = drag.startRect;
    const clamp = (v: number) => Math.max(0, Math.min(100, v));

    if (drag.mode === "move") {
      leftPct = clamp(leftPct + dxPct);
      topPct = clamp(topPct + dyPct);
      if (leftPct + widthPct > 100) leftPct = 100 - widthPct;
      if (topPct + heightPct > 100) topPct = 100 - heightPct;
    } else {
      const r = drag.startRect;
      let l = r.leftPct, t = r.topPct, w = r.widthPct, h = r.heightPct;
      if (drag.mode === "nw") { l = clamp(l + dxPct); t = clamp(t + dyPct); w = r.widthPct - dxPct; h = r.heightPct - dyPct; }
      if (drag.mode === "ne") { t = clamp(t + dyPct); w = r.widthPct + dxPct; h = r.heightPct - dyPct; }
      if (drag.mode === "sw") { l = clamp(l + dxPct); w = r.widthPct - dxPct; h = r.heightPct + dyPct; }
      if (drag.mode === "se") { w = r.widthPct + dxPct; h = r.heightPct + dyPct; }
      w = Math.max(3, Math.min(100 - l, w));
      h = Math.max(3, Math.min(100 - t, h));
      leftPct = l; topPct = t; widthPct = w; heightPct = h;
    }

    onChange({
      ...placement,
      printArea: { leftPct, topPct, widthPct, heightPct },
    });
  };

  const endDrag = () => setDrag(null);

  const r = placement.printArea;
  const safe = placement.safePct ?? 0;
  const bleed = placement.bleedPct ?? 0;

  // DPI hint based on physical mm and rectangle pixel size (using assumed export of 300dpi reference)
  const exportPxPerMmAt300 = 300 / 25.4;
  const designPx = {
    w: Math.round(placement.widthMm * exportPxPerMmAt300),
    h: Math.round(placement.heightMm * exportPxPerMmAt300),
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="relative w-full bg-[#f7f8fa] rounded-lg border border-line overflow-hidden select-none"
      style={{ aspectRatio: `${placement.mockupWidth} / ${placement.mockupHeight}` }}
    >
      {placement.mockup ? (
        <img
          src={placement.mockup}
          alt=""
          onLoad={onImgLoad}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ink-muted text-sm">
          <ImageIcon className="size-6 mr-2" /> kein Mockup
        </div>
      )}

      {/* Bleed (outside) */}
      {bleed > 0 && (
        <div
          className="absolute border-2 border-dashed border-red-400 pointer-events-none"
          style={{
            left: `${r.leftPct - (r.widthPct * bleed) / 100}%`,
            top: `${r.topPct - (r.heightPct * bleed) / 100}%`,
            width: `${r.widthPct * (1 + (2 * bleed) / 100)}%`,
            height: `${r.heightPct * (1 + (2 * bleed) / 100)}%`,
          }}
        />
      )}

      {/* Print area */}
      <div
        onPointerDown={startDrag("move")}
        className="absolute bg-brand/10 border-2 border-brand cursor-move"
        style={{
          left: `${r.leftPct}%`,
          top: `${r.topPct}%`,
          width: `${r.widthPct}%`,
          height: `${r.heightPct}%`,
        }}
      >
        {/* Safe zone */}
        {safe > 0 && (
          <div
            className="absolute border border-dashed border-green-500 pointer-events-none"
            style={{
              left: `${safe}%`,
              top: `${safe}%`,
              right: `${safe}%`,
              bottom: `${safe}%`,
            }}
          />
        )}
        <div className="absolute top-1 left-1 text-[10px] font-medium bg-brand text-white rounded px-1.5 py-0.5 pointer-events-none">
          {placement.widthMm}×{placement.heightMm} mm · {designPx.w}×{designPx.h}px@300dpi
        </div>
        {/* Corner handles */}
        {(["nw", "ne", "sw", "se"] as const).map((corner) => (
          <div
            key={corner}
            onPointerDown={startDrag(corner)}
            className="absolute size-3 bg-white border-2 border-brand rounded-sm"
            style={{
              cursor: `${corner}-resize`,
              left: corner.includes("w") ? -6 : undefined,
              right: corner.includes("e") ? -6 : undefined,
              top: corner.includes("n") ? -6 : undefined,
              bottom: corner.includes("s") ? -6 : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main editor ─────────────────────────────────────────────────────────
export function PlacementsEditor({ value, onChange }: Props) {
  const t = useT();
  const placements = useMemo(() => value ?? [], [value]);
  const [activeId, setActiveId] = useState<string | null>(placements[0]?.id ?? null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!activeId && placements[0]) setActiveId(placements[0].id);
    if (activeId && !placements.find((p) => p.id === activeId)) setActiveId(placements[0]?.id ?? null);
  }, [placements, activeId]);

  const active = placements.find((p) => p.id === activeId) ?? null;

  const update = (next: PrintPlacement) => {
    onChange(placements.map((p) => (p.id === next.id ? next : p)));
  };

  const add = (key: PlacementKey) => {
    const label = t(`admin.placements.key.${key}` as never) as string;
    const np = newPlacement(key, label || key);
    onChange([...placements, np]);
    setActiveId(np.id);
    if (detailsRef.current) detailsRef.current.open = false;
  };

  const remove = (id: string) => {
    onChange(placements.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {placements.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              p.id === activeId
                ? "bg-brand text-white border-brand"
                : "bg-white text-ink border-line hover:border-brand"
            }`}
          >
            <Move className="size-3" />
            {p.label}
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(p.id);
              }}
              className="ml-1 opacity-60 hover:opacity-100"
              title={t("admin.placements.delete")}
            >
              <Trash2 className="size-3" />
            </span>
          </button>
        ))}

        <details ref={detailsRef} className="relative">
          <summary className="list-none cursor-pointer flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-dashed border-line text-ink-muted hover:text-brand hover:border-brand">
            <Plus className="size-3" /> {t("admin.placements.add")}
          </summary>
          <div className="absolute z-10 mt-1 bg-white border border-line rounded-lg shadow-lg p-1 grid grid-cols-2 gap-0.5 w-72 max-h-72 overflow-auto">
            {PLACEMENT_KEYS.map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => add(k)}
                className="text-left text-xs px-2 py-1.5 rounded hover:bg-surface-alt"
              >
                {t(`admin.placements.key.${k}` as never) as string}
              </button>
            ))}
          </div>
        </details>
      </div>

      {!active && (
        <div className="text-sm text-ink-muted bg-surface-alt rounded-lg p-6 text-center border border-dashed border-line">
          {t("admin.placements.empty")}
        </div>
      )}

      {active && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          {/* Visual editor */}
          <PrintAreaCanvas placement={active} onChange={update} />

          {/* Right panel */}
          <div className="space-y-3 text-sm">
            <div>
              <label className="label">{t("admin.placements.labelDe")}</label>
              <input
                className="input"
                value={active.label}
                onChange={(e) => update({ ...active, label: e.target.value })}
              />
            </div>

            <div>
              <label className="label">{t("admin.placements.key")}</label>
              <select
                className="input"
                value={active.key}
                onChange={(e) => update({ ...active, key: e.target.value as PlacementKey })}
              >
                {PLACEMENT_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {t(`admin.placements.key.${k}` as never) as string}
                  </option>
                ))}
              </select>
            </div>

            <ImageUploader
              value={active.mockup}
              onChange={(url) => update({ ...active, mockup: url })}
              folder="mockups"
              label={t("admin.placements.mockup")}
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">{t("admin.placements.widthMm")}</label>
                <input
                  type="number"
                  min={1}
                  className="input"
                  value={active.widthMm}
                  onChange={(e) => update({ ...active, widthMm: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="label">{t("admin.placements.heightMm")}</label>
                <input
                  type="number"
                  min={1}
                  className="input"
                  value={active.heightMm}
                  onChange={(e) => update({ ...active, heightMm: Number(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="label">{t("admin.placements.dpi")}</label>
                <input
                  type="number"
                  min={72}
                  className="input"
                  value={active.recommendedDpi ?? 150}
                  onChange={(e) => update({ ...active, recommendedDpi: Number(e.target.value) || 150 })}
                />
              </div>
              <div>
                <label className="label">{t("admin.placements.safe")} (%)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  className="input"
                  value={active.safePct ?? 0}
                  onChange={(e) => update({ ...active, safePct: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="label">{t("admin.placements.bleed")} (%)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  className="input"
                  value={active.bleedPct ?? 0}
                  onChange={(e) => update({ ...active, bleedPct: Number(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <label className="label">{t("admin.placements.surcharge")} (€)</label>
              <input
                type="number"
                step="0.10"
                min={0}
                className="input"
                value={active.additionalPrice ?? 0}
                onChange={(e) => update({ ...active, additionalPrice: Number(e.target.value) || 0 })}
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-ink-muted">
              <input
                type="checkbox"
                checked={!!active.mockupOnTop}
                onChange={(e) => update({ ...active, mockupOnTop: e.target.checked })}
              />
              {t("admin.placements.mockupOnTop")}
            </label>

            <div className="bg-surface-alt rounded-lg p-3 text-[11px] text-ink-muted leading-relaxed flex gap-2">
              <Maximize2 className="size-4 shrink-0 mt-0.5" />
              <span>{t("admin.placements.hint")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
