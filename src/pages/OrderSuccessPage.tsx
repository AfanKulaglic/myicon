import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle2, Package, Mail } from "lucide-react";
import { useTrackedOrdersStore } from "@/store/trackedOrders";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("id") ?? "—";
  const addTracked = useTrackedOrdersStore((s) => s.add);

  useEffect(() => {
    if (orderId && orderId !== "—") addTracked(orderId);
  }, [orderId, addTracked]);

  return (
    <div className="container py-16 lg:py-24 max-w-2xl text-center">
      <div className="mx-auto size-16 rounded-full bg-success/10 grid place-items-center mb-6">
        <CheckCircle2 className="size-9 text-success" />
      </div>
      <h1 className="h-display">Vielen Dank für Ihre Bestellung!</h1>
      <p className="mt-3 text-ink-muted">
        Bestellnummer <span className="font-mono text-ink">{orderId}</span> — wir haben Ihnen eine
        Bestätigung per E-Mail gesendet.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-10 text-left">
        <div className="card p-5">
          <Mail className="size-5 text-brand" />
          <h3 className="mt-3 font-medium">Bestätigung</h3>
          <p className="mt-1 text-sm text-ink-muted">Sie erhalten eine E-Mail mit den Details Ihrer Bestellung.</p>
        </div>
        <div className="card p-5">
          <Package className="size-5 text-brand" />
          <h3 className="mt-3 font-medium">Produktion & Versand</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Verfolgen Sie den Fortschritt jederzeit unter <Link to="/order/track" className="text-brand underline">Bestellung verfolgen</Link>.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/order/track/${orderId}`} className="btn btn-primary">Bestellung verfolgen</Link>
        <Link to="/account/orders" className="btn btn-outline">Alle Bestellungen</Link>
        <Link to="/" className="btn btn-ghost">Zur Startseite</Link>
      </div>
    </div>
  );
}
