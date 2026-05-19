import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useCategories } from "@/hooks/useCategories";
import { saveCategory, seedCategoriesFromMock } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { useT } from "@/hooks/useT";
import { ChevronDown, ChevronRight, Download, Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/store/toast";
import type { Category, Subcategory } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";

// ─── Category form shape ──────────────────────────────────────────────────────
interface SubcategoryRow {
  slug: string;
  title: string;
}

interface CategoryFormValues {
  title: string;
  description: string;
  image: string;
  subcategories: SubcategoryRow[];
}

// ─── Single category card ─────────────────────────────────────────────────────
function CategoryCard({ category }: { category: Category }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { isDirty } } = useForm<CategoryFormValues>({
    defaultValues: {
      title: category.title,
      description: category.description,
      image: category.image ?? "",
      subcategories: category.subcategories.map((s: Subcategory) => ({
        slug: s.slug,
        title: s.title,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subcategories" });

  const onSubmit = async (values: CategoryFormValues) => {
    setSaving(true);
    try {
      await saveCategory({
        ...category,
        title: values.title,
        description: values.description,
        image: values.image || category.image,
        subcategories: values.subcategories.map((s) => ({
          slug: s.slug,
          title: s.title,
        })),
      });
      toast({ title: t("admin.action.saved") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-alt/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {category.image && (
            <img src={category.image} alt="" className="size-9 rounded-lg object-cover border border-line" />
          )}
          <div>
            <p className="font-medium text-sm">{category.title}</p>
            <p className="text-xs text-ink-muted">{category.slug} · {category.subcategories.length} {t("admin.categories.subcategories")}</p>
          </div>
        </div>
        {open ? <ChevronDown className="size-4 text-ink-muted" /> : <ChevronRight className="size-4 text-ink-muted" />}
      </button>

      {open && (
        <form onSubmit={handleSubmit(onSubmit)} className="border-t border-line px-5 py-5 space-y-5 bg-white">
          {/* Image */}
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Kategoriebild</p>
            <ImageUploader
              value={watch("image")}
              onChange={(url) => setValue("image", url, { shouldDirty: true })}
              folder="categories"
              label="Bild"
            />
          </div>

          {/* Names */}
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">{t("admin.categories.categoryName")}</p>
            <div>
              <label className="label">Name</label>
              <input className="input" {...register("title")} />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">{t("admin.categories.catDescription")}</p>
            <div>
              <label className="label">Beschreibung</label>
              <textarea rows={2} className="input resize-none" {...register("description")} />
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{t("admin.categories.subcategories")}</p>
              <button
                type="button"
                onClick={() => append({ slug: "", title: "" })}
                className="text-xs text-brand flex items-center gap-1 hover:underline"
              >
                <Plus className="size-3" /> {t("admin.categories.addSubcategory")}
              </button>
            </div>
            <div className="space-y-2">
              {/* Column headers */}
              <div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-2 px-1">
                <span className="text-xs text-ink-muted">Slug</span>
                <span className="text-xs text-ink-muted">Name</span>
                <span />
              </div>
              {fields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <input
                    className="input text-xs font-mono"
                    {...register(`subcategories.${i}.slug`)}
                    placeholder="slug"
                  />
                  <input
                    className="input text-sm"
                    {...register(`subcategories.${i}.title`)}
                    placeholder="Name"
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-ink-muted hover:text-red-500 p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" size="sm" loading={saving}>
              <Save className="size-3.5" /> {t("admin.save")}
            </Button>
            {!isDirty && !saving && (
              <span className="text-xs text-ink-muted">{t("admin.categories.noChanges")}</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminCategories() {
  const t = useT();
  const { categories, loading } = useCategories(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm(t("admin.categories.confirmSeed"))) return;
    setSeeding(true);
    try { await seedCategoriesFromMock(); } finally { setSeeding(false); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("admin.categories.title")}</h1>
          <p className="text-sm text-ink-muted mt-0.5">{t("admin.categories.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSeed} loading={seeding}>
          <Download className="size-4" /> {t("admin.categories.importMock")}
        </Button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-ink-muted text-sm">{t("admin.loading")}</div>
      ) : categories.length === 0 ? (
        <div className="card p-8 text-center text-ink-muted text-sm">
          {t("admin.categories.empty")}
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
