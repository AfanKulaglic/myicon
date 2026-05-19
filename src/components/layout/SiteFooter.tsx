import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/mock-data/categories";
import { Mail, Phone, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useT } from "@/hooks/useT";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_FOOTER, DEFAULT_FOOTER_EN, type FooterContent } from "@/types/content";

const FOOTER_TRUST_ICONS = [Truck, ShieldCheck, CreditCard, Phone];

export function SiteFooter() {
  const t = useT();
  const c = useSiteContent<FooterContent>("site_footer", DEFAULT_FOOTER, DEFAULT_FOOTER_EN);
  return (
    <footer className="bg-surface-alt border-t border-line mt-16">
      {/* Trust strip */}
      <div className="border-b border-line bg-white">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
          {c.trustItems.map(({ label }, i) => {
            const Icon = FOOTER_TRUST_ICONS[i] ?? Truck;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-4" />
                </span>
                <span className="text-ink-muted">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
        <div className="col-span-2 md:col-span-1 lg:col-span-2 max-w-sm">
          <Logo />
          <p className="mt-4 text-sm text-ink-muted leading-relaxed">
            {c.tagline}
          </p>
          <div className="mt-5 space-y-2 text-sm text-ink-muted">
            <a className="flex items-center gap-2 hover:text-ink" href={c.phoneHref}>
              <Phone className="size-4" /> {c.phone}
            </a>
            <a className="flex items-center gap-2 hover:text-ink" href={c.emailHref}>
              <Mail className="size-4" /> {c.email}
            </a>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink mb-3">{c.colProductsLabel}</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link className="hover:text-ink" to={`/categories/${cat.slug}`}>
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink mb-3">{c.colAccountLabel}</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link className="hover:text-ink" to="/login">{t("footer.login")}</Link></li>
            <li><Link className="hover:text-ink" to="/register">{t("footer.register")}</Link></li>
            <li><Link className="hover:text-ink" to="/account/orders">{t("footer.orders")}</Link></li>
            <li><Link className="hover:text-ink" to="/account/drafts">{t("footer.designs")}</Link></li>
            <li><Link className="hover:text-ink" to="/wishlist">{t("footer.wishlist")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink mb-3">{c.colServiceLabel}</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link className="hover:text-ink" to="/help/faq">{t("footer.faq")}</Link></li>
            <li><Link className="hover:text-ink" to="/order/track">Bestellung verfolgen</Link></li>
            <li><Link className="hover:text-ink" to="/contact">{t("footer.contact")}</Link></li>
            <li><Link className="hover:text-ink" to="/about">{t("footer.about")}</Link></li>
            <li><Link className="hover:text-ink" to="/legal/terms">{t("footer.terms")}</Link></li>
            <li><Link className="hover:text-ink" to="/legal/privacy">{t("footer.privacy")}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <div>© {new Date().getFullYear()} MYICON. {c.copyrightText}</div>
          <div className="flex items-center gap-4">
            <span>Bezahlung: PayPal</span>
            <Link to="/legal/imprint" className="hover:text-ink">{t("footer.imprint")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
