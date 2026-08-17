/**
 * Vercel serverless function — MYICON AI support chat.
 *
 * The Groq API key lives server-side only (`GROQ_API_KEY`). The client posts
 * the conversation so far, this function augments it with live data from
 * Firebase (product catalog, and the order the customer is asking about) and
 * relays it to Groq's OpenAI-compatible endpoint.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   GROQ_API_KEY  — Groq API key (free tier, https://console.groq.com)
 *   GROQ_MODEL    — optional, defaults to "openai/gpt-oss-120b"
 *   VITE_FIREBASE_DATABASE_URL — optional, defaults to the shop's RTDB URL
 */

const GROQ_API_KEY =
  process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const DB_URL =
  process.env.VITE_FIREBASE_DATABASE_URL ||
  "https://wlab-40444-default-rtdb.firebaseio.com";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Firebase ${res.status}`);
  }
  return res.json();
}

/** Compact product catalog for the AI — id, title, category, price, blurb. */
async function getCatalog(): Promise<string> {
  const val = (await fetchJson(
    `${DB_URL}/products.json`,
  )) as Record<string, Record<string, unknown>> | null;
  if (!val) return "";
  const lines = Object.entries(val).map(([id, p]) => {
    const title = typeof p.title === "string" ? p.title : id;
    const cat = typeof p.category === "string" ? p.category : "";
    const price =
      typeof p.priceFrom === "number"
        ? `${p.priceFrom.toFixed(2)} €`
        : "Preis auf Anfrage";
    const desc =
      typeof p.description === "string"
        ? p.description.slice(0, 220)
        : "";
    const colors = Array.isArray(p.colors)
      ? (p.colors as { name?: string }[])
          .map((c) => c.name)
          .filter(Boolean)
          .join(", ")
      : "";
    const sizes = Array.isArray(p.sizes) ? (p.sizes as string[]).join(", ") : "";
    return [
      `- ${id} | ${title} | Kategorie: ${cat} | ab ${price}`,
      desc ? `  Beschreibung: ${desc}` : "",
      colors ? `  Farben: ${colors}` : "",
      sizes ? `  Größen: ${sizes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });
  return lines.join("\n");
}

/** Fetch a single order by id (same public read as the tracking page). */
async function getOrder(orderId: string): Promise<string | null> {
  try {
    const o = (await fetchJson(`${DB_URL}/orders/${orderId}.json`)) as Record<
      string,
      unknown
    > | null;
    if (!o) return null;
    const statusMap: Record<string, string> = {
      awaiting_payment: "wartet auf Zahlung (Vorkasse)",
      pending: "eingegangen (bezahlt)",
      processing: "in Bearbeitung",
      shipped: "versendet",
      delivered: "zugeliefert",
      cancelled: "storniert",
    };
    const status =
      statusMap[String(o.status)] ?? String(o.status ?? "unbekannt");
    const total =
      typeof o.total === "number" ? `${o.total.toFixed(2)} €` : "?";
    const method =
      o.paymentMethod === "bank_transfer"
        ? "Banküberweisung (Vorkasse)"
        : "PayPal";
    const items = Array.isArray(o.items)
      ? (o.items as { title?: string; quantity?: number }[])
          .map((i) => `${i.quantity ?? 1}× ${i.title ?? "Artikel"}`)
          .join(", ")
      : "";
    return `Bestellung ${orderId}: Status "${status}", Zahlungsart ${method}, Gesamt ${total}. Artikel: ${items}`;
  } catch {
    return null;
  }
}

/** Build the system prompt with live catalog + any order context. */
async function buildSystemPrompt(latestUserText: string): Promise<string> {
  const catalog = await getCatalog();

  // If the customer mentions an order number, fetch it and give the AI
  // the live status so it can answer accurately.
  const orderMatch = latestUserText.match(/ord_[A-Za-z0-9]+/i);
  const orderInfo = orderMatch ? await getOrder(orderMatch[0]) : null;

  return `Du bist der KI-Support von MYiCON (my-icon.shop), einem deutschen Online-Shop für bedruckte Textilien (T-Shirts, Polos, Hoodies, Caps, Schürzen) und Druckprodukte (Flyer, Broschüren, Visitenkarten, Plakate, Werbematerial). Kunden können Produkte online individualisieren (eigene Designs/Text hochladen) und per PayPal oder Banküberweisung (Vorkasse) bezahlen.

Regeln:
- Antworte IMMER auf Deutsch, freundlich, kurz und hilfreich (maximal ~120 Wörter pro Antwort, außer der Kunde bittet um mehr Details).
- Du kennst den kompletten Produktkatalog des Shops (siehe unten). Beantworte Fragen zu Produkten, Preisen, Farben, Größen, Lieferzeiten und Individualisierung anhand dieser Daten.
- Wenn du die Antwort nicht kennst oder unsicher bist, verweise freundlich auf die Kontaktseite (/contact) oder die FAQ (/help/faq).
- Bankdaten (IBAN/BIC) nennst du NIEMALS im Chat. Sage dem Kunden, dass er die Überweisungsdaten per E-Mail nach der Bestellung erhält.
- Bei Fragen zum Bestellstatus: bitte um die Bestellnummer (Format: ord_...). Wenn der Kunde eine Bestellnummer nennt, kannst du den Status direkt prüfen.
- Du darfst KEINE persönlichen Daten anderer Kunden preisgeben. Bestellstatus nur für die vom Kunden selbst genannte Bestellnummer.
- Preise in Euro, inkl. MwSt. Versand ist kostenlos (Gratis).

${
  orderInfo
    ? `Aktuelle Anfrage des Kunden betrifft eine Bestellung:\n${orderInfo}\n\nNutze diesen Status, um dem Kunden zu antworten.`
    : ""
}

Aktueller Produktkatalog:
${catalog || "(Katalog derzeit nicht verfügbar)"}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!GROQ_API_KEY) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  const body = req.body ?? {};
  const messages = body.messages as ChatMessage[] | undefined;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Missing messages" });
    return;
  }

  // Only the last user message is used for context lookups (order number etc.)
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  try {
    const system = await buildSystemPrompt(lastUser);
    const payload = {
      model: GROQ_MODEL,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.4,
      max_tokens: 600,
    };

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data });
      return;
    }
    const text = data?.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
