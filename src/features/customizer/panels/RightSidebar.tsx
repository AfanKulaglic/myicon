import { useCustomizer, useSelectedLayer, type Layer } from "../state/CustomizerContext";
import { cn } from "@/lib/utils";

const FONTS = ["Inter", "Plus Jakarta Sans", "Arial", "Georgia", "Times New Roman", "Courier New", "Impact"];
const COLORS = ["#111111", "#FFFFFF", "#1E5AA8", "#C03434", "#E5A21C", "#1A8754", "#7C3AED"];

export function RightSidebar() {
  const c = useCustomizer();
  const sel = useSelectedLayer();

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <ViewSwitcher />
      <ProductOptions />
      {sel ? <LayerControls layer={sel} /> : <EmptySelection />}
    </div>
  );
}

function ViewSwitcher() {
  const { product, viewId, setViewId, setSelectedId } = useCustomizer();
  // Prefer placements as the list of switchable views
  const views = (product.placements?.length ? product.placements : product.views).map((v) => ({
    id: v.id,
    label: v.label,
  }));
  return (
    <div className="p-4 border-b border-line">
      <div className="text-xs font-semibold text-ink-muted uppercase mb-2">Ansicht</div>
      <div className="grid grid-cols-2 gap-2">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => { setViewId(v.id); setSelectedId(null); }}
            className={cn(
              "py-2 rounded-lg text-sm font-medium border transition-colors",
              viewId === v.id
                ? "border-brand bg-brand/5 text-brand"
                : "border-line text-ink-muted hover:border-ink"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductOptions() {
  const { product, productColor, setProductColor, productSize, setProductSize } = useCustomizer();
  return (
    <div className="p-4 border-b border-line space-y-4">
      {product.colors && product.colors.length > 0 ? (
        <div>
          <div className="text-xs font-semibold text-ink-muted uppercase mb-2">Farbe</div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setProductColor(c.name)}
                className={cn(
                  "size-8 rounded-full border-2",
                  productColor === c.name ? "border-brand" : "border-line"
                )}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      ) : null}
      {product.sizes && product.sizes.length > 0 ? (
        <div>
          <div className="text-xs font-semibold text-ink-muted uppercase mb-2">Größe</div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setProductSize(s)}
                className={cn(
                  "min-w-9 h-8 px-2 rounded-md border text-xs font-medium",
                  productSize === s ? "border-brand bg-brand text-white" : "border-line"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmptySelection() {
  return (
    <div className="p-6 text-center text-xs text-ink-muted">
      <div className="mx-auto size-12 rounded-full bg-surface-alt flex items-center justify-center mb-3">
        <span className="text-lg">✨</span>
      </div>
      <p className="font-medium text-ink">Kein Element ausgewählt</p>
      <p className="mt-1.5">Tippen Sie auf ein Element auf der Leinwand, um es zu bearbeiten.</p>
      <div className="mt-5 pt-4 border-t border-line text-left">
        <p className="text-[10px] uppercase tracking-wide text-ink-subtle font-semibold mb-2">Tastenkürzel</p>
        <ul className="space-y-1.5 text-[11px]">
          <li className="flex justify-between"><span>Rückgängig</span><kbd className="px-1.5 py-0.5 bg-surface-alt rounded text-[10px] font-mono">Strg+Z</kbd></li>
          <li className="flex justify-between"><span>Duplizieren</span><kbd className="px-1.5 py-0.5 bg-surface-alt rounded text-[10px] font-mono">Strg+D</kbd></li>
          <li className="flex justify-between"><span>Löschen</span><kbd className="px-1.5 py-0.5 bg-surface-alt rounded text-[10px] font-mono">Entf</kbd></li>
          <li className="flex justify-between"><span>Bewegen</span><kbd className="px-1.5 py-0.5 bg-surface-alt rounded text-[10px] font-mono">↑↓←→</kbd></li>
        </ul>
      </div>
    </div>
  );
}

function LayerControls({ layer }: { layer: Layer }) {
  const { updateLayer, removeLayer, duplicateLayer, bringToFront, sendToBack } = useCustomizer();
  const typeLabel =
    layer.type === "text" ? "Text" :
    layer.type === "image" ? "Bild" :
    layer.type === "rect" ? "Rechteck" : "Kreis";

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Eigenschaften</div>
        <span className="text-[10px] font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">{typeLabel}</span>
      </div>

      {layer.type === "text" && (
        <TextControls layer={layer} />
      )}

      {(layer.type === "rect" || layer.type === "circle") && (
        <ColorRow
          label="Farbe"
          value={layer.fill}
          onChange={(v) => updateLayer(layer.id, { fill: v } as Partial<Layer>)}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-ink-muted">Deckkraft</label>
          <span className="text-xs font-mono text-ink">{Math.round(layer.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min={0} max={1} step={0.05}
          value={layer.opacity}
          onChange={(e) => updateLayer(layer.id, { opacity: Number(e.target.value) })}
          className="w-full accent-brand"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-ink-muted">Drehung</label>
          <span className="text-xs font-mono text-ink">{Math.round(layer.rotation)}°</span>
        </div>
        <input
          type="range"
          min={-180} max={180} step={1}
          value={layer.rotation}
          onChange={(e) => updateLayer(layer.id, { rotation: Number(e.target.value) })}
          className="w-full accent-brand"
        />
      </div>

      <div className="pt-3 border-t border-line space-y-2">
        <div className="text-[10px] uppercase tracking-wide text-ink-subtle font-semibold mb-1">Aktionen</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => bringToFront(layer.id)} className="btn-outline text-xs py-2">Nach vorne</button>
          <button onClick={() => sendToBack(layer.id)} className="btn-outline text-xs py-2">Nach hinten</button>
          <button onClick={() => duplicateLayer(layer.id)} className="btn-outline text-xs py-2">Duplizieren</button>
          <button
            onClick={() => removeLayer(layer.id)}
            className="btn bg-red-50 text-red-600 hover:bg-red-100 py-2 text-xs"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

function TextControls({ layer }: { layer: Extract<Layer, { type: "text" }> }) {
  const { updateLayer } = useCustomizer();
  return (
    <div className="space-y-4">
      <div>
        <label className="label text-xs">Text</label>
        <textarea
          rows={2}
          value={layer.text}
          onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
          className="input resize-none"
        />
      </div>
      <div>
        <label className="label text-xs">Schriftart</label>
        <select
          value={layer.fontFamily}
          onChange={(e) => updateLayer(layer.id, { fontFamily: e.target.value })}
          className="input"
        >
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label text-xs">Größe</label>
          <input
            type="number"
            value={layer.fontSize}
            onChange={(e) => updateLayer(layer.id, { fontSize: Math.max(6, Number(e.target.value)) })}
            className="input"
          />
        </div>
        <div>
          <label className="label text-xs">Stil</label>
          <select
            value={layer.fontStyle}
            onChange={(e) => updateLayer(layer.id, { fontStyle: e.target.value as Layer["type"] extends "text" ? never : never })}
            className="input"
          >
            <option value="normal">Normal</option>
            <option value="bold">Fett</option>
            <option value="italic">Kursiv</option>
            <option value="bold italic">Fett kursiv</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label text-xs">Ausrichtung</label>
        <div className="grid grid-cols-3 gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => updateLayer(layer.id, { align: a })}
              className={cn(
                "h-9 rounded-lg border text-xs font-medium capitalize",
                layer.align === a ? "border-brand bg-brand/5 text-brand" : "border-line"
              )}
            >
              {a === "left" ? "Links" : a === "center" ? "Mitte" : "Rechts"}
            </button>
          ))}
        </div>
      </div>
      <ColorRow
        label="Farbe"
        value={layer.fill}
        onChange={(v) => updateLayer(layer.id, { fill: v })}
      />
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-muted block mb-1.5">{label}</label>
      <div className="flex flex-wrap items-center gap-1.5">
        {COLORS.map((c) => {
          const selected = value.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={cn(
                "size-8 rounded-lg border-2 transition-all relative",
                selected
                  ? "border-brand scale-110 shadow-sm"
                  : "border-line hover:scale-105"
              )}
              style={{ backgroundColor: c }}
              aria-label={c}
            >
              {selected && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                  style={{ color: c === "#FFFFFF" || c === "#E5A21C" ? "#111" : "#fff" }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
        <label className="size-8 rounded-lg border-2 border-line cursor-pointer overflow-hidden relative hover:scale-105 transition-transform"
          style={{
            background: "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
          title="Eigene Farbe"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
