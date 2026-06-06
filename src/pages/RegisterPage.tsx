import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_REGISTER, DEFAULT_REGISTER_EN, type RegisterContent } from "@/types/content";
import { useState } from "react";

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
    "auth/popup-closed-by-user": "Das Anmeldefenster wurde geschlossen.",
    "auth/cancelled-popup-request": "Anmeldung abgebrochen.",
  };
  return map[code] ?? "Registrierung fehlgeschlagen. Bitte erneut versuchen.";
}

export default function RegisterPage() {
  const c = useSiteContent<RegisterContent>("page_register", DEFAULT_REGISTER, DEFAULT_REGISTER_EN);
  const registerWithEmail = useAuthStore((s) => s.registerWithEmail);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState<string | null>(null);
  
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

  const handleGoogleSignup = async () => {
    setGoogleError(null);
    try {
      await loginWithGoogle();
      navigate("/account");
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Kostenlos starten
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight">
                Erstellen Sie Ihr<br />Konto heute
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed max-w-md">
                Werden Sie Teil unserer Community und gestalten Sie individuelle Produkte mit professionellen Design-Tools.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Sofort loslegen</h3>
                  <p className="text-sm text-ink-muted">Keine Wartezeit, direkt designen</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">100% sicher</h3>
                  <p className="text-sm text-ink-muted">Ihre Daten sind verschlüsselt geschützt</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Keine versteckten Kosten</h3>
                  <p className="text-sm text-ink-muted">Transparente Preise, faire Konditionen</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-line">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-sm text-ink-muted">
                  "Einfach zu bedienen, großartige Ergebnisse. Kann ich nur empfehlen!"
                </p>
                <p className="text-xs text-ink-muted">— Sarah M., Grafikdesignerin</p>
              </div>
            </div>
          </div>

          {/* Right side - Register Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="card p-8 lg:p-10 shadow-elevated bg-white">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-ink">Konto erstellen</h2>
                <p className="mt-2 text-sm text-ink-muted">Starten Sie in wenigen Sekunden</p>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoogleSignup}
                className="w-full justify-center group hover:shadow-sm"
              >
                <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Mit Google registrieren
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
                  <label className="block text-sm font-medium text-ink mb-2">{c.labelName}</label>
                  <input 
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" 
                    {...register("name")} 
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
                      <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

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
                  <label className="block text-sm font-medium text-ink mb-2">{c.labelPassword}</label>
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

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">{c.labelConfirm}</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-line bg-white placeholder:text-ink-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" 
                    {...register("confirm")} 
                  />
                  {errors.confirm && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
                      <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirm.message}
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
                  Haben Sie bereits ein Konto?{" "}
                  <Link 
                    to="/login" 
                    className="text-brand font-semibold hover:text-brand-600 transition-colors"
                  >
                    Jetzt anmelden
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-ink-muted px-4">
              Durch die Registrierung stimmen Sie unseren{" "}
              <Link to="/terms" className="underline hover:text-ink">Nutzungsbedingungen</Link>{" "}
              und der{" "}
              <Link to="/privacy" className="underline hover:text-ink">Datenschutzerklärung</Link> zu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
