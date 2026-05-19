import { useEffect, useState, Fragment } from "react";
import { useAuthStore } from "@/store/auth";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Image as ImageIcon, ExternalLink } from "lucide-react";
import { subscribeToOrder } from "@/lib/firestore";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN, type AccountContent } from "@/types/content";
import type { Order } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Eingegangen",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt",
  cancelled: "Storniert",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-brand/10 text-brand",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

/**
 * Live-subscribed order: returns the freshest server-side copy when available
 * (so admin status changes show up immediately), falls back to the locally
 * stored snapshot otherwise.
 */
function useLiveOrder(local: Order): Order {
  const [live, setLive] = useState<Order | null>(null);
  useEffect(() => {
    const unsub = subscribeToOrder(local.id, (o) => setLive(o));
    return () => unsub();
  }, [local.id]);
  return live ?? local;
}

function OrderCard({ local }: { local: Order }) {
  const order = useLiveOrder(local);
  const [open, setOpen] = useState(false);

  return (
    <li className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 hover:bg-surface-alt/40 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {open ? (
              <ChevronDown className="size-4 text-ink-muted shrink-0" />
            ) : (
              <ChevronRight className="size-4 text-ink-muted shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs text-ink-muted">Bestellnummer</div>
              <div className="font-mono text-sm truncate">{order.id}</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-ink-muted">Datum</div>
            <div className="text-sm">
              {new Date(order.createdAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-ink-muted">Gesamt</div>
            <div className="text-sm font-semibold">{formatCurrency(order.total)}</div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              STATUS_COLORS[order.status] ?? "bg-surface-alt text-ink"
            }`}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-line bg-surface-alt/30 p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
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
              <p className="text-sm">{STATUS_LABELS[order.status] ?? order.status}</p>
              <Link
                to={`/order/track/${order.id}`}
                className="mt-2 inline-flex items-center gap-1 text-xs text-brand hover:underline"
              >
                Status verfolgen <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-ink-muted mb-2">Artikel</p>
            <ul className="space-y-3">
              {order.items.map((i) => (
                <Fragment key={i.id}>
                  <li className="bg-white border border-line rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="size-14 rounded-md overflow-hidden bg-surface-alt flex-shrink-0 border border-line">
                        <img src={i.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{i.title}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {i.variant?.color}
                          {i.variant?.color && i.variant?.size ? " · " : ""}
                          {i.variant?.size}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {i.quantity} × {formatCurrency(i.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {formatCurrency(i.price * i.quantity)}
                      </p>
                    </div>

                    {i.customDesigns && i.customDesigns.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-line space-y-3">
                        <div>
                          <p className="text-[11px] font-medium text-ink-muted mb-2 flex items-center gap-1.5">
                            <ImageIcon className="size-3" />
                            Ihre Designs ({i.customDesigns.length})
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {i.customDesigns.map((d) => (
                              <a
                                key={d.viewId}
                                href={d.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                              >
                                <div className="aspect-square bg-surface-alt rounded-md overflow-hidden border border-line group-hover:border-brand transition-colors">
                                  <img
                                    src={d.imageUrl}
                                    alt={d.viewLabel}
                                    className="size-full object-contain"
                                  />
                                </div>
                                <p className="text-[10px] text-center mt-1 text-ink-muted group-hover:text-brand truncate">
                                  {d.viewLabel}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>

                        {i.customDesigns.some((d) => d.texts?.length) && (
                          <div>
                            <p className="text-[11px] font-medium text-ink-muted mb-2">Texte</p>
                            <ul className="space-y-1">
                              {i.customDesigns.flatMap((d) =>
                                (d.texts ?? []).map((t, idx) => (
                                  <li
                                    key={`${d.viewId}-text-${idx}`}
                                    className="text-xs bg-surface-alt rounded px-2 py-1 break-words"
                                    style={{
                                      fontFamily: t.fontFamily,
                                      color: t.fill,
                                      fontWeight: t.fontStyle.includes("bold") ? 700 : 400,
                                      fontStyle: t.fontStyle.includes("italic") ? "italic" : "normal",
                                    }}
                                  >
                                    {t.text}
                                  </li>
                                )),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default function OrdersPage() {
  const c = useSiteContent<AccountContent>("page_account", DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN);
  const orders = useAuthStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="h-section">{c.ordersTitle}</h1>
        <div className="card p-10 mt-6 text-center">
          <p className="text-ink-muted">{c.ordersEmpty}</p>
          <Link to="/categories" className="btn btn-primary mt-5 inline-flex">{c.ordersEmptyCta}</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h-section">{c.ordersTitle}</h1>
        <Link to="/order/track" className="btn btn-outline btn-sm">
          Bestellung verfolgen
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Klicken Sie auf eine Bestellung, um Details, Lieferadresse und Designs zu sehen. Der
        Status wird live aktualisiert, sobald wir Ihre Bestellung weiterverarbeiten.
      </p>
      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <OrderCard key={o.id} local={o} />
        ))}
      </ul>
    </div>
  );
}
