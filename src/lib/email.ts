import type { Order } from "@/types";
import { BANK_ACCOUNT, paymentReference } from "./bank";
import { formatCurrency, optimizeImage } from "./utils";

/**
 * Transactional emails via Resend (https://resend.com — free tier: 3,000
 * emails/month, 100/day).
 *
 * The Resend API key lives SERVER-SIDE only — it is read by the Vercel
 * serverless function `api/send-email.ts` from `RESEND_API_KEY`, so it never
 * ships to the browser. This client module renders the email HTML and posts
 * it to its own `/api/send-email` endpoint, which relays it to Resend.
 * Sending through the server also avoids Resend's CORS restriction: direct
 * browser calls to api.resend.com are blocked (no Access-Control-Allow-Origin
 * header), which is why a serverless relay is required.
 *
 * If the endpoint fails, the functions log to the console and resolve without
 * throwing — the order flow must never break because of email.
 */

const FROM_EMAIL =
  (import.meta.env.VITE_EMAIL_FROM as string | undefined) ??
  "MYICON <info@my-icon.shop>";
/**
 * The shop owner's business inbox. The admin "new order" notification is
 * addressed to it. Set via VITE_EMAIL_COPY_TO.
 */
const COPY_TO =
  (import.meta.env.VITE_EMAIL_COPY_TO as string | undefined) ??
  "myicon2025@gmail.com";
/**
 * Public base URL of the live shop (Vercel). Used for the logo fallback and
 * for links inside emails (tracking page). Override via VITE_PUBLIC_URL.
 */
const PUBLIC_URL =
  (import.meta.env.VITE_PUBLIC_URL as string | undefined) ??
  "https://myicon-one.vercel.app";
/**
 * Logo shown at the top of every email. Hosted on ImgBB so it loads in every
 * mail client. Override via VITE_EMAIL_LOGO_URL if it ever changes.
 */
const LOGO_URL =
  (import.meta.env.VITE_EMAIL_LOGO_URL as string | undefined) ??
  "https://i.ibb.co/60ff2bwD/logo-text-1.png";
/** Brand palette (matches tailwind.config.mjs). */
const BRAND = {
  blue: "#1E5AA8",
  blueDark: "#194B8C",
  blueSoft: "#EEF3FB",
  blueLine: "#D6E2F3",
  accent: "#C5E337",
  ink: "#1E1E1E",
  muted: "#5A6675",
  subtle: "#8A95A4",
  bg: "#F5F6F8",
  card: "#FFFFFF",
  line: "#E5E7EB",
  footer: "#FAFBFC",
} as const;

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Low-level sender. Renders are built by this client module; the actual
 * delivery happens through the serverless endpoint `/api/send-email` (which
 * holds the Resend API key server-side). Returns true when the email was
 * accepted, false when it was skipped or failed.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<boolean> {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        ...(text ? { text } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] Relay error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Send failed", err);
    return false;
  }
}

/** Escape user-provided values before embedding them in HTML. */
function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Shared email shell styled like the MYICON website: white card, brand blue +
 * lime accent, the site logo on top, soft footer. Fully custom HTML — Resend
 * sends exactly what we hand it.
 */
function shell(innerHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Inter',Arial,Helvetica,sans-serif;color:${BRAND.ink};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
            <tr>
              <td>
                <img src="${LOGO_URL}" alt="MYiCON – Qualität, die man sieht." width="150" style="display:block;width:150px;height:auto;" />
              </td>
            </tr>
          </table>
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.card};border-radius:12px;overflow:hidden;border:1px solid ${BRAND.line};">
            <tr>
              <td style="background:${BRAND.blue};height:5px;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px;font-size:14px;line-height:1.6;">
                ${innerHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BRAND.line};background:${BRAND.footer};color:${BRAND.subtle};font-size:12px;line-height:1.7;">
                <strong style="color:${BRAND.ink};">MYiCON</strong> &middot; Qualität, die man sieht.<br/>
                ${esc(PUBLIC_URL.replace(/^https?:\/\//, ""))}<br/>
                Diese E-Mail wurde automatisch erstellt.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Branded call-to-action button, like the site's primary buttons. */
function ctaButton(href: string, label: string): string {
  return `<a href="${esc(href)}" style="display:inline-block;background:${BRAND.blue};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">${esc(label)}</a>`;
}

/**
 * Ordered items table + total. Every row shows the product image (from the
 * order snapshot); products without an image get a branded placeholder so a
 * product never appears image-less in an order email.
 */
function itemsTableHtml(order: Order): string {
  const rows = order.items
    .map((i) => {
      const thumb = i.image
        ? `<img src="${esc(optimizeImage(i.image, 128))}" alt="${esc(i.title)}" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:8px;border:1px solid ${BRAND.line};" />`
        : `<div style="width:48px;height:48px;border-radius:8px;border:1px solid ${BRAND.line};background:#F0F1F3;"></div>`;
      return `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f1f3;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;vertical-align:middle;">${thumb}</td>
                <td style="vertical-align:middle;">${esc(i.quantity)}&times; ${esc(i.title)}</td>
              </tr>
            </table>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f1f3;text-align:right;white-space:nowrap;vertical-align:middle;">${formatCurrency(i.price * i.quantity)}</td>
        </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      ${rows}
      <tr>
        <td style="padding:10px 0;font-weight:bold;color:${BRAND.blue};">Gesamt</td>
        <td style="padding:10px 0;text-align:right;font-weight:bold;color:${BRAND.blue};white-space:nowrap;">${formatCurrency(order.total)}</td>
      </tr>
    </table>`;
}

/** Bank details box — shown only for Vorkasse (bank transfer) orders. */
function bankDetailsHtml(order: Order, reference: string): string {
  return `<div style="background:${BRAND.blueSoft};border:1px solid ${BRAND.blueLine};border-radius:8px;padding:16px 18px;margin:0 0 20px;">
      <p style="margin:0 0 8px;font-weight:bold;color:${BRAND.blue};">Bitte überweisen Sie den Betrag auf folgendes Konto:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:13px;">
        <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Rechnungsnummer (Proforma)</td><td style="padding:2px 0;font-family:monospace;font-weight:bold;">${esc(reference)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Empfänger</td><td style="padding:2px 0;">${esc(BANK_ACCOUNT.holder)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">IBAN</td><td style="padding:2px 0;font-family:monospace;">${esc(BANK_ACCOUNT.iban)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">BIC</td><td style="padding:2px 0;font-family:monospace;">${esc(BANK_ACCOUNT.bic)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Bank</td><td style="padding:2px 0;">${esc(BANK_ACCOUNT.bankName)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Verwendungszweck (= Rechnungsnr.)</td><td style="padding:2px 0;font-family:monospace;font-weight:bold;">${esc(reference)}</td></tr>
      </table>
    </div>`;
}

/**
 * Order confirmation — sent to the CUSTOMER for every order (PayPal and
 * Vorkasse). Always lists the ordered products with their images; bank details
 * are included only for bank-transfer (Vorkasse) orders.
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  const to = order.email;
  if (!to) return false;
  const isVorkasse = order.paymentMethod === "bank_transfer";
  const reference = paymentReference(order.id);

  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Vielen Dank für Ihre Bestellung!</h2>
    <p style="margin:0 0 16px;">
      Ihre Bestellnummer lautet <strong style="font-family:monospace;">${esc(order.id)}</strong>.
      ${
        isVorkasse
          ? `Ihre <strong>Proforma-Rechnung</strong> trägt die Nummer <strong style="font-family:monospace;">${esc(reference)}</strong> — diese Nummer geben Sie bitte bei der Überweisung als <strong>Verwendungszweck</strong> an.`
          : `Ihre Zahlung per <strong>PayPal</strong> ist bei uns eingegangen.`
      }
    </p>

    ${itemsTableHtml(order)}

    ${isVorkasse ? bankDetailsHtml(order, reference) : ""}

    ${
      isVorkasse
        ? `<p style="margin:0 0 16px;font-size:13px;color:${BRAND.muted};">
      Bitte geben Sie bei der Überweisung unbedingt den <strong>Verwendungszweck</strong> an —
      nur so können wir Ihre Zahlung Ihrer Bestellung zuordnen. Die Produktion startet,
      sobald Ihre Zahlung bei uns eingegangen ist (in der Regel innerhalb von ${BANK_ACCOUNT.paymentDeadlineDays} Werktagen).
    </p>`
        : `<p style="margin:0 0 16px;font-size:13px;color:${BRAND.muted};">
      Ihre Bestellung ist jetzt <strong>in Bearbeitung</strong>. Sie erhalten eine weitere
      E-Mail, sobald Ihre Bestellung versendet wurde.
    </p>`
    }

    <p style="margin:0 0 20px;font-size:13px;color:${BRAND.muted};">
      Den Status Ihrer Bestellung können Sie jederzeit online verfolgen.
    </p>
    ${ctaButton(`${PUBLIC_URL}/order/track/${esc(order.id)}`, "Bestellung verfolgen")}
  `);

  return sendEmail({
    to,
    subject: isVorkasse
      ? `Ihre Bestellung ${order.id} bei MYICON — bitte überweisen Sie den Betrag`
      : `Ihre Bestellung ${order.id} bei MYICON — vielen Dank!`,
    html,
  });
}

/** Payment-received confirmation — sent to the customer when the admin marks a Vorkasse order as paid. */
export async function sendPaymentReceivedEmail(order: Order): Promise<boolean> {
  const to = order.email;
  if (!to) return false;

  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Ihre Zahlung ist eingegangen!</h2>
    <p style="margin:0 0 16px;">
      Vielen Dank! Wir haben Ihre Überweisung für die Bestellung
      <strong style="font-family:monospace;">${esc(order.id)}</strong> erhalten
      und Ihre Bestellung ist jetzt <strong>in Bearbeitung</strong>.
    </p>
    <p style="margin:0 0 16px;">
      Gesamtbetrag: <strong>${formatCurrency(order.total)}</strong>
    </p>
    <p style="margin:0 0 20px;font-size:13px;color:${BRAND.muted};">
      Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wurde.
      Den aktuellen Status finden Sie jederzeit online.
    </p>
    ${ctaButton(`${PUBLIC_URL}/order/track/${esc(order.id)}`, "Bestellung verfolgen")}
  `);

  return sendEmail({
    to,
    subject: `Zahlungseingang für Bestellung ${order.id} — Ihre Bestellung ist in Bearbeitung`,
    html,
  });
}

/**
 * Order shipped notification — sent to the customer when the admin marks the
 * order as "shipped" (Versandt).
 */
export async function sendOrderShippedEmail(order: Order): Promise<boolean> {
  const to = order.email;
  if (!to) return false;

  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Ihre Bestellung ist auf dem Weg! 🚚</h2>
    <p style="margin:0 0 16px;">
      Ihre Bestellung <strong style="font-family:monospace;">${esc(order.id)}</strong> wurde
      soeben versendet und ist nun <strong>unterwegs zu Ihnen</strong>.
    </p>

    ${itemsTableHtml(order)}

    <p style="margin:0 0 16px;font-size:13px;color:${BRAND.muted};">
      Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung zugestellt wurde.
    </p>

    <p style="margin:0 0 20px;font-size:13px;color:${BRAND.muted};">
      Den Status Ihrer Bestellung können Sie jederzeit online verfolgen.
    </p>
    ${ctaButton(`${PUBLIC_URL}/order/track/${esc(order.id)}`, "Bestellung verfolgen")}
  `);

  return sendEmail({
    to,
    subject: `Ihre Bestellung ${order.id} bei MYICON — ist unterwegs!`,
    html,
  });
}

/**
 * Order delivered notification — sent to the customer when the admin marks the
 * order as "delivered" (Geliefert).
 */
export async function sendOrderDeliveredEmail(order: Order): Promise<boolean> {
  const to = order.email;
  if (!to) return false;

  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Ihre Bestellung wurde zugestellt! ✅</h2>
    <p style="margin:0 0 16px;">
      Ihre Bestellung <strong style="font-family:monospace;">${esc(order.id)}</strong> wurde
      erfolgreich zugestellt. Wir hoffen, Ihnen hat das Produkt gefallen!
    </p>

    ${itemsTableHtml(order)}

    <p style="margin:0 0 16px;font-size:13px;color:${BRAND.muted};">
      Bei Fragen oder Problemen stehen wir Ihnen gerne zur Verfügung.
    </p>
    ${ctaButton(`${PUBLIC_URL}/order/track/${esc(order.id)}`, "Bestellung ansehen")}
  `);

  return sendEmail({
    to,
    subject: `Ihre Bestellung ${order.id} bei MYICON — zugestellt`,
    html,
  });
}

/**
 * Contact form — sent to the shop owner's inbox (VITE_EMAIL_COPY_TO) when a
 * customer submits the contact form.
 */
export async function sendContactMessageEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  if (!COPY_TO) return false;

  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Neue Kontaktanfrage 📬</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-size:13px;">
      <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Name</td><td style="padding:2px 0;">${esc(name)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">E-Mail</td><td style="padding:2px 0;">${esc(email)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Betreff</td><td style="padding:2px 0;">${esc(subject)}</td></tr>
    </table>
    <div style="background:${BRAND.blueSoft};border:1px solid ${BRAND.blueLine};border-radius:8px;padding:16px 18px;">
      <p style="margin:0 0 8px;font-weight:bold;color:${BRAND.blue};">Nachricht:</p>
      <p style="margin:0;white-space:pre-wrap;">${esc(message)}</p>
    </div>
    <p style="margin:16px 0 0;font-size:13px;color:${BRAND.muted};">
      Antworten Sie direkt auf diese E-Mail, um zu antworten.
    </p>
  `);

  return sendEmail({
    to: COPY_TO,
    subject: `Kontaktanfrage: ${esc(subject).slice(0, 60)}`,
    html,
  });
}

/**
 * Registration confirmation — sent to the customer after they create an
 * account, so they know the registration was successful.
 */
export async function sendRegistrationEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<boolean> {
  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Willkommen bei MYiCON! 🎉</h2>
    <p style="margin:0 0 16px;">
      Hallo ${esc(name)},<br/>
      Ihre Registrierung war erfolgreich. Ihr Konto ist jetzt bereit —
      Sie können Designs erstellen, Bestellungen verfolgen und vieles mehr.
    </p>
    ${ctaButton(`${PUBLIC_URL}/account`, "Zum Konto")}
    <p style="margin:16px 0 0;font-size:13px;color:${BRAND.muted};">
      Falls Sie Fragen haben, helfen wir Ihnen gerne weiter.
    </p>
  `);

  return sendEmail({
    to: email,
    subject: "Willkommen bei MYiCON — Registrierung erfolgreich",
    html,
  });
}

/**
 * Admin "new order" notification — sent to the shop owner's inbox
 * (VITE_EMAIL_COPY_TO) for EVERY order. Lists the ordered products with their
 * images, the total and the customer's data so the admin can start fulfilling.
 */
export async function sendNewOrderAdminEmail(order: Order): Promise<boolean> {
  if (!COPY_TO) return false;
  const methodLabel =
    order.paymentMethod === "bank_transfer" ? "Überweisung (Vorkasse)" : "PayPal";
  const a = order.address;

  const html = shell(`
    <h2 style="margin:0 0 12px;font-size:18px;">Neue Bestellung ${esc(order.id)}</h2>
    <p style="margin:0 0 16px;">
      Zahlungsart: <strong>${methodLabel}</strong>
      ${
        order.paymentMethod === "bank_transfer"
          ? `&nbsp;&middot;&nbsp; Status: <strong>wartet auf Zahlung</strong>`
          : `&nbsp;&middot;&nbsp; Status: <strong>bezahlt</strong>`
      }
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-size:13px;">
      <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Kunde</td><td style="padding:2px 0;">${esc(a.fullName)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">E-Mail</td><td style="padding:2px 0;">${esc(order.email)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Adresse</td><td style="padding:2px 0;">${esc(a.street)}, ${esc(a.zip)} ${esc(a.city)}, ${esc(a.country)}</td></tr>
      ${a.phone ? `<tr><td style="padding:2px 12px 2px 0;color:#5a6675;">Telefon</td><td style="padding:2px 0;">${esc(a.phone)}</td></tr>` : ""}
    </table>

    ${itemsTableHtml(order)}
  `);

  return sendEmail({
    to: COPY_TO,
    subject: `Neue Bestellung ${order.id} — ${methodLabel}`,
    html,
  });
}
