import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Tracks which order IDs the admin has already been notified about. Persisted
 * to localStorage so a page refresh doesn't replay every existing order as
 * "new" — only orders that arrive *after* the admin's last seen list trigger
 * the toast/sound/Notification.
 */
interface AdminNotificationsState {
  seenOrderIds: string[];
  /** Mark a set of ids as seen (idempotent). */
  markSeen: (ids: string[]) => void;
  /** Quickly check if an id is already known. */
  has: (id: string) => boolean;
}

export const useAdminNotificationsStore = create<AdminNotificationsState>()(
  persist(
    (set, get) => ({
      seenOrderIds: [],
      markSeen: (ids) => {
        if (ids.length === 0) return;
        const current = new Set(get().seenOrderIds);
        let changed = false;
        for (const id of ids) {
          if (!current.has(id)) {
            current.add(id);
            changed = true;
          }
        }
        if (changed) set({ seenOrderIds: Array.from(current) });
      },
      has: (id) => get().seenOrderIds.includes(id),
    }),
    { name: "myicon-admin-seen-orders" },
  ),
);
