import { create } from "zustand";

// Site is German-only. The `Locale` type and store are kept so any references
// continue to compile, but the locale is permanently locked to "de" and
// `setLocale` is a no-op.
export type Locale = "de";

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>(() => ({
  locale: "de",
  setLocale: () => {
    /* no-op: language switching has been removed */
  },
}));
