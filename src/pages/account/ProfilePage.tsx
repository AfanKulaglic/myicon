import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { MapPin, Plus } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN, type AccountContent } from "@/types/content";

const addrSchema = z.object({
  fullName: z.string().min(2),
  street: z.string().min(3),
  zip: z.string().min(4),
  city: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().optional(),
});
type AddrV = z.infer<typeof addrSchema>;

export default function ProfilePage() {
  const c = useSiteContent<AccountContent>("page_account", DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN);
  const user = useAuthStore((s) => s.user)!;
  const addresses = useAuthStore((s) => s.addresses);
  const addAddress = useAuthStore((s) => s.addAddress);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddrV>({
    resolver: zodResolver(addrSchema),
    defaultValues: { country: "Deutschland" },
  });

  const onAddAddress = (v: AddrV) => {
    addAddress(v);
    toast({ title: c.profileSavedToast });
    reset();
    setShowForm(false);
  };

  return (
    <div>
      <h1 className="h-section">{c.profileTitle}</h1>

      <section className="card p-6 mt-6">
        <h2 className="font-semibold mb-4">{c.profilePersonalSection}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{c.profileLabelName}</label>
            <input className="input" defaultValue={user.name ?? ""} readOnly />
          </div>
          <div>
            <label className="label">{c.profileLabelEmail}</label>
            <input className="input" defaultValue={user.email} readOnly />
          </div>
        </div>
      </section>

      <section className="card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">{c.profileAddressesSection}</h2>
          <Button variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="size-4" /> {c.profileNewAddressBtn}
          </Button>
        </div>

        {addresses.length === 0 && !showForm && (
          <p className="text-sm text-ink-muted">{c.profileNoAddresses}</p>
        )}

        {addresses.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-3 mb-4">
            {addresses.map((a, i) => (
              <li key={i} className="rounded-lg border border-line p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="size-4 text-brand" />
                  <span className="font-medium">{a.fullName}</span>
                </div>
                <div className="text-ink-muted">
                  {a.street}<br />
                  {a.zip} {a.city}<br />
                  {a.country}
                </div>
              </li>
            ))}
          </ul>
        )}

        {showForm && (
          <form onSubmit={handleSubmit(onAddAddress)} className="grid sm:grid-cols-2 gap-3 mt-4">
            <div className="sm:col-span-2">
              <label className="label">{c.profileLabelFullName}</label>
              <input className="input" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">{c.profileLabelStreet}</label>
              <input className="input" {...register("street")} />
            </div>
            <div>
              <label className="label">{c.profileLabelZip}</label>
              <input className="input" {...register("zip")} />
            </div>
            <div>
              <label className="label">{c.profileLabelCity}</label>
              <input className="input" {...register("city")} />
            </div>
            <div>
              <label className="label">{c.profileLabelCountry}</label>
              <input className="input" {...register("country")} />
            </div>
            <div>
              <label className="label">{c.profileLabelPhone}</label>
              <input className="input" {...register("phone")} />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>{c.profileCancelBtn}</Button>
              <Button type="submit">{c.profileSaveBtn}</Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
