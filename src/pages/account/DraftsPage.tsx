import { Link } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { useDraftsStore } from "@/store/drafts";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN, type AccountContent } from "@/types/content";

export default function DraftsPage() {
  const c = useSiteContent<AccountContent>("page_account", DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN);
  const drafts = useDraftsStore((s) => s.drafts);
  const removeDraft = useDraftsStore((s) => s.removeDraft);

  if (drafts.length === 0) {
    return (
      <div>
        <h1 className="h-section">{c.draftsTitle}</h1>
        <div className="card p-10 mt-6 text-center">
          <p className="text-ink-muted">{c.draftsEmpty}</p>
          <Link to="/categories" className="btn btn-primary mt-5 inline-flex">{c.draftsEmptyCta}</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h-section">{c.draftsTitle}</h1>
      <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drafts.map((d) => (
          <li key={d.id} className="card overflow-hidden flex flex-col">
            <div className="aspect-square bg-surface-alt grid place-items-center">
              {d.thumbnail ? (
                <img src={d.thumbnail} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-ink-muted">{c.draftsNoPreview}</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm truncate">{d.productTitle}</h3>
              <p className="text-xs text-ink-muted">
                {new Date(d.updatedAt).toLocaleDateString("de-DE")}
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/products/${d.productSlug}/customize?draft=${d.id}`}
                  className="flex-1 btn btn-outline text-xs py-2 justify-center"
                >
                  <Pencil className="size-3.5" /> {c.draftsEditBtn}
                </Link>
                <button
                  onClick={() => removeDraft(d.id)}
                  className="btn text-xs py-2 px-3 border border-line hover:text-red-500"
                  aria-label="Löschen"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
