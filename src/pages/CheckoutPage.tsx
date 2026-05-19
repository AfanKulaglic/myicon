import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { formatCurrency, uid } from "@/lib/utils";
import { Lock, ShieldCheck } from "lucide-react";
import { saveOrderToFirestore } from "@/lib/firestore";

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

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCartStore();
  const addOrder = useAuthStore((s) => s.addOrder);
  const addAddress = useAuthStore((s) => s.addAddress);
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const sub = subtotal();
  const vat = sub * 0.19;
  const total = sub + vat;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: "Deutschland", email: user?.email ?? "", fullName: user?.name ?? "" },
  });

  if (items.length === 0 && !processing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="h-section">Ihr Warenkorb ist leer</h1>
        <Link to="/categories" className="btn btn-primary mt-6 inline-flex">Weiter einkaufen</Link>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    setProcessing(true);
    // Simulate PayPal redirect/payment
    await new Promise((r) => setTimeout(r, 1200));

    if (!user) login(values.email, values.fullName);

    const address = {
      fullName: values.fullName,
      street: values.street,
      city: values.city,
      zip: values.zip,
      country: values.country,
      phone: values.phone,
    };
    addAddress(address);

    const orderId = uid("ord");
    const order = {
      id: orderId,
      createdAt: Date.now(),
      items,
      total,
      status: "pending" as const,
      address,
    };
    addOrder(order);
    // Await the RTDB write so admin actually sees the order and the customer's
    // tracking page can find it. If it fails, surface the error instead of
    // navigating to a success page for an order that doesn't exist server-side.
    try {
      await saveOrderToFirestore(order);
    } catch (err) {
      console.error("Order save failed", err);
      alert(
        "Bestellung konnte nicht an unseren Server übertragen werden. Bitte versuchen Sie es erneut.\n\n" +
          (err instanceof Error ? err.message : ""),
      );
      return;
    }

    clear();
    navigate(`/order/success?id=${orderId}`);
  };

  return (
    <div className="container py-10 lg:py-14">
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
            <div className="flex items-center gap-3 p-4 rounded-lg border border-line bg-surface-alt">
              <div className="size-10 rounded-md bg-[#FFC439] grid place-items-center font-bold text-[#003087]">P</div>
              <div>
                <div className="font-medium">PayPal</div>
                <div className="text-xs text-ink-muted">Sicher bezahlen mit Käuferschutz</div>
              </div>
              <ShieldCheck className="size-5 text-success ml-auto" />
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
          <dl className="space-y-1.5 text-sm border-t border-line pt-4">
            <div className="flex justify-between"><dt className="text-ink-muted">Zwischensumme</dt><dd>{formatCurrency(sub)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">MwSt.</dt><dd>{formatCurrency(vat)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Versand</dt><dd className="text-success">Gratis</dd></div>
          </dl>
          <div className="border-t border-line mt-4 pt-4 flex justify-between font-semibold">
            <span>Gesamt</span><span>{formatCurrency(total)}</span>
          </div>
          <Button type="submit" loading={processing} className="w-full mt-5 justify-center">
            <Lock className="size-4" /> Mit PayPal bezahlen
          </Button>
          <p className="text-xs text-ink-muted text-center mt-3">
            Sichere Verschlüsselung · SSL geschützt
          </p>
        </aside>
      </form>
    </div>
  );
}
