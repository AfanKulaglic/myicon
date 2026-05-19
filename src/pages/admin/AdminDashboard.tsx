import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToOrders } from "@/lib/firestore";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { Package, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-brand/10 text-brand",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminDashboard() {
  const t = useT();
  const [orders, setOrders] = useState<Order[]>([]);
  const { products } = useProducts(false);

  const STATUS_LABELS: Record<string, string> = {
    pending: t("admin.status.pending"),
    processing: t("admin.status.processing"),
    shipped: t("admin.status.shipped"),
    delivered: t("admin.status.delivered"),
    cancelled: t("admin.status.cancelled"),
  };

  useEffect(() => {
    const unsub = subscribeToOrders(setOrders);
    return unsub;
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const recent = orders.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <h1 className="text-2xl font-semibold">{t("admin.nav.dashboard")}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-5 flex items-start gap-4">
          <span className="p-2 rounded-lg bg-brand/10 text-brand"><ShoppingBag className="size-5" /></span>
          <div>
            <p className="text-sm text-ink-muted">{t("admin.dashboard.orders")}</p>
            <p className="text-2xl font-semibold">{orders.length}</p>
          </div>
        </div>
        <div className="card p-5 flex items-start gap-4">
          <span className="p-2 rounded-lg bg-green-100 text-green-700"><TrendingUp className="size-5" /></span>
          <div>
            <p className="text-sm text-ink-muted">{t("admin.dashboard.revenue")}</p>
            <p className="text-2xl font-semibold">{formatCurrency(revenue)}</p>
          </div>
        </div>
        <div className="card p-5 flex items-start gap-4">
          <span className="p-2 rounded-lg bg-purple-100 text-purple-700"><Package className="size-5" /></span>
          <div>
            <p className="text-sm text-ink-muted">{t("admin.dashboard.products")}</p>
            <p className="text-2xl font-semibold">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-semibold">{t("admin.dashboard.recentOrders")}</h2>
          <Link to="/admin/orders" className="text-sm text-brand hover:underline">{t("admin.dashboard.viewAll")}</Link>
        </div>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-ink-muted">
            <AlertCircle className="size-8 opacity-40" />
            <p className="text-sm">{t("admin.dashboard.noOrders")}</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{o.id}</p>
                  <p className="text-xs text-ink-muted">{new Date(o.createdAt).toLocaleDateString("de-DE")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status] ?? ""}`}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                  <span className="text-sm font-semibold">{formatCurrency(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
