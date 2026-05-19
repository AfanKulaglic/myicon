import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { Package, Heart, User, FileEdit, LayoutDashboard, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN, type AccountContent } from "@/types/content";

export default function AccountLayout() {
  const c = useSiteContent<AccountContent>("page_account", DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const NAV = [
    { to: "/account", label: c.navOverview, icon: LayoutDashboard, end: true },
    { to: "/account/orders", label: c.navOrders, icon: Package },
    { to: "/account/drafts", label: c.navDesigns, icon: FileEdit },
    { to: "/account/wishlist", label: c.navWishlist, icon: Heart },
    { to: "/account/profile", label: c.navProfile, icon: User },
  ];

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return (
    <div className="container py-6 sm:py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 sm:gap-6 lg:gap-8">
      <aside className="card p-3 h-fit lg:sticky lg:top-24">
        <div className="px-3 py-3 border-b border-line mb-2">
          <div className="text-xs text-ink-muted">{c.loggedInAs}</div>
          <div className="font-medium truncate">{user.name ?? user.email}</div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-brand/10 text-brand font-medium" : "text-ink-muted hover:bg-surface-alt hover:text-ink"
                )
              }
            >
              <n.icon className="size-4" /> {n.label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-muted hover:bg-surface-alt hover:text-red-500 mt-2 border-t border-line pt-3"
          >
            <LogOut className="size-4" /> {c.navLogout}
          </button>
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
