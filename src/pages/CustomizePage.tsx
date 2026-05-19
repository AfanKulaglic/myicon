import { useEffect, useRef } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { PRODUCT_MAP } from "@/mock-data/products";
import { CustomizerShell } from "@/features/customizer/CustomizerShell";
import { useDraftsStore } from "@/store/drafts";
import { useCustomizer } from "@/features/customizer/state/CustomizerContext";

function DraftLoader({ draftId }: { draftId: string }) {
  const c = useCustomizer();
  const getDraft = useDraftsStore((s) => s.getDraft);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    const d = getDraft(draftId);
    if (d?.data) {
      c.loadFromSerialized(d.data);
      done.current = true;
    }
  }, [draftId, c, getDraft]);
  return null;
}

export default function CustomizePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const draftId = params.get("draft");
  const product = PRODUCT_MAP[slug];
  if (!product) return <Navigate to="/categories" replace />;
  return (
    <CustomizerShell product={product}>
      {draftId ? <DraftLoader draftId={draftId} /> : null}
    </CustomizerShell>
  );
}
