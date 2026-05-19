import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import type { Product } from "@/types";
import { uid } from "@/lib/utils";

export type LayerType = "text" | "image" | "rect" | "circle";

export interface BaseLayer {
  id: string;
  type: LayerType;
  viewId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: "normal" | "bold" | "italic" | "bold italic";
  align: "left" | "center" | "right";
  fill: string;
  curve?: number; // -1..1
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  src: string;
}

export interface ShapeLayer extends BaseLayer {
  type: "rect" | "circle";
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export type Layer = TextLayer | ImageLayer | ShapeLayer;

interface HistoryEntry {
  layers: Layer[];
}

interface CustomizerState {
  product: Product;
  viewId: string;
  setViewId: (id: string) => void;
  productColor: string;
  setProductColor: (c: string) => void;
  productSize?: string;
  setProductSize: (s: string) => void;
  layers: Layer[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  zoom: number;
  setZoom: (z: number) => void;
  showRulers: boolean;
  toggleRulers: () => void;
  showBleed: boolean;
  toggleBleed: () => void;
  addLayer: (l: Omit<Layer, "id" | "viewId"> & { viewId?: string }) => string;
  updateLayer: (id: string, patch: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  serialize: () => unknown;
  loadFromSerialized: (data: unknown) => void;
  exportRef: React.MutableRefObject<(() => string | null) | null>;
}

const Ctx = createContext<CustomizerState | null>(null);

export function CustomizerProvider({
  product,
  initialColor,
  children,
}: {
  product: Product;
  initialColor?: string;
  children: ReactNode;
}) {
  const [viewId, setViewId] = useState(
    product.placements?.[0]?.id ?? product.views[0].id
  );
  const [productColor, setProductColor] = useState(
    initialColor ?? product.colors?.[0]?.name ?? "Weiß"
  );
  const [productSize, setProductSize] = useState<string | undefined>(product.sizes?.[3]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showRulers, setShowRulers] = useState(true);
  const [showBleed, setShowBleed] = useState(true);

  const exportRef = useRef<(() => string | null) | null>(null);

  // History
  const past = useRef<HistoryEntry[]>([]);
  const future = useRef<HistoryEntry[]>([]);
  const [, force] = useState(0);
  const tick = () => force((n) => n + 1);

  const commit = useCallback((next: Layer[]) => {
    past.current.push({ layers });
    if (past.current.length > 50) past.current.shift();
    future.current = [];
    setLayers(next);
    tick();
  }, [layers]);

  const undo = useCallback(() => {
    const last = past.current.pop();
    if (!last) return;
    future.current.push({ layers });
    setLayers(last.layers);
    tick();
  }, [layers]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push({ layers });
    setLayers(next.layers);
    tick();
  }, [layers]);

  const addLayer: CustomizerState["addLayer"] = useCallback(
    (l) => {
      const id = uid("layer");
      const newLayer = { ...l, id, viewId: l.viewId ?? viewId } as Layer;
      commit([...layers, newLayer]);
      setSelectedId(id);
      return id;
    },
    [commit, layers, viewId]
  );

  const updateLayer = useCallback(
    (id: string, patch: Partial<Layer>) => {
      // Don't push to history for tiny drags — caller commits via "commit" semantics
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l))
      );
    },
    []
  );

  const removeLayer = useCallback(
    (id: string) => {
      commit(layers.filter((l) => l.id !== id));
      setSelectedId(null);
    },
    [commit, layers]
  );

  const duplicateLayer = useCallback(
    (id: string) => {
      const l = layers.find((x) => x.id === id);
      if (!l) return;
      const copy = { ...l, id: uid("layer"), x: l.x + 16, y: l.y + 16 } as Layer;
      commit([...layers, copy]);
      setSelectedId(copy.id);
    },
    [commit, layers]
  );

  const reorder = useCallback(
    (id: string, fn: (idx: number, arr: Layer[]) => number) => {
      const idx = layers.findIndex((l) => l.id === id);
      if (idx < 0) return;
      const target = fn(idx, layers);
      if (target === idx) return;
      const next = layers.slice();
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      commit(next);
    },
    [commit, layers]
  );

  const bringForward = useCallback(
    (id: string) => reorder(id, (i, a) => Math.min(a.length - 1, i + 1)),
    [reorder]
  );
  const sendBackward = useCallback(
    (id: string) => reorder(id, (i) => Math.max(0, i - 1)),
    [reorder]
  );
  const bringToFront = useCallback(
    (id: string) => reorder(id, (_, a) => a.length - 1),
    [reorder]
  );
  const sendToBack = useCallback((id: string) => reorder(id, () => 0), [reorder]);

  const serialize = useCallback(
    () => ({
      productId: product.id,
      viewId,
      productColor,
      productSize,
      layers,
    }),
    [product.id, viewId, productColor, productSize, layers]
  );

  const loadFromSerialized = useCallback((data: unknown) => {
    const d = data as ReturnType<typeof serialize>;
    if (!d) return;
    setViewId(d.viewId ?? product.views[0].id);
    setProductColor(d.productColor ?? productColor);
    setProductSize(d.productSize);
    setLayers(d.layers ?? []);
    past.current = [];
    future.current = [];
  }, [product.views, productColor]);

  const value = useMemo<CustomizerState>(
    () => ({
      product,
      viewId,
      setViewId,
      productColor,
      setProductColor,
      productSize,
      setProductSize,
      layers,
      selectedId,
      setSelectedId,
      zoom,
      setZoom,
      showRulers,
      toggleRulers: () => setShowRulers((v) => !v),
      showBleed,
      toggleBleed: () => setShowBleed((v) => !v),
      addLayer,
      updateLayer,
      removeLayer,
      duplicateLayer,
      bringForward,
      sendBackward,
      bringToFront,
      sendToBack,
      undo,
      redo,
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
      serialize,
      loadFromSerialized,
      exportRef,
    }),
    [
      product, viewId, productColor, productSize, layers, selectedId, zoom,
      showRulers, showBleed, addLayer, updateLayer, removeLayer, duplicateLayer,
      bringForward, sendBackward, bringToFront, sendToBack, undo, redo,
      serialize, loadFromSerialized,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCustomizer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCustomizer must be used within CustomizerProvider");
  return v;
}

export function useSelectedLayer(): Layer | null {
  const { layers, selectedId } = useCustomizer();
  return layers.find((l) => l.id === selectedId) ?? null;
}
