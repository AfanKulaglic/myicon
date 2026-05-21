import { useState, useEffect } from "react";
import { subscribeSiteContent } from "@/lib/firestore";
import { useLanguageStore } from "@/store/language";

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Subscribe to a Firebase RTDB site content section for the current UI locale.
 * Now with localStorage caching to improve performance.
 *
 * @param sectionId - the section key (e.g. "home_hero")
 * @param defaults  - fallback content for "de"
 * @param defaultsEn - fallback content for "en"
 */
export function useSiteContent<T extends object>(
  sectionId: string,
  defaults: T,
  defaultsEn?: T
): T {
  const locale = useLanguageStore((s) => s.locale);
  const activeDefaults = defaults;
  
  // Try to load from cache first
  const getCachedContent = (): T | null => {
    try {
      const cacheKey = `siteContent_${sectionId}_${locale}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data as T;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
    return null;
  };

  const [content, setContent] = useState<T>(getCachedContent() || activeDefaults);
  void defaultsEn;

  useEffect(() => {
    // Check cache first
    const cached = getCachedContent();
    if (cached) {
      setContent(cached);
    } else {
      setContent(activeDefaults);
    }

    const unsub = subscribeSiteContent(sectionId, (data) => {
      if (data) {
        const localeData = data[locale] as Partial<T> | undefined;
        const finalContent = localeData ? { ...activeDefaults, ...localeData } as T : activeDefaults;
        setContent(finalContent);
        
        // Cache the result
        try {
          const cacheKey = `siteContent_${sectionId}_${locale}`;
          localStorage.setItem(cacheKey, JSON.stringify({
            data: finalContent,
            timestamp: Date.now()
          }));
        } catch (e) {
          // Ignore cache errors
        }
      } else {
        setContent(activeDefaults);
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, locale]);

  return content;
}
