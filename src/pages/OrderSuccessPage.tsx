import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Check, Landmark, Package, Mail, Clock } from "lucide-react";
import { useTrackedOrdersStore } from "@/store/trackedOrders";
import { BANK_ACCOUNT, paymentReference } from "@/lib/bank";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("id") ?? "—";
  const paymentMethod = params.get("method");
  const isBankTransfer = paymentMethod === "bank_transfer";
  const addTracked = useTrackedOrdersStore((s) => s.add);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId && orderId !== "—") addTracked(orderId);
  }, [orderId, addTracked]);

  const reference = paymentReference(orderId);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

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

      {isBankTransfer && (
        <div className="card p-6 mt-8 text-left">
          <div className="flex items-center gap-2 font-medium">
            <Landmark className="size-5 text-brand" />
            <h2 className="text-lg">Bezahlen Sie jetzt per Überweisung</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Bitte überweisen Sie den Betrag auf unser Konto. Sobald Ihre Zahlung bei uns
            eingegangen ist (in der Regel innerhalb von {BANK_ACCOUNT.paymentDeadlineDays} Werktagen),
            starten wir die Produktion und Sie erhalten eine Bestätigung per E-Mail.
          </p>
          <dl className="mt-5 space-y-3 text-sm bg-surface-alt rounded-lg p-4">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted shrink-0">Empfänger</dt>
              <dd className="font-medium text-right">{BANK_ACCOUNT.holder}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted shrink-0">IBAN</dt>
              <dd className="font-mono text-right">{BANK_ACCOUNT.iban}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted shrink-0">BIC</dt>
              <dd className="font-mono text-right">{BANK_ACCOUNT.bic}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted shrink-0">Bank</dt>
              <dd className="text-right">{BANK_ACCOUNT.bankName}</dd>
            </div>
            <div className="flex justify-between gap-4 items-center border-t border-line pt-3">
              <dt className="text-ink-muted shrink-0">Verwendungszweck</dt>
              <dd className="flex items-center gap-2">
                <span className="font-mono font-semibold text-brand">{reference}</span>
                <button
                  type="button"
                  onClick={copyReference}
                  className="size-7 inline-flex items-center justify-center rounded-md hover:bg-white text-ink-muted transition-colors"
                  aria-label="Verwendungszweck kopieren"
                  title="Verwendungszweck kopieren"
                >
                  {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                </button>
              </dd>
            </div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-xs text-ink-muted">
            <Clock className="size-4 shrink-0 mt-0.5" />
            Wichtig: Bitte geben Sie den Verwendungszweck exakt an — nur so können wir Ihre Zahlung
            Ihrer Bestellung zuordnen. Offene Vorkasse-Bestellungen verfallen nach{" "}
            {BANK_ACCOUNT.paymentDeadlineDays} Tagen.
          </p>
        </div>
      )}

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
