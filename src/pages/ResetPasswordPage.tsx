import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const schema = z
  .object({
    password: z.string().min(6, "Mindestens 6 Zeichen"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirm"],
  });
type V = z.infer<typeof schema>;

function firebaseError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-action-code": "Dieser Link ist ungültig oder abgelaufen.",
    "auth/expired-action-code": "Dieser Link ist abgelaufen. Bitte erneut anfordern.",
    "auth/weak-password": "Das Passwort ist zu schwach (mindestens 6 Zeichen).",
    "auth/user-disabled": "Dieses Konto wurde deaktiviert.",
  };
  return map[code] ?? "Fehler beim Zurücksetzen. Bitte erneut versuchen.";
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode") ?? "";
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "done" | "invalid">(
    "checking",
  );
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((em) => {
        setEmail(em);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [oobCode]);

  const onSubmit = async (v: V) => {
    try {
      await confirmPasswordReset(auth, oobCode, v.password);
      setStatus("done");
    } catch (e: unknown) {
      setError(firebaseError((e as { code?: string }).code ?? ""));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-alt via-white to-surface-alt flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-8 lg:p-10 shadow-elevated bg-white">
          {status === "checking" && (
            <div className="text-center space-y-4 py-6">
              <KeyRound className="size-10 text-brand mx-auto animate-pulse" />
              <p className="text-sm text-ink-muted">Link wird geprüft…</p>
            </div>
          )}

          {status === "invalid" && (
            <div className="text-center space-y-4">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
                <AlertCircle className="size-7" />
              </span>
              <h2 className="text-2xl font-semibold">Ungültiger Link</h2>
              <p className="text-sm text-ink-muted">
                Dieser Link ist ungültig oder abgelaufen. Bitte fordern Sie einen
                neuen Link an.
              </p>
              <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline">
                <ArrowLeft className="size-4" /> Neuen Link anfordern
              </Link>
            </div>
          )}

          {status === "ready" && (
            <>
              <div className="mb-8">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <KeyRound className="size-6" />
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-ink">Neues Passwort</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Legen Sie ein neues Passwort für <strong>{email}</strong> fest.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Neues Passwort</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-2">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Passwort bestätigen</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    {...register("confirm")}
                  />
                  {errors.confirm && (
                    <p className="text-xs text-red-500 mt-2">{errors.confirm.message}</p>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button type="submit" loading={isSubmitting} size="lg" className="w-full justify-center">
                  Passwort speichern
                </Button>
              </form>
            </>
          )}

          {status === "done" && (
            <div className="text-center space-y-4">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto">
                <CheckCircle2 className="size-7" />
              </span>
              <h2 className="text-2xl font-semibold">Passwort geändert</h2>
              <p className="text-sm text-ink-muted">
                Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt anmelden.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full justify-center"
              >
                Zur Anmeldung
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
