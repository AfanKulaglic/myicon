import { useState, useEffect } from "react";
import { subscribeSiteContent } from "@/lib/firestore";
import { useLanguageStore } from "@/store/language";

// Aggressive cache: 24 hours for content that rarely changes
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// In-memory cache for instant access (survives page navigation)
const memoryCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Subscribe to a Firebase RTDB site content section for the current UI locale.
 * Now with aggressive multi-layer caching for maximum performance.
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
  
  // Layer 1: Check in-memory cache (instant)
  const getMemoryCached = (): T | null => {
    const cacheKey = `${sectionId}_${locale}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  };

  // Layer 2: Check localStorage cache (very fast)
  const getLocalStorageCached = (): T | null => {
    try {
      const cacheKey = `siteContent_${sectionId}_${locale}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          // Also populate memory cache
          memoryCache.set(`${sectionId}_${locale}`, { data, timestamp });
          return data as T;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
    return null;
  };

  // Try both cache layers first
  const initialContent = getMemoryCached() || getLocalStorageCached() || activeDefaults;
  const [content, setContent] = useState<T>(initialContent);
  void defaultsEn;

  useEffect(() => {
    // Check caches again on mount
    const cached = getMemoryCached() || getLocalStorageCached();
    if (cached) {
      setContent(cached);
      // Still subscribe to get updates in background
    } else {
      setContent(activeDefaults);
    }

    const unsub = subscribeSiteContent(sectionId, (data) => {
      if (data) {
        const localeData = data[locale] as Partial<T> | undefined;
        const finalContent = localeData ? { ...activeDefaults, ...localeData } as T : activeDefaults;
        setContent(finalContent);
        
        // Cache in both layers
        const cacheKey = `${sectionId}_${locale}`;
        const cacheData = { data: finalContent, timestamp: Date.now() };
        
        // Memory cache
        memoryCache.set(cacheKey, cacheData);
        
        // localStorage cache
        try {
          localStorage.setItem(`siteContent_${cacheKey}`, JSON.stringify(cacheData));
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
