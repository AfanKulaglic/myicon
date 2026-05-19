import { Link } from "react-router-dom";
import { Package, FileEdit, Heart, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useDraftsStore } from "@/store/drafts";
import { useWishlistStore } from "@/store/wishlist";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN, type AccountContent } from "@/types/content";

export default function AccountPage() {
  const c = useSiteContent<AccountContent>("page_account", DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN);
  const user = useAuthStore((s) => s.user);
  const orders = useAuthStore((s) => s.orders);
  const addresses = useAuthStore((s) => s.addresses);
  const drafts = useDraftsStore((s) => s.drafts);
  const wishlist = useWishlistStore((s) => s.productIds);

  const stats = [
    { icon: Package, label: c.dashStatOrders, value: orders.length, to: "/account/orders" },
    { icon: FileEdit, label: c.dashStatDesigns, value: drafts.length, to: "/account/drafts" },
    { icon: Heart, label: c.dashStatWishlist, value: wishlist.length, to: "/account/wishlist" },
    { icon: MapPin, label: c.dashStatAddresses, value: addresses.length, to: "/account/profile" },
  ];

  return (
    <div>
      <h1 className="h-section">{c.dashWelcome}{user?.name ? `, ${user.name}` : ""}!</h1>
      <p className="mt-2 text-ink-muted">{c.dashSubtitle}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card p-5 hover:shadow-elevated transition-shadow">
            <s.icon className="size-5 text-brand" />
            <div className="mt-3 text-2xl font-display font-semibold">{s.value}</div>
            <div className="text-sm text-ink-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <section className="mt-10 card p-6">
        <h2 className="font-semibold">{c.dashLastActivity}</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">{c.dashNoOrders} <Link to="/categories" className="text-brand hover:underline">{c.dashNoOrdersLink}</Link></p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className="py-3 flex justify-between items-center text-sm">
                <span className="font-mono">{o.id}</span>
                <span className="text-ink-muted">{new Date(o.createdAt).toLocaleDateString("de-DE")}</span>
                <Link to="/account/orders" className="text-brand hover:underline">{c.dashOrderDetails}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
