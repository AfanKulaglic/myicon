import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrackedOrdersState {
  /**
   * Order IDs the user has explicitly added to their tracking list,
   * persisted locally so they never have to retype the code.
   */
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
}

export const useTrackedOrdersStore = create<TrackedOrdersState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((s) =>
          s.ids.includes(id) ? s : { ids: [id, ...s.ids] }
        ),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    { name: "myicon-tracked-orders" }
  )
);
