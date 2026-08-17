/**
 * Vercel serverless function — page view tracking for the admin analytics.
 *
 * The client sends a page view (path, session id, referrer) and this function
 * records it in Firebase under `pageViews/` together with the visitor's
 * country (Vercel `x-vercel-ip-country` header) and device type (User-Agent),
 * so the shop owner can see who visited, from where, and how long they stayed.
 *
 * Bots & crawlers (search engines, AI crawlers, link previews, security
 * scanners) are detected by their User-Agent and SKIPPED — otherwise the
 * analytics fill up with automated visits from random countries that no real
 * customer ever made.
 *
 * Payload (POST /api/track):
 *   { path: string, sessionId: string, ref?: string }
 */

const DB_URL =
  process.env.VITE_FIREBASE_DATABASE_URL ||
  "https://wlab-40444-default-rtdb.firebaseio.com";

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const u = ua.toLowerCase();
  if (/(ipad|tablet)/.test(u)) return "tablet";
  if (/(iphone|ipod|android|mobile)/.test(u)) return "mobile";
  return "desktop";
}

/**
 * Case-insensitive substrings that mark a User-Agent as a bot / crawler /
 * scanner. Kept as a flat list so it is easy to extend.
 */
const BOT_PATTERNS = [
  // search engines
  "googlebot",
  "bingbot",
  "duckduckbot",
  "baiduspider",
  "yandex",
  "sogou",
  "exabot",
  "archive.org_bot",
  "ia_archiver",
  // AI crawlers
  "gptbot",
  "chatgpt",
  "claudebot",
  "anthropic",
  "perplexitybot",
  "bytespider",
  "amazonbot",
  "applebot",
  "meta-externalagent",
  "ccbot",
  "diffbot",
  // social / link previews
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "telegrambot",
  "whatsapp",
  "viber",
  "skypeuripreview",
  "pinterest",
  "tumblr",
  "embed.ly",
  "iframely",
  // SEO / monitoring tools
  "ahrefsbot",
  "semrushbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "dataforseo",
  "serpstat",
  "screaming frog",
  "pingdom",
  "uptimerobot",
  "statuscake",
  "gtmetrix",
  "newrelic",
  "datadog",
  // generic scanners / scripts
  "wget",
  "curl",
  "python-requests",
  "python-urllib",
  "go-http-client",
  "headlesschrome",
  "phantomjs",
  "puppeteer",
  "playwright",
  "selenium",
  "masscan",
  "zgrab",
  "censys",
  "internetmeasurement",
  "nmap",
  "nikto",
  "fuzz",
  "scrapy",
  "okhttp",
  "axios",
  "insomnia",
  "postmanruntime",
  // generic bot tokens
  "bot",
  "crawler",
  "spider",
  "scanner",
];

function isBot(ua: string): boolean {
  if (!ua || ua.trim().length < 10) return true; // empty/short UA = script
  const u = ua.toLowerCase();
  return BOT_PATTERNS.some((p) => u.includes(p));
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

  const ua = String(req.headers["user-agent"] ?? "");
  // Bots get a 200 with ok:true too — no reason to advertise that we filter.
  if (isBot(ua)) {
    res.status(200).json({ ok: true, skipped: "bot" });
    return;
  }

  const body = req.body ?? {};
  const path = typeof body.path === "string" ? body.path.slice(0, 300) : "";
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : "";
  const ref = typeof body.ref === "string" ? body.ref.slice(0, 300) : "";

  const entry = {
    ts: Date.now(),
    path: path || "/",
    sessionId: sessionId || "",
    ref: ref || "",
    country: String(req.headers["x-vercel-ip-country"] ?? ""),
    device: detectDevice(ua),
  };

  try {
    await fetch(`${DB_URL}/pageViews.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
