/**
 * Vercel serverless function — MYICON AI support chat.
 *
 * The Groq API key lives server-side only (`GROQ_API_KEY`). The client posts
 * the conversation so far, this function augments it with live data from
 * Firebase (product catalog, and the order the customer is asking about) and
 * relays it to Groq's OpenAI-compatible endpoint.
 *
 * Model fallback: three free-tier models are tried in order. If one returns a
 * rate-limit (429) or any error, the next model is used automatically, so the
 * chat keeps working even when the daily limit of one model is exhausted.
 *
 * Every conversation is logged to Firebase under `chatLogs/` with the
 * timestamp, country (Vercel header) and device type so the shop owner can
 * review questions and answers in the admin panel.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   GROQ_API_KEY  — Groq API key (free tier, https://console.groq.com)
 *   GROQ_MODEL    — optional, overrides the primary model
 *   VITE_FIREBASE_DATABASE_URL — optional, defaults to the shop's RTDB URL
 */

const GROQ_API_KEY =
  process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const DB_URL =
  process.env.VITE_FIREBASE_DATABASE_URL ||
  "https://wlab-40444-default-rtdb.firebaseio.com";

/** Fallback chain: primary + two reserves (all free on Groq's free tier). */
const MODEL_CHAIN = [
  GROQ_MODEL,
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b",
].filter((m, i, arr) => m && arr.indexOf(m) === i);

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

/** Guess device type from the User-Agent header. */
function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const u = ua.toLowerCase();
  if (/(ipad|tablet)/.test(u)) return "tablet";
  if (/(iphone|ipod|android|mobile)/.test(u)) return "mobile";
  return "desktop";
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

  const orderMatch = latestUserText.match(/ord_[A-Za-z0-9]+/i);
  const orderInfo = orderMatch ? await getOrder(orderMatch[0]) : null;

  return `Du bist der KI-Support von MYiCON (my-icon.shop), einem deutschen Online-Shop für bedruckte Textilien (T-Shirts, Polos, Hoodies, Caps, Schürzen) und Druckprodukte (Flyer, Broschüren, Visitenkarten, Plakate, Werbematerial). Kunden können Produkte online individualisieren (eigene Designs/Text hochladen) und per PayPal oder Banküberweisung (Vorkasse) bezahlen.

Wichtige Seiten des Shops (gib dem Kunden bei passenden Fragen immer den direkten Link dazu):
- Warenkorb: https://www.my-icon.shop/cart
- Kasse: https://www.my-icon.shop/checkout
- Bestellung verfolgen (Status & Bestellnummer): https://www.my-icon.shop/order/track
- Alle Produkte: https://www.my-icon.shop/categories
- Mein Konto: https://www.my-icon.shop/account
- Login: https://www.my-icon.shop/login
- Registrieren: https://www.my-icon.shop/register
- FAQ: https://www.my-icon.shop/help/faq
- Kontakt: https://www.my-icon.shop/contact
Wenn der Kunde z.B. fragt, wo er seine Bestellung findet oder seinen Warenkorb sehen kann, nenne den passenden Link (https://www.my-icon.shop/order/track bzw. /cart) direkt in der Antwort.

Regeln:
- Antworte IMMER auf Deutsch, freundlich, kurz und hilfreich (maximal ~120 Wörter pro Antwort, außer der Kunde bittet um mehr Details).
- Du kennst den kompletten Produktkatalog des Shops (siehe unten). Beantworte Fragen zu Produkten, Preisen, Farben, Größen, Lieferzeiten und Individualisierung anhand dieser Daten.
- Wenn du die Antwort nicht kennst oder unsicher bist, verweise freundlich auf die Kontaktseite (https://www.my-icon.shop/contact) oder die FAQ (https://www.my-icon.shop/help/faq).
- Bankdaten (IBAN/BIC) nennst du NIEMALS im Chat. Sage dem Kunden, dass er die Überweisungsdaten per E-Mail nach der Bestellung erhält.
- Bei Fragen zum Bestellstatus: bitte um die Bestellnummer (Format: ord_...). Wenn der Kunde eine Bestellnummer nennt, kannst du den Status direkt prüfen. Zum Verfolgen gib den Link https://www.my-icon.shop/order/track an.
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

/** Write a chat log entry to Firebase (best-effort, never blocks the reply). */
async function logChat({
  question,
  reply,
  model,
  country,
  device,
  userAgent,
}: {
  question: string;
  reply: string;
  model: string;
  country: string;
  device: string;
  userAgent: string;
}): Promise<void> {
  try {
    const entry = {
      ts: Date.now(),
      question: question.slice(0, 1000),
      reply: reply.slice(0, 4000),
      model,
      country: country || "",
      device,
      userAgent: userAgent.slice(0, 300),
    };
    await fetch(`${DB_URL}/chatLogs.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    /* logging must never break the chat */
  }
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

  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Request metadata for analytics
  const country = String(req.headers["x-vercel-ip-country"] ?? "");
  const device = detectDevice(String(req.headers["user-agent"] ?? ""));

  try {
    const system = await buildSystemPrompt(lastUser);
    const payload = {
      model: MODEL_CHAIN[0],
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.4,
      max_tokens: 600,
    };

    // Try each model in the fallback chain until one answers.
    let reply = "";
    let usedModel = "";
    let lastError: unknown = null;
    for (const model of MODEL_CHAIN) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...payload, model }),
        });
        if (!r.ok) {
          // 429 = rate limit (daily quota used up) → try the next model
          lastError = `model ${model} failed with ${r.status}`;
          continue;
        }
        const data = await r.json();
        reply = data?.choices?.[0]?.message?.content ?? "";
        usedModel = model;
        break;
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    if (!reply) {
      res.status(502).json({
        error: `All models unavailable: ${String(lastError)}`,
      });
      return;
    }

    // Fire-and-forget the log entry so the admin can review it later.
    void logChat({
      question: lastUser,
      reply,
      model: usedModel,
      country,
      device,
      userAgent: String(req.headers["user-agent"] ?? ""),
    });

    res.status(200).json({ reply, model: usedModel });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
