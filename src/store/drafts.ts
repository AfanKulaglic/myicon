import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DesignDraft } from "@/types";
import { uid } from "@/lib/utils";

interface DraftsState {
  drafts: DesignDraft[];
  saveDraft: (draft: Omit<DesignDraft, "id" | "updatedAt"> & { id?: string }) => string;
  removeDraft: (id: string) => void;
  getDraft: (id: string) => DesignDraft | undefined;
  clear: () => void;
}

/**
 * Recursively walk a serialized canvas state and replace any inline base64
 * image dataURLs with the empty string. Inline images can be many MB each and
 * blow up the ~5 MB localStorage quota after one or two saves. Catbox-hosted
 * URLs (https://files.catbox.moe/...) are preserved as-is.
 */
function stripDataUrls(value: unknown): unknown {
  if (typeof value === "string") {
    return value.startsWith("data:") ? "" : value;
  }
  if (Array.isArray(value)) return value.map(stripDataUrls);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = stripDataUrls(v);
    }
    return out;
  }
  return value;
}

function stripThumbnail(thumb: string | undefined): string | undefined {
  if (!thumb) return undefined;
  return thumb.startsWith("data:") ? undefined : thumb;
}

export const useDraftsStore = create<DraftsState>()(
  persist(
    (set, get) => ({
      drafts: [],
      saveDraft: (input) => {
        const id = input.id ?? uid("draft");
        const draft: DesignDraft = {
          id,
          productId: input.productId,
          productSlug: input.productSlug,
          productTitle: input.productTitle,
          thumbnail: stripThumbnail(input.thumbnail),
          data: stripDataUrls(input.data),
          updatedAt: Date.now(),
        };
        set((s) => {
          const exists = s.drafts.some((d) => d.id === id);
          return {
            drafts: exists
              ? s.drafts.map((d) => (d.id === id ? draft : d))
              : [draft, ...s.drafts],
          };
        });
        return id;
      },
      removeDraft: (id) => set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),
      getDraft: (id) => get().drafts.find((d) => d.id === id),
      clear: () => set({ drafts: [] }),
    }),
    {
      name: "myicon-drafts",
      storage: {
        getItem: (name) => {
          try {
            const v = localStorage.getItem(name);
            return v ? JSON.parse(v) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const serialize = (v: unknown) => JSON.stringify(v);
          try {
            localStorage.setItem(name, serialize(value));
          } catch {
            // Quota exceeded — drop oldest drafts until it fits.
            try {
              const parsed = value as { state: { drafts: DesignDraft[] } };
              while (parsed.state.drafts.length > 1) {
                parsed.state.drafts.pop();
                try {
                  localStorage.setItem(name, serialize(parsed));
                  return;
                } catch {
                  /* keep trimming */
                }
              }
              // Last resort: clear the key entirely.
              localStorage.removeItem(name);
            } catch {
              localStorage.removeItem(name);
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
