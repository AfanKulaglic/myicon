import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAdminCode } from "@/lib/firestore";

interface AdminState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  unlock: (code: string) => Promise<boolean>;
  lock: () => void;
  clearError: () => void;
}

// Default code used if no code has been set in Firestore yet
const DEFAULT_CODE = "admin123";

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      loading: false,
      error: null,
      clearError: () => set({ error: null }),
      lock: () => set({ isAdmin: false }),

      unlock: async (code: string) => {
        set({ loading: true, error: null });
        try {
          const stored = await getAdminCode();
          const expected = stored ?? import.meta.env.VITE_ADMIN_CODE ?? DEFAULT_CODE;
          if (code === expected) {
            set({ isAdmin: true, loading: false });
            return true;
          }
          set({ loading: false, error: "Falscher Zugangscode" });
          return false;
        } catch {
          set({ loading: false, error: "Verbindungsfehler. Bitte erneut versuchen." });
          return false;
        }
      },
    }),
    {
      name: "myicon-admin",
      // Session storage: clears when tab is closed
      storage: createJSONStorage(() => sessionStorage),
      // Only persist isAdmin — never persist loading/error (they can get stuck)
      partialize: (state) => ({ isAdmin: state.isAdmin }),
      onRehydrateStorage: () => (state) => {
        if (state) state.loading = false;
      },
    }
  )
);
