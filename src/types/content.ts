// ─── Hero Section ─────────────────────────────────────────────────────────────
export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroPromoCard {
  tag: string;
  title: string;
  text: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  imageUrl?: string;
  stats: HeroStat[];
  promoCard: HeroPromoCard;
}

export const DEFAULT_HERO: HeroContent = {
  badge: "Neu: Erweiterter Designer",
  title: "Premium Druck.\nIndividuell.",
  titleHighlight: "In Minuten.",
  subtitle:
    "Gestalten Sie hochwertige T-Shirts, Visitenkarten, Flyer, Plakate und Werbeartikel online — mit unserem professionellen Designer. Schnelle Produktion, faire Preise, kompromisslose Qualität.",
  ctaPrimaryText: "Produkte entdecken",
  ctaPrimaryUrl: "/categories",
  ctaSecondaryText: "Jetzt designen",
  ctaSecondaryUrl: "/products/premium-t-shirt/customize",
  imageUrl: "", // Add your custom hero image URL here (leave empty to use fallback)
  stats: [
    { value: "2 Mio.+", label: "zufriedene Kunden" },
    { value: "24 h", label: "Same-Day Druck" },
    { value: "4.9 ★", label: "Kundenbewertung" },
  ],
  promoCard: {
    tag: "Tiefpreis-Garantie",
    title: "30 Tage erstattet",
    text: "Sollten Sie einen günstigeren Preis finden, erstatten wir die Differenz.",
  },
};

export const DEFAULT_HERO_EN: HeroContent = {
  badge: "New: Enhanced Designer",
  title: "Premium Print.\nPersonalized.",
  titleHighlight: "In minutes.",
  subtitle:
    "Design high-quality T-shirts, business cards, flyers, posters and promotional items online — with our professional designer. Fast production, fair prices, uncompromising quality.",
  ctaPrimaryText: "Discover products",
  ctaPrimaryUrl: "/categories",
  ctaSecondaryText: "Design now",
  ctaSecondaryUrl: "/products/premium-t-shirt/customize",
  imageUrl: "", // Add your custom hero image URL here (leave empty to use fallback)
  stats: [
    { value: "2M+", label: "satisfied customers" },
    { value: "24 h", label: "same-day printing" },
    { value: "4.9 ★", label: "customer rating" },
  ],
  promoCard: {
    tag: "Best Price Guarantee",
    title: "30-day refund",
    text: "If you find a cheaper price, we'll refund the difference.",
  },
};

// ─── How It Works ─────────────────────────────────────────────────────────────
export interface HowItWorksStep {
  icon: string; // Lucide icon name
  title: string;
  text: string;
}

export interface HowItWorksContent {
  sectionTitle: string;
  sectionSubtitle: string;
  steps: HowItWorksStep[];
}

export const DEFAULT_HOW_IT_WORKS: HowItWorksContent = {
  sectionTitle: "So einfach geht's",
  sectionSubtitle:
    "In drei Schritten zu Ihrem individuellen Produkt — schnell und unkompliziert.",
  steps: [
    { icon: "MousePointerClick", title: "1. Produkt wählen", text: "Stöbern Sie durch unser umfangreiches Sortiment und wählen Sie Ihr Produkt." },
    { icon: "Brush", title: "2. Design erstellen", text: "Gestalten Sie individuell mit unserem professionellen Online-Designer." },
    { icon: "PackageCheck", title: "3. Bestellen & erhalten", text: "Sicher per PayPal bezahlen — geliefert in wenigen Werktagen." },
  ],
};

export const DEFAULT_HOW_IT_WORKS_EN: HowItWorksContent = {
  sectionTitle: "It's this easy",
  sectionSubtitle: "Three simple steps to your custom product — quick and effortless.",
  steps: [
    { icon: "MousePointerClick", title: "1. Choose a product", text: "Browse our extensive range and pick the product you need." },
    { icon: "Brush", title: "2. Create your design", text: "Customise it with our professional online designer." },
    { icon: "PackageCheck", title: "3. Order & receive", text: "Pay securely via PayPal — delivered within a few working days." },
  ],
};

// ─── CTA Section ──────────────────────────────────────────────────────────────
export interface CTAContent {
  title: string;
  description: string;
  primaryText: string;
  primaryUrl: string;
  secondaryText: string;
  secondaryUrl: string;
}

export const DEFAULT_CTA: CTAContent = {
  title: "Starten Sie Ihr Design — heute.",
  description:
    "Erstellen Sie professionelle Drucksachen in Minuten. Speichern Sie Entwürfe und bestellen Sie, wann immer Sie bereit sind.",
  primaryText: "Produkte ansehen",
  primaryUrl: "/categories",
  secondaryText: "Konto erstellen",
  secondaryUrl: "/register",
};

export const DEFAULT_CTA_EN: CTAContent = {
  title: "Start your design — today.",
  description:
    "Create professional print products in minutes. Save drafts and order whenever you're ready.",
  primaryText: "Browse products",
  primaryUrl: "/categories",
  secondaryText: "Create account",
  secondaryUrl: "/register",
};

// ─── About Page ───────────────────────────────────────────────────────────────
export interface AboutFeature {
  icon: string;
  label: string;
  text: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  features: AboutFeature[];
}

export const DEFAULT_ABOUT: AboutContent = {
  heroTitle: "Premium Druck. Persönlich gestaltet.",
  heroSubtitle:
    "Wir glauben, dass jedes Produkt eine Geschichte erzählen sollte. Mit modernster Drucktechnik und einer intuitiven Designer-Plattform helfen wir Privatpersonen und Unternehmen in ganz Europa, ihre Ideen Wirklichkeit werden zu lassen.",
  storyTitle: "Unsere Geschichte",
  storyParagraphs: [
    "MYICON wurde 2024 in Berlin gegründet mit dem Ziel, individuellen Druck so einfach und zugänglich wie möglich zu machen.",
    "Unser Team aus Designern, Druckspezialisten und Entwicklern arbeitet täglich daran, Ihren Bestellprozess zu verbessern — von der Idee bis zur Lieferung.",
  ],
  features: [
    { icon: "Award", label: "Qualität", text: "Zertifizierte Druckqualität auf Premium-Materialien." },
    { icon: "Truck", label: "Schnell", text: "Lieferung in 3–5 Werktagen — europaweit." },
    { icon: "Leaf", label: "Nachhaltig", text: "Klimaneutraler Versand und FSC-zertifizierte Papiere." },
    { icon: "Users", label: "Persönlich", text: "Dediziertes Service-Team in Berlin." },
  ],
};

export const DEFAULT_ABOUT_EN: AboutContent = {
  heroTitle: "Premium Print. Personally crafted.",
  heroSubtitle:
    "We believe every product should tell a story. With state-of-the-art printing technology and an intuitive designer platform, we help individuals and businesses across Europe bring their ideas to life.",
  storyTitle: "Our Story",
  storyParagraphs: [
    "MYICON was founded in Berlin in 2024 with the goal of making custom printing as simple and accessible as possible.",
    "Our team of designers, print specialists and developers works every day to improve your ordering experience — from concept to delivery.",
  ],
  features: [
    { icon: "Award", label: "Quality", text: "Certified print quality on premium materials." },
    { icon: "Truck", label: "Fast", text: "Delivery in 3–5 working days — across Europe." },
    { icon: "Leaf", label: "Sustainable", text: "Climate-neutral shipping and FSC-certified papers." },
    { icon: "Users", label: "Personal", text: "Dedicated service team in Berlin." },
  ],
};

// ─── FAQ Page ─────────────────────────────────────────────────────────────────
export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQContent {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export const DEFAULT_FAQ: FAQContent = {
  title: "Häufige Fragen",
  subtitle: "Antworten auf die häufigsten Fragen rund um MYICON.",
  items: [
    { q: "Wie lange dauert die Lieferung?", a: "Standardlieferung erfolgt innerhalb von 3–5 Werktagen nach Druckfreigabe. Express-Optionen sind verfügbar." },
    { q: "Welche Dateiformate kann ich hochladen?", a: "PNG, JPG und SVG werden direkt im Designer unterstützt. Für Druckaufträge empfehlen wir hochauflösende Dateien (min. 300 DPI)." },
    { q: "Gibt es Mindestbestellmengen?", a: "Nein, Sie können bereits ab 1 Stück bestellen. Mengenrabatte werden automatisch berechnet." },
    { q: "Wie funktioniert der Designer?", a: "Wählen Sie ein Produkt, klicken auf 'Jetzt designen' und fügen Texte, Grafiken oder Logos hinzu. Die Vorschau zeigt Ihnen das Endergebnis in Echtzeit." },
    { q: "Welche Zahlungsmethoden akzeptieren Sie?", a: "Wir akzeptieren PayPal, Kreditkarte (Visa/Mastercard), Rechnung und Vorkasse." },
    { q: "Kann ich meine Bestellung stornieren?", a: "Solange die Produktion noch nicht gestartet wurde, können Sie Ihre Bestellung kostenlos stornieren." },
    { q: "Wie sicher ist meine Zahlung?", a: "Alle Zahlungen sind SSL-verschlüsselt. Wir geben Ihre Daten nicht an Dritte weiter." },
  ],
};

export const DEFAULT_FAQ_EN: FAQContent = {
  title: "Frequently Asked Questions",
  subtitle: "Answers to the most common questions about MYICON.",
  items: [
    { q: "How long does delivery take?", a: "Standard delivery takes 3–5 working days after print approval. Express options are available." },
    { q: "What file formats can I upload?", a: "PNG, JPG and SVG are supported directly in the designer. For print orders we recommend high-resolution files (min. 300 DPI)." },
    { q: "Are there minimum order quantities?", a: "No, you can order from just 1 piece. Volume discounts are calculated automatically." },
    { q: "How does the designer work?", a: "Choose a product, click 'Design now' and add text, graphics or logos. The live preview shows you the final result in real time." },
    { q: "What payment methods do you accept?", a: "We accept PayPal, credit card (Visa/Mastercard), invoice and prepayment." },
    { q: "Can I cancel my order?", a: "As long as production has not yet started, you can cancel your order free of charge." },
    { q: "How secure is my payment?", a: "All payments are SSL-encrypted. We never share your data with third parties." },
  ],
};

// ─── Contact Page ─────────────────────────────────────────────────────────────
export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export const DEFAULT_CONTACT: ContactContent = {
  title: "Kontakt",
  subtitle: "Wir sind für Sie da. Schreiben Sie uns oder rufen Sie an.",
  email: "myicon2025@gmail.com",
  phone: "02191 5606112\n0176 64824863\n0178 8793509",
  address: "www.my-icon.shop",
  hours: "Mo – Fr 9:00 – 18:00",
};

export const DEFAULT_CONTACT_EN: ContactContent = {
  title: "Contact",
  subtitle: "We're here for you. Write to us or give us a call.",
  email: "myicon2025@gmail.com",
  phone: "02191 5606112\n0176 64824863\n0178 8793509",
  address: "www.my-icon.shop",
  hours: "Mon – Fri 9:00 am – 6:00 pm",
};

// ─── Trust Strip ──────────────────────────────────────────────────────────────
export interface TrustStripContent {
  items: { icon: string; label: string }[];
}

export const DEFAULT_TRUST_STRIP: TrustStripContent = {
  items: [
    { icon: "Zap", label: "Schnelle Produktion" },
    { icon: "ShieldCheck", label: "Premium Qualität" },
    { icon: "CreditCard", label: "Sicher per PayPal" },
    { icon: "Save", label: "Designs speichern" },
    { icon: "Truck", label: "Kostenloser Versand ab 99 €" },
  ],
};

export const DEFAULT_TRUST_STRIP_EN: TrustStripContent = {
  items: [
    { icon: "Zap", label: "Fast production" },
    { icon: "ShieldCheck", label: "Premium quality" },
    { icon: "CreditCard", label: "Secure payment via PayPal" },
    { icon: "Save", label: "Save designs" },
    { icon: "Truck", label: "Free shipping from €99" },
  ],
};

// ─── Home: Categories Section ─────────────────────────────────────────────────
export interface HomeCategoriesContent {
  title: string;
  subtitle: string;
  linkText: string;
}

export const DEFAULT_HOME_CATEGORIES: HomeCategoriesContent = {
  title: "Beliebte Kategorien",
  subtitle: "Vom T-Shirt bis zur Visitenkarte — Premium Produkte für jeden Anlass.",
  linkText: "Alle Kategorien →",
};

export const DEFAULT_HOME_CATEGORIES_EN: HomeCategoriesContent = {
  title: "Popular Categories",
  subtitle: "From T-shirts to business cards — premium products for every occasion.",
  linkText: "All categories →",
};

// ─── Home: Bestsellers Section ────────────────────────────────────────────────
export interface HomeBestsellersContent {
  title: string;
  subtitle: string;
}

export const DEFAULT_HOME_BESTSELLERS: HomeBestsellersContent = {
  title: "Bestseller",
  subtitle: "Unsere meistverkauften Produkte — jetzt individuell gestalten.",
};

export const DEFAULT_HOME_BESTSELLERS_EN: HomeBestsellersContent = {
  title: "Bestsellers",
  subtitle: "Our best-selling products — personalise them now.",
};

// ─── Legal Pages (Terms, Privacy) ─────────────────────────────────────────────
export interface LegalPageContent {
  title: string;
  sections: { h: string; p: string }[];
}

export const DEFAULT_TERMS: LegalPageContent = {
  title: "Allgemeine Geschäftsbedingungen",
  sections: [
    { h: "§1 Geltungsbereich", p: "Für alle Bestellungen über unseren Online-Shop gelten die nachfolgenden AGB." },
    { h: "§2 Vertragspartner", p: "Der Kaufvertrag kommt zustande mit MYICON GmbH, Druckallee 1, 10115 Berlin." },
    { h: "§3 Preise & Versandkosten", p: "Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Versandkosten werden im Bestellprozess angezeigt." },
    { h: "§4 Lieferung", p: "Die Lieferzeit beträgt in der Regel 3–5 Werktage nach Druckfreigabe." },
    { h: "§5 Widerruf", p: "Bei individuell gefertigten Produkten ist das Widerrufsrecht ausgeschlossen, soweit gesetzlich zulässig." },
    { h: "§6 Gewährleistung", p: "Es gelten die gesetzlichen Gewährleistungsbestimmungen." },
  ],
};

export const DEFAULT_TERMS_EN: LegalPageContent = {
  title: "Terms and Conditions",
  sections: [
    { h: "§1 Scope", p: "The following terms and conditions apply to all orders placed through our online shop." },
    { h: "§2 Contracting Party", p: "The purchase contract is concluded with MYICON GmbH, Druckallee 1, 10115 Berlin." },
    { h: "§3 Prices & Shipping Costs", p: "All prices include the applicable VAT. Shipping costs are shown during the checkout process." },
    { h: "§4 Delivery", p: "Delivery typically takes 3–5 business days after print approval." },
    { h: "§5 Right of Withdrawal", p: "The right of withdrawal is excluded for custom-made products to the extent permitted by law." },
    { h: "§6 Warranty", p: "The statutory warranty provisions apply." },
  ],
};

export const DEFAULT_PRIVACY: LegalPageContent = {
  title: "Datenschutzerklärung",
  sections: [
    { h: "1. Verantwortlicher", p: "MYICON, www.my-icon.shop, myicon2025@gmail.com" },
    { h: "2. Datenerhebung", p: "Wir erheben personenbezogene Daten nur, sofern Sie uns diese im Rahmen einer Bestellung oder Kontaktanfrage freiwillig mitteilen." },
    { h: "3. Cookies", p: "Unsere Webseite verwendet technisch notwendige Cookies. Analytische Cookies werden nur mit Ihrer ausdrücklichen Zustimmung gesetzt." },
    { h: "4. Ihre Rechte", p: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit gemäß DSGVO. Anfragen richten Sie bitte an myicon2025@gmail.com." },
    { h: "5. Zahlungsdienstleister", p: "Bei Zahlung über PayPal werden Daten an die PayPal (Europe) S.à r.l. übermittelt — siehe deren Datenschutzerklärung." },
  ],
};

export const DEFAULT_PRIVACY_EN: LegalPageContent = {
  title: "Privacy Policy",
  sections: [
    { h: "1. Controller", p: "MYICON, www.my-icon.shop, myicon2025@gmail.com" },
    { h: "2. Data Collection", p: "We only collect personal data that you voluntarily provide as part of an order or contact request." },
    { h: "3. Cookies", p: "Our website uses technically necessary cookies. Analytical cookies are only set with your explicit consent." },
    { h: "4. Your Rights", p: "You have the right to access, rectify, delete and port your data under GDPR. Please address requests to myicon2025@gmail.com." },
    { h: "5. Payment Service Provider", p: "When paying via PayPal, data is transmitted to PayPal (Europe) S.à r.l. — see their privacy policy." },
  ],
};

// ─── Imprint Page ─────────────────────────────────────────────────────────────
export interface ImprintContent {
  title: string;
  body: string;
}

export const DEFAULT_IMPRINT: ImprintContent = {
  title: "Impressum",
  body: "MYICON\nwww.my-icon.shop\n\nTelefon: 02191 5606112\nTelefon: 0176 64824863\nTelefon: 0178 8793509\nE-Mail: myicon2025@gmail.com",
};

export const DEFAULT_IMPRINT_EN: ImprintContent = {
  title: "Legal Notice",
  body: "MYICON\nwww.my-icon.shop\n\nPhone: 02191 5606112\nPhone: 0176 64824863\nPhone: 0178 8793509\nEmail: myicon2025@gmail.com",
};

// ─── Navbar (Site Header) ─────────────────────────────────────────────────────
export interface NavbarContent {
  utilShipping: string;
  utilSameday: string;
  utilGuarantee: string;
  helpText: string;
  contactText: string;
  searchPlaceholder: string;
  searchBtnText: string;
  accountText: string;
}

export const DEFAULT_NAVBAR: NavbarContent = {
  utilShipping: "Kostenloser Versand ab 99 €",
  utilSameday: "Same-Day Produktion verfügbar",
  utilGuarantee: "30 Tage Tiefpreis-Garantie",
  helpText: "Hilfe",
  contactText: "Kontakt",
  searchPlaceholder: "Produktsortiment durchsuchen…",
  searchBtnText: "Suchen",
  accountText: "Konto",
};

export const DEFAULT_NAVBAR_EN: NavbarContent = {
  utilShipping: "Free shipping from €99",
  utilSameday: "Same-day production available",
  utilGuarantee: "30-day best-price guarantee",
  helpText: "Help",
  contactText: "Contact",
  searchPlaceholder: "Search our product range…",
  searchBtnText: "Search",
  accountText: "Account",
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export interface FooterTrustItem {
  label: string;
}

export interface FooterContent {
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  colProductsLabel: string;
  colAccountLabel: string;
  colServiceLabel: string;
  copyrightText: string;
  trustItems: FooterTrustItem[];
}

export const DEFAULT_FOOTER: FooterContent = {
  tagline: "MYICON — Premium europäische Plattform für individuell bedruckte Textilien, Drucksachen und Werbeartikel. Hochwertige Qualität, schnelle Produktion.",
  phone: "02191 5606112",
  phoneHref: "tel:+492191 5606112",
  email: "myicon2025@gmail.com",
  emailHref: "mailto:myicon2025@gmail.com",
  colProductsLabel: "Produkte",
  colAccountLabel: "Konto",
  colServiceLabel: "Service",
  copyrightText: "Alle Rechte vorbehalten.",
  trustItems: [
    { label: "Kostenloser Versand ab 99 €" },
    { label: "30 Tage Tiefpreis-Garantie" },
    { label: "Sicher per PayPal bezahlen" },
    { label: "Premium Kundenservice" },
  ],
};

export const DEFAULT_FOOTER_EN: FooterContent = {
  tagline: "MYICON — Premium European platform for custom-printed apparel, print products and promotional items. Superior quality, fast production.",
  phone: "02191 5606112",
  phoneHref: "tel:+492191 5606112",
  email: "myicon2025@gmail.com",
  emailHref: "mailto:myicon2025@gmail.com",
  colProductsLabel: "Products",
  colAccountLabel: "Account",
  colServiceLabel: "Service",
  copyrightText: "All rights reserved.",
  trustItems: [
    { label: "Free shipping from €99" },
    { label: "30-day best-price guarantee" },
    { label: "Secure payment via PayPal" },
    { label: "Premium customer support" },
  ],
};

// ─── Cart Page ────────────────────────────────────────────────────────────────
export interface CartContent {
  pageTitle: string;
  emptyTitle: string;
  emptySubtitle: string;
  emptyCtaText: string;
  summaryTitle: string;
  labelSubtotal: string;
  labelVat: string;
  labelShipping: string;
  labelShippingFree: string;
  labelTotal: string;
  checkoutBtnText: string;
  continueBtnText: string;
}

export const DEFAULT_CART: CartContent = {
  pageTitle: "Warenkorb",
  emptyTitle: "Ihr Warenkorb ist leer",
  emptySubtitle: "Entdecken Sie unsere Produkte und gestalten Sie Ihr Design.",
  emptyCtaText: "Jetzt entdecken",
  summaryTitle: "Zusammenfassung",
  labelSubtotal: "Zwischensumme",
  labelVat: "MwSt. 19%",
  labelShipping: "Versand",
  labelShippingFree: "Kostenlos",
  labelTotal: "Gesamt",
  checkoutBtnText: "Zur Kasse",
  continueBtnText: "Weiter einkaufen",
};

export const DEFAULT_CART_EN: CartContent = {
  pageTitle: "Cart",
  emptyTitle: "Your cart is empty",
  emptySubtitle: "Discover our products and create your design.",
  emptyCtaText: "Discover now",
  summaryTitle: "Summary",
  labelSubtotal: "Subtotal",
  labelVat: "VAT 19%",
  labelShipping: "Shipping",
  labelShippingFree: "Free",
  labelTotal: "Total",
  checkoutBtnText: "Checkout",
  continueBtnText: "Continue shopping",
};

// ─── Wishlist Page ────────────────────────────────────────────────────────────
export interface WishlistContent {
  pageTitle: string;
  emptyText: string;
  emptyCtaText: string;
}

export const DEFAULT_WISHLIST: WishlistContent = {
  pageTitle: "Merkliste",
  emptyText: "Ihre Merkliste ist leer.",
  emptyCtaText: "Produkte entdecken",
};

export const DEFAULT_WISHLIST_EN: WishlistContent = {
  pageTitle: "Wishlist",
  emptyText: "Your wishlist is empty.",
  emptyCtaText: "Discover products",
};

// ─── Login Page ───────────────────────────────────────────────────────────────
export interface LoginContent {
  pageTitle: string;
  subtitle: string;
  labelEmail: string;
  labelPassword: string;
  submitBtn: string;
  noAccountText: string;
  registerLink: string;
}

export const DEFAULT_LOGIN: LoginContent = {
  pageTitle: "Anmelden",
  subtitle: "Willkommen zurück bei MYICON.",
  labelEmail: "E-Mail",
  labelPassword: "Passwort",
  submitBtn: "Anmelden",
  noAccountText: "Noch kein Konto?",
  registerLink: "Registrieren",
};

export const DEFAULT_LOGIN_EN: LoginContent = {
  pageTitle: "Sign in",
  subtitle: "Welcome back to MYICON.",
  labelEmail: "Email",
  labelPassword: "Password",
  submitBtn: "Sign in",
  noAccountText: "Don't have an account?",
  registerLink: "Register",
};

// ─── Register Page ────────────────────────────────────────────────────────────
export interface RegisterContent {
  pageTitle: string;
  subtitle: string;
  labelName: string;
  labelEmail: string;
  labelPassword: string;
  labelConfirm: string;
  submitBtn: string;
  alreadyText: string;
  loginLink: string;
}

export const DEFAULT_REGISTER: RegisterContent = {
  pageTitle: "Konto erstellen",
  subtitle: "In Sekunden registrieren und losdesignen.",
  labelName: "Vollständiger Name",
  labelEmail: "E-Mail",
  labelPassword: "Passwort",
  labelConfirm: "Passwort bestätigen",
  submitBtn: "Registrieren",
  alreadyText: "Bereits registriert?",
  loginLink: "Anmelden",
};

export const DEFAULT_REGISTER_EN: RegisterContent = {
  pageTitle: "Create account",
  subtitle: "Register in seconds and start designing.",
  labelName: "Full name",
  labelEmail: "Email",
  labelPassword: "Password",
  labelConfirm: "Confirm password",
  submitBtn: "Register",
  alreadyText: "Already registered?",
  loginLink: "Sign in",
};

// ─── Account Pages (layout + all sub-pages) ───────────────────────────────────
export interface AccountContent {
  // Sidebar nav
  loggedInAs: string;
  navOverview: string;
  navOrders: string;
  navDesigns: string;
  navWishlist: string;
  navProfile: string;
  navLogout: string;
  // Dashboard
  dashWelcome: string;
  dashSubtitle: string;
  dashStatOrders: string;
  dashStatDesigns: string;
  dashStatWishlist: string;
  dashStatAddresses: string;
  dashLastActivity: string;
  dashNoOrders: string;
  dashNoOrdersLink: string;
  dashOrderDetails: string;
  // Orders page
  ordersTitle: string;
  ordersEmpty: string;
  ordersEmptyCta: string;
  ordersLabelNumber: string;
  ordersLabelDate: string;
  ordersLabelTotal: string;
  // Drafts page
  draftsTitle: string;
  draftsEmpty: string;
  draftsEmptyCta: string;
  draftsEditBtn: string;
  draftsNoPreview: string;
  // Profile page
  profileTitle: string;
  profilePersonalSection: string;
  profileLabelName: string;
  profileLabelEmail: string;
  profileAddressesSection: string;
  profileNewAddressBtn: string;
  profileNoAddresses: string;
  profileSavedToast: string;
  profileLabelFullName: string;
  profileLabelStreet: string;
  profileLabelZip: string;
  profileLabelCity: string;
  profileLabelCountry: string;
  profileLabelPhone: string;
  profileSaveBtn: string;
  profileCancelBtn: string;
}

export const DEFAULT_ACCOUNT: AccountContent = {
  loggedInAs: "Angemeldet als",
  navOverview: "Übersicht",
  navOrders: "Bestellungen",
  navDesigns: "Designs",
  navWishlist: "Merkliste",
  navProfile: "Profil & Adressen",
  navLogout: "Abmelden",
  dashWelcome: "Willkommen",
  dashSubtitle: "Hier finden Sie alle Informationen zu Ihrem Konto.",
  dashStatOrders: "Bestellungen",
  dashStatDesigns: "Designs",
  dashStatWishlist: "Merkliste",
  dashStatAddresses: "Adressen",
  dashLastActivity: "Letzte Aktivität",
  dashNoOrders: "Noch keine Bestellungen.",
  dashNoOrdersLink: "Jetzt entdecken",
  dashOrderDetails: "Details",
  ordersTitle: "Bestellungen",
  ordersEmpty: "Sie haben noch keine Bestellungen.",
  ordersEmptyCta: "Produkte entdecken",
  ordersLabelNumber: "Bestellnummer",
  ordersLabelDate: "Datum",
  ordersLabelTotal: "Gesamt",
  draftsTitle: "Meine Designs",
  draftsEmpty: "Sie haben noch keine gespeicherten Designs.",
  draftsEmptyCta: "Jetzt designen",
  draftsEditBtn: "Bearbeiten",
  draftsNoPreview: "Keine Vorschau",
  profileTitle: "Profil & Adressen",
  profilePersonalSection: "Persönliche Daten",
  profileLabelName: "Name",
  profileLabelEmail: "E-Mail",
  profileAddressesSection: "Gespeicherte Adressen",
  profileNewAddressBtn: "Neue Adresse",
  profileNoAddresses: "Sie haben noch keine gespeicherten Adressen.",
  profileSavedToast: "Adresse gespeichert",
  profileLabelFullName: "Name",
  profileLabelStreet: "Straße",
  profileLabelZip: "PLZ",
  profileLabelCity: "Stadt",
  profileLabelCountry: "Land",
  profileLabelPhone: "Telefon",
  profileSaveBtn: "Speichern",
  profileCancelBtn: "Abbrechen",
};

export const DEFAULT_ACCOUNT_EN: AccountContent = {
  loggedInAs: "Signed in as",
  navOverview: "Overview",
  navOrders: "Orders",
  navDesigns: "Designs",
  navWishlist: "Wishlist",
  navProfile: "Profile & Addresses",
  navLogout: "Sign out",
  dashWelcome: "Welcome",
  dashSubtitle: "Here you will find all information about your account.",
  dashStatOrders: "Orders",
  dashStatDesigns: "Designs",
  dashStatWishlist: "Wishlist",
  dashStatAddresses: "Addresses",
  dashLastActivity: "Recent activity",
  dashNoOrders: "No orders yet.",
  dashNoOrdersLink: "Discover now",
  dashOrderDetails: "Details",
  ordersTitle: "Orders",
  ordersEmpty: "You have no orders yet.",
  ordersEmptyCta: "Discover products",
  ordersLabelNumber: "Order number",
  ordersLabelDate: "Date",
  ordersLabelTotal: "Total",
  draftsTitle: "My Designs",
  draftsEmpty: "You have no saved designs yet.",
  draftsEmptyCta: "Start designing",
  draftsEditBtn: "Edit",
  draftsNoPreview: "No preview",
  profileTitle: "Profile & Addresses",
  profilePersonalSection: "Personal information",
  profileLabelName: "Name",
  profileLabelEmail: "Email",
  profileAddressesSection: "Saved addresses",
  profileNewAddressBtn: "New address",
  profileNoAddresses: "You have no saved addresses yet.",
  profileSavedToast: "Address saved",
  profileLabelFullName: "Full name",
  profileLabelStreet: "Street",
  profileLabelZip: "Postcode",
  profileLabelCity: "City",
  profileLabelCountry: "Country",
  profileLabelPhone: "Phone",
  profileSaveBtn: "Save",
  profileCancelBtn: "Cancel",
};
