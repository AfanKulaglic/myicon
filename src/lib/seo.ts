/**
 * Lightweight SEO helpers: update document title, meta description and
 * Open Graph tags for the current page. Used for product pages (and any
 * future dynamic routes) so each URL has unique search-engine metadata.
 */

const SITE_NAME = "MYICON";
const BASE_URL = "https://www.my-icon.shop";
const DEFAULT_IMAGE = "https://i.ibb.co/60ff2bwD/logo-text-1.png";

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [key, val] = selector.replace("meta[", "").replace("]", "").split("=");
    el.setAttribute(key, val.replace(/"/g, ""));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function removeJsonLd(type: string) {
  document
    .querySelectorAll(`script[data-seo-type="${type}"]`)
    .forEach((el) => el.remove());
}

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Optional JSON-LD Product schema (for product pages). */
  product?: {
    name: string;
    description: string;
    price: number;
    currency?: string;
    image?: string;
    sku?: string;
  };
}

export function applySeo({ title, description, path, image, product }: SeoOptions) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const img = image || DEFAULT_IMAGE;

  document.title = fullTitle;
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", fullTitle);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:image"]', "content", img);
  setMeta('meta[property="og:type"]', "content", product ? "product" : "website");
  setMeta('meta[name="twitter:title"]', "content", fullTitle);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", img);

  // Canonical link
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  // Product structured data
  removeJsonLd("product");
  if (product) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image || img,
      sku: product.sku,
      brand: { "@type": "Brand", name: SITE_NAME },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: product.currency ?? "EUR",
        price: product.price.toFixed(2),
        availability: "https://schema.org/InStock",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoType = "product";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
