import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { saveProduct } from "@/lib/firestore";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PlacementsEditor } from "@/components/admin/PlacementsEditor";
import { Button } from "@/components/ui/Button";
import { useT } from "@/hooks/useT";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import { uid } from "@/lib/utils";
import type { PrintPlacement } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Titel erforderlich"),
  slug: z.string().min(2, "Slug erforderlich"),
  description: z.string().min(5, "Beschreibung erforderlich"),
  highlights: z.array(z.object({ value: z.string() })),
  badge: z.string().optional(),
  category: z.string().min(1, "Kategorie erforderlich"),
  subcategory: z.string().optional(),
  type: z.enum(["tshirt", "polo", "hoodie", "cap", "apron", "flyer", "brochure", "businesscard", "poster", "promo", "other"]),
  priceFrom: z.coerce.number().min(0),
  basePrice: z.coerce.number().min(0),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviews: z.coerce.number().min(0).optional(),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  sizes: z.string(), // comma-separated, converted on save
  image: z.string().optional(),
  bestseller: z.boolean().optional(),
  // Advanced: raw JSON strings
  galleryJson: z.string().optional(),
  viewsJson: z.string().optional(),
  zonesJson: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AdminProductForm() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { products } = useProducts(false);
  const { categories } = useCategories();
  const existing = isNew ? null : products.find((p) => p.id === id) ?? null;

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "other",
      priceFrom: 0,
      basePrice: 0,
      bestseller: false,
      highlights: [],
      colors: [],
      sizes: "",
    },
  });

  const highlightFields = useFieldArray({ control, name: "highlights" });
  const colorFields = useFieldArray({ control, name: "colors" });

  const imageValue = watch("image") ?? "";
  const [placements, setPlacements] = useState<PrintPlacement[]>([]);

  // Populate form when editing
  useEffect(() => {
    if (!existing) return;
    reset({
      title: existing.title,
      slug: existing.slug,
      description: existing.description ?? "",
      highlights: (existing.highlights ?? []).map((v: string) => ({ value: v })),
      badge: existing.badge ?? "",
      category: existing.category,
      subcategory: existing.subcategory ?? "",
      type: (existing.type as FormValues["type"]) ?? "other",
      priceFrom: existing.priceFrom ?? existing.basePrice,
      basePrice: existing.basePrice,
      rating: existing.rating ?? 5,
      reviews: existing.reviews ?? 0,
      colors: (existing.colors ?? []).map((c: { name: string; hex: string }) => ({ name: c.name, hex: c.hex })),
      sizes: (existing.sizes ?? []).join(", "),
      image: existing.image ?? "",
      bestseller: existing.bestseller ?? false,
      galleryJson: JSON.stringify(existing.gallery ?? [], null, 2),
      viewsJson: JSON.stringify(existing.views ?? {}, null, 2),
      zonesJson: JSON.stringify(existing.zones ?? [], null, 2),
    });
    setPlacements(existing.placements ?? []);
  }, [existing, reset]);

  const onSubmit = async (values: FormValues) => {
    let gallery: string[] = [];
    let views: Record<string, unknown> = {};
    let zones: unknown[] = [];
    try { gallery = JSON.parse(values.galleryJson || "[]"); } catch { gallery = []; }
    try { views = JSON.parse(values.viewsJson || "{}"); } catch { views = {}; }
    try { zones = JSON.parse(values.zonesJson || "[]"); } catch { zones = []; }

    const product = {
      id: isNew ? uid("prod") : id!,
      title: values.title,
      slug: values.slug,
      description: values.description,
      highlights: values.highlights.map((h) => h.value).filter(Boolean),
      badge: values.badge || undefined,
      category: values.category as import("@/types").CategorySlug,
      type: values.type as import("@/types").ProductType,
      subcategory: values.subcategory || undefined,
      priceFrom: values.priceFrom,
      basePrice: values.basePrice,
      rating: values.rating ?? 5,
      reviews: values.reviews ?? 0,
      colors: values.colors,
      sizes: values.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      image: values.image || "",
      gallery,
      views,
      zones,
      placements,
      bestseller: values.bestseller ?? false,
    };

    await saveProduct(product as any);
    navigate("/admin/products");
  };

  const selectedCategory = categories.find((c) => c.slug === watch("category"));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/products")} className="text-ink-muted hover:text-ink">
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="text-2xl font-semibold">{isNew ? t("admin.products.newProduct") : t("admin.products.editProduct")}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">{t("admin.products.basicInfo")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t("admin.field.title")}</label>
              <input className="input" {...register("title")} />
              {errors.title && <p className="err">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label">{t("admin.products.labelSlug")}</label>
              <input className="input" {...register("slug")} />
              {errors.slug && <p className="err">{errors.slug.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">{t("admin.field.description")}</label>
            <textarea rows={3} className="input resize-none" {...register("description")} />
          </div>
          <div>
            <label className="label flex items-center justify-between">
              {t("admin.products.labelHighlights")}
              <button type="button" onClick={() => highlightFields.append({ value: "" })} className="text-xs text-brand hover:underline flex items-center gap-1">
                <Plus className="size-3" /> {t("admin.action.add")}
              </button>
            </label>
            <div className="space-y-2 mt-1">
              {highlightFields.fields.map((f, i) => (
                <div key={f.id} className="flex gap-2">
                  <input className="input flex-1" {...register(`highlights.${i}.value`)} placeholder="Highlight…" />
                  <button type="button" onClick={() => highlightFields.remove(i)} className="text-ink-muted hover:text-red-500">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="bestseller" {...register("bestseller")} className="rounded border-line" />
            <label htmlFor="bestseller" className="text-sm text-ink-muted">Bestseller</label>
          </div>
          <div>
            <label className="label">{t("admin.field.badge")} (z.B. "Neu")</label>
            <input className="input" {...register("badge")} placeholder="Optionaler Badge-Text" />
          </div>
        </div>

        {/* Category & Pricing */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">{t("admin.products.categoryPricing")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t("admin.nav.categories")}</label>
              <select className="input" {...register("category")}>
                <option value="">{t("admin.products.selectCategory")}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.title}</option>
                ))}
              </select>
              {errors.category && <p className="err">{errors.category.message}</p>}
            </div>
            <div>
              <label className="label">{t("admin.products.labelSubcategory")}</label>
              <select className="input" {...register("subcategory")}>
                <option value="">{t("admin.products.none")}</option>
                {selectedCategory?.subcategories.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">{t("admin.products.labelType")}</label>
              <select className="input" {...register("type")}>
                <option value="tshirt">T-Shirt</option>
                <option value="polo">Polo-Shirt</option>
                <option value="hoodie">Hoodie</option>
                <option value="cap">Cap</option>
                <option value="apron">Schürze</option>
                <option value="flyer">Flyer</option>
                <option value="brochure">Broschüre</option>
                <option value="businesscard">Visitenkarte</option>
                <option value="poster">Plakat</option>
                <option value="promo">Werbematerial</option>
                <option value="other">{t("admin.products.typeOther")}</option>
              </select>
            </div>
            <div>
              <label className="label">{t("admin.products.labelPriceFrom")}</label>
              <input type="number" step="0.01" className="input" {...register("priceFrom")} />
            </div>
            <div>
              <label className="label">{t("admin.products.labelBasePrice")}</label>
              <input type="number" step="0.01" className="input" {...register("basePrice")} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t("admin.products.labelRating")}</label>
              <input type="number" step="0.1" min="0" max="5" className="input" {...register("rating")} />
            </div>
            <div>
              <label className="label">{t("admin.products.labelReviews")}</label>
              <input type="number" className="input" {...register("reviews")} />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">{t("admin.products.imageSection")}</h2>
          <ImageUploader
            value={imageValue}
            onChange={(url) => setValue("image", url)}
            folder="products"
            label={t("admin.products.mainImage")}
          />
        </div>

        {/* Colors & Sizes */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">{t("admin.products.variants")}</h2>
          <div>
            <label className="label flex items-center justify-between">
              {t("admin.products.labelColors")}
              <button type="button" onClick={() => colorFields.append({ name: "", hex: "#000000" })} className="text-xs text-brand hover:underline flex items-center gap-1">
                <Plus className="size-3" /> {t("admin.products.addColor")}
              </button>
            </label>
            <div className="space-y-2 mt-1">
              {colorFields.fields.map((f, i) => (
                <div key={f.id} className="flex gap-2 items-center">
                  <input type="color" {...register(`colors.${i}.hex`)} className="h-9 w-12 rounded cursor-pointer border border-line" />
                  <input className="input flex-1" {...register(`colors.${i}.name`)} placeholder={t("admin.products.colorName")} />
                  <button type="button" onClick={() => colorFields.remove(i)} className="text-ink-muted hover:text-red-500">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="label">{t("admin.products.labelSizes")}</label>
            <input className="input" {...register("sizes")} placeholder="S, M, L, XL" />
          </div>
        </div>

        {/* Print Placements (visual editor) */}
        <div className="card p-5 space-y-4">
          <div>
            <h2 className="font-semibold">{t("admin.placements.title")}</h2>
            <p className="text-xs text-ink-muted mt-0.5">{t("admin.placements.subtitle")}</p>
          </div>
          <PlacementsEditor value={placements} onChange={setPlacements} />
        </div>

        {/* Advanced JSON */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">{t("admin.products.advancedJson")}</h2>
          <div>
            <label className="label">{t("admin.products.labelGallery")}</label>
            <textarea rows={3} className="input resize-none font-mono text-xs" {...register("galleryJson")} placeholder='["https://..."]' />
          </div>
          <div>
            <label className="label">{t("admin.products.labelViews")}</label>
            <textarea rows={4} className="input resize-none font-mono text-xs" {...register("viewsJson")} placeholder='{"front": {"image": "..."}}' />
          </div>
          <div>
            <label className="label">{t("admin.products.labelZones")}</label>
            <textarea rows={4} className="input resize-none font-mono text-xs" {...register("zonesJson")} placeholder='[{"id": "front", ...}]' />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={isSubmitting}>{t("admin.save")}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>{t("admin.cancel")}</Button>
        </div>
      </form>
    </div>
  );
}
