import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) =>
        set((s) =>
          s.productIds.includes(id)
            ? { productIds: s.productIds.filter((p) => p !== id) }
            : { productIds: [...s.productIds, id] }
        ),
      has: (id) => get().productIds.includes(id),
      clear: () => set({ productIds: [] }),
    }),
    { name: "myicon-wishlist" }
  )
);
