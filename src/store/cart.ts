import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, AppliedPromo } from "@/types";
import { uid } from "@/lib/utils";
import { computeDiscount } from "@/lib/promo";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promo: AppliedPromo | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  applyPromo: (promo: AppliedPromo) => void;
  removePromo: () => void;
  subtotal: () => number;
  discount: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promo: null,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) =>
              i.productId === item.productId &&
              i.variant.color === item.variant.color &&
              i.variant.size === item.variant.size &&
              i.designId === item.designId
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...s.items, { ...item, id: uid("cart") }] };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clear: () => set({ items: [], promo: null }),
      applyPromo: (promo) => set({ promo }),
      removePromo: () => set({ promo: null }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      // Recompute discount live against current items so it stays correct
      // when quantities change after a code was applied.
      discount: () => {
        const { promo, items } = get();
        if (!promo) return 0;
        return computeDiscount(promo, items);
      },
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "myicon-cart" }
  )
);
