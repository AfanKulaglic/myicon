import { useState, useEffect } from "react";
import { subscribeToCategories } from "@/lib/firestore";
import { CATEGORIES } from "@/mock-data/categories";
import type { Category } from "@/types";

/**
 * Subscribe to Firestore categories collection.
 * Falls back to mock data when Firestore is empty.
 */
export function useCategories(fallbackToMock = true) {
  const [categories, setCategories] = useState<Category[]>(fallbackToMock ? CATEGORIES : []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToCategories((cs) => {
      setCategories(cs);
      setLoading(false);
    }, fallbackToMock);
    return unsub;
  }, [fallbackToMock]);

  return { categories, loading };
}
