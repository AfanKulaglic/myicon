import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { formatCurrency, uid } from "@/lib/utils";
import { Landmark, Lock, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { saveOrderToFirestore } from "@/lib/firestore";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { sendNewOrderAdminEmail, sendOrderConfirmationEmail } from "@/lib/email";
import type { PaymentMethod } from "@/types";

const schema = z.object({
  email: z.string().email("Bitte gültige E-Mail eingeben"),
  fullName: z.string().min(2, "Bitte vollständigen Namen eingeben"),
  street: z.string().min(3, "Bitte Straße eingeben"),
  zip: z.string().min(4, "Bitte PLZ eingeben"),
  city: z.string().min(2, "Bitte Stadt eingeben"),
  country: z.string().min(2),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/** Pending PayPal order kept in sessionStorage while the customer is on paypal.com */
const PENDING_KEY = "pendingPaypal";

export default function CheckoutPage() {
  const { items, subtotal, discount, promo, clear } = useCartStore();
  const addOrder = useAuthStore((s) => s.addOrder);
  const addAddress = useAuthStore((s) => s.addAddress);
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");

  const sub = subtotal();
  const disc = discount();
  const vat = (sub - disc) * 0.19;
  const total = sub - disc + vat;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: "Deutschland", email: user?.email ?? "", fullName: user?.name ?? "" },
  });

  // ─── PayPal return / cancel handling ───────────────────────────────────────
  // After the customer approves on paypal.com they are redirected back to
  // /checkout?paypal=return&token=...&PayerID=... ; if they cancel it's
  // /checkout?paypal=cancel. We capture the approved payment here and only
  // then create the order in Firebase (a PayPal order is paid immediately).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypal = params.get("paypal");
    const token = params.get("token");

    if (paypal === "cancel") {
      sessionStorage.removeItem(PENDING_KEY);
      window.history.replaceState({}, "", "/checkout");
      setProcessing(false);
      alert("Die PayPal-Zahlung wurde abgebrochen. Sie können es erneut versuchen.");
      return;
    }

    if (paypal === "return" && token) {
      window.history.replaceState({}, "", "/checkout");
      completePayPalPayment(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completePayPalPayment = async (paypalOrderId: string) => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) {
      setProcessing(false);
      alert("Ihre Bestellung konnte nicht zugeordnet werden. Bitte versuchen Sie es erneut.");
      return;
    }
    let pending: { order: ReturnType<typeof buildOrder> };
    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      setProcessing(false);
      alert("Ihre Bestellung konnte nicht zugeordnet werden. Bitte versuchen Sie es erneut.");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: paypalOrderId }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "COMPLETED") {
        console.error("[paypal] capture failed", res.status, data);
        alert(
          "Die PayPal-Zahlung konnte nicht abgeschlossen werden. Falls das Geld abgebucht wurde, kontaktieren Sie uns bitte unter myicon2025@gmail.com.",
        );
        return;
      }

      const order = pending.order;
      // Sanity check: captured amount should match what the customer was charged.
      const captured = Number(data.amount);
      if (Number.isFinite(captured) && Math.abs(captured - order.total) > 0.01) {
        console.warn("[paypal] amount mismatch", captured, order.total);
      }

      // Payment confirmed — persist the order, notify customer + admin.
      await saveOrderToFirestore(order);
      sendOrderConfirmationEmail(order).catch(() => {});
      sendNewOrderAdminEmail(order).catch(() => {});
      addOrder(order);
      sessionStorage.removeItem(PENDING_KEY);
      clear();
      navigate(`/order/success?id=${order.id}&method=paypal`);
    } catch (err) {
      console.error("[paypal] capture error", err);
      alert("PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setProcessing(false);
    }
  };

  const buildOrder = (values: FormValues) => {
    const orderId = uid("ord");
    const address = {
      fullName: values.fullName,
      street: values.street,
      city: values.city,
      zip: values.zip,
      country: values.country,
      phone: values.phone,
    };
    // Bank transfer orders wait for the admin to confirm the payment;
    // PayPal orders are paid immediately.
    const status: "awaiting_payment" | "pending" =
      paymentMethod === "bank_transfer" ? "awaiting_payment" : "pending";
    return {
      id: orderId,
      createdAt: Date.now(),
      items,
      total,
      status,
      paymentMethod,
      email: values.email,
      address,
      ...(promo ? { promo: { ...promo, discountAmount: disc } } : {}),
    };
  };

  const onSubmit = async (values: FormValues) => {
    setProcessing(true);

    if (!user) login(values.email, values.fullName);
    addAddress({
      fullName: values.fullName,
      street: values.street,
      city: values.city,
      zip: values.zip,
      country: values.country,
      phone: values.phone,
    });

    const order = buildOrder(values);

    // PayPal: create the PayPal order server-side and redirect the customer to
    // paypal.com for approval. The shop order is only created AFTER the
    // payment is captured (see completePayPalPayment above).
    if (paymentMethod === "paypal") {
      try {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            returnUrl: `${window.location.origin}/checkout?paypal=return`,
            cancelUrl: `${window.location.origin}/checkout?paypal=cancel`,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.approvalUrl) {
          console.error("[paypal] create-order failed", res.status, data);
          alert(
            "PayPal ist momentan nicht erreichbar. Bitte wählen Sie Banküberweisung (Vorkasse) oder versuchen Sie es später erneut.",
          );
          setProcessing(false);
          return;
        }
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({ paypalOrderId: data.id, order }),
        );
        window.location.href = data.approvalUrl;
        return; // page unloads — do not continue
      } catch (err) {
        console.error("[paypal] create-order error", err);
        alert(
          "PayPal ist momentan nicht erreichbar. Bitte wählen Sie Banküberweisung (Vorkasse) oder versuchen Sie es später erneut.",
        );
        setProcessing(false);
        return;
      }
    }

    // Bank transfer (Vorkasse): no payment happens at checkout — the customer
    // transfers the money afterwards, so the order is created immediately.
    try {
      await saveOrderToFirestore(order);
    } catch (err) {
      console.error("Order save failed", err);
      alert(
        "Bestellung konnte nicht an unseren Server übertragen werden. Bitte versuchen Sie es erneut.\n\n" +
          (err instanceof Error ? err.message : ""),
      );
      setProcessing(false);
      return;
    }

    // Fire the order confirmation email (with bank details for Vorkasse) and
    // the admin "new order" notification. Non-blocking: a failed email must
    // never break the checkout.
    sendOrderConfirmationEmail(order).catch(() => {});
    sendNewOrderAdminEmail(order).catch(() => {});

    addOrder(order);
    clear();
    navigate(`/order/success?id=${order.id}&method=${paymentMethod}`);
  };

  if (items.length === 0 && !processing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="h-section">Ihr Warenkorb ist leer</h1>
        <Link to="/categories" className="btn btn-primary mt-6 inline-flex">Weiter einkaufen</Link>
      </div>
    );
  }

  return (
    <div className="container py-10 lg:py-14">
      {processing && (
        <div className="fixed inset-0 z-[90] bg-white/80 backdrop-blur-sm grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-ink">
            <Loader2 className="size-8 text-brand animate-spin" />
            <p className="font-medium">Zahlung wird bestätigt…</p>
          </div>
        </div>
      )}
      <h1 className="h-display mb-8">Kasse</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-semibold mb-4">Kontakt</h2>
            <div className="grid gap-4">
              <div>
                <label className="label">E-Mail</label>
                <input className="input" type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold mb-4">Lieferadresse</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Vollständiger Name</label>
                <input className="input" {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label">Straße & Hausnummer</label>
                <input className="input" {...register("street")} />
                {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <label className="label">PLZ</label>
                <input className="input" {...register("zip")} />
                {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip.message}</p>}
              </div>
              <div>
                <label className="label">Stadt</label>
                <input className="input" {...register("city")} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label">Land</label>
                <input className="input" {...register("country")} />
              </div>
              <div>
                <label className="label">Telefon (optional)</label>
                <input className="input" {...register("phone")} />
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold mb-4">Zahlung</h2>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-brand ring-1 ring-brand/30 bg-brand/5"
                    : "border-line bg-surface-alt hover:border-ink-subtle"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="mt-1 accent-[#003087]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-md bg-[#FFC439] grid place-items-center font-bold text-[#003087] text-sm">P</div>
                    <div className="font-medium">PayPal</div>
                  </div>
                  <div className="text-xs text-ink-muted mt-1">Sicher bezahlen mit Käuferschutz</div>
                </div>
                <ShieldCheck className="size-5 text-success mt-1" />
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-brand ring-1 ring-brand/30 bg-brand/5"
                    : "border-line bg-surface-alt hover:border-ink-subtle"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1 accent-[#1E5AA8]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-md bg-brand/10 grid place-items-center text-brand">
                      <Landmark className="size-4" />
                    </div>
                    <div className="font-medium">Banküberweisung / Vorkasse</div>
                  </div>
                  <div className="text-xs text-ink-muted mt-1">
                    Sie zahlen im Voraus per Überweisung — Produktion startet nach Zahlungseingang
                  </div>
                </div>
              </label>

              {paymentMethod === "bank_transfer" && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs text-ink-muted space-y-1.5">
                  <div className="flex items-center gap-2 font-medium text-brand">
                    <Mail className="size-4 text-brand" />
                    Zahlungsdaten folgen per E-Mail
                  </div>
                  <p>
                    Nachdem Sie Ihre Bestellung aufgegeben haben, erhalten Sie alle
                    Überweisungsdaten (Empfänger, IBAN, BIC und Verwendungszweck)
                    an Ihre E-Mail-Adresse zugesandt.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-semibold mb-4">Bestellübersicht</h2>
          <ul className="space-y-3 mb-4 max-h-80 overflow-y-auto no-scrollbar">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3">
                <div className="size-14 rounded-md overflow-hidden bg-surface-alt flex-shrink-0">
                  <img src={i.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <div className="truncate font-medium">{i.title}</div>
                  <div className="text-xs text-ink-muted">{i.quantity} Stk.</div>
                </div>
                <div className="text-sm font-medium whitespace-nowrap">{formatCurrency(i.price * i.quantity)}</div>
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <PromoCodeInput />
          </div>
          <dl className="space-y-1.5 text-sm border-t border-line pt-4">
            <div className="flex justify-between"><dt className="text-ink-muted">Zwischensumme</dt><dd>{formatCurrency(sub)}</dd></div>
            {disc > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Rabatt {promo ? `(${promo.code})` : ""}</dt><dd>−{formatCurrency(disc)}</dd>
              </div>
            )}
            <div className="flex justify-between"><dt className="text-ink-muted">MwSt.</dt><dd>{formatCurrency(vat)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Versand</dt><dd className="text-success">Gratis</dd></div>
          </dl>
          <div className="border-t border-line mt-4 pt-4 flex justify-between font-semibold">
            <span>Gesamt</span><span>{formatCurrency(total)}</span>
          </div>
          <Button type="submit" loading={processing} className="w-full mt-5 justify-center">
            <Lock className="size-4" />
            {paymentMethod === "paypal" ? "Mit PayPal bezahlen" : "Bestellung aufgeben (Vorkasse)"}
          </Button>
          <p className="text-xs text-ink-muted text-center mt-3">
            Sichere Verschlüsselung · SSL geschützt
          </p>
        </aside>
      </form>
    </div>
  );
}
