import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/admin";
import { Button } from "@/components/ui/Button";
import { useT } from "@/hooks/useT";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Menu,
  X,
} from "lucide-react";

function CodeGate() {
  const t = useT();
  const { unlock, loading, error, clearError } = useAdminStore();
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await unlock(code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt px-4">
      <div className="card p-8 w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Lock className="size-6" />
          </span>
          <h1 className="text-xl font-semibold">{t("admin.gate.title")}</h1>
          <p className="text-sm text-ink-muted text-center">{t("admin.gate.desc")}</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="input pr-10"
              placeholder={t("admin.gate.placeholder")}
              value={code}
              onChange={(e) => { setCode(e.target.value); clearError(); }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" loading={loading} className="w-full justify-center">
            {t("admin.gate.login")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const t = useT();
  const { isAdmin, lock } = useAdminStore();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const NAV = [
    { to: "/admin", icon: LayoutDashboard, label: t("admin.nav.dashboard"), end: true },
    { to: "/admin/products", icon: Package, label: t("admin.nav.products") },
    { to: "/admin/categories", icon: Tag, label: t("admin.nav.categories") },
    { to: "/admin/orders", icon: ShoppingBag, label: t("admin.nav.orders") },
    { to: "/admin/content", icon: FileText, label: t("admin.nav.content") },
    { to: "/admin/settings", icon: Settings, label: t("admin.nav.settings") },
  ];

  if (!isAdmin) return <CodeGate />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile top bar (shown < md) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-line px-3 py-2 sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
          aria-label="Menü öffnen"
        >
          <Menu className="size-5" />
        </button>
        <img src="/logo/logo text.png" alt="MYiCON" className="h-7 w-auto object-contain" />
        <span className="size-9" />
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static column on md+ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-line flex flex-col
          transform transition-transform duration-200
          ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-56 md:flex-shrink-0
        `}
      >
        <div className="px-5 py-5 border-b border-line flex items-start justify-between gap-2">
          <div>
            <img src="/logo/logo text.png" alt="MYiCON" className="h-8 w-auto object-contain" />
            <span className="block text-xs text-ink-muted">{t("admin.panel")}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden size-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt"
            aria-label="Menü schließen"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-brand/10 text-brand font-medium" : "text-ink-muted hover:bg-surface-alt hover:text-ink"
                }`
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-line space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:bg-surface-alt hover:text-ink w-full"
          >
            <Eye className="size-4" /> {t("admin.nav.viewSite")}
          </button>
          <button
            onClick={lock}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:bg-red-50 hover:text-red-600 w-full"
          >
            <LogOut className="size-4" /> {t("admin.nav.logout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-surface-alt min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
