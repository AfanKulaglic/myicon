import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_LOGIN, DEFAULT_LOGIN_EN, type LoginContent } from "@/types/content";

const schema = z.object({
  email: z.string().email("Bitte gültige E-Mail eingeben"),
  password: z.string().min(6, "Mindestens 6 Zeichen"),
});
type V = z.infer<typeof schema>;

function firebaseError(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found": "Kein Konto mit dieser E-Mail gefunden.",
    "auth/wrong-password": "Falsches Passwort. Bitte erneut versuchen.",
    "auth/invalid-credential": "E-Mail oder Passwort ist falsch.",
    "auth/too-many-requests": "Zu viele Versuche. Bitte später erneut versuchen.",
    "auth/user-disabled": "Dieses Konto wurde deaktiviert.",
  };
  return map[code] ?? "Anmeldung fehlgeschlagen. Bitte erneut versuchen.";
}

export default function LoginPage() {
  const c = useSiteContent<LoginContent>("page_login", DEFAULT_LOGIN, DEFAULT_LOGIN_EN);
  const loginWithEmail = useAuthStore((s) => s.loginWithEmail);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/account";

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (v: V) => {
    try {
      await loginWithEmail(v.email, v.password);
      navigate(from, { replace: true });
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
            <label className="label">{c.labelEmail}</label>
            <input type="email" className="input" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">{c.labelPassword}</label>
            <input type="password" className="input" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          {errors.root && (
            <p className="text-xs text-red-500 rounded bg-red-50 px-3 py-2 border border-red-200">{errors.root.message}</p>
          )}
          <Button type="submit" loading={isSubmitting} className="w-full justify-center">{c.submitBtn}</Button>
        </form>
        <div className="mt-6 text-sm text-center text-ink-muted">
          {c.noAccountText} <Link to="/register" className="text-brand font-medium hover:underline">{c.registerLink}</Link>
        </div>
      </div>
    </div>
  );
}
