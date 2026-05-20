import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";

// Route-level code splitting — each page gets its own chunk
const HomePage = lazy(() => import("@/pages/HomePage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const SubcategoryPage = lazy(() => import("@/pages/SubcategoryPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CustomizePage = lazy(() => import("@/pages/CustomizePage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"));
const TrackOrderPage = lazy(() => import("@/pages/TrackOrderPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const AccountLayout = lazy(() => import("@/pages/account/AccountLayout"));
const AccountPage = lazy(() => import("@/pages/account/AccountPage"));
const OrdersPage = lazy(() => import("@/pages/account/OrdersPage"));
const DraftsPage = lazy(() => import("@/pages/account/DraftsPage"));
const AccountWishlistPage = lazy(() => import("@/pages/account/WishlistPage"));
const ProfilePage = lazy(() => import("@/pages/account/ProfilePage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const ImprintPage = lazy(() => import("@/pages/ImprintPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const PDFPresentationPage = lazy(() => import("@/pages/PDFPresentationPage"));
const AdminDocumentationPage = lazy(() => import("@/pages/AdminDocumentationPage"));

// Admin pages — lazy-loaded, code-gated by AdminLayout
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("@/pages/admin/AdminProductForm"));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ShellLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <SiteHeader onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Suspense fallback={null}>
      <Routes>
        {/* Admin panel = full-screen, code-gated */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Customizer = full-screen, no header/footer */}
        <Route path="/products/:slug/customize" element={<CustomizePage />} />
        
        {/* PDF Presentation = full-screen, no header/footer */}
        <Route path="/pdf" element={<PDFPresentationPage />} />
        
        {/* Admin Documentation = full-screen, no header/footer */}
        <Route path="/how-to-use-admin" element={<AdminDocumentationPage />} />

        <Route
          path="*"
          element={
            <ShellLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/:slug" element={<CategoryPage />} />
                <Route path="/categories/:slug/:sub" element={<SubcategoryPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/success" element={<OrderSuccessPage />} />
                <Route path="/order/track" element={<TrackOrderPage />} />
                <Route path="/order/track/:id" element={<TrackOrderPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/account" element={<AccountLayout />}>
                  <Route index element={<AccountPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="drafts" element={<DraftsPage />} />
                  <Route path="wishlist" element={<AccountWishlistPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="/help/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/legal/terms" element={<TermsPage />} />
                <Route path="/legal/privacy" element={<PrivacyPage />} />
                <Route path="/legal/imprint" element={<ImprintPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ShellLayout>
          }
        />
      </Routes>
      <CartDrawer />
      <Toaster />
      </Suspense>
    </div>
  );
}
