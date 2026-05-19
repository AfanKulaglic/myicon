import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_REGISTER, DEFAULT_REGISTER_EN, type RegisterContent } from "@/types/content";

const schema = z
  .object({
    name: z.string().min(2, "Bitte Namen eingeben"),
    email: z.string().email("Ungültige E-Mail"),
    password: z.string().min(6, "Mindestens 6 Zeichen"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwörter stimmen nicht überein", path: ["confirm"] });
type V = z.infer<typeof schema>;

function firebaseError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Diese E-Mail wird bereits verwendet.",
    "auth/invalid-email": "Ungültige E-Mail-Adresse.",
    "auth/weak-password": "Das Passwort ist zu schwach (mindestens 6 Zeichen).",
    "auth/operation-not-allowed": "Registrierung ist derzeit deaktiviert.",
  };
  return map[code] ?? "Registrierung fehlgeschlagen. Bitte erneut versuchen.";
}

export default function RegisterPage() {
  const c = useSiteContent<RegisterContent>("page_register", DEFAULT_REGISTER, DEFAULT_REGISTER_EN);
  const registerWithEmail = useAuthStore((s) => s.registerWithEmail);
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (v: V) => {
    try {
      await registerWithEmail(v.email, v.password, v.name);
      navigate("/account");
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      setError("root", { message: firebaseError(code) });
    }
  };

  return (
    <div className="container py-12 lg:py-20 max-w-md">
      <div className="card p-8">
        <h1 className="h-section">{c.pageTitle}</h1>
        <p className="mt-1 text-sm text-ink-muted">{c.subtitle}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">{c.labelName}</label>
            <input className="input" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">{c.labelEmail}</label>
            <input type="email" className="input" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">{c.labelPassword}</label>
            <input type="password" className="input" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">{c.labelConfirm}</label>
            <input type="password" className="input" {...register("confirm")} />
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>
          {errors.root && (
            <p className="text-xs text-red-500 rounded bg-red-50 px-3 py-2 border border-red-200">{errors.root.message}</p>
          )}
          <Button type="submit" loading={isSubmitting} className="w-full justify-center">{c.submitBtn}</Button>
        </form>
        <div className="mt-6 text-sm text-center text-ink-muted">
          {c.alreadyText} <Link to="/login" className="text-brand font-medium hover:underline">{c.loginLink}</Link>
        </div>
      </div>
    </div>
  );
}
