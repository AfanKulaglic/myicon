import { useEffect, useState, Fragment, useRef } from "react";
import { subscribeToOrders, updateOrderStatus, deleteOrder } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { ChevronDown, ChevronRight, Image as ImageIcon, Bell, BellOff, Trash2 } from "lucide-react";
import type { Order } from "@/types";
import { useAdminNotificationsStore } from "@/store/adminNotifications";
import { toast } from "@/store/toast";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-brand/10 text-brand",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const t = useT();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const STATUS_LABELS: Record<string, string> = {
    pending: t("admin.status.pending"),
    processing: t("admin.status.processing"),
    shipped: t("admin.status.shipped"),
    delivered: t("admin.status.delivered"),
    cancelled: t("admin.status.cancelled"),
  };

  useEffect(() => {
    const unsub = subscribeToOrders((os) => {
      setOrders(os);
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── New-order notifications ────────────────────────────────────────────────
  // First snapshot from RTDB is *all existing orders* — those must NOT
  // trigger a notification. We seed `markSeen` with their ids on first run,
  // then any id appearing in a later snapshot that we haven't seen is "new".
  const seenIds = useAdminNotificationsStore((s) => s.seenOrderIds);
  const markSeen = useAdminNotificationsStore((s) => s.markSeen);
  const initialised = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [notifAllowed, setNotifAllowed] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied",
  );

  useEffect(() => {
    if (orders.length === 0) return;
    if (!initialised.current) {
      // Seed: on first load, treat every currently-known id as already seen.
      markSeen(orders.map((o) => o.id));
      initialised.current = true;
      return;
    }
    const seenSet = new Set(seenIds);
    const fresh = orders.filter((o) => !seenSet.has(o.id));
    if (fresh.length === 0) return;
    // Play chime
    try {
      audioRef.current?.play().catch(() => {});
    } catch {
      /* autoplay blocked — ignore */
    }
    for (const o of fresh) {
      toast({
        title: `Neue Bestellung · ${formatCurrency(o.total)}`,
        description: `${o.address?.fullName ?? "Kunde"} · ${o.items.length} Artikel`,
      });
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("MYICON · Neue Bestellung", {
            body: `${o.address?.fullName ?? "Kunde"} · ${formatCurrency(o.total)} · ${o.items.length} Artikel`,
            tag: o.id,
          });
        } catch {
          /* some browsers block constructed Notifications outside SW — ignore */
        }
      }
    }
    markSeen(fresh.map((o) => o.id));
  }, [orders, seenIds, markSeen]);

  const requestNotifPermission = async () => {
    if (typeof Notification === "undefined") return;
    const res = await Notification.requestPermission();
    setNotifAllowed(res);
  };

  const handleStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try { await updateOrderStatus(orderId, status as Order["status"]); } finally { setUpdating(null); }
  };

  const handleDelete = async (orderId: string) => {
    setDeleting(orderId);
    setConfirmDeleteId(null);
    try {
      await deleteOrder(orderId);
      toast({ title: "Bestellung gelöscht" });
    } catch {
      toast({ title: "Fehler beim Löschen" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Embedded short chime (base64 WAV) — no extra HTTP roundtrip, plays on new order */}
      <audio
        ref={audioRef}
        preload="auto"
        src="data:audio/wav;base64,UklGRiQEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAEAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wA="
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("admin.orders.title")}</h1>
        {typeof Notification !== "undefined" && notifAllowed !== "granted" && (
          <button
            type="button"
            onClick={requestNotifPermission}
            className="btn btn-outline btn-sm"
            title="Browser-Benachrichtigungen bei neuen Bestellungen aktivieren"
          >
            {notifAllowed === "denied" ? (
              <>
                <BellOff className="size-4" />
                Benachrichtigungen blockiert
              </>
            ) : (
              <>
                <Bell className="size-4" />
                Benachrichtigungen aktivieren
              </>
            )}
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-ink-muted text-sm">{t("admin.orders.loading")}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-ink-muted text-sm">{t("admin.orders.empty")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-ink-muted">{t("admin.orders.id")}</th>
                  <th className="text-left px-4 py-3 font-medium text-ink-muted hidden md:table-cell">{t("admin.orders.date")}</th>
                  <th className="text-left px-4 py-3 font-medium text-ink-muted hidden lg:table-cell">{t("admin.orders.address")}</th>
                  <th className="text-left px-4 py-3 font-medium text-ink-muted">{t("admin.dashboard.status")}</th>
                  <th className="text-right px-4 py-3 font-medium text-ink-muted">{t("admin.dashboard.total")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => {
                  const isOpen = expanded.has(o.id);
                  return (
                    <Fragment key={o.id}>
                      <tr className="hover:bg-surface-alt/50">
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(o.id)}
                            className="flex items-center gap-2 text-left"
                          >
                            {isOpen ? (
                              <ChevronDown className="size-4 text-ink-muted" />
                            ) : (
                              <ChevronRight className="size-4 text-ink-muted" />
                            )}
                            <div>
                              <p className="font-mono text-xs font-medium">{o.id}</p>
                              <p className="text-xs text-ink-muted mt-0.5">
                                {o.items.length} {t("admin.orders.items")}
                              </p>
                            </div>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-ink-muted hidden md:table-cell">
                          {new Date(o.createdAt).toLocaleDateString("de-DE")}
                        </td>
                        <td className="px-4 py-3 text-ink-muted hidden lg:table-cell">
                          {o.address?.fullName}<br />
                          <span className="text-xs">{o.address?.city}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            disabled={updating === o.id}
                            onChange={(e) => handleStatus(o.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer outline-none ${STATUS_COLORS[o.status] ?? ""}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(o.total)}</td>
                        <td className="px-4 py-3 text-right">
                          {confirmDeleteId === o.id ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs text-ink-muted">Sicher?</span>
                              <button
                                type="button"
                                onClick={() => handleDelete(o.id)}
                                disabled={deleting === o.id}
                                className="text-xs text-red-600 font-medium hover:underline disabled:opacity-50"
                              >
                                Ja, löschen
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-xs text-ink-muted hover:underline"
                              >
                                Abbrechen
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(o.id)}
                              disabled={deleting === o.id}
                              className="p-1.5 rounded hover:bg-red-50 text-ink-muted hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Bestellung löschen"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${o.id}-details`} className="bg-surface-alt/40">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-4">
                              {o.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-white border border-line rounded-lg p-4"
                                >
                                  <div className="flex items-start gap-4">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="size-16 rounded-md object-cover border border-line shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium">{item.title}</p>
                                      <p className="text-xs text-ink-muted mt-0.5">
                                        {item.variant.color ? `${item.variant.color}` : ""}
                                        {item.variant.color && item.variant.size ? " · " : ""}
                                        {item.variant.size ?? ""}
                                      </p>
                                      <p className="text-xs text-ink-muted mt-0.5">
                                        {item.quantity} × {formatCurrency(item.price)}
                                      </p>
                                    </div>
                                    <p className="font-semibold text-sm whitespace-nowrap">
                                      {formatCurrency(item.price * item.quantity)}
                                    </p>
                                  </div>

                                  {item.customDesigns && item.customDesigns.length > 0 ? (
                                    <div className="mt-4 pt-4 border-t border-line space-y-4">
                                      <div>
                                        <p className="text-xs font-medium text-ink-muted mb-2 flex items-center gap-1.5">
                                          <ImageIcon className="size-3.5" />
                                          Bearbeitete Druckbereiche ({item.customDesigns.length})
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                          {item.customDesigns.map((d) => (
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
                                              <p className="text-xs text-center mt-1 text-ink-muted group-hover:text-brand">
                                                {d.viewLabel} · Vorschau
                                              </p>
                                            </a>
                                          ))}
                                        </div>
                                      </div>

                                      {item.customDesigns.some((d) => d.uploadedImages?.length) && (
                                        <div>
                                          <p className="text-xs font-medium text-ink-muted mb-2 flex items-center gap-1.5">
                                            <ImageIcon className="size-3.5" />
                                            Original-Uploads (Druckqualität)
                                          </p>
                                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {item.customDesigns.flatMap((d) =>
                                              (d.uploadedImages ?? []).map((u, idx) => (
                                                <a
                                                  key={`${d.viewId}-orig-${idx}`}
                                                  href={u.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="block group"
                                                >
                                                  <div className="aspect-square bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fff_0%_50%)_50%/16px_16px] rounded-md overflow-hidden border border-line group-hover:border-brand transition-colors">
                                                    <img
                                                      src={u.url}
                                                      alt={`${d.viewLabel} Original`}
                                                      className="size-full object-contain"
                                                    />
                                                  </div>
                                                  <p className="text-xs text-center mt-1 text-ink-muted group-hover:text-brand">
                                                    {d.viewLabel} · Original
                                                  </p>
                                                </a>
                                              )),
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {item.customDesigns.some((d) => d.texts?.length) && (
                                        <div>
                                          <p className="text-xs font-medium text-ink-muted mb-2">
                                            Texte
                                          </p>
                                          <div className="space-y-2">
                                            {item.customDesigns.flatMap((d) =>
                                              (d.texts ?? []).map((t, idx) => (
                                                <div
                                                  key={`${d.viewId}-text-${idx}`}
                                                  className="bg-surface-alt rounded-md p-2 flex items-start gap-3 text-xs"
                                                >
                                                  <span className="text-[10px] text-ink-muted shrink-0 w-20 truncate">
                                                    {d.viewLabel}
                                                  </span>
                                                  <span
                                                    className="flex-1 break-words"
                                                    style={{
                                                      fontFamily: t.fontFamily,
                                                      color: t.fill,
                                                      fontWeight: t.fontStyle.includes("bold") ? 700 : 400,
                                                      fontStyle: t.fontStyle.includes("italic") ? "italic" : "normal",
                                                    }}
                                                  >
                                                    {t.text}
                                                  </span>
                                                  <span className="text-[10px] text-ink-muted shrink-0">
                                                    {t.fontFamily} · {t.fontSize}px
                                                  </span>
                                                </div>
                                              )),
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : item.designId ? (
                                    <p className="mt-3 pt-3 border-t border-line text-xs text-ink-muted italic">
                                      Keine bearbeiteten Druckbereiche.
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
