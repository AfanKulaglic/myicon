import { useLanguageStore } from "@/store/language";
import { translations, type TranslationKey } from "@/i18n/translations";

/**
 * Returns a translation function `t(key)` scoped to the current UI locale.
 * Falls back to the German string if an English translation is missing.
 */
export function useT() {
  const locale = useLanguageStore((s) => s.locale);
  return function t(key: TranslationKey): string {
    return (translations[locale] as Record<string, string>)[key]
      ?? (translations.de as Record<string, string>)[key]
      ?? key;
  };
}
