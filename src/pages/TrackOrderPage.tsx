import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Factory,
  XCircle,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { subscribeToOrder } from "@/lib/firestore";
import { useAuthStore } from "@/store/auth";
import { useTrackedOrdersStore } from "@/store/trackedOrders";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/store/toast";
import type { Order } from "@/types";

type Status = Order["status"];

const STEPS: { key: Status; label: string; Icon: React.ElementType }[] = [
  { key: "pending", label: "Eingegangen", Icon: Clock },
  { key: "processing", label: "In Bearbeitung", Icon: Factory },
  { key: "shipped", label: "Versandt", Icon: Truck },
  { key: "delivered", label: "Geliefert", Icon: CheckCircle2 },
];

const STATUS_INDEX: Record<Status, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

const STATUS_LABEL: Record<Status, string> = {
  pending: "Eingegangen",
  processing: "In Bearbeitung",
  shipped: "Versandt",
  delivered: "Geliefert",
  cancelled: "Storniert",
};

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-brand/10 text-brand",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function ProgressBar({ status }: { status: Status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <XCircle className="size-5" />
        Bestellung storniert
      </div>
    );
  }
  const current = STATUS_INDEX[status];
  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-1 sm:gap-2 relative z-10">
        {STEPS.map((step, i) => {
          const done = i <= current;
          const Icon = step.Icon;
          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={`size-10 rounded-full grid place-items-center border-2 transition-colors ${
                  done
                    ? "bg-brand border-brand text-white"
                    : "bg-white border-line text-ink-subtle"
                }`}
              >
                <Icon className="size-5" />
              </div>
              <p
                className={`text-[9px] sm:text-[11px] mt-2 font-medium ${
                  done ? "text-ink" : "text-ink-subtle"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
      {/* Connector line behind icons */}
      <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-line -z-0">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

interface OrderCardProps {
  id: string;
  defaultOpen?: boolean;
  onRemove?: (id: string) => void;
}

function OrderCard({ id, defaultOpen, onRemove }: OrderCardProps) {
  const [order, setOrder] = useState<Order | null | "loading">("loading");
  const [open, setOpen] = useState(!!defaultOpen);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = subscribeToOrder(id, (o) => setOrder(o));
    return () => unsub();
  }, [id]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  if (order === "loading") {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 w-32 bg-surface-alt rounded" />
        <div className="h-12 w-full bg-surface-alt rounded mt-4" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-sm">{id}</p>
            <p className="text-xs text-ink-muted mt-1">
              Diese Bestellung wurde nicht gefunden. Bitte prüfen Sie den Code.
            </p>
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(id)}
              className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt text-ink-muted"
              aria-label="Aus Liste entfernen"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 hover:bg-surface-alt/40 transition-colors"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium truncate">{order.id}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyId();
                }}
                className="size-7 inline-flex items-center justify-center rounded-md hover:bg-surface-alt text-ink-muted"
                aria-label="Bestellnummer kopieren"
              >
                {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("de-DE")} ·{" "}
              {order.items.length} Artikel · {formatCurrency(order.total)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            {onRemove && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(id);
                  }
                }}
                className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt text-ink-muted cursor-pointer"
                aria-label="Aus Liste entfernen"
              >
                <Trash2 className="size-4" />
              </span>
            )}
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar status={order.status} />
        </div>
      </button>

      {open && (
        <div className="border-t border-line bg-surface-alt/30 p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-ink-muted mb-1">Lieferadresse</p>
              <p className="text-sm">
                {order.address?.fullName}<br />
                {order.address?.street}<br />
                {order.address?.zip} {order.address?.city}<br />
                {order.address?.country}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-muted mb-1">Status</p>
              <p className="text-sm">{STATUS_LABEL[order.status]}</p>
              <p className="text-xs text-ink-muted mt-2">
                Der Status wird automatisch aktualisiert, sobald wir Ihre Bestellung weiterverarbeiten.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-ink-muted mb-2">Artikel</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 bg-white rounded-lg border border-line p-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-14 rounded-md object-cover border border-line shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {item.variant?.color}{item.variant?.color && item.variant?.size ? " · " : ""}
                      {item.variant?.size}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {order.items.some((i) => i.customDesigns && i.customDesigns.length > 0) && (
            <div>
              <p className="text-xs font-medium text-ink-muted mb-2">Ihre Designs</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {order.items.flatMap((i) =>
                  (i.customDesigns ?? []).map((d) => (
                    <a
                      key={`${i.id}-${d.viewId}`}
                      href={d.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="aspect-square bg-white rounded-md overflow-hidden border border-line group-hover:border-brand transition-colors">
                        <img src={d.imageUrl} alt={d.viewLabel} className="size-full object-contain" />
                      </div>
                      <p className="text-[11px] text-center mt-1 text-ink-muted group-hover:text-brand">
                        {d.viewLabel}
                      </p>
                    </a>
                  )),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  const params = useParams<{ id?: string }>();
  const trackedIds = useTrackedOrdersStore((s) => s.ids);
  const addTracked = useTrackedOrdersStore((s) => s.add);
  const removeTracked = useTrackedOrdersStore((s) => s.remove);
  const authOrders = useAuthStore((s) => s.orders);

  const [code, setCode] = useState("");
  const autoAdded = useRef<string | null>(null);

  // Auto-add the URL-param id to the tracked list (so /order/track/ord_xyz works
  // as a shareable deep link and remembers the code locally afterwards).
  useEffect(() => {
    const urlId = params.id?.trim();
    if (urlId && autoAdded.current !== urlId) {
      autoAdded.current = urlId;
      addTracked(urlId);
    }
  }, [params.id, addTracked]);

  const allIds = useMemo(() => {
    const fromAuth = authOrders.map((o) => o.id);
    return Array.from(new Set([...trackedIds, ...fromAuth]));
  }, [trackedIds, authOrders]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    addTracked(trimmed);
    setCode("");
    toast({ title: "Bestellung hinzugefügt", description: trimmed });
  };

  return (
    <div className="container py-10 lg:py-14 max-w-3xl">
      <div className="mb-8">
        <h1 className="h-display">Bestellung verfolgen</h1>
        <p className="mt-2 text-ink-muted">
          Geben Sie Ihre Bestellnummer ein, um den aktuellen Status zu sehen. Ihre
          Bestellungen bleiben hier gespeichert — Sie müssen den Code nicht jedes
          Mal neu eingeben.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-8 bg-white rounded-xl border border-line p-2"
      >
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="size-4 text-ink-muted" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Bestellnummer, z. B. ord_..."
            className="flex-1 bg-transparent outline-none py-2.5 text-sm font-mono"
          />
        </div>
        <button type="submit" className="btn btn-primary px-5">
          Verfolgen
        </button>
      </form>

      {allIds.length === 0 ? (
        <div className="card p-10 text-center">
          <Package className="size-10 text-ink-subtle mx-auto" />
          <h3 className="mt-4 font-medium">Noch keine Bestellung verfolgt</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Sobald Sie eine Bestellnummer eingeben oder eine Bestellung aufgeben,
            sehen Sie hier den Status.
          </p>
          <Link to="/categories" className="btn btn-outline mt-6 inline-flex">
            Produkte ansehen
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {allIds.map((id, i) => (
            <OrderCard
              key={id}
              id={id}
              defaultOpen={i === 0}
              onRemove={trackedIds.includes(id) ? removeTracked : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
