import { useParams, Navigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductDetail } from "@/features/product/ProductDetail";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";

export default function ProductPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  if (loading && !product) return <ProductDetailSkeleton />;
  if (!loading && !product) return <Navigate to="/categories" replace />;
  if (!product) return null;
  return <ProductDetail product={product} />;
}
