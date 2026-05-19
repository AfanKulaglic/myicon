import { useState, useEffect } from "react";
import { subscribeSiteContent } from "@/lib/firestore";
import { useLanguageStore } from "@/store/language";

/**
 * Subscribe to a Firebase RTDB site content section for the current UI locale.
 * DB structure: siteContent/{sectionId}/de | siteContent/{sectionId}/en
 *
 * @param sectionId - the section key (e.g. "home_hero")
 * @param defaults  - fallback content for "de" (and any locale without a dedicated EN default)
 * @param defaultsEn - fallback content for "en" when no EN data exists in Firebase
 */
export function useSiteContent<T extends object>(
  sectionId: string,
  defaults: T,
  defaultsEn?: T
): T {
  const locale = useLanguageStore((s) => s.locale);
  const activeDefaults = defaults;
  const [content, setContent] = useState<T>(activeDefaults);
  void defaultsEn;

  useEffect(() => {
    // Reset to locale-specific defaults immediately while Firebase responds
    setContent(activeDefaults);

    const unsub = subscribeSiteContent(sectionId, (data) => {
      if (data) {
        // Only use the exact locale's data — do NOT fall back to "de" data when EN is missing,
        // because that would show German text to English users.
        const localeData = data[locale] as Partial<T> | undefined;
        setContent(localeData ? { ...activeDefaults, ...localeData } as T : activeDefaults);
      } else {
        setContent(activeDefaults);
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, locale]);

  return content;
}
