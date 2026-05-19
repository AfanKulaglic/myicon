import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { updateSiteContent, getSiteContentLocale } from "@/lib/firestore";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { useT } from "@/hooks/useT";
import { type TranslationKey } from "@/i18n/translations";
import { type Locale } from "@/store/language";
import { PreviewProvider } from "@/components/admin/PreviewContext";
import {
  HeroPreview, HowItWorksPreview, CTAPreview, AboutPreview,
  FAQPreview, ContactPreview, TrustStripPreview,
  HomeCategoriesPreview, HomeBestsellersPreview,
  LegalPreview, ImprintPreview,
  NavbarPreview, FooterPreview,
  CartPreview, WishlistPreview,
  LoginPreview, RegisterPreview, AccountPreview,
} from "@/components/admin/PreviewComponents";
import { Plus, Trash2, Monitor, Home, Info, HelpCircle, Phone, FileText, Shield, Building, PanelTop, PanelBottom, ShoppingBag, Heart, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import {
  DEFAULT_HERO, DEFAULT_HERO_EN,
  DEFAULT_HOW_IT_WORKS, DEFAULT_HOW_IT_WORKS_EN,
  DEFAULT_CTA, DEFAULT_CTA_EN,
  DEFAULT_ABOUT, DEFAULT_ABOUT_EN,
  DEFAULT_FAQ, DEFAULT_FAQ_EN,
  DEFAULT_CONTACT, DEFAULT_CONTACT_EN,
  DEFAULT_TRUST_STRIP, DEFAULT_TRUST_STRIP_EN,
  DEFAULT_HOME_CATEGORIES, DEFAULT_HOME_CATEGORIES_EN,
  DEFAULT_HOME_BESTSELLERS, DEFAULT_HOME_BESTSELLERS_EN,
  DEFAULT_TERMS, DEFAULT_TERMS_EN,
  DEFAULT_PRIVACY, DEFAULT_PRIVACY_EN,
  DEFAULT_IMPRINT, DEFAULT_IMPRINT_EN,
  DEFAULT_NAVBAR, DEFAULT_NAVBAR_EN,
  DEFAULT_FOOTER, DEFAULT_FOOTER_EN,
  DEFAULT_CART, DEFAULT_CART_EN,
  DEFAULT_WISHLIST, DEFAULT_WISHLIST_EN,
  DEFAULT_LOGIN, DEFAULT_LOGIN_EN,
  DEFAULT_REGISTER, DEFAULT_REGISTER_EN,
  DEFAULT_ACCOUNT, DEFAULT_ACCOUNT_EN,
  type HeroContent, type HowItWorksContent, type CTAContent,
  type AboutContent, type FAQContent, type ContactContent,
  type TrustStripContent, type HomeCategoriesContent, type HomeBestsellersContent,
  type LegalPageContent, type ImprintContent,
  type NavbarContent, type FooterContent,
  type CartContent, type WishlistContent,
  type LoginContent, type RegisterContent, type AccountContent,
} from "@/types/content";

// ─── Types ────────────────────────────────────────────────────────────────────
type PageKey = "home" | "about" | "faq" | "contact" | "terms" | "privacy" | "imprint" | "navbar" | "footer" | "cart" | "wishlist" | "login" | "register" | "account";
type SectionKey =
  | "hero" | "how_it_works" | "cta" | "home_sections"
  | "about" | "faq" | "contact" | "terms" | "privacy" | "imprint"
  | "navbar" | "footer" | "cart" | "wishlist"
  | "login" | "register" | "account";

interface LiveDataMap {
  home_hero: HeroContent;
  home_how_it_works: HowItWorksContent;
  home_cta: CTAContent;
  home_trust_strip: TrustStripContent;
  home_categories: HomeCategoriesContent;
  home_bestsellers: HomeBestsellersContent;
  about: AboutContent;
  faq: FAQContent;
  contact: ContactContent;
  legal_terms: LegalPageContent;
  legal_privacy: LegalPageContent;
  legal_imprint: ImprintContent;
  site_navbar: NavbarContent;
  site_footer: FooterContent;
  page_cart: CartContent;
  page_wishlist: WishlistContent;
  page_login: LoginContent;
  page_register: RegisterContent;
  page_account: AccountContent;
}

// ─── Page / section configuration ─────────────────────────────────────────────
const PAGE_CONFIG: Record<PageKey, { labelKey: TranslationKey; icon: React.ElementType; sections: SectionKey[] }> = {
  home:    { labelKey: "admin.tab.home",    icon: Home,        sections: ["hero", "how_it_works", "cta", "home_sections"] },
  about:   { labelKey: "admin.tab.about",   icon: Info,        sections: ["about"] },
  faq:     { labelKey: "admin.tab.faq",     icon: HelpCircle,  sections: ["faq"] },
  contact: { labelKey: "admin.tab.contact", icon: Phone,       sections: ["contact"] },
  terms:   { labelKey: "admin.tab.terms",   icon: FileText,    sections: ["terms"] },
  privacy: { labelKey: "admin.tab.privacy", icon: Shield,      sections: ["privacy"] },
  imprint: { labelKey: "admin.tab.imprint", icon: Building,    sections: ["imprint"] },
  navbar:   { labelKey: "admin.tab.navbar",   icon: PanelTop,    sections: ["navbar"] },
  footer:   { labelKey: "admin.tab.footer",   icon: PanelBottom, sections: ["footer"] },
  cart:     { labelKey: "admin.tab.cart",     icon: ShoppingBag, sections: ["cart"] },
  wishlist: { labelKey: "admin.tab.wishlist", icon: Heart,       sections: ["wishlist"] },
  login:    { labelKey: "admin.tab.login",    icon: LogIn,       sections: ["login"] },
  register: { labelKey: "admin.tab.register", icon: UserPlus,    sections: ["register"] },
  account:  { labelKey: "admin.tab.account",  icon: LayoutDashboard, sections: ["account"] },
};

const SECTION_TO_PAGE: Record<SectionKey, PageKey> = {
  hero: "home", how_it_works: "home", cta: "home", home_sections: "home",
  about: "about", faq: "faq", contact: "contact",
  terms: "terms", privacy: "privacy", imprint: "imprint",
  navbar: "navbar", footer: "footer",
  cart: "cart", wishlist: "wishlist",
  login: "login", register: "register", account: "account",
};

const SECTION_LABEL_KEYS: Record<SectionKey, TranslationKey> = {
  hero: "admin.tab.hero",
  how_it_works: "admin.tab.howItWorks",
  cta: "admin.tab.cta",
  home_sections: "admin.tab.homeSections",
  about: "admin.tab.about",
  faq: "admin.tab.faq",
  contact: "admin.tab.contact",
  terms: "admin.tab.terms",
  privacy: "admin.tab.privacy",
  imprint: "admin.tab.imprint",
  navbar: "admin.tab.navbar",
  footer: "admin.tab.footer",
  cart: "admin.tab.cart",
  wishlist: "admin.tab.wishlist",
  login: "admin.tab.login",
  register: "admin.tab.register",
  account: "admin.tab.account",
};

const PAGES = Object.keys(PAGE_CONFIG) as PageKey[];

function makeDefaults(locale: Locale): LiveDataMap {
  const de = locale === "de";
  return {
    home_hero:        de ? DEFAULT_HERO           : DEFAULT_HERO_EN,
    home_how_it_works: de ? DEFAULT_HOW_IT_WORKS  : DEFAULT_HOW_IT_WORKS_EN,
    home_cta:         de ? DEFAULT_CTA            : DEFAULT_CTA_EN,
    home_trust_strip: de ? DEFAULT_TRUST_STRIP    : DEFAULT_TRUST_STRIP_EN,
    home_categories:  de ? DEFAULT_HOME_CATEGORIES: DEFAULT_HOME_CATEGORIES_EN,
    home_bestsellers: de ? DEFAULT_HOME_BESTSELLERS: DEFAULT_HOME_BESTSELLERS_EN,
    about:            de ? DEFAULT_ABOUT          : DEFAULT_ABOUT_EN,
    faq:              de ? DEFAULT_FAQ            : DEFAULT_FAQ_EN,
    contact:          de ? DEFAULT_CONTACT        : DEFAULT_CONTACT_EN,
    legal_terms:      de ? DEFAULT_TERMS          : DEFAULT_TERMS_EN,
    legal_privacy:    de ? DEFAULT_PRIVACY        : DEFAULT_PRIVACY_EN,
    legal_imprint:    de ? DEFAULT_IMPRINT        : DEFAULT_IMPRINT_EN,
    site_navbar:      de ? DEFAULT_NAVBAR         : DEFAULT_NAVBAR_EN,
    site_footer:      de ? DEFAULT_FOOTER         : DEFAULT_FOOTER_EN,
    page_cart:        de ? DEFAULT_CART           : DEFAULT_CART_EN,
    page_wishlist:    de ? DEFAULT_WISHLIST       : DEFAULT_WISHLIST_EN,
    page_login:       de ? DEFAULT_LOGIN          : DEFAULT_LOGIN_EN,
    page_register:    de ? DEFAULT_REGISTER       : DEFAULT_REGISTER_EN,
    page_account:     de ? DEFAULT_ACCOUNT        : DEFAULT_ACCOUNT_EN,
  };
}

// ─── Hook: load a single section's content for a locale ──────────────────────
function useLocaleContent<T extends object>(sectionId: string, locale: Locale, defaults: T): T {
  const [content, setContent] = useState<T>(defaults);
  useEffect(() => {
    getSiteContentLocale<T>(sectionId, locale).then((data) => {
      setContent(data ? { ...defaults, ...data } : defaults);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, locale]);
  return content;
}

// ─── Locale tab button ────────────────────────────────────────────────────────
// (Removed: language switching feature — site is German-only.)

// ─── Full-page preview ────────────────────────────────────────────────────────
function PageFullPreview({ page, data }: { page: PageKey; data: LiveDataMap }) {
  const pageContent = (() => {
    switch (page) {
      case "home":
        return (
          <>
            <HeroPreview c={data.home_hero} />
            <TrustStripPreview c={data.home_trust_strip} />
            <HomeCategoriesPreview c={data.home_categories} />
            <HomeBestsellersPreview c={data.home_bestsellers} />
            <HowItWorksPreview c={data.home_how_it_works} />
            <CTAPreview c={data.home_cta} />
          </>
        );
      case "about":   return <AboutPreview c={data.about} />;
      case "faq":     return <FAQPreview c={data.faq} />;
      case "contact": return <ContactPreview c={data.contact} />;
      case "terms":   return <LegalPreview c={data.legal_terms} section="terms" />;
      case "privacy": return <LegalPreview c={data.legal_privacy} section="privacy" />;
      case "imprint": return <ImprintPreview c={data.legal_imprint} />;
      case "navbar":  return null;
      case "footer":  return null;
      case "cart":    return <CartPreview c={data.page_cart} />;
      case "wishlist": return <WishlistPreview c={data.page_wishlist} />;
      case "login":    return <LoginPreview c={data.page_login} />;
      case "register": return <RegisterPreview c={data.page_register} />;
      case "account":  return <AccountPreview c={data.page_account} />;
    }
  })();

  return (
    <>
      <NavbarPreview c={data.site_navbar} />
      {pageContent}
      <FooterPreview c={data.site_footer} />
    </>
  );
}

// ─── Editor components (form only, no split layout) ──────────────────────────

function HeroEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: HeroContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_HERO : DEFAULT_HERO_EN;
  const content = useLocaleContent<HeroContent>("home_hero", locale, defaults);
  const { register, handleSubmit, setValue, control, watch, reset, formState: { isSubmitting } } =
    useForm<HeroContent>({ values: content });
  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });

  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => {
    const { unsubscribe } = watch((d) => { cbRef.current(d as HeroContent); });
    return unsubscribe;
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("home_hero", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="badge"><label className="label">{t("admin.field.badge")}</label><input className="input" {...register("badge")} /></div>
        <div data-field-id="titleHighlight"><label className="label">{t("admin.field.titleHighlight")}</label><input className="input" {...register("titleHighlight")} /></div>
      </div>
      <div data-field-id="title"><label className="label">{t("admin.field.titleNewline")}</label><textarea rows={2} className="input resize-none" {...register("title")} /></div>
      <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><textarea rows={3} className="input resize-none" {...register("subtitle")} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="ctaPrimaryText"><label className="label">{t("admin.field.ctaPrimaryText")}</label><input className="input" {...register("ctaPrimaryText")} /></div>
        <div data-field-id="ctaPrimaryUrl"><label className="label">{t("admin.field.ctaPrimaryUrl")}</label><input className="input" {...register("ctaPrimaryUrl")} /></div>
        <div data-field-id="ctaSecondaryText"><label className="label">{t("admin.field.ctaSecondaryText")}</label><input className="input" {...register("ctaSecondaryText")} /></div>
        <div data-field-id="ctaSecondaryUrl"><label className="label">{t("admin.field.ctaSecondaryUrl")}</label><input className="input" {...register("ctaSecondaryUrl")} /></div>
      </div>
      <div data-field-id="imageUrl">
        <ImageUploader value={watch("imageUrl") ?? ""} onChange={(url) => setValue("imageUrl", url)} folder="hero" label={t("admin.field.heroImage")} />
      </div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.stats")}
          <button type="button" onClick={() => appendStat({ value: "", label: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <div className="space-y-2 mt-1">
          {statFields.map((f, i) => (
            <div key={f.id} className="flex gap-2 items-center" data-field-id={`stats.${i}.value`}>
              <input className="input w-24 shrink-0" placeholder={t("admin.field.value")} {...register(`stats.${i}.value`)} />
              <input className="input flex-1" placeholder={t("admin.field.label")} {...register(`stats.${i}.label`)} />
              <button type="button" onClick={() => removeStat(i)} className="text-ink-muted hover:text-red-500"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.promoCard")}</p>
        <div data-field-id="promoCard.tag"><label className="label">{t("admin.field.promoCardTag")}</label><input className="input" {...register("promoCard.tag")} /></div>
        <div data-field-id="promoCard.title"><label className="label">{t("admin.field.promoCardTitle")}</label><input className="input" {...register("promoCard.title")} /></div>
        <div data-field-id="promoCard.text"><label className="label">{t("admin.field.promoCardText")}</label><textarea rows={2} className="input resize-none" {...register("promoCard.text")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function HowItWorksEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: HowItWorksContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_HOW_IT_WORKS : DEFAULT_HOW_IT_WORKS_EN;
  const content = useLocaleContent<HowItWorksContent>("home_how_it_works", locale, defaults);
  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } =
    useForm<HowItWorksContent>({ values: content });
  const { fields, append, remove } = useFieldArray({ control, name: "steps" });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as HowItWorksContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("home_how_it_works", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="sectionTitle"><label className="label">{t("admin.field.sectionTitle")}</label><input className="input" {...register("sectionTitle")} /></div>
      <div data-field-id="sectionSubtitle"><label className="label">{t("admin.field.sectionSubtitle")}</label><input className="input" {...register("sectionSubtitle")} /></div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.steps")}
          <button type="button" onClick={() => append({ icon: "MousePointerClick", title: "", text: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <div className="space-y-3 mt-1">
          {fields.map((f, i) => (
            <div key={f.id} className="card p-4 space-y-2" data-field-id={`steps.${i}.title`}>
              <div className="grid sm:grid-cols-2 gap-3">
                <div data-field-id={`steps.${i}.icon`}><label className="label">{t("admin.field.iconName")}</label><input className="input" {...register(`steps.${i}.icon`)} /></div>
                <div><label className="label">{t("admin.field.title")}</label><input className="input" {...register(`steps.${i}.title`)} /></div>
              </div>
              <div data-field-id={`steps.${i}.text`}><label className="label">{t("admin.field.text")}</label><textarea rows={2} className="input resize-none" {...register(`steps.${i}.text`)} /></div>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1"><Trash2 className="size-3" />{t("admin.action.remove")}</button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function CTAEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: CTAContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_CTA : DEFAULT_CTA_EN;
  const content = useLocaleContent<CTAContent>("home_cta", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<CTAContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as CTAContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("home_cta", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="title"><label className="label">{t("admin.field.title")}</label><input className="input" {...register("title")} /></div>
      <div data-field-id="description"><label className="label">{t("admin.field.description")}</label><textarea rows={3} className="input resize-none" {...register("description")} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="primaryText"><label className="label">{t("admin.field.btn1Text")}</label><input className="input" {...register("primaryText")} /></div>
        <div data-field-id="primaryUrl"><label className="label">{t("admin.field.btn1Url")}</label><input className="input" {...register("primaryUrl")} /></div>
        <div data-field-id="secondaryText"><label className="label">{t("admin.field.btn2Text")}</label><input className="input" {...register("secondaryText")} /></div>
        <div data-field-id="secondaryUrl"><label className="label">{t("admin.field.btn2Url")}</label><input className="input" {...register("secondaryUrl")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function HomeSectionsEditor({
  locale,
  onTrustChange, onCatChange, onBestChange,
}: {
  locale: Locale;
  onTrustChange: (d: TrustStripContent) => void;
  onCatChange: (d: HomeCategoriesContent) => void;
  onBestChange: (d: HomeBestsellersContent) => void;
}) {
  const t = useT();
  const trustDef  = locale === "de" ? DEFAULT_TRUST_STRIP     : DEFAULT_TRUST_STRIP_EN;
  const catDef    = locale === "de" ? DEFAULT_HOME_CATEGORIES  : DEFAULT_HOME_CATEGORIES_EN;
  const bestDef   = locale === "de" ? DEFAULT_HOME_BESTSELLERS : DEFAULT_HOME_BESTSELLERS_EN;
  const trustContent = useLocaleContent<TrustStripContent>("home_trust_strip", locale, trustDef);
  const catContent   = useLocaleContent<HomeCategoriesContent>("home_categories", locale, catDef);
  const bestContent  = useLocaleContent<HomeBestsellersContent>("home_bestsellers", locale, bestDef);

  const trustForm = useForm<TrustStripContent>({ values: trustContent });
  const catForm   = useForm<HomeCategoriesContent>({ values: catContent });
  const bestForm  = useForm<HomeBestsellersContent>({ values: bestContent });
  const { fields: trustFields, append: appendTrust, remove: removeTrust } = useFieldArray({ control: trustForm.control, name: "items" });

  const tcRef = useRef(onTrustChange); useEffect(() => { tcRef.current = onTrustChange; });
  const ccRef = useRef(onCatChange);   useEffect(() => { ccRef.current = onCatChange; });
  const bcRef = useRef(onBestChange);  useEffect(() => { bcRef.current = onBestChange; });

  useEffect(() => { trustForm.reset(trustContent); tcRef.current(trustContent); }, [trustContent]); // eslint-disable-line
  useEffect(() => { catForm.reset(catContent);     ccRef.current(catContent); },   [catContent]);   // eslint-disable-line
  useEffect(() => { bestForm.reset(bestContent);   bcRef.current(bestContent); },  [bestContent]);  // eslint-disable-line
  useEffect(() => { const { unsubscribe } = trustForm.watch((d) => { tcRef.current(d as TrustStripContent); }); return unsubscribe; }, [trustForm.watch]); // eslint-disable-line
  useEffect(() => { const { unsubscribe } = catForm.watch((d)   => { ccRef.current(d as HomeCategoriesContent); }); return unsubscribe; }, [catForm.watch]);   // eslint-disable-line
  useEffect(() => { const { unsubscribe } = bestForm.watch((d)  => { bcRef.current(d as HomeBestsellersContent); }); return unsubscribe; }, [bestForm.watch]);  // eslint-disable-line

  return (
    <div className="space-y-8">
      {/* Trust Strip */}
      <div>
        <h2 className="text-base font-semibold mb-1">Trust-Strip</h2>
        <p className="text-xs text-ink-muted mb-3">Icons: Zap, Truck, ShieldCheck, CreditCard, Save, Star, Package, Phone, Award, Tag, Clock, Globe</p>
        <form onSubmit={trustForm.handleSubmit(async (v) => { await updateSiteContent("home_trust_strip", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-3 card p-4">
          <div className="space-y-2">
            {trustFields.map((f, i) => (
              <div key={f.id} className="flex gap-2 items-center" data-field-id={`items.${i}.label`}>
                <input className="input w-32 shrink-0" placeholder={t("admin.field.icon")} {...trustForm.register(`items.${i}.icon`)} />
                <input className="input flex-1" placeholder={t("admin.field.label")} {...trustForm.register(`items.${i}.label`)} />
                <button type="button" onClick={() => removeTrust(i)} className="text-ink-muted hover:text-red-500"><Trash2 className="size-4" /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => appendTrust({ icon: "Zap", label: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
          <Button type="submit" loading={trustForm.formState.isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t("admin.field.categoriesSection")}</h2>
        <form onSubmit={catForm.handleSubmit(async (v) => { await updateSiteContent("home_categories", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-3 card p-4">
          <div data-field-id="title"><label className="label">{t("admin.field.title")}</label><input className="input" {...catForm.register("title")} /></div>
          <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><input className="input" {...catForm.register("subtitle")} /></div>
          <div data-field-id="linkText"><label className="label">{t("admin.field.linkText")}</label><input className="input" {...catForm.register("linkText")} /></div>
          <Button type="submit" loading={catForm.formState.isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
        </form>
      </div>

      {/* Bestsellers */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t("admin.field.bestsellersSection")}</h2>
        <form onSubmit={bestForm.handleSubmit(async (v) => { await updateSiteContent("home_bestsellers", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-3 card p-4">
          <div data-field-id="title"><label className="label">{t("admin.field.title")}</label><input className="input" {...bestForm.register("title")} /></div>
          <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><input className="input" {...bestForm.register("subtitle")} /></div>
          <Button type="submit" loading={bestForm.formState.isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
        </form>
      </div>
    </div>
  );
}

function AboutEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: AboutContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_ABOUT : DEFAULT_ABOUT_EN;
  const content = useLocaleContent<AboutContent>("about", locale, defaults);
  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } =
    useForm<AboutContent>({ values: content });
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });
  const { fields: paraFields, append: appendPara, remove: removePara } = useFieldArray({ control, name: "storyParagraphs" as never });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as AboutContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("about", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="heroTitle"><label className="label">{t("admin.field.heroTitle")}</label><input className="input" {...register("heroTitle")} /></div>
      <div data-field-id="heroSubtitle"><label className="label">{t("admin.field.heroSubtitle")}</label><textarea rows={3} className="input resize-none" {...register("heroSubtitle")} /></div>
      <div data-field-id="storyTitle"><label className="label">{t("admin.field.storyTitle")}</label><input className="input" {...register("storyTitle")} /></div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.storyParagraphs")}
          <button type="button" onClick={() => appendPara("" as never)} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <div className="space-y-2 mt-1">
          {paraFields.map((f, i) => (
            <div key={f.id} className="flex gap-2" data-field-id={`storyParagraphs.${i}`}>
              <textarea rows={2} className="input flex-1 resize-none" {...register(`storyParagraphs.${i}` as never)} />
              <button type="button" onClick={() => removePara(i)} className="text-ink-muted hover:text-red-500"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.features")}
          <button type="button" onClick={() => appendFeature({ icon: "Award", label: "", text: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <div className="space-y-3 mt-1">
          {featureFields.map((f, i) => (
            <div key={f.id} className="card p-3 grid sm:grid-cols-3 gap-3" data-field-id={`features.${i}.label`}>
              <div><label className="label">{t("admin.field.icon")}</label><input className="input" {...register(`features.${i}.icon`)} /></div>
              <div><label className="label">{t("admin.field.label")}</label><input className="input" {...register(`features.${i}.label`)} /></div>
              <div><label className="label">{t("admin.field.text")}</label><input className="input" {...register(`features.${i}.text`)} /></div>
              <button type="button" onClick={() => removeFeature(i)} className="text-xs text-red-500 flex items-center gap-1"><Trash2 className="size-3" />{t("admin.action.remove")}</button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function FAQEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: FAQContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_FAQ : DEFAULT_FAQ_EN;
  const content = useLocaleContent<FAQContent>("faq", locale, defaults);
  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } =
    useForm<FAQContent>({ values: content });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as FAQContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("faq", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="title"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("title")} /></div>
        <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><input className="input" {...register("subtitle")} /></div>
      </div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.qa")}
          <button type="button" onClick={() => append({ q: "", a: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <div className="space-y-3 mt-1">
          {fields.map((f, i) => (
            <div key={f.id} className="card p-4 space-y-2" data-field-id={`items.${i}.q`}>
              <div><label className="label">{t("admin.field.question")}</label><input className="input" {...register(`items.${i}.q`)} /></div>
              <div data-field-id={`items.${i}.a`}><label className="label">{t("admin.field.answer")}</label><textarea rows={2} className="input resize-none" {...register(`items.${i}.a`)} /></div>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1"><Trash2 className="size-3" />{t("admin.action.remove")}</button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function ContactEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: ContactContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_CONTACT : DEFAULT_CONTACT_EN;
  const content = useLocaleContent<ContactContent>("contact", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<ContactContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as ContactContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("contact", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="title"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("title")} /></div>
        <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><input className="input" {...register("subtitle")} /></div>
        <div data-field-id="email"><label className="label">{t("admin.field.email")}</label><input type="email" className="input" {...register("email")} /></div>
        <div data-field-id="phone"><label className="label">{t("admin.field.phone")}</label><input className="input" {...register("phone")} /></div>
      </div>
      <div data-field-id="address"><label className="label">{t("admin.field.address")}</label><textarea rows={3} className="input resize-none" {...register("address")} /></div>
      <div data-field-id="hours"><label className="label">{t("admin.field.hours")}</label><input className="input" {...register("hours")} /></div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function LegalEditor({
  sectionId, locale, deDefaults, enDefaults, onDataChange,
}: {
  sectionId: string; locale: Locale;
  deDefaults: LegalPageContent; enDefaults: LegalPageContent;
  onDataChange: (d: LegalPageContent) => void;
}) {
  const t = useT();
  const defaults = locale === "de" ? deDefaults : enDefaults;
  const content = useLocaleContent<LegalPageContent>(sectionId, locale, defaults);
  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } =
    useForm<LegalPageContent>({ values: content });
  const { fields, append, remove } = useFieldArray({ control, name: "sections" });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as LegalPageContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent(sectionId, locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="title"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("title")} /></div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.sections")}
          <button type="button" onClick={() => append({ h: "", p: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <div className="space-y-3 mt-1">
          {fields.map((f, i) => (
            <div key={f.id} className="card p-4 space-y-2" data-field-id={`sections.${i}.h`}>
              <div><label className="label">{t("admin.field.heading")}</label><input className="input" {...register(`sections.${i}.h`)} /></div>
              <div data-field-id={`sections.${i}.p`}><label className="label">{t("admin.field.text")}</label><textarea rows={3} className="input resize-none" {...register(`sections.${i}.p`)} /></div>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1"><Trash2 className="size-3" />{t("admin.action.remove")}</button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function ImprintEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: ImprintContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_IMPRINT : DEFAULT_IMPRINT_EN;
  const content = useLocaleContent<ImprintContent>("legal_imprint", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<ImprintContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as ImprintContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("legal_imprint", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="title"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("title")} /></div>
      <div data-field-id="body"><label className="label">{t("admin.field.bodyText")}</label><textarea rows={12} className="input resize-y font-mono text-xs" {...register("body")} /></div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function NavbarEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: NavbarContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_NAVBAR : DEFAULT_NAVBAR_EN;
  const content = useLocaleContent<NavbarContent>("site_navbar", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<NavbarContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as NavbarContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("site_navbar", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <p className="text-xs text-ink-muted">{t("admin.field.navbarTopBarHint")}</p>
      <div data-field-id="utilShipping"><label className="label">{t("admin.field.utilShipping")}</label><input className="input" {...register("utilShipping")} /></div>
      <div data-field-id="utilSameday"><label className="label">{t("admin.field.utilSameday")}</label><input className="input" {...register("utilSameday")} /></div>
      <div data-field-id="utilGuarantee"><label className="label">{t("admin.field.utilGuarantee")}</label><input className="input" {...register("utilGuarantee")} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="helpText"><label className="label">{t("admin.field.helpText")}</label><input className="input" {...register("helpText")} /></div>
        <div data-field-id="contactText"><label className="label">{t("admin.field.contactText")}</label><input className="input" {...register("contactText")} /></div>
        <div data-field-id="searchPlaceholder"><label className="label">{t("admin.field.searchPlaceholder")}</label><input className="input" {...register("searchPlaceholder")} /></div>
        <div data-field-id="searchBtnText"><label className="label">{t("admin.field.searchBtnText")}</label><input className="input" {...register("searchBtnText")} /></div>
        <div data-field-id="accountText"><label className="label">{t("admin.field.accountText")}</label><input className="input" {...register("accountText")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function FooterEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: FooterContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_FOOTER : DEFAULT_FOOTER_EN;
  const content = useLocaleContent<FooterContent>("site_footer", locale, defaults);
  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } =
    useForm<FooterContent>({ values: content });
  const { fields: trustFields, append: appendTrust, remove: removeTrust } = useFieldArray({ control, name: "trustItems" });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as FooterContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("site_footer", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="tagline"><label className="label">{t("admin.field.tagline")}</label><textarea rows={3} className="input resize-none" {...register("tagline")} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div data-field-id="phone"><label className="label">{t("admin.field.phone")}</label><input className="input" {...register("phone")} /></div>
        <div data-field-id="phoneHref"><label className="label">{t("admin.field.phoneHref")}</label><input className="input" {...register("phoneHref")} /></div>
        <div data-field-id="email"><label className="label">{t("admin.field.email")}</label><input className="input" {...register("email")} /></div>
        <div data-field-id="emailHref"><label className="label">{t("admin.field.emailHref")}</label><input className="input" {...register("emailHref")} /></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div data-field-id="colProductsLabel"><label className="label">{t("admin.field.colProductsLabel")}</label><input className="input" {...register("colProductsLabel")} /></div>
        <div data-field-id="colAccountLabel"><label className="label">{t("admin.field.colAccountLabel")}</label><input className="input" {...register("colAccountLabel")} /></div>
        <div data-field-id="colServiceLabel"><label className="label">{t("admin.field.colServiceLabel")}</label><input className="input" {...register("colServiceLabel")} /></div>
      </div>
      <div data-field-id="copyrightText"><label className="label">{t("admin.field.copyrightText")}</label><input className="input" {...register("copyrightText")} /></div>
      <div>
        <label className="label flex items-center justify-between">
          {t("admin.field.trustItemsFooter")}
          <button type="button" onClick={() => appendTrust({ label: "" })} className="text-xs text-brand flex items-center gap-1"><Plus className="size-3" />{t("admin.action.add")}</button>
        </label>
        <p className="text-xs text-ink-muted mb-2">{t("admin.field.trustItemsFooterHint")}</p>
        <div className="space-y-2">
          {trustFields.map((f, i) => (
            <div key={f.id} className="flex gap-2 items-center" data-field-id={`trustItems.${i}.label`}>
              <input className="input flex-1" placeholder={t("admin.field.label")} {...register(`trustItems.${i}.label`)} />
              <button type="button" onClick={() => removeTrust(i)} className="text-ink-muted hover:text-red-500"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function CartEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: CartContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_CART : DEFAULT_CART_EN;
  const content = useLocaleContent<CartContent>("page_cart", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<CartContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as CartContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("page_cart", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="pageTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("pageTitle")} /></div>
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.emptyState")}</p>
        <div data-field-id="emptyTitle"><label className="label">{t("admin.field.emptyTitle")}</label><input className="input" {...register("emptyTitle")} /></div>
        <div data-field-id="emptySubtitle"><label className="label">{t("admin.field.emptySubtitle")}</label><input className="input" {...register("emptySubtitle")} /></div>
        <div data-field-id="emptyCtaText"><label className="label">{t("admin.field.emptyCtaText")}</label><input className="input" {...register("emptyCtaText")} /></div>
      </div>
      <div data-field-id="summaryTitle"><label className="label">{t("admin.field.summaryTitle")}</label><input className="input" {...register("summaryTitle")} /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div data-field-id="labelSubtotal"><label className="label">{t("admin.field.labelSubtotal")}</label><input className="input" {...register("labelSubtotal")} /></div>
        <div data-field-id="labelVat"><label className="label">{t("admin.field.labelVat")}</label><input className="input" {...register("labelVat")} /></div>
        <div data-field-id="labelShipping"><label className="label">{t("admin.field.labelShipping")}</label><input className="input" {...register("labelShipping")} /></div>
        <div data-field-id="labelShippingFree"><label className="label">{t("admin.field.labelShippingFree")}</label><input className="input" {...register("labelShippingFree")} /></div>
        <div data-field-id="labelTotal"><label className="label">{t("admin.field.labelTotal")}</label><input className="input" {...register("labelTotal")} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div data-field-id="checkoutBtnText"><label className="label">{t("admin.field.checkoutBtnText")}</label><input className="input" {...register("checkoutBtnText")} /></div>
        <div data-field-id="continueBtnText"><label className="label">{t("admin.field.continueBtnText")}</label><input className="input" {...register("continueBtnText")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function WishlistEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: WishlistContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_WISHLIST : DEFAULT_WISHLIST_EN;
  const content = useLocaleContent<WishlistContent>("page_wishlist", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<WishlistContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as WishlistContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("page_wishlist", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="pageTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("pageTitle")} /></div>
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.emptyState")}</p>
        <div data-field-id="emptyText"><label className="label">{t("admin.field.emptyText")}</label><input className="input" {...register("emptyText")} /></div>
        <div data-field-id="emptyCtaText"><label className="label">{t("admin.field.emptyCtaText")}</label><input className="input" {...register("emptyCtaText")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function LoginEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: LoginContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_LOGIN : DEFAULT_LOGIN_EN;
  const content = useLocaleContent<LoginContent>("page_login", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<LoginContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as LoginContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("page_login", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="pageTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("pageTitle")} /></div>
      <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><input className="input" {...register("subtitle")} /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div data-field-id="labelEmail"><label className="label">{t("admin.field.loginLabelEmail")}</label><input className="input" {...register("labelEmail")} /></div>
        <div data-field-id="labelPassword"><label className="label">{t("admin.field.loginLabelPassword")}</label><input className="input" {...register("labelPassword")} /></div>
      </div>
      <div data-field-id="submitBtn"><label className="label">{t("admin.field.loginSubmitBtn")}</label><input className="input" {...register("submitBtn")} /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div data-field-id="noAccountText"><label className="label">{t("admin.field.noAccountText")}</label><input className="input" {...register("noAccountText")} /></div>
        <div data-field-id="registerLink"><label className="label">{t("admin.field.registerLink")}</label><input className="input" {...register("registerLink")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function RegisterEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: RegisterContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_REGISTER : DEFAULT_REGISTER_EN;
  const content = useLocaleContent<RegisterContent>("page_register", locale, defaults);
  const { register: reg, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<RegisterContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as RegisterContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("page_register", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-4">
      <div data-field-id="pageTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...reg("pageTitle")} /></div>
      <div data-field-id="subtitle"><label className="label">{t("admin.field.subtitle")}</label><input className="input" {...reg("subtitle")} /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div data-field-id="labelName"><label className="label">{t("admin.field.registerLabelName")}</label><input className="input" {...reg("labelName")} /></div>
        <div data-field-id="labelEmail"><label className="label">{t("admin.field.loginLabelEmail")}</label><input className="input" {...reg("labelEmail")} /></div>
        <div data-field-id="labelPassword"><label className="label">{t("admin.field.loginLabelPassword")}</label><input className="input" {...reg("labelPassword")} /></div>
        <div data-field-id="labelConfirm"><label className="label">{t("admin.field.registerLabelConfirm")}</label><input className="input" {...reg("labelConfirm")} /></div>
      </div>
      <div data-field-id="submitBtn"><label className="label">{t("admin.field.loginSubmitBtn")}</label><input className="input" {...reg("submitBtn")} /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div data-field-id="alreadyText"><label className="label">{t("admin.field.alreadyText")}</label><input className="input" {...reg("alreadyText")} /></div>
        <div data-field-id="loginLink"><label className="label">{t("admin.field.loginLink")}</label><input className="input" {...reg("loginLink")} /></div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

function AccountEditor({ locale, onDataChange }: { locale: Locale; onDataChange: (d: AccountContent) => void }) {
  const t = useT();
  const defaults = locale === "de" ? DEFAULT_ACCOUNT : DEFAULT_ACCOUNT_EN;
  const content = useLocaleContent<AccountContent>("page_account", locale, defaults);
  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } =
    useForm<AccountContent>({ values: content });
  const cbRef = useRef(onDataChange);
  useEffect(() => { cbRef.current = onDataChange; });
  useEffect(() => { reset(content); cbRef.current(content); }, [content, reset]);
  useEffect(() => { const { unsubscribe } = watch((d) => { cbRef.current(d as AccountContent); }); return unsubscribe; }, [watch]);

  return (
    <form onSubmit={handleSubmit(async (v) => { await updateSiteContent("page_account", locale, v); toast({ title: t("admin.action.saved") }); })} className="space-y-6">
      {/* Sidebar nav */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.accountNavSection")}</p>
        <div data-field-id="loggedInAs"><label className="label">{t("admin.field.loggedInAs")}</label><input className="input" {...register("loggedInAs")} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div data-field-id="navOverview"><label className="label">{t("admin.field.navOverview")}</label><input className="input" {...register("navOverview")} /></div>
          <div data-field-id="navOrders"><label className="label">{t("admin.field.navOrders")}</label><input className="input" {...register("navOrders")} /></div>
          <div data-field-id="navDesigns"><label className="label">{t("admin.field.navDesigns")}</label><input className="input" {...register("navDesigns")} /></div>
          <div data-field-id="navWishlist"><label className="label">{t("admin.field.navWishlist")}</label><input className="input" {...register("navWishlist")} /></div>
          <div data-field-id="navProfile"><label className="label">{t("admin.field.navProfile")}</label><input className="input" {...register("navProfile")} /></div>
          <div data-field-id="navLogout"><label className="label">{t("admin.field.navLogout")}</label><input className="input" {...register("navLogout")} /></div>
        </div>
      </div>
      {/* Dashboard */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.accountDashSection")}</p>
        <div data-field-id="dashWelcome"><label className="label">{t("admin.field.dashWelcome")}</label><input className="input" {...register("dashWelcome")} /></div>
        <div data-field-id="dashSubtitle"><label className="label">{t("admin.field.dashSubtitle")}</label><input className="input" {...register("dashSubtitle")} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div data-field-id="dashStatOrders"><label className="label">{t("admin.field.dashStatOrders")}</label><input className="input" {...register("dashStatOrders")} /></div>
          <div data-field-id="dashStatDesigns"><label className="label">{t("admin.field.dashStatDesigns")}</label><input className="input" {...register("dashStatDesigns")} /></div>
          <div data-field-id="dashStatWishlist"><label className="label">{t("admin.field.dashStatWishlist")}</label><input className="input" {...register("dashStatWishlist")} /></div>
          <div data-field-id="dashStatAddresses"><label className="label">{t("admin.field.dashStatAddresses")}</label><input className="input" {...register("dashStatAddresses")} /></div>
          <div data-field-id="dashLastActivity"><label className="label">{t("admin.field.dashLastActivity")}</label><input className="input" {...register("dashLastActivity")} /></div>
          <div data-field-id="dashNoOrders"><label className="label">{t("admin.field.dashNoOrders")}</label><input className="input" {...register("dashNoOrders")} /></div>
          <div data-field-id="dashNoOrdersLink"><label className="label">{t("admin.field.dashNoOrdersLink")}</label><input className="input" {...register("dashNoOrdersLink")} /></div>
          <div data-field-id="dashOrderDetails"><label className="label">{t("admin.field.dashOrderDetails")}</label><input className="input" {...register("dashOrderDetails")} /></div>
        </div>
      </div>
      {/* Orders */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.accountOrdersSection")}</p>
        <div data-field-id="ordersTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("ordersTitle")} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div data-field-id="ordersEmpty"><label className="label">{t("admin.field.emptyText")}</label><input className="input" {...register("ordersEmpty")} /></div>
          <div data-field-id="ordersEmptyCta"><label className="label">{t("admin.field.emptyCtaText")}</label><input className="input" {...register("ordersEmptyCta")} /></div>
          <div data-field-id="ordersLabelNumber"><label className="label">{t("admin.field.ordersLabelNumber")}</label><input className="input" {...register("ordersLabelNumber")} /></div>
          <div data-field-id="ordersLabelDate"><label className="label">{t("admin.field.ordersLabelDate")}</label><input className="input" {...register("ordersLabelDate")} /></div>
          <div data-field-id="ordersLabelTotal"><label className="label">{t("admin.field.ordersLabelTotal")}</label><input className="input" {...register("ordersLabelTotal")} /></div>
        </div>
      </div>
      {/* Drafts */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.accountDraftsSection")}</p>
        <div data-field-id="draftsTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("draftsTitle")} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div data-field-id="draftsEmpty"><label className="label">{t("admin.field.emptyText")}</label><input className="input" {...register("draftsEmpty")} /></div>
          <div data-field-id="draftsEmptyCta"><label className="label">{t("admin.field.emptyCtaText")}</label><input className="input" {...register("draftsEmptyCta")} /></div>
          <div data-field-id="draftsEditBtn"><label className="label">{t("admin.field.draftsEditBtn")}</label><input className="input" {...register("draftsEditBtn")} /></div>
          <div data-field-id="draftsNoPreview"><label className="label">{t("admin.field.draftsNoPreview")}</label><input className="input" {...register("draftsNoPreview")} /></div>
        </div>
      </div>
      {/* Profile */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-medium text-ink-muted">{t("admin.field.accountProfileSection")}</p>
        <div data-field-id="profileTitle"><label className="label">{t("admin.field.pageTitle")}</label><input className="input" {...register("profileTitle")} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div data-field-id="profilePersonalSection"><label className="label">{t("admin.field.profilePersonalSection")}</label><input className="input" {...register("profilePersonalSection")} /></div>
          <div data-field-id="profileAddressesSection"><label className="label">{t("admin.field.profileAddressesSection")}</label><input className="input" {...register("profileAddressesSection")} /></div>
          <div data-field-id="profileNewAddressBtn"><label className="label">{t("admin.field.profileNewAddressBtn")}</label><input className="input" {...register("profileNewAddressBtn")} /></div>
          <div data-field-id="profileNoAddresses"><label className="label">{t("admin.field.profileNoAddresses")}</label><input className="input" {...register("profileNoAddresses")} /></div>
          <div data-field-id="profileSavedToast"><label className="label">{t("admin.field.profileSavedToast")}</label><input className="input" {...register("profileSavedToast")} /></div>
          <div data-field-id="profileLabelName"><label className="label">{t("admin.field.profileLabelName")}</label><input className="input" {...register("profileLabelName")} /></div>
          <div data-field-id="profileLabelEmail"><label className="label">{t("admin.field.profileLabelEmail")}</label><input className="input" {...register("profileLabelEmail")} /></div>
          <div data-field-id="profileLabelFullName"><label className="label">{t("admin.field.profileLabelFullName")}</label><input className="input" {...register("profileLabelFullName")} /></div>
          <div data-field-id="profileLabelStreet"><label className="label">{t("admin.field.profileLabelStreet")}</label><input className="input" {...register("profileLabelStreet")} /></div>
          <div data-field-id="profileLabelZip"><label className="label">{t("admin.field.profileLabelZip")}</label><input className="input" {...register("profileLabelZip")} /></div>
          <div data-field-id="profileLabelCity"><label className="label">{t("admin.field.profileLabelCity")}</label><input className="input" {...register("profileLabelCity")} /></div>
          <div data-field-id="profileLabelCountry"><label className="label">{t("admin.field.profileLabelCountry")}</label><input className="input" {...register("profileLabelCountry")} /></div>
          <div data-field-id="profileLabelPhone"><label className="label">{t("admin.field.profileLabelPhone")}</label><input className="input" {...register("profileLabelPhone")} /></div>
          <div data-field-id="profileSaveBtn"><label className="label">{t("admin.field.profileSaveBtn")}</label><input className="input" {...register("profileSaveBtn")} /></div>
          <div data-field-id="profileCancelBtn"><label className="label">{t("admin.field.profileCancelBtn")}</label><input className="input" {...register("profileCancelBtn")} /></div>
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>{locale === "de" ? t("admin.action.saveDe") : t("admin.action.saveEn")}</Button>
    </form>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminContent() {
  const t = useT();
  const editingLocale: Locale = "de";
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [liveData, setLiveData] = useState<LiveDataMap>(() => makeDefaults("de"));

  // Reset live data to locale defaults when locale changes
  useEffect(() => {
    setLiveData(makeDefaults(editingLocale));
  }, [editingLocale]);

  // Stable setter helpers
  const upd = useCallback(<K extends keyof LiveDataMap>(key: K) => (val: LiveDataMap[K]) => {
    setLiveData((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Section change handler — called by PreviewEl clicks
  const handleSectionChange = useCallback((section: string) => {
    const s = section as SectionKey;
    const page = SECTION_TO_PAGE[s];
    if (page) { setActivePage(page); setActiveSection(s); }
  }, []);

  const pageSections = PAGE_CONFIG[activePage].sections;
  const hasSubTabs = pageSections.length > 1;

  return (
    <PreviewProvider onSectionChange={handleSectionChange}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* ── Header ── */}
        <div className="shrink-0 px-6 pt-5 pb-3 border-b border-line bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl font-semibold">{t("admin.content.editTitle")}</h1>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0">
          {/* Left panel: navigation + form */}
          <div className="w-[460px] shrink-0 flex flex-col border-r border-line bg-white">
            {/* Page tabs */}
            <div className="shrink-0 px-4 pt-4 pb-2 border-b border-line">
              <div className="flex flex-wrap gap-1">
                {PAGES.map((pageKey) => {
                  const cfg = PAGE_CONFIG[pageKey];
                  const Icon = cfg.icon;
                  const active = activePage === pageKey;
                  return (
                    <button
                      key={pageKey}
                      onClick={() => {
                        setActivePage(pageKey);
                        setActiveSection(PAGE_CONFIG[pageKey].sections[0]);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        active ? "bg-brand text-white" : "text-ink-muted hover:bg-surface-alt hover:text-ink"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      {t(cfg.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section sub-tabs (home page only) */}
            {hasSubTabs && (
              <div className="shrink-0 px-4 pt-2 pb-2 border-b border-line">
                <div className="flex gap-1 flex-wrap">
                  {pageSections.map((sk) => (
                    <button
                      key={sk}
                      onClick={() => setActiveSection(sk)}
                      className={`px-3 py-1 rounded-md text-xs transition-colors ${
                        activeSection === sk
                          ? "bg-brand/10 text-brand font-medium"
                          : "text-ink-muted hover:text-ink hover:bg-surface-alt"
                      }`}
                    >
                      {t(SECTION_LABEL_KEYS[sk])}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form area — all editors always mounted, CSS-hidden when not active */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className={activeSection === "hero" ? "" : "hidden"}>
                <HeroEditor locale={editingLocale} onDataChange={upd("home_hero")} />
              </div>
              <div className={activeSection === "how_it_works" ? "" : "hidden"}>
                <HowItWorksEditor locale={editingLocale} onDataChange={upd("home_how_it_works")} />
              </div>
              <div className={activeSection === "cta" ? "" : "hidden"}>
                <CTAEditor locale={editingLocale} onDataChange={upd("home_cta")} />
              </div>
              <div className={activeSection === "home_sections" ? "" : "hidden"}>
                <HomeSectionsEditor
                  locale={editingLocale}
                  onTrustChange={upd("home_trust_strip")}
                  onCatChange={upd("home_categories")}
                  onBestChange={upd("home_bestsellers")}
                />
              </div>
              <div className={activeSection === "about" ? "" : "hidden"}>
                <AboutEditor locale={editingLocale} onDataChange={upd("about")} />
              </div>
              <div className={activeSection === "faq" ? "" : "hidden"}>
                <FAQEditor locale={editingLocale} onDataChange={upd("faq")} />
              </div>
              <div className={activeSection === "contact" ? "" : "hidden"}>
                <ContactEditor locale={editingLocale} onDataChange={upd("contact")} />
              </div>
              <div className={activeSection === "terms" ? "" : "hidden"}>
                <LegalEditor sectionId="legal_terms" locale={editingLocale} deDefaults={DEFAULT_TERMS} enDefaults={DEFAULT_TERMS_EN} onDataChange={upd("legal_terms")} />
              </div>
              <div className={activeSection === "privacy" ? "" : "hidden"}>
                <LegalEditor sectionId="legal_privacy" locale={editingLocale} deDefaults={DEFAULT_PRIVACY} enDefaults={DEFAULT_PRIVACY_EN} onDataChange={upd("legal_privacy")} />
              </div>
              <div className={activeSection === "imprint" ? "" : "hidden"}>
                <ImprintEditor locale={editingLocale} onDataChange={upd("legal_imprint")} />
              </div>
              <div className={activeSection === "navbar" ? "" : "hidden"}>
                <NavbarEditor locale={editingLocale} onDataChange={upd("site_navbar")} />
              </div>
              <div className={activeSection === "footer" ? "" : "hidden"}>
                <FooterEditor locale={editingLocale} onDataChange={upd("site_footer")} />
              </div>
              <div className={activeSection === "cart" ? "" : "hidden"}>
                <CartEditor locale={editingLocale} onDataChange={upd("page_cart")} />
              </div>
              <div className={activeSection === "wishlist" ? "" : "hidden"}>
                <WishlistEditor locale={editingLocale} onDataChange={upd("page_wishlist")} />
              </div>
              <div className={activeSection === "login" ? "" : "hidden"}>
                <LoginEditor locale={editingLocale} onDataChange={upd("page_login")} />
              </div>
              <div className={activeSection === "register" ? "" : "hidden"}>
                <RegisterEditor locale={editingLocale} onDataChange={upd("page_register")} />
              </div>
              <div className={activeSection === "account" ? "" : "hidden"}>
                <AccountEditor locale={editingLocale} onDataChange={upd("page_account")} />
              </div>
            </div>
          </div>

          {/* Right panel: full-page live preview */}
          <div className="flex-1 overflow-y-auto bg-surface-alt/40">
            <div className="sticky top-0 z-10 bg-white border-b border-line px-4 py-2 flex items-center gap-2 text-xs text-ink-muted">
              <Monitor className="size-3.5" />
              <span>Live-Vorschau — klicke auf ein Element um zum Eingabefeld zu springen</span>
            </div>
            <div className="m-4 border border-line rounded-xl overflow-hidden bg-white shadow-sm">
              <PageFullPreview page={activePage} data={liveData} />
            </div>
          </div>
        </div>
      </div>
    </PreviewProvider>
  );
}
