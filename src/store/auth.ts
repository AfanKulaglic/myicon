import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { Address, Order } from "@/types";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  loading: boolean;
  // Firebase Auth actions
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  // Legacy / guest login used in checkout
  login: (email: string, name?: string) => void;
  addAddress: (a: Address) => void;
  addOrder: (o: Order) => void;
  _setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      orders: [],
      loading: false,

      _setUser: (user) => set({ user }),

      loginWithEmail: async (email, password) => {
        set({ loading: true });
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          set({
            user: {
              id: cred.user.uid,
              email: cred.user.email!,
              name: cred.user.displayName ?? cred.user.email!.split("@")[0],
            },
            loading: false,
          });
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },

      registerWithEmail: async (email, password, name) => {
        set({ loading: true });
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(cred.user, { displayName: name });
          set({
            user: { id: cred.user.uid, email: cred.user.email!, name },
            loading: false,
          });
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },

      // Legacy guest login for checkout auto-login
      login: (email, name) =>
        set({
          user: { id: `guest_${Date.now()}`, email, name: name ?? email.split("@")[0] },
        }),

      addAddress: (a) => set((s) => ({ addresses: [a, ...s.addresses] })),
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    { name: "myicon-auth" }
  )
);

// Keep Zustand in sync with Firebase Auth state changes (e.g. token expiry)
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  const { user, _setUser } = useAuthStore.getState();
  if (firebaseUser) {
    _setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName ?? firebaseUser.email!.split("@")[0],
    });
  } else {
    // Only clear if this was a real Firebase user (not a guest/mock user)
    if (user && !user.id.startsWith("guest_")) {
      _setUser(null);
    }
  }
});

