import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductDetail } from "@/features/product/ProductDetail";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { applySeo } from "@/lib/seo";

export default function ProductPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);

  // Dynamic SEO per product: title, description, OG tags + Product schema
  useEffect(() => {
    if (!product) return;
    const cleanDesc =
      product.description?.replace(/\s+/g, " ").trim().slice(0, 155) ??
      `MYICON ${product.title} — ab ${product.priceFrom.toFixed(2)} € online bestellen.`;
    applySeo({
      title: `${product.title} — ab ${product.priceFrom.toFixed(2)} €`,
      description: cleanDesc,
      path: `/products/${product.slug}`,
      image: product.image || undefined,
      product: {
        name: product.title,
        description: cleanDesc,
        price: product.priceFrom,
        image: product.image || undefined,
        sku: product.id,
      },
    });
  }, [product]);

  if (loading && !product) return <ProductDetailSkeleton />;
  if (!loading && !product) return <Navigate to="/categories" replace />;
  if (!product) return null;
  return <ProductDetail product={product} />;
}
