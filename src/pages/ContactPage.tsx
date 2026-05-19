import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_CONTACT, DEFAULT_CONTACT_EN, type ContactContent } from "@/types/content";

const schema = z.object({
  name: z.string().min(2, "Name erforderlich"),
  email: z.string().email("Ungültige E-Mail"),
  subject: z.string().min(3, "Betreff erforderlich"),
  message: z.string().min(10, "Bitte mindestens 10 Zeichen eingeben"),
});
type V = z.infer<typeof schema>;

export default function ContactPage() {
  const c = useSiteContent<ContactContent>("contact", DEFAULT_CONTACT, DEFAULT_CONTACT_EN);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    toast({ title: "Nachricht gesendet", description: "Wir melden uns innerhalb von 24 h." });
    setSent(true);
    reset();
  };

  return (
    <div className="container py-10 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="h-display">{c.title}</h1>
        <p className="mt-3 text-ink-muted">{c.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-10 mt-6 lg:mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input className="input" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">E-Mail</label>
              <input type="email" className="input" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Betreff</label>
            <input className="input" {...register("subject")} />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="label">Nachricht</label>
            <textarea rows={6} className="input resize-none" {...register("message")} />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting}>{sent ? "Erneut senden" : "Nachricht senden"}</Button>
        </form>

        <aside className="space-y-4">
          <div className="card p-5">
            <Mail className="size-5 text-brand" />
            <h3 className="mt-3 font-medium">E-Mail</h3>
            <a href={`mailto:${c.email}`} className="text-sm text-ink-muted hover:text-brand">{c.email}</a>
          </div>
          <div className="card p-5">
            <Phone className="size-5 text-brand" />
            <h3 className="mt-3 font-medium">Telefon</h3>
            <div className="space-y-1">
              {c.phone.split("\n").map((num) => (
                <a key={num} href={`tel:${num.replace(/\s/g, "")}`} className="block text-sm text-ink-muted hover:text-brand">{num}</a>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <MapPin className="size-5 text-brand" />
            <h3 className="mt-3 font-medium">Adresse</h3>
            <p className="text-sm text-ink-muted whitespace-pre-line">{c.address}</p>
          </div>
          <div className="card p-5">
            <Clock className="size-5 text-brand" />
            <h3 className="mt-3 font-medium">Servicezeiten</h3>
            <p className="text-sm text-ink-muted">{c.hours}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
