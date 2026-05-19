import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";

import HomePage from "@/pages/HomePage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryPage from "@/pages/CategoryPage";
import SubcategoryPage from "@/pages/SubcategoryPage";
import ProductPage from "@/pages/ProductPage";
import CustomizePage from "@/pages/CustomizePage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AccountLayout from "@/pages/account/AccountLayout";
import AccountPage from "@/pages/account/AccountPage";
import OrdersPage from "@/pages/account/OrdersPage";
import DraftsPage from "@/pages/account/DraftsPage";
import AccountWishlistPage from "@/pages/account/WishlistPage";
import ProfilePage from "@/pages/account/ProfilePage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ImprintPage from "@/pages/ImprintPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin pages (eagerly loaded — code-gated by AdminLayout)
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminContent from "@/pages/admin/AdminContent";
import AdminSettings from "@/pages/admin/AdminSettings";

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
    </div>
  );
}
