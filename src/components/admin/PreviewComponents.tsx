/**
 * Live preview components for AdminContent.
 * Every <PreviewEl> carries a `section` prop so clicking it switches the correct
 * section tab in the left panel and scrolls to the matching [data-field-id] input.
 */
import {
  ArrowRight, Sparkles,
  MousePointerClick, Brush, PackageCheck,
  Truck, ShieldCheck, Save, CreditCard, Zap, Star, Package,
  Phone, Award, Tag, Clock, Globe, Leaf, Users,
  Mail, MapPin,
  Menu, Search, User, Heart, ShoppingBag, ChevronDown,
  LayoutDashboard, FileEdit, LogOut,
  type LucideIcon,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { PreviewEl } from "./PreviewContext";
import { CATEGORIES } from "@/mock-data/categories";
import type {
  HeroContent, HowItWorksContent, CTAContent, AboutContent,
  FAQContent, ContactContent, TrustStripContent,
  HomeCategoriesContent, HomeBestsellersContent,
  LegalPageContent, ImprintContent,
  NavbarContent, FooterContent,
  CartContent, WishlistContent,
  LoginContent, RegisterContent, AccountContent,
} from "@/types/content";

// ─── Icon maps ────────────────────────────────────────────────────────────────
const TRUST_ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Zap, ShieldCheck, Save, CreditCard, Truck, Star, Package, Phone, Award, Tag, Clock, Globe,
};
const HOW_ICON_MAP: Record<string, LucideIcon> = { MousePointerClick, Brush, PackageCheck };
const ABOUT_ICON_MAP: Record<string, LucideIcon> = { Award, Truck, Leaf, Users };

// ─── Hero Preview ─────────────────────────────────────────────────────────────
export function HeroPreview({ c }: { c: HeroContent }) {
  return (
    <section className="relative bg-gradient-to-b from-surface-alt to-white border-b border-line overflow-hidden">
      <div className="container py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl space-y-3">
            <PreviewEl fieldId="badge" section="hero" as="span" className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand/10 text-brand">
              <Sparkles className="size-3.5" /> {c.badge}
            </PreviewEl>
            <PreviewEl fieldId="title" section="hero" className="block">
              <h1 className="text-2xl font-bold font-display text-ink leading-tight">
                {c.title.split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}{" "}
                <PreviewEl fieldId="titleHighlight" section="hero" as="span" className="text-brand">
                  {c.titleHighlight}
                </PreviewEl>
              </h1>
            </PreviewEl>
            <PreviewEl fieldId="subtitle" section="hero">
              <p className="text-sm text-ink-muted leading-relaxed">{c.subtitle}</p>
            </PreviewEl>
            <div className="flex flex-wrap gap-2 pt-1">
              <PreviewEl fieldId="ctaPrimaryText" section="hero" className="inline-flex">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium">
                  {c.ctaPrimaryText} <ArrowRight className="size-3.5" />
                </button>
              </PreviewEl>
              <PreviewEl fieldId="ctaSecondaryText" section="hero" className="inline-flex">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line text-ink text-sm font-medium">
                  {c.ctaSecondaryText}
                </button>
              </PreviewEl>
            </div>
            {(c.stats ?? []).length > 0 && (
              <dl className="grid grid-cols-3 gap-4 pt-2">
                {(c.stats ?? []).map((s, i) => (
                  <PreviewEl key={i} fieldId={`stats.${i}.value`} section="hero" className="block">
                    <dt className="text-lg font-semibold font-display text-ink">{s.value}</dt>
                    <dd className="text-xs text-ink-muted mt-0.5">{s.label}</dd>
                  </PreviewEl>
                ))}
              </dl>
            )}
          </div>
          <div className="relative">
            <PreviewEl fieldId="imageUrl" section="hero" className="block">
              <div className="aspect-[5/4] rounded-xl overflow-hidden bg-white border border-line shadow-sm">
                <div
                  className="size-full bg-cover bg-center"
                  style={{
                    backgroundImage: c.imageUrl
                      ? `url(${c.imageUrl})`
                      : "url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=60&auto=format&fit=crop)",
                  }}
                />
              </div>
            </PreviewEl>
            {c.promoCard && (
              <PreviewEl fieldId="promoCard.tag" section="hero" className="absolute -left-2 -bottom-2 block">
                <div className="card p-3 shadow-elevated bg-white w-52 text-xs">
                  <div className="text-ink-muted">{c.promoCard.tag}</div>
                  <div className="mt-1 font-semibold text-ink text-sm">{c.promoCard.title}</div>
                  <div className="mt-1 text-ink-muted">{c.promoCard.text}</div>
                </div>
              </PreviewEl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TrustStrip Preview ───────────────────────────────────────────────────────
export function TrustStripPreview({ c }: { c: TrustStripContent }) {
  return (
    <section className="bg-white border-y border-line py-3">
      <div className="container">
        <ul className="flex flex-wrap items-center gap-4">
          {c.items.map(({ icon, label }, i) => {
            const Icon = TRUST_ICON_MAP[icon] ?? Zap;
            return (
              <PreviewEl key={i} fieldId={`items.${i}.label`} section="home_sections" as="li" className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-3.5" />
                </span>
                {label}
              </PreviewEl>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ─── Home Categories Preview ──────────────────────────────────────────────────
export function HomeCategoriesPreview({ c }: { c: HomeCategoriesContent }) {
  return (
    <section className="py-6 border-b border-line">
      <div className="container">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <PreviewEl fieldId="title" section="home_sections">
              <h2 className="text-xl font-bold font-display">{c.title}</h2>
            </PreviewEl>
            <PreviewEl fieldId="subtitle" section="home_sections">
              <p className="text-sm text-ink-muted mt-1">{c.subtitle}</p>
            </PreviewEl>
          </div>
          <PreviewEl fieldId="linkText" section="home_sections" className="inline-block">
            <span className="text-sm text-brand font-medium">{c.linkText} →</span>
          </PreviewEl>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square rounded-xl bg-surface-alt border border-line" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Home Bestsellers Preview ─────────────────────────────────────────────────
export function HomeBestsellersPreview({ c }: { c: HomeBestsellersContent }) {
  return (
    <section className="py-6 bg-surface-alt border-b border-line">
      <div className="container">
        <PreviewEl fieldId="title" section="home_sections">
          <h2 className="text-xl font-bold font-display">{c.title}</h2>
        </PreviewEl>
        <PreviewEl fieldId="subtitle" section="home_sections">
          <p className="text-sm text-ink-muted mt-1">{c.subtitle}</p>
        </PreviewEl>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[3/4] rounded-xl bg-white border border-line" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HowItWorks Preview ───────────────────────────────────────────────────────
export function HowItWorksPreview({ c }: { c: HowItWorksContent }) {
  return (
    <section className="py-8 border-b border-line">
      <div className="container">
        <div className="text-center max-w-xl mx-auto mb-6">
          <PreviewEl fieldId="sectionTitle" section="how_it_works">
            <h2 className="text-xl font-bold font-display text-ink">{c.sectionTitle}</h2>
          </PreviewEl>
          <PreviewEl fieldId="sectionSubtitle" section="how_it_works">
            <p className="mt-1 text-sm text-ink-muted">{c.sectionSubtitle}</p>
          </PreviewEl>
        </div>
        <ol className="grid sm:grid-cols-3 gap-4">
          {c.steps.map(({ icon, title, text }, i) => {
            const Icon = HOW_ICON_MAP[icon] ?? MousePointerClick;
            return (
              <PreviewEl key={i} fieldId={`steps.${i}.title`} section="how_it_works" as="li" className="card p-4 block">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-4" />
                </span>
                <h3 className="mt-3 font-semibold text-sm text-ink">{title}</h3>
                <p className="mt-1 text-xs text-ink-muted">{text}</p>
              </PreviewEl>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ─── CTA Preview ──────────────────────────────────────────────────────────────
export function CTAPreview({ c }: { c: CTAContent }) {
  return (
    <section className="py-8">
      <div className="container">
        <div className="rounded-2xl bg-brand text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-md">
            <PreviewEl fieldId="title" section="cta">
              <h2 className="text-lg font-semibold font-display">{c.title}</h2>
            </PreviewEl>
            <PreviewEl fieldId="description" section="cta">
              <p className="mt-1.5 text-white/85 text-sm">{c.description}</p>
            </PreviewEl>
          </div>
          <div className="flex gap-2 shrink-0">
            <PreviewEl fieldId="primaryText" section="cta" className="inline-flex">
              <button className="px-3 py-1.5 rounded-lg bg-white text-brand text-sm font-medium">{c.primaryText}</button>
            </PreviewEl>
            <PreviewEl fieldId="secondaryText" section="cta" className="inline-flex">
              <button className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-sm font-medium">{c.secondaryText}</button>
            </PreviewEl>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About Preview ────────────────────────────────────────────────────────────
export function AboutPreview({ c }: { c: AboutContent }) {
  return (
    <div>
      <section className="container py-8 max-w-2xl">
        <PreviewEl fieldId="heroTitle" section="about">
          <h1 className="text-2xl font-bold font-display text-ink">{c.heroTitle}</h1>
        </PreviewEl>
        <PreviewEl fieldId="heroSubtitle" section="about">
          <p className="mt-3 text-sm text-ink-muted">{c.heroSubtitle}</p>
        </PreviewEl>
      </section>
      <section className="bg-surface-alt border-y border-line py-6">
        <div className="container grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {c.features.map((f, i) => {
            const Icon = ABOUT_ICON_MAP[f.icon] ?? Award;
            return (
              <PreviewEl key={i} fieldId={`features.${i}.label`} section="about" className="block">
                <Icon className="size-5 text-brand" />
                <h3 className="mt-2 font-semibold text-sm">{f.label}</h3>
                <p className="text-xs text-ink-muted mt-1">{f.text}</p>
              </PreviewEl>
            );
          })}
        </div>
      </section>
      <section className="container py-8 max-w-2xl">
        <PreviewEl fieldId="storyTitle" section="about">
          <h2 className="text-lg font-semibold font-display">{c.storyTitle}</h2>
        </PreviewEl>
        <div className="mt-3 space-y-2">
          {c.storyParagraphs.map((p, i) => (
            <PreviewEl key={i} fieldId={`storyParagraphs.${i}`} section="about">
              <p className="text-sm text-ink-muted">{p}</p>
            </PreviewEl>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── FAQ Preview ──────────────────────────────────────────────────────────────
export function FAQPreview({ c }: { c: FAQContent }) {
  return (
    <div className="container py-8 max-w-2xl">
      <PreviewEl fieldId="title" section="faq">
        <h1 className="text-2xl font-bold font-display">{c.title}</h1>
      </PreviewEl>
      <PreviewEl fieldId="subtitle" section="faq">
        <p className="mt-2 text-sm text-ink-muted">{c.subtitle}</p>
      </PreviewEl>
      <div className="mt-6 space-y-2">
        {c.items.map((f, i) => (
          <PreviewEl key={i} fieldId={`items.${i}.q`} section="faq" className="card overflow-hidden block p-3">
            <p className="font-medium text-sm">{f.q}</p>
            <p className="mt-1 text-xs text-ink-muted">{f.a}</p>
          </PreviewEl>
        ))}
      </div>
    </div>
  );
}

// ─── Contact Preview ──────────────────────────────────────────────────────────
export function ContactPreview({ c }: { c: ContactContent }) {
  return (
    <div className="container py-8">
      <PreviewEl fieldId="title" section="contact">
        <h1 className="text-2xl font-bold font-display">{c.title}</h1>
      </PreviewEl>
      <PreviewEl fieldId="subtitle" section="contact">
        <p className="mt-2 text-sm text-ink-muted">{c.subtitle}</p>
      </PreviewEl>
      <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-sm">
        <PreviewEl fieldId="email" section="contact" className="card p-3 block">
          <Mail className="size-4 text-brand" />
          <p className="text-xs text-ink-muted mt-2">E-Mail</p>
          <p className="text-sm font-medium mt-0.5">{c.email}</p>
        </PreviewEl>
        <PreviewEl fieldId="phone" section="contact" className="card p-3 block">
          <Phone className="size-4 text-brand" />
          <p className="text-xs text-ink-muted mt-2">Telefon</p>
          <p className="text-sm font-medium mt-0.5">{c.phone}</p>
        </PreviewEl>
        <PreviewEl fieldId="address" section="contact" className="card p-3 block">
          <MapPin className="size-4 text-brand" />
          <p className="text-xs text-ink-muted mt-2">Adresse</p>
          <p className="text-sm font-medium mt-0.5 whitespace-pre-line">{c.address}</p>
        </PreviewEl>
        <PreviewEl fieldId="hours" section="contact" className="card p-3 block">
          <Clock className="size-4 text-brand" />
          <p className="text-xs text-ink-muted mt-2">Servicezeiten</p>
          <p className="text-sm font-medium mt-0.5">{c.hours}</p>
        </PreviewEl>
      </div>
    </div>
  );
}

// ─── Legal Preview ────────────────────────────────────────────────────────────
export function LegalPreview({ c, section = "terms" }: { c: LegalPageContent; section?: string }) {
  return (
    <div className="container py-8 max-w-2xl">
      <PreviewEl fieldId="title" section={section}>
        <h1 className="text-2xl font-bold font-display">{c.title}</h1>
      </PreviewEl>
      <div className="mt-6 space-y-4">
        {c.sections.map((s, i) => (
          <PreviewEl key={i} fieldId={`sections.${i}.h`} section={section} className="block space-y-1">
            <h2 className="font-semibold text-sm">{s.h}</h2>
            <p className="text-xs text-ink-muted whitespace-pre-wrap">{s.p}</p>
          </PreviewEl>
        ))}
      </div>
    </div>
  );
}

// ─── Imprint Preview ──────────────────────────────────────────────────────────
export function ImprintPreview({ c }: { c: ImprintContent }) {
  return (
    <div className="container py-8 max-w-2xl">
      <PreviewEl fieldId="title" section="imprint">
        <h1 className="text-2xl font-bold font-display">{c.title}</h1>
      </PreviewEl>
      <PreviewEl fieldId="body" section="imprint" className="block mt-4">
        <div className="text-sm text-ink-muted whitespace-pre-wrap font-mono">{c.body}</div>
      </PreviewEl>
    </div>
  );
}

// ─── Navbar Preview ───────────────────────────────────────────────────────────
export function NavbarPreview({ c }: { c: NavbarContent }) {
  return (
    <header className="bg-white/95 border-b border-line">
      {/* Top utility row */}
      <div className="bg-surface-alt border-b border-line px-4 py-1.5 text-xs text-ink-muted flex items-center justify-between">
        <div className="flex items-center gap-5">
          <PreviewEl fieldId="utilShipping" section="navbar" as="span">{c.utilShipping}</PreviewEl>
          <PreviewEl fieldId="utilSameday" section="navbar" as="span">{c.utilSameday}</PreviewEl>
          <PreviewEl fieldId="utilGuarantee" section="navbar" as="span">{c.utilGuarantee}</PreviewEl>
        </div>
        <div className="flex items-center gap-4">
          <PreviewEl fieldId="helpText" section="navbar" as="span" className="hover:text-ink cursor-pointer">{c.helpText}</PreviewEl>
          <PreviewEl fieldId="contactText" section="navbar" as="span" className="hover:text-ink cursor-pointer">{c.contactText}</PreviewEl>
        </div>
      </div>
      {/* Main row */}
      <div className="px-4 py-3 flex items-center gap-3 lg:gap-6">
        {/* Logo */}
        <span className="inline-flex items-center gap-2">
          <img src="/logo/logo text.png" alt="MYiCON" className="h-8 w-auto object-contain" />
        </span>
        {/* Search */}
        <div className="flex flex-1 max-w-2xl mx-2 lg:mx-6 items-center gap-2 rounded-xl border border-line bg-surface-alt focus-within:bg-white focus-within:border-brand px-3 py-2">
          <Search className="size-4 text-ink-subtle shrink-0" />
          <PreviewEl fieldId="searchPlaceholder" section="navbar" as="span" className="text-sm text-ink-subtle flex-1 truncate">{c.searchPlaceholder}</PreviewEl>
          <PreviewEl fieldId="searchBtnText" section="navbar" as="span" className="rounded-lg bg-brand text-white text-sm font-medium px-4 py-1.5 shrink-0">{c.searchBtnText}</PreviewEl>
        </div>
        {/* Icons */}
        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <span className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink">
            <User className="size-5" />
            <PreviewEl fieldId="accountText" section="navbar" as="span" className="hidden lg:inline">{c.accountText}</PreviewEl>
          </span>
          <span className="size-10 inline-flex items-center justify-center rounded-lg text-ink-muted"><Heart className="size-5" /></span>
          <span className="size-10 inline-flex items-center justify-center rounded-lg text-ink-muted"><ShoppingBag className="size-5" /></span>
        </div>
      </div>
      {/* Desktop nav row */}
      <nav className="border-t border-line bg-white">
        <div className="px-4">
          <ul className="flex items-center gap-1">
            <li>
              <span className="inline-flex items-center px-4 py-3.5 text-sm font-medium text-ink">Alle Produkte</span>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug} className="flex items-center">
                <span className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-ink">
                  {cat.title}
                  <ChevronDown className="size-3.5" />
                </span>
              </li>
            ))}
            <li>
              <span className="inline-flex items-center px-4 py-3.5 text-sm font-medium text-ink">Hilfe &amp; Wissen</span>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

// ─── Footer Preview ───────────────────────────────────────────────────────────
const FOOTER_TRUST_ICONS = [Truck, ShieldCheck, CreditCard, Phone];

export function FooterPreview({ c }: { c: FooterContent }) {
  return (
    <footer className="bg-surface-alt border-t border-line">
      {/* Trust strip */}
      <div className="border-b border-line bg-white px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {c.trustItems.map(({ label }, i) => {
          const Icon = FOOTER_TRUST_ICONS[i] ?? Truck;
          return (
            <PreviewEl key={i} fieldId={`trustItems.${i}.label`} section="footer" className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-3.5" />
              </span>
              <span className="text-xs text-ink-muted">{label}</span>
            </PreviewEl>
          );
        })}
      </div>
      {/* Main columns */}
      <div className="px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1">
          <span className="inline-flex items-center">
            <img src="/logo/logo text.png" alt="MYiCON" className="h-7 w-auto object-contain" />
          </span>
          <PreviewEl fieldId="tagline" section="footer" className="block mt-3 text-xs text-ink-muted leading-relaxed">{c.tagline}</PreviewEl>
          <div className="mt-3 space-y-1.5 text-xs text-ink-muted">
            <PreviewEl fieldId="phone" section="footer" className="flex items-center gap-1.5">
              <Phone className="size-3.5" /> {c.phone}
            </PreviewEl>
            <PreviewEl fieldId="email" section="footer" className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> {c.email}
            </PreviewEl>
          </div>
        </div>
        {/* Products column */}
        <div>
          <PreviewEl fieldId="colProductsLabel" section="footer" className="block text-xs font-semibold text-ink mb-2">{c.colProductsLabel}</PreviewEl>
          <ul className="space-y-1.5 text-xs text-ink-muted">
            <li>T-Shirts</li><li>Visitenkarten</li><li>Flyer</li>
          </ul>
        </div>
        {/* Account column */}
        <div>
          <PreviewEl fieldId="colAccountLabel" section="footer" className="block text-xs font-semibold text-ink mb-2">{c.colAccountLabel}</PreviewEl>
          <ul className="space-y-1.5 text-xs text-ink-muted">
            <li>Login</li><li>Registrieren</li><li>Bestellungen</li>
          </ul>
        </div>
        {/* Service column */}
        <div>
          <PreviewEl fieldId="colServiceLabel" section="footer" className="block text-xs font-semibold text-ink mb-2">{c.colServiceLabel}</PreviewEl>
          <ul className="space-y-1.5 text-xs text-ink-muted">
            <li>FAQ</li><li>Kontakt</li><li>Über uns</li>
          </ul>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-line px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-muted">
        <PreviewEl fieldId="copyrightText" section="footer" as="span">© {new Date().getFullYear()} MYICON. {c.copyrightText}</PreviewEl>
        <span className="flex items-center gap-3">
          <span>Bezahlung: PayPal</span>
          <span className="hover:text-ink">Impressum</span>
        </span>
      </div>
    </footer>
  );
}

// ─── Cart Preview ─────────────────────────────────────────────────────────────
export function CartPreview({ c }: { c: CartContent }) {
  return (
    <div className="container py-8 lg:py-10">
      <PreviewEl fieldId="pageTitle" section="cart">
        <h1 className="text-2xl font-bold font-display text-ink mb-6">{c.pageTitle}</h1>
      </PreviewEl>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Sample cart item */}
        <div className="space-y-3">
          <div className="card p-4 flex gap-3 opacity-60">
            <div className="size-20 rounded-lg bg-surface-alt flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-40 bg-line rounded mb-2" />
              <div className="h-3 w-24 bg-line rounded" />
            </div>
          </div>
          {/* Empty state */}
          <div className="text-center py-8 border border-dashed border-line rounded-xl">
            <ShoppingBag className="size-8 mx-auto text-ink-muted mb-3" />
            <PreviewEl fieldId="emptyTitle" section="cart">
              <p className="font-semibold text-ink text-sm">{c.emptyTitle}</p>
            </PreviewEl>
            <PreviewEl fieldId="emptySubtitle" section="cart">
              <p className="text-xs text-ink-muted mt-1">{c.emptySubtitle}</p>
            </PreviewEl>
            <PreviewEl fieldId="emptyCtaText" section="cart" className="inline-block mt-3">
              <span className="px-4 py-2 rounded-lg bg-brand text-white text-sm">{c.emptyCtaText}</span>
            </PreviewEl>
          </div>
        </div>
        {/* Summary sidebar */}
        <aside className="card p-5 h-fit">
          <PreviewEl fieldId="summaryTitle" section="cart">
            <h2 className="font-semibold text-ink mb-4 text-sm">{c.summaryTitle}</h2>
          </PreviewEl>
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between">
              <PreviewEl fieldId="labelSubtotal" section="cart" as="dt" className="text-ink-muted">{c.labelSubtotal}</PreviewEl>
              <dd>—</dd>
            </div>
            <div className="flex justify-between">
              <PreviewEl fieldId="labelVat" section="cart" as="dt" className="text-ink-muted">{c.labelVat}</PreviewEl>
              <dd>—</dd>
            </div>
            <div className="flex justify-between">
              <PreviewEl fieldId="labelShipping" section="cart" as="dt" className="text-ink-muted">{c.labelShipping}</PreviewEl>
              <PreviewEl fieldId="labelShippingFree" section="cart" as="dd" className="text-green-600 font-medium">{c.labelShippingFree}</PreviewEl>
            </div>
          </dl>
          <div className="border-t border-line my-3" />
          <div className="flex justify-between text-sm font-semibold">
            <PreviewEl fieldId="labelTotal" section="cart" as="span">{c.labelTotal}</PreviewEl>
            <span>—</span>
          </div>
          <PreviewEl fieldId="checkoutBtnText" section="cart" className="block mt-4">
            <span className="block w-full text-center px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium">{c.checkoutBtnText}</span>
          </PreviewEl>
          <PreviewEl fieldId="continueBtnText" section="cart" className="block text-center text-xs text-ink-muted mt-2">{c.continueBtnText}</PreviewEl>
        </aside>
      </div>
    </div>
  );
}

// ─── Wishlist Preview ─────────────────────────────────────────────────────────
export function WishlistPreview({ c }: { c: WishlistContent }) {
  return (
    <div className="container py-8 lg:py-10">
      <PreviewEl fieldId="pageTitle" section="wishlist">
        <h1 className="text-2xl font-bold font-display text-ink mb-6">{c.pageTitle}</h1>
      </PreviewEl>
      {/* Empty state */}
      <div className="text-center py-12 border border-dashed border-line rounded-xl">
        <Heart className="size-8 mx-auto text-ink-muted mb-3" />
        <PreviewEl fieldId="emptyText" section="wishlist">
          <p className="text-sm text-ink-muted">{c.emptyText}</p>
        </PreviewEl>
        <PreviewEl fieldId="emptyCtaText" section="wishlist" className="inline-block mt-4">
          <span className="px-4 py-2 rounded-lg bg-brand text-white text-sm">{c.emptyCtaText}</span>
        </PreviewEl>
      </div>
    </div>
  );
}

// ─── Login Preview ────────────────────────────────────────────────────────────
export function LoginPreview({ c }: { c: LoginContent }) {
  return (
    <div className="container py-12 max-w-md">
      <div className="card p-8">
        <PreviewEl fieldId="pageTitle" section="login">
          <h1 className="h-section">{c.pageTitle}</h1>
        </PreviewEl>
        <PreviewEl fieldId="subtitle" section="login">
          <p className="mt-1 text-sm text-ink-muted">{c.subtitle}</p>
        </PreviewEl>
        <div className="mt-6 space-y-4">
          <PreviewEl fieldId="labelEmail" section="login" className="block">
            <label className="label">{c.labelEmail}</label>
            <div className="input mt-1 bg-surface-alt text-ink-muted text-sm pointer-events-none">name@example.com</div>
          </PreviewEl>
          <PreviewEl fieldId="labelPassword" section="login" className="block">
            <label className="label">{c.labelPassword}</label>
            <div className="input mt-1 bg-surface-alt text-ink-muted text-sm pointer-events-none">••••••</div>
          </PreviewEl>
        </div>
        <PreviewEl fieldId="submitBtn" section="login" className="block mt-4">
          <button className="w-full px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium">{c.submitBtn}</button>
        </PreviewEl>
        <div className="mt-6 text-sm text-center text-ink-muted">
          <PreviewEl fieldId="noAccountText" section="login" as="span">{c.noAccountText}</PreviewEl>{" "}
          <PreviewEl fieldId="registerLink" section="login" as="span" className="text-brand font-medium">{c.registerLink}</PreviewEl>
        </div>
      </div>
    </div>
  );
}

// ─── Register Preview ─────────────────────────────────────────────────────────
export function RegisterPreview({ c }: { c: RegisterContent }) {
  const fields: [string, string, string][] = [
    ["labelName", c.labelName, "Max Mustermann"],
    ["labelEmail", c.labelEmail, "name@example.com"],
    ["labelPassword", c.labelPassword, "••••••"],
    ["labelConfirm", c.labelConfirm, "••••••"],
  ];
  return (
    <div className="container py-12 max-w-md">
      <div className="card p-8">
        <PreviewEl fieldId="pageTitle" section="register">
          <h1 className="h-section">{c.pageTitle}</h1>
        </PreviewEl>
        <PreviewEl fieldId="subtitle" section="register">
          <p className="mt-1 text-sm text-ink-muted">{c.subtitle}</p>
        </PreviewEl>
        <div className="mt-6 space-y-3">
          {fields.map(([id, label, placeholder]) => (
            <PreviewEl key={id} fieldId={id} section="register" className="block">
              <label className="label">{label}</label>
              <div className="input mt-1 bg-surface-alt text-ink-muted text-sm pointer-events-none">{placeholder}</div>
            </PreviewEl>
          ))}
        </div>
        <PreviewEl fieldId="submitBtn" section="register" className="block mt-4">
          <button className="w-full px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium">{c.submitBtn}</button>
        </PreviewEl>
        <div className="mt-6 text-sm text-center text-ink-muted">
          <PreviewEl fieldId="alreadyText" section="register" as="span">{c.alreadyText}</PreviewEl>{" "}
          <PreviewEl fieldId="loginLink" section="register" as="span" className="text-brand font-medium">{c.loginLink}</PreviewEl>
        </div>
      </div>
    </div>
  );
}

// ─── Account Preview (dashboard view) ────────────────────────────────────────
export function AccountPreview({ c }: { c: AccountContent }) {
  const statItems = [
    { id: "dashStatOrders", label: c.dashStatOrders, icon: Package },
    { id: "dashStatDesigns", label: c.dashStatDesigns, icon: FileEdit },
    { id: "dashStatWishlist", label: c.dashStatWishlist, icon: Heart },
    { id: "dashStatAddresses", label: c.dashStatAddresses, icon: MapPin },
  ];
  const navItems = [
    { id: "navOverview", label: c.navOverview, icon: LayoutDashboard },
    { id: "navOrders", label: c.navOrders, icon: Package },
    { id: "navDesigns", label: c.navDesigns, icon: FileEdit },
    { id: "navWishlist", label: c.navWishlist, icon: Heart },
    { id: "navProfile", label: c.navProfile, icon: User },
  ];
  return (
    <div className="container py-10 grid lg:grid-cols-[200px_1fr] gap-6">
      <aside className="card p-3 h-fit">
        <div className="px-3 py-2 border-b border-line mb-2">
          <PreviewEl fieldId="loggedInAs" section="account" className="block">
            <div className="text-xs text-ink-muted">{c.loggedInAs}</div>
          </PreviewEl>
          <div className="font-medium text-sm truncate">Max Mustermann</div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <PreviewEl key={id} fieldId={id} section="account" className="block">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-ink-muted">
                <Icon className="size-4" /> {label}
              </div>
            </PreviewEl>
          ))}
          <PreviewEl fieldId="navLogout" section="account" className="block">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-ink-muted mt-1 border-t border-line pt-2">
              <LogOut className="size-4" /> {c.navLogout}
            </div>
          </PreviewEl>
        </nav>
      </aside>
      <div>
        <PreviewEl fieldId="dashWelcome" section="account">
          <h1 className="text-2xl font-bold font-display">{c.dashWelcome}, Max!</h1>
        </PreviewEl>
        <PreviewEl fieldId="dashSubtitle" section="account">
          <p className="mt-2 text-sm text-ink-muted">{c.dashSubtitle}</p>
        </PreviewEl>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          {statItems.map(({ id, label, icon: Icon }) => (
            <PreviewEl key={id} fieldId={id} section="account" className="card p-4 block">
              <Icon className="size-4 text-brand" />
              <div className="mt-2 text-xl font-semibold">0</div>
              <div className="text-xs text-ink-muted">{label}</div>
            </PreviewEl>
          ))}
        </div>
        <section className="mt-6 card p-4">
          <PreviewEl fieldId="dashLastActivity" section="account">
            <h2 className="font-semibold text-sm">{c.dashLastActivity}</h2>
          </PreviewEl>
          <PreviewEl fieldId="dashNoOrders" section="account">
            <p className="mt-2 text-sm text-ink-muted">
              {c.dashNoOrders}{" "}
              <span className="text-brand">{c.dashNoOrdersLink}</span>
            </p>
          </PreviewEl>
        </section>
      </div>
    </div>
  );
}
