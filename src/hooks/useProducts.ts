import { useState, useEffect } from "react";
import { subscribeToProducts } from "@/lib/firestore";
import type { Product } from "@/types";

/**
 * Subscribe to Firestore products collection.
 * @param fallbackToMock - If true (default), returns mock data when Firestore is empty.
 *   Set to false in admin context to see the true empty state.
 */
export function useProducts(fallbackToMock = true) {
  // Always start empty so mock/hardcoded images never flash before Firebase responds.
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToProducts((ps) => {
      setProducts(ps);
      setLoading(false);
    }, fallbackToMock);
    return unsub;
  }, [fallbackToMock]);

  return { products, loading };
}
