import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { deleteProduct, seedProductsFromMock } from "@/lib/firestore";
import { formatCurrency, cn } from "@/lib/utils";
import { Plus, Trash2, Pencil, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/hooks/useT";
import type { Product } from "@/types";

export default function AdminProducts() {
  const t = useT();
  const { products, loading } = useProducts(false);
  const { categories } = useCategories();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  const handleDelete = async (p: Product) => {
    if (!confirm(`${p.title}?`)) return;
    setDeleting(p.id);
    try { await deleteProduct(p.id); } finally { setDeleting(null); }
  };

  const handleSeed = async () => {
    if (!confirm(t("admin.products.confirmSeed"))) return;
    setSeeding(true);
    try { await seedProductsFromMock(); } finally { setSeeding(false); }
  };

  const visibleProducts = filterCat === "all"
    ? products
    : products.filter((p) => p.category === filterCat);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("admin.products.title")}</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleSeed} loading={seeding}>
            <Download className="size-4" /> {t("admin.products.importMock")}
          </Button>
          <Link to="/admin/products/new">
            <Button size="sm"><Plus className="size-4" /> {t("admin.products.newProduct")}</Button>
          </Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-line bg-surface-alt/50">
          <button
            onClick={() => setFilterCat("all")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              filterCat === "all"
                ? "bg-brand text-white"
                : "bg-surface-alt text-ink-muted hover:bg-line"
            )}
          >
            Alle ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <button
                key={c.slug}
                onClick={() => setFilterCat(c.slug)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  filterCat === c.slug
                    ? "bg-brand text-white"
                    : "bg-surface-alt text-ink-muted hover:bg-line"
                )}
              >
                {c.title} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="p-8 text-center text-ink-muted text-sm">{t("admin.loading")}</div>
        ) : visibleProducts.length === 0 ? (
          <div className="p-8 text-center text-ink-muted text-sm">
            {t("admin.products.empty")}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-alt border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">{t("admin.products.colProduct")}</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted hidden md:table-cell">{t("admin.products.colCategory")}</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted hidden sm:table-cell">{t("admin.products.colPrice")}</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">{t("admin.products.colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visibleProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img src={p.image} alt="" className="size-10 rounded-lg object-cover border border-line flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-ink-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted hidden md:table-cell">{p.category}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{formatCurrency(p.priceFrom ?? p.basePrice)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/products/${p.id}`}>
                        <Button variant="outline" size="sm"><Pencil className="size-3.5" /></Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        loading={deleting === p.id}
                        onClick={() => handleDelete(p)}
                        className="text-red-500 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
