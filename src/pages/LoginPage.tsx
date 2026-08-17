import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_LOGIN, DEFAULT_LOGIN_EN, type LoginContent } from "@/types/content";
import { useState } from "react";

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
    "auth/popup-closed-by-user": "Das Anmeldefenster wurde geschlossen.",
    "auth/cancelled-popup-request": "Anmeldung abgebrochen.",
  };
  return map[code] ?? "Anmeldung fehlgeschlagen. Bitte erneut versuchen.";
}

export default function LoginPage() {
  const c = useSiteContent<LoginContent>("page_login", DEFAULT_LOGIN, DEFAULT_LOGIN_EN);
  const loginWithEmail = useAuthStore((s) => s.loginWithEmail);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/account";
  const [googleError, setGoogleError] = useState<string | null>(null);

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

  const handleGoogleLogin = async () => {
    setGoogleError(null);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      setGoogleError(firebaseError(code));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-alt via-white to-surface-alt">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-8 lg:py-12">
          {/* Left side - Branding & Info */}
          <div className="hidden lg:flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sicher & Verschlüsselt
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight">
                Willkommen<br />zurück!
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed max-w-md">
                Melden Sie sich an, um Ihre Designs zu verwalten, Bestellungen zu verfolgen und exklusive Angebote zu erhalten.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Ihre Designs speichern</h3>
                  <p className="text-sm text-ink-muted">Bearbeiten Sie Ihre Entwürfe jederzeit</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Schneller Checkout</h3>
                  <p className="text-sm text-ink-muted">Gespeicherte Adressen & Zahlungsmethoden</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Exklusive Angebote</h3>
                  <p className="text-sm text-ink-muted">Mitglieder-Rabatte & früher Zugang</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-line">
              <div className="flex items-center gap-3 text-sm text-ink-muted">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="size-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                  <div className="size-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                </div>
                <p><span className="font-semibold text-ink">2.500+</span> zufriedene Kunden</p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="card p-8 lg:p-10 shadow-elevated bg-white">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-ink">Anmelden</h2>
                <p className="mt-2 text-sm text-ink-muted">Geben Sie Ihre Anmeldedaten ein</p>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoogleLogin}
                className="w-full justify-center group hover:shadow-sm"
              >
                <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Mit Google anmelden
              </Button>

              {googleError && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 border border-red-200">
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-red-500"></span>
                    {googleError}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-ink-muted font-medium">Oder mit E-Mail</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">{c.labelEmail}</label>
                  <input 
                    type="email" 
                    placeholder="ihre@email.de"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" 
                    {...register("email")} 
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
                      <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-ink">{c.labelPassword}</label>
                    <Link to="/forgot-password" className="text-xs text-brand hover:underline">
                      Passwort vergessen?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" 
                    {...register("password")} 
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
                      <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {errors.root && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 border border-red-200">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <svg className="size-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.root.message}
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  loading={isSubmitting} 
                  size="lg"
                  className="w-full justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {c.submitBtn}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-line text-center">
                <p className="text-sm text-ink-muted">
                  Noch kein Konto?{" "}
                  <Link 
                    to="/register" 
                    className="text-brand font-semibold hover:text-brand-600 transition-colors"
                  >
                    Jetzt registrieren
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-ink-muted px-4">
              Durch die Anmeldung stimmen Sie unseren{" "}
              <Link to="/terms" className="underline hover:text-ink">Nutzungsbedingungen</Link> zu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
