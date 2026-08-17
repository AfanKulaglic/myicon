import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Bitte gültige E-Mail eingeben"),
});
type V = z.infer<typeof schema>;

function firebaseError(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found": "Kein Konto mit dieser E-Mail gefunden.",
    "auth/invalid-email": "Ungültige E-Mail-Adresse.",
    "auth/too-many-requests": "Zu viele Versuche. Bitte später erneut versuchen.",
  };
  return map[code] ?? "Fehler beim Senden. Bitte erneut versuchen.";
}

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<V>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (v: V) => {
    setSending(true);
    setError(null);
    try {
      const url =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
          ? "http://localhost:5173/reset-password"
          : "https://www.my-icon.shop/reset-password";
      await sendPasswordResetEmail(auth, v.email, {
        url,
        handleCodeInApp: true,
      });
      setSent(true);
    } catch (e: unknown) {
      setError(firebaseError((e as { code?: string }).code ?? ""));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-alt via-white to-surface-alt flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-8 lg:p-10 shadow-elevated bg-white">
          {sent ? (
            <div className="text-center space-y-4">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto">
                <CheckCircle2 className="size-7" />
              </span>
              <h2 className="text-2xl font-semibold">E-Mail gesendet</h2>
              <p className="text-sm text-ink-muted">
                Wenn ein Konto mit dieser Adresse existiert, haben wir Ihnen einen
                Link zum Zurücksetzen Ihres Passworts geschickt. Bitte prüfen Sie
                auch Ihren Spam-Ordner.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline">
                <ArrowLeft className="size-4" /> Zurück zur Anmeldung
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Mail className="size-6" />
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-ink">Passwort vergessen?</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link,
                  mit dem Sie ein neues Passwort festlegen können.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">E-Mail</label>
                  <input
                    type="email"
                    placeholder="ihre@email.de"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-2">{errors.email.message}</p>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button type="submit" loading={sending} size="lg" className="w-full justify-center">
                  Link senden
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-line text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline">
                  <ArrowLeft className="size-4" /> Zurück zur Anmeldung
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
