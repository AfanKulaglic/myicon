import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { useProducts } from "@/hooks/useProducts";
import {
  subscribeToPromoCodes,
  savePromoCode,
  deletePromoCode,
} from "@/lib/firestore";
import type { PromoCode } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Tag, Plus, Trash2, Pencil, Percent, Euro, Check, X,
  Power, PowerOff, Search,
} from "lucide-react";

interface PromoFormValues {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  appliesTo: "all" | "specific";
  minOrderValue: number;
  active: boolean;
}

const EMPTY: PromoFormValues = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 10,
  appliesTo: "all",
  minOrderValue: 0,
  active: true,
};

// ─── Editor form (create / edit) ──────────────────────────────────────────────
function PromoForm({
  initial,
  onClose,
}: {
  initial?: PromoCode;
  onClose: () => void;
}) {
  const { products } = useProducts(false);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(initial?.productIds ?? []);
  const [productQuery, setProductQuery] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromoFormValues>({
    defaultValues: initial
      ? {
          code: initial.code,
          description: initial.description ?? "",
          discountType: initial.discountType,
          discountValue: initial.discountValue,
          appliesTo: initial.appliesTo,
          minOrderValue: initial.minOrderValue ?? 0,
          active: initial.active,
        }
      : EMPTY,
  });

  const discountType = watch("discountType");
  const appliesTo = watch("appliesTo");

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productQuery.toLowerCase())
  );

  const onSubmit = async (v: PromoFormValues) => {
    if (v.appliesTo === "specific" && selectedIds.length === 0) {
      toast({ title: "Bitte mindestens ein Produkt auswählen", variant: "error" });
      return;
    }
    setSaving(true);
    try {
      await savePromoCode({
        ...(initial?.id ? { id: initial.id } : {}),
        code: v.code.trim().toUpperCase(),
        description: v.description.trim(),
        discountType: v.discountType,
        discountValue: Number(v.discountValue),
        appliesTo: v.appliesTo,
        productIds: v.appliesTo === "specific" ? selectedIds : [],
        minOrderValue: Number(v.minOrderValue) || 0,
        active: v.active,
      });
      toast({ title: initial ? "Code aktualisiert" : "Code erstellt", variant: "success" });
      onClose();
    } catch {
      toast({ title: "Speichern fehlgeschlagen", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 sm:p-6 space-y-5 border-2 border-brand/20">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Tag className="size-5 text-brand" />
          {initial ? "Code bearbeiten" : "Neuer Rabattcode"}
        </h2>
        <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink p-1">
          <X className="size-5" />
        </button>
      </div>

      {/* Code + description */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Code *</label>
          <input
            className="input uppercase font-mono"
            placeholder="SOMMER20"
            {...register("code", { required: "Code ist erforderlich", minLength: { value: 3, message: "Mind. 3 Zeichen" } })}
          />
          {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
        </div>
        <div>
          <label className="label">Beschreibung (intern)</label>
          <input className="input" placeholder="z.B. Sommeraktion 2026" {...register("description")} />
        </div>
      </div>

      {/* Discount type + value */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Rabatt-Typ</label>
          <div className="grid grid-cols-2 gap-2">
            <label className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${discountType === "percentage" ? "border-brand bg-brand/5 text-brand font-medium" : "border-line text-ink-muted hover:border-brand/40"}`}>
              <input type="radio" value="percentage" className="sr-only" {...register("discountType")} />
              <Percent className="size-4" /> Prozent
            </label>
            <label className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${discountType === "fixed" ? "border-brand bg-brand/5 text-brand font-medium" : "border-line text-ink-muted hover:border-brand/40"}`}>
              <input type="radio" value="fixed" className="sr-only" {...register("discountType")} />
              <Euro className="size-4" /> Festbetrag
            </label>
          </div>
        </div>
        <div>
          <label className="label">
            {discountType === "percentage" ? "Rabatt in %" : "Rabatt in €"}
          </label>
          <div className="relative">
            <input
              type="number"
              step={discountType === "percentage" ? "1" : "0.01"}
              min="0"
              max={discountType === "percentage" ? "100" : undefined}
              className="input pr-10"
              {...register("discountValue", { required: true, min: { value: 0.01, message: "Muss größer als 0 sein" } })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">
              {discountType === "percentage" ? "%" : "€"}
            </span>
          </div>
          {errors.discountValue && <p className="text-xs text-red-500 mt-1">{errors.discountValue.message}</p>}
        </div>
      </div>

      {/* Min order value */}
      <div className="max-w-[50%] sm:pr-2">
        <label className="label">Mindestbestellwert (€) — optional</label>
        <input type="number" step="0.01" min="0" className="input" placeholder="0.00" {...register("minOrderValue")} />
      </div>

      {/* Scope */}
      <div>
        <label className="label">Gültig für</label>
        <div className="grid sm:grid-cols-2 gap-2">
          <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${appliesTo === "all" ? "border-brand bg-brand/5 text-brand font-medium" : "border-line text-ink-muted hover:border-brand/40"}`}>
            <input type="radio" value="all" className="sr-only" {...register("appliesTo")} />
            Alle Produkte
          </label>
          <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${appliesTo === "specific" ? "border-brand bg-brand/5 text-brand font-medium" : "border-line text-ink-muted hover:border-brand/40"}`}>
            <input type="radio" value="specific" className="sr-only" {...register("appliesTo")} />
            Bestimmte Produkte
          </label>
        </div>
      </div>

      {/* Product picker */}
      {appliesTo === "specific" && (
        <div className="rounded-lg border border-line p-4 space-y-3 bg-surface-alt/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Produkte auswählen</p>
            <span className="text-xs text-ink-muted">{selectedIds.length} ausgewählt</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-subtle" />
            <input
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder="Produkt suchen…"
              className="input pl-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1.5 -mr-1 pr-1">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-4">Keine Produkte gefunden.</p>
            ) : (
              filteredProducts.map((p) => {
                const checked = selectedIds.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg border text-left transition-colors ${checked ? "border-brand bg-brand/5" : "border-line bg-white hover:border-brand/40"}`}
                  >
                    <span className={`size-5 rounded-md border flex items-center justify-center shrink-0 ${checked ? "bg-brand border-brand text-white" : "border-line"}`}>
                      {checked && <Check className="size-3.5" />}
                    </span>
                    {p.image ? (
                      <img src={p.image} alt="" className="size-9 rounded-md object-cover border border-line shrink-0" />
                    ) : (
                      <span className="size-9 rounded-md bg-surface-alt shrink-0" />
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{p.title}</span>
                      <span className="block text-xs text-ink-muted">{formatCurrency(p.basePrice)}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Active toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" className="sr-only peer" {...register("active")} />
        <span className="relative inline-block w-11 h-6 rounded-full bg-line peer-checked:bg-green-500 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        <span className="text-sm">Code aktiv</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={saving}>
          <Check className="size-4" /> {initial ? "Speichern" : "Code erstellen"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
      </div>
    </form>
  );
}

// ─── Single promo row ─────────────────────────────────────────────────────────
function PromoRow({
  promo,
  productCount,
  onEdit,
}: {
  promo: PromoCode;
  productCount: number;
  onEdit: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const toggleActive = async () => {
    setBusy(true);
    try {
      await savePromoCode({ id: promo.id, active: !promo.active });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Code "${promo.code}" wirklich löschen?`)) return;
    setBusy(true);
    try {
      await deletePromoCode(promo.id);
      toast({ title: "Code gelöscht" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className={`inline-flex size-10 items-center justify-center rounded-lg shrink-0 ${promo.active ? "bg-brand/10 text-brand" : "bg-surface-alt text-ink-subtle"}`}>
          {promo.discountType === "percentage" ? <Percent className="size-5" /> : <Euro className="size-5" />}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-semibold text-ink">{promo.code}</span>
            {promo.active ? (
              <span className="chip bg-green-100 text-green-700 text-[10px]">Aktiv</span>
            ) : (
              <span className="chip bg-surface-alt text-ink-subtle text-[10px]">Inaktiv</span>
            )}
          </div>
          <p className="text-xs text-ink-muted mt-0.5 truncate">
            {promo.discountType === "percentage"
              ? `${promo.discountValue}% Rabatt`
              : `${formatCurrency(promo.discountValue)} Rabatt`}
            {" · "}
            {promo.appliesTo === "all" ? "Alle Produkte" : `${productCount} Produkt(e)`}
            {promo.minOrderValue ? ` · ab ${formatCurrency(promo.minOrderValue)}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={toggleActive}
          disabled={busy}
          className="size-9 inline-flex items-center justify-center rounded-lg text-ink-muted hover:bg-surface-alt disabled:opacity-50"
          title={promo.active ? "Deaktivieren" : "Aktivieren"}
        >
          {promo.active ? <Power className="size-4 text-green-600" /> : <PowerOff className="size-4" />}
        </button>
        <button
          onClick={onEdit}
          className="size-9 inline-flex items-center justify-center rounded-lg text-ink-muted hover:bg-surface-alt"
          title="Bearbeiten"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="size-9 inline-flex items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Löschen"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPromoCodes() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);

  useEffect(() => {
    const unsub = subscribeToPromoCodes((list) => {
      setPromos(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (p: PromoCode) => { setEditing(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Tag className="size-6 text-brand" /> Rabattcodes
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Erstellen und verwalten Sie Promo-Codes für Ihre Kunden.
          </p>
        </div>
        {!showForm && (
          <Button onClick={openNew}>
            <Plus className="size-4" /> Neuer Code
          </Button>
        )}
      </div>

      {showForm && (
        <PromoForm initial={editing ?? undefined} onClose={closeForm} />
      )}

      {loading ? (
        <div className="card p-8 text-center text-ink-muted text-sm">Lädt…</div>
      ) : promos.length === 0 && !showForm ? (
        <div className="card p-10 text-center">
          <div className="mx-auto size-14 rounded-full bg-surface-alt grid place-items-center mb-4">
            <Tag className="size-6 text-ink-muted" />
          </div>
          <h3 className="font-semibold">Noch keine Rabattcodes</h3>
          <p className="text-sm text-ink-muted mt-1 mb-5">
            Erstellen Sie Ihren ersten Promo-Code, um Kunden Rabatte zu gewähren.
          </p>
          <Button onClick={openNew}><Plus className="size-4" /> Ersten Code erstellen</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => (
            <PromoRow
              key={p.id}
              promo={p}
              productCount={p.productIds?.length ?? 0}
              onEdit={() => openEdit(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
