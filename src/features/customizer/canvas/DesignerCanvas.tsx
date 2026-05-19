import { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer as KLayer, Rect, Group, Image as KImage, Text as KText, Circle, Transformer, Line } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { ChevronUp, ChevronDown, Copy, Trash2, Lock, Unlock } from "lucide-react";
import { useCustomizer, type Layer } from "../state/CustomizerContext";

const CANVAS_REF_WIDTH = 1000; // base reference width

/**
 * Green-screen recolor with shadow / highlight split.
 *
 * Mockups are shot with the garment in pure green (#00FF00) on white. The
 * green channel encodes fabric luminance: deepest folds ≈ 60, mid-tone fabric
 * ≈ 180, lit highlights ≈ 255.
 *
 * A pure multiply (`out = target × L`) flattens dark colours because
 * `black × L = black` everywhere — no fold detail survives. Real fabric also
 * shows lighter highlights where light hits, so we split the luminance:
 *
 *   if L ≤ midpoint  →  out = target × (L / midpoint)
 *                       (shadow band: darken target toward black)
 *
 *   if L >  midpoint →  t   = (L - midpoint) / (1 - midpoint)
 *                       out = target + (1 - target) × t × HIGHLIGHT_STRENGTH
 *                       (highlight band: blend target toward white)
 *
 * At `L = midpoint` the output is exactly `target` (no recolor distortion).
 * Below midpoint, the target gets multiplied down to near-black at the deepest
 * folds. Above midpoint, even pure-black target picks up grey highlights, so
 * black hoodies / red hoodies / navy hoodies all show realistic fabric folds.
 *
 * Tuning:
 *   MIDPOINT = 0.62  → fits photos where most fabric sits a bit below pure green
 *   HIGHLIGHT_STRENGTH = 0.55 → strong enough to show through pure black
 *
 * Non-green pixels (background, labels, drawstrings) are killed via the
 * `greenness = g - max(r,b)` test, with a soft anti-aliased edge.
 */
const MIDPOINT = 0.62;
const HIGHLIGHT_STRENGTH = 0.55;

/**
 * Recolor SVG by replacing green fill with target color.
 * For SVG mockups, we can't use pixel-based processing, so we fetch the SVG,
 * parse it, and replace all green fills with the target color.
 */
function useSVGRecolor(
  src: string,
  targetHex: string | null
): HTMLImageElement | null {
  const [out, setOut] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src.endsWith('.svg')) {
      // Not an SVG, return null and let the raster handler take over
      setOut(null);
      return;
    }
    if (!targetHex) {
      // No color specified, load SVG as-is
      const img = new Image();
      img.onload = () => setOut(img);
      img.src = src;
      return;
    }

    // Fetch and recolor the SVG
    fetch(src)
      .then((res) => res.text())
      .then((svgText) => {
        // Replace all instances of green (#00FF00, #0f0, rgb(0,255,0), etc.)
        const recolored = svgText
          .replace(/fill="#00FF00"/gi, `fill="${targetHex}"`)
          .replace(/fill="#0F0"/gi, `fill="${targetHex}"`)
          .replace(/fill="rgb\(0,\s*255,\s*0\)"/gi, `fill="${targetHex}"`);
        
        // Convert to data URL
        const blob = new Blob([recolored], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
          setOut(img);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      })
      .catch(() => {
        // Fallback: load original SVG
        const img = new Image();
        img.onload = () => setOut(img);
        img.src = src;
      });
  }, [src, targetHex]);

  return out;
}

function useGreenScreenRecolor(
  src: string,
  targetHex: string | null
): HTMLImageElement | null {
  const [base] = useImage(src, "anonymous");
  const [out, setOut] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!base) {
      setOut(null);
      return;
    }
    if (!targetHex) {
      setOut(base);
      return;
    }
    const hex = targetHex.replace("#", "");
    let tr = parseInt(hex.slice(0, 2), 16);
    let tg = parseInt(hex.slice(2, 4), 16);
    let tb = parseInt(hex.slice(4, 6), 16);
    if (Number.isNaN(tr) || Number.isNaN(tg) || Number.isNaN(tb)) {
      setOut(base);
      return;
    }
    // Clamp very bright targets so fabric folds stay visible. Pure white
    // (#FFFFFF) recolors to a flat white where shadows blend invisibly into
    // the page; capping each channel at MAX_TARGET keeps a tiny bit of
    // grey in the deepest folds so the garment shape reads as fabric.
    const MAX_TARGET = 232;
    if (tr > MAX_TARGET) tr = MAX_TARGET;
    if (tg > MAX_TARGET) tg = MAX_TARGET;
    if (tb > MAX_TARGET) tb = MAX_TARGET;

    const canvas = document.createElement("canvas");
    canvas.width = base.naturalWidth || base.width;
    canvas.height = base.naturalHeight || base.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(base, 0, 0);
    let data: ImageData;
    try {
      data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch {
      setOut(base);
      return;
    }
    const px = data.data;
    const midInv = 1 / MIDPOINT;
    const highInv = 1 / (1 - MIDPOINT);
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const greenness = g - Math.max(r, b);
      if (greenness <= 0) {
        px[i + 3] = 0;
        continue;
      }
      const alpha = greenness < 60 ? greenness / 60 : 1;
      const L = g / 255;
      let or: number;
      let og: number;
      let ob: number;
      if (L <= MIDPOINT) {
        const s = L * midInv; // 0..1
        or = tr * s;
        og = tg * s;
        ob = tb * s;
      } else {
        const t = (L - MIDPOINT) * highInv * HIGHLIGHT_STRENGTH; // 0..HIGHLIGHT_STRENGTH
        or = tr + (255 - tr) * t;
        og = tg + (255 - tg) * t;
        ob = tb + (255 - tb) * t;
      }
      px[i] = or | 0;
      px[i + 1] = og | 0;
      px[i + 2] = ob | 0;
      px[i + 3] = (255 * alpha) | 0;
    }
    ctx.putImageData(data, 0, 0);
    const img = new Image();
    img.onload = () => setOut(img);
    img.src = canvas.toDataURL("image/png");
  }, [base, targetHex]);

  return out;
}

function MockupImage({
  src,
  width,
  height,
  targetHex,
}: {
  src: string;
  width: number;
  height: number;
  /** When set, the source photo is recoloured via green-screen replacement. */
  targetHex?: string | null;
}) {
  // Use SVG recoloring for SVG files, raster recoloring for PNG/JPG
  const svgImg = useSVGRecolor(src, targetHex ?? null);
  const rasterImg = useGreenScreenRecolor(src, targetHex ?? null);
  
  const img = src.endsWith('.svg') ? svgImg : rasterImg;
  
  // Pulsing animation for loading state
  const [pulseOpacity, setPulseOpacity] = useState(0.4);
  
  useEffect(() => {
    if (img) return; // Stop animation when loaded
    
    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycle = (elapsed % 1500) / 1500; // 1.5s cycle
      const opacity = 0.3 + Math.sin(cycle * Math.PI * 2) * 0.15; // Oscillate between 0.15 and 0.45
      setPulseOpacity(opacity);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [img]);
  
  if (!img) {
    // Loading skeleton - show a subtle pulsing placeholder
    return (
      <Group>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#E2E8F0"
          listening={false}
        />
        <Rect
          x={width * 0.25}
          y={height * 0.3}
          width={width * 0.5}
          height={height * 0.4}
          fill="#CBD5E1"
          opacity={pulseOpacity}
          cornerRadius={8}
          listening={false}
        />
        <KText
          x={0}
          y={height / 2 - 10}
          width={width}
          text="Mockup wird geladen..."
          fontSize={14}
          fontFamily="Inter, sans-serif"
          fill="#64748B"
          align="center"
          opacity={0.6 + pulseOpacity * 0.4}
          listening={false}
        />
      </Group>
    );
  }
  
  return (
    <KImage
      image={img}
      x={0}
      y={0}
      width={width}
      height={height}
      listening={false}
    />
  );
}

function CanvasImageLayer({
  layer,
  common,
}: {
  layer: Layer & { type: "image" };
  common: Record<string, unknown>;
}) {
  const [img] = useImage(layer.src, "anonymous");
  if (!img) return null;
  return (
    <KImage
      {...common}
      image={img}
      width={layer.width}
      height={layer.height}
    />
  );
}

export function DesignerCanvas() {
  const {
    product,
    viewId,
    layers,
    selectedId,
    setSelectedId,
    updateLayer,
    removeLayer,
    duplicateLayer,
    bringForward,
    sendBackward,
    zoom,
    showBleed,
    exportRef,
    undo,
    redo,
    productColor,
  } = useCustomizer();

  // Resolve the selected color name to a hex from the product palette.
  // Mockup photos are shot with the garment in pure green (#00FF00) on a
  // white background. `useGreenScreenRecolor` detects green pixels via
  //   greenness = g - max(r,b)
  // and outputs `targetColor × (g/255)` so:
  //   • White (#FFFFFF)  → garment is white with folds preserved
  //   • Red, Marine, …   → garment becomes that hue with folds preserved
  //   • Black (#111111)  → garment is near-black, deepest folds darken further
  //   • No palette       → raw photo shown unchanged (still green)
  const colorHex = useMemo(() => {
    if (!product.colors || product.colors.length === 0) return null;
    const match = product.colors.find((c) => c.name === productColor);
    return match?.hex ?? product.colors[0]?.hex ?? null;
  }, [product.colors, productColor]);


  const view = product.views.find((v) => v.id === viewId) ?? product.views[0];
  // Prefer placement-based rendering when placements exist
  const activePlacement = useMemo(
    () => product.placements?.find((p) => p.id === viewId) ?? null,
    [product.placements, viewId]
  );

  // Reference canvas dimensions — non-square for tall mockups (e.g. 1000×1200 t-shirt)
  const refW = activePlacement?.mockupWidth ?? CANVAS_REF_WIDTH;
  const refH = activePlacement?.mockupHeight ?? CANVAS_REF_WIDTH;

  // Mockup image source
  const mockupSrc = activePlacement?.mockup ?? view.image;

  // Print area in canvas units (absolute pixels on the reference canvas)
  const area = useMemo(() => {
    if (activePlacement) {
      const { leftPct, topPct, widthPct, heightPct } = activePlacement.printArea;
      return {
        x: (leftPct / 100) * refW,
        y: (topPct / 100) * refH,
        width: (widthPct / 100) * refW,
        height: (heightPct / 100) * refH,
      };
    }
    return view.area;
  }, [activePlacement, view.area, refW, refH]);

  // Safe zone inset (absolute px)
  const safeInsetX = activePlacement ? ((activePlacement.safePct ?? 0) / 100) * area.width : 0;
  const safeInsetY = activePlacement ? ((activePlacement.safePct ?? 0) / 100) * area.height : 0;

  // Bleed outset (absolute px)
  const bleedOutX = activePlacement ? ((activePlacement.bleedPct ?? 0) / 100) * area.width : 10;
  const bleedOutY = activePlacement ? ((activePlacement.bleedPct ?? 0) / 100) * area.height : 10;

  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container size with ResizeObserver — stageSize derived in useMemo
  const [containerSize, setContainerSize] = useState({ width: 800, height: 800 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Derive stage size to maintain mockup aspect ratio, fit container
  const stageSize = useMemo(() => {
    const pad = 48;
    const targetW = Math.max(100, containerSize.width - pad);
    const targetH = Math.max(100, containerSize.height - pad);
    const scale = Math.min(targetW / refW, targetH / refH);
    return { width: refW * scale, height: refH * scale };
  }, [containerSize, refW, refH]);

  const stageScale = (stageSize.width / refW) * zoom;

  // Attach transformer
  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }
    const node = stage.findOne(`#${selectedId}`);
    if (node) {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId, layers, viewId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault(); undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault(); redo();
      } else if (selectedId && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault(); removeLayer(selectedId);
      } else if (selectedId && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault(); duplicateLayer(selectedId);
      } else if (selectedId) {
        const step = e.shiftKey ? 10 : 1;
        const l = layers.find((x) => x.id === selectedId);
        if (!l) return;
        if (e.key === "ArrowLeft") { e.preventDefault(); updateLayer(selectedId, { x: l.x - step }); }
        else if (e.key === "ArrowRight") { e.preventDefault(); updateLayer(selectedId, { x: l.x + step }); }
        else if (e.key === "ArrowUp") { e.preventDefault(); updateLayer(selectedId, { y: l.y - step }); }
        else if (e.key === "ArrowDown") { e.preventDefault(); updateLayer(selectedId, { y: l.y + step }); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, layers, removeLayer, duplicateLayer, updateLayer, undo, redo]);

  // Export function
  useEffect(() => {
    exportRef.current = () => {
      const stage = stageRef.current;
      if (!stage) return null;
      // temporarily hide transformer
      trRef.current?.visible(false);
      trRef.current?.getLayer()?.batchDraw();
      const url = stage.toDataURL({ pixelRatio: 2 });
      trRef.current?.visible(true);
      trRef.current?.getLayer()?.batchDraw();
      return url;
    };
    return () => { exportRef.current = null; };
  }, [exportRef]);

  // Snapping guides
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  const currentLayers = useMemo(
    () => layers.filter((l) => l.viewId === viewId),
    [layers, viewId]
  );

  // ─── Same-side neighbours ─────────────────────────────────────────────
  // Placements that share the SAME mockup image as the active one are on
  // the same physical face of the product (e.g. a t-shirt's `front`
  // placement and `chest_left` placement both use /mockups/tshirt/front.png).
  // The zones stay independent (each layer still belongs to exactly one
  // placement), but when editing one zone we softly preview the designs
  // placed in the other same-side zones so the user can see how everything
  // sits on that face of the garment.
  const sameSidePlacements = useMemo(() => {
    if (!activePlacement || !product.placements) return [];
    return product.placements.filter(
      (p) => p.id !== activePlacement.id && p.mockup === activePlacement.mockup
    );
  }, [activePlacement, product.placements]);

  const ghostLayers = useMemo(() => {
    if (sameSidePlacements.length === 0) return [];
    const ids = new Set(sameSidePlacements.map((p) => p.id));
    return layers.filter((l) => ids.has(l.viewId));
  }, [sameSidePlacements, layers]);

  // Pre-compute neighbour print-area rectangles in canvas units so we can
  // draw a faint outline + tiny label tag for each.
  const sameSideRects = useMemo(
    () =>
      sameSidePlacements.map((p) => ({
        id: p.id,
        label: p.label,
        x: (p.printArea.leftPct / 100) * refW,
        y: (p.printArea.topPct / 100) * refH,
        width: (p.printArea.widthPct / 100) * refW,
        height: (p.printArea.heightPct / 100) * refH,
      })),
    [sameSidePlacements, refW, refH]
  );

  // Floating action toolbar position (in stage container coords, DOM px)
  const [toolbarBox, setToolbarBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const selectedLayer = useMemo(() => layers.find((l) => l.id === selectedId) ?? null, [layers, selectedId]);

  // Recompute toolbar position whenever selection / transform / zoom / pan changes
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !selectedId) { setToolbarBox(null); return; }
    const update = () => {
      const node = stage.findOne(`#${selectedId}`);
      if (!node) { setToolbarBox(null); return; }
      const rect = node.getClientRect({ relativeTo: stage as unknown as Konva.Container });
      setToolbarBox({
        x: rect.x * stageScale,
        y: rect.y * stageScale,
        w: rect.width * stageScale,
        h: rect.height * stageScale,
      });
    };
    update();
    const handlers = ["dragmove", "transform", "transformend", "dragend"];
    handlers.forEach((evt) => stage.on(`${evt}.toolbar`, update));
    return () => { handlers.forEach((evt) => stage.off(`${evt}.toolbar`)); };
  }, [selectedId, layers, stageScale, viewId]);

  const isLocked = !!(selectedLayer && "locked" in selectedLayer && selectedLayer.locked);

  return (
    <div ref={containerRef} className="size-full flex items-center justify-center overflow-hidden">
      <div
        style={{
          width: stageSize.width * zoom,
          height: stageSize.height * zoom,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        className="bg-white shadow-elevated rounded-lg overflow-hidden border border-line"
      >
        <Stage
          ref={stageRef}
          width={refW * stageScale}
          height={refH * stageScale}
          scaleX={stageScale}
          scaleY={stageScale}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          {/* Backdrop layer — solid panel behind the garment so transparent
              areas of the recoloured mockup show a clean grey background. */}
          <KLayer listening={false}>
            <Rect x={0} y={0} width={refW} height={refH} fill="#F5F6F8" />
          </KLayer>

          {/* Garment layer — green-screen recolour. The mockup photo's green
              pixels are mapped to the selected palette colour, modulated by
              the green channel as a luminance map; non-green pixels are made
              fully transparent. One pass, exact silhouette, folds intact. */}
          <KLayer listening={false}>
            <MockupImage
              src={mockupSrc}
              width={refW}
              height={refH}
              targetHex={colorHex}
            />
          </KLayer>

          {/* Print area + safe zone + bleed */}
          <KLayer listening={false}>
            {/* Bleed outset — red dashed */}
            {showBleed && (
              <Rect
                x={area.x - bleedOutX}
                y={area.y - bleedOutY}
                width={area.width + bleedOutX * 2}
                height={area.height + bleedOutY * 2}
                stroke="#C03434"
                strokeWidth={1}
                dash={[6, 6]}
              />
            )}
            {/* Print area border — brand blue */}
            <Rect
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              stroke="#1E5AA8"
              strokeWidth={1.5}
              dash={[4, 4]}
            />
            {/* Safe zone inset — green dashed */}
            {(safeInsetX > 0 || safeInsetY > 0) && (
              <Rect
                x={area.x + safeInsetX}
                y={area.y + safeInsetY}
                width={area.width - safeInsetX * 2}
                height={area.height - safeInsetY * 2}
                stroke="#1A8754"
                strokeWidth={1}
                dash={[4, 4]}
                opacity={0.7}
              />
            )}
          </KLayer>

          {/* Same-side neighbours — faint outlines of OTHER print areas on
              this face of the product, plus ghosted previews of any layers
              the user already placed in those zones. Read-only. */}
          {sameSideRects.length > 0 && (
            <KLayer listening={false}>
              {sameSideRects.map((r) => (
                <Group key={`neighbour-${r.id}`}>
                  <Rect
                    x={r.x}
                    y={r.y}
                    width={r.width}
                    height={r.height}
                    stroke="#94A3B8"
                    strokeWidth={1}
                    dash={[3, 5]}
                    opacity={0.55}
                  />
                  <KText
                    x={r.x + 4}
                    y={r.y + 4}
                    text={r.label}
                    fontSize={11}
                    fontFamily="Inter, sans-serif"
                    fill="#64748B"
                    opacity={0.75}
                  />
                </Group>
              ))}
              {ghostLayers.map((l) => {
                const baseOpacity = (l.opacity ?? 1) * 0.35;
                if (l.type === "rect") {
                  return (
                    <Rect
                      key={`ghost-${l.id}`}
                      x={l.x}
                      y={l.y}
                      width={l.width}
                      height={l.height}
                      rotation={l.rotation}
                      fill={l.fill}
                      stroke={l.stroke}
                      strokeWidth={l.strokeWidth ?? 0}
                      opacity={baseOpacity}
                    />
                  );
                }
                if (l.type === "circle") {
                  return (
                    <Circle
                      key={`ghost-${l.id}`}
                      x={l.x + l.width / 2}
                      y={l.y + l.height / 2}
                      radius={Math.min(l.width, l.height) / 2}
                      rotation={l.rotation}
                      fill={l.fill}
                      stroke={l.stroke}
                      strokeWidth={l.strokeWidth ?? 0}
                      opacity={baseOpacity}
                    />
                  );
                }
                if (l.type === "text") {
                  return (
                    <KText
                      key={`ghost-${l.id}`}
                      x={l.x}
                      y={l.y}
                      rotation={l.rotation}
                      text={l.text}
                      width={l.width}
                      fontSize={l.fontSize}
                      fontFamily={l.fontFamily}
                      fontStyle={l.fontStyle}
                      fill={l.fill}
                      align={l.align}
                      opacity={baseOpacity}
                    />
                  );
                }
                if (l.type === "image") {
                  return (
                    <CanvasImageLayer
                      key={`ghost-${l.id}`}
                      layer={l}
                      common={{
                        x: l.x,
                        y: l.y,
                        rotation: l.rotation,
                        opacity: baseOpacity,
                        listening: false,
                      }}
                    />
                  );
                }
                return null;
              })}
            </KLayer>
          )}

          {/* Clipped design area */}
          <KLayer>
            <Group
              clipFunc={(ctx) => {
                ctx.rect(area.x, area.y, area.width, area.height);
              }}
            >
              {currentLayers.map((l) => {
                const common = {
                  id: l.id,
                  x: l.x,
                  y: l.y,
                  rotation: l.rotation,
                  opacity: l.opacity,
                  draggable: !l.locked,
                  onClick: () => setSelectedId(l.id),
                  onTap: () => setSelectedId(l.id),
                  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => {
                    const node = e.target;
                    const layerW = (l as { width: number }).width;
                    const layerH = (l as { height: number }).height;
                    // simple center-snapping
                    const cx = node.x() + layerW / 2;
                    const cy = node.y() + layerH / 2;
                    const acx = area.x + area.width / 2;
                    const acy = area.y + area.height / 2;
                    const newGuides: { x: number[]; y: number[] } = { x: [], y: [] };
                    if (Math.abs(cx - acx) < 6) {
                      node.x(acx - layerW / 2);
                      newGuides.x.push(acx);
                    }
                    if (Math.abs(cy - acy) < 6) {
                      node.y(acy - layerH / 2);
                      newGuides.y.push(acy);
                    }
                    setGuides(newGuides);
                  },
                  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                    setGuides({ x: [], y: [] });
                    updateLayer(l.id, { x: e.target.x(), y: e.target.y() });
                  },
                  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
                    const node = e.target as Konva.Node;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    if (l.type === "text") {
                      updateLayer(l.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        width: Math.max(20, (l as { width: number }).width * scaleX),
                        fontSize: Math.max(8, (l as { fontSize: number }).fontSize * scaleY),
                      } as Partial<Layer>);
                    } else {
                      updateLayer(l.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        width: Math.max(10, (l as { width: number }).width * scaleX),
                        height: Math.max(10, (l as { height: number }).height * scaleY),
                      } as Partial<Layer>);
                    }
                  },
                };
                if (l.type === "image") return <CanvasImageLayer key={l.id} layer={l} common={common} />;
                if (l.type === "rect") return (
                  <Rect key={l.id} {...common}
                        width={l.width} height={l.height}
                        fill={l.fill} stroke={l.stroke}
                        strokeWidth={l.strokeWidth ?? 0} />
                );
                if (l.type === "circle") return (
                  <Circle key={l.id} {...common}
                          x={l.x + l.width / 2} y={l.y + l.height / 2}
                          radius={Math.min(l.width, l.height) / 2}
                          fill={l.fill} stroke={l.stroke}
                          strokeWidth={l.strokeWidth ?? 0} />
                );
                if (l.type === "text") return (
                  <KText
                    key={l.id}
                    {...common}
                    text={l.text}
                    width={l.width}
                    fontSize={l.fontSize}
                    fontFamily={l.fontFamily}
                    fontStyle={l.fontStyle}
                    fill={l.fill}
                    align={l.align}
                  />
                );
                return null;
              })}
            </Group>
          </KLayer>

          {/* Layer outlines — dashed selection helpers around every (unselected) layer */}
          <KLayer listening={false}>
            {currentLayers.map((l) => {
              if (l.id === selectedId) return null; // selected gets transformer border instead
              if (l.type === "circle") {
                return (
                  <Circle
                    key={`outline-${l.id}`}
                    x={l.x + l.width / 2}
                    y={l.y + l.height / 2}
                    radius={Math.min(l.width, l.height) / 2}
                    rotation={l.rotation}
                    stroke="#1E5AA8"
                    strokeWidth={1}
                    dash={[5, 4]}
                    opacity={0.4}
                  />
                );
              }
              const w = (l as { width: number }).width;
              const h = l.type === "text"
                ? Math.max(20, (l as { fontSize: number }).fontSize * 1.4)
                : (l as { height: number }).height;
              return (
                <Rect
                  key={`outline-${l.id}`}
                  x={l.x}
                  y={l.y}
                  width={w}
                  height={h}
                  rotation={l.rotation}
                  stroke="#1E5AA8"
                  strokeWidth={1}
                  dash={[5, 4]}
                  opacity={0.4}
                />
              );
            })}
          </KLayer>

          {/* Rulers / guides */}
          <KLayer listening={false}>
            {guides.x.map((x, i) => (
              <Line key={`gx${i}`} points={[x, 0, x, refH]} stroke="#1E5AA8" strokeWidth={1} dash={[4, 4]} />
            ))}
            {guides.y.map((y, i) => (
              <Line key={`gy${i}`} points={[0, y, refW, y]} stroke="#1E5AA8" strokeWidth={1} dash={[4, 4]} />
            ))}
          </KLayer>

          {/* Transformer */}
          <KLayer>
            <Transformer
              ref={trRef}
              rotateEnabled
              enabledAnchors={[
                "top-left", "top-right", "bottom-left", "bottom-right",
                "middle-left", "middle-right", "top-center", "bottom-center",
              ]}
              borderStroke="#1E5AA8"
              borderStrokeWidth={2}
              borderDash={[]}
              anchorStroke="#1E5AA8"
              anchorStrokeWidth={2}
              anchorFill="#FFFFFF"
              anchorSize={14}
              anchorCornerRadius={7}
              rotateAnchorOffset={36}
              padding={2}
              ignoreStroke
            />
          </KLayer>
        </Stage>

        {/* Floating Canva-style action toolbar */}
        {toolbarBox && selectedLayer && (
          <div
            className="absolute z-20 flex items-center gap-0.5 bg-white shadow-pop border border-line rounded-xl px-1.5 py-1 pointer-events-auto"
            style={{
              left: toolbarBox.x + toolbarBox.w / 2,
              top: Math.max(8, toolbarBox.y - 12),
              transform: "translate(-50%, -100%)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <ToolbarBtn title="Nach vorne" onClick={() => bringForward(selectedLayer.id)}>
              <ChevronUp className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn title="Nach hinten" onClick={() => sendBackward(selectedLayer.id)}>
              <ChevronDown className="size-4" />
            </ToolbarBtn>
            <ToolbarDivider />
            <ToolbarBtn title="Duplizieren" onClick={() => duplicateLayer(selectedLayer.id)}>
              <Copy className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn
              title={isLocked ? "Entsperren" : "Sperren"}
              active={isLocked}
              onClick={() => updateLayer(selectedLayer.id, { locked: !isLocked } as Partial<Layer>)}
            >
              {isLocked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
            </ToolbarBtn>
            <ToolbarDivider />
            <ToolbarBtn title="Löschen" danger onClick={() => removeLayer(selectedLayer.id)}>
              <Trash2 className="size-4" />
            </ToolbarBtn>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarBtn({
  children, onClick, title, danger, active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors " +
        (danger
          ? "text-red-500 hover:bg-red-50"
          : active
          ? "text-brand bg-brand/10"
          : "text-ink-muted hover:text-ink hover:bg-surface-alt")
      }
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="w-px h-5 bg-line mx-0.5" />;
}
