/**
 * Vercel serverless function — page view tracking for the admin analytics.
 *
 * The client sends a page view (path, session id, referrer) and this function
 * records it in Firebase under `pageViews/` together with the visitor's
 * country (Vercel `x-vercel-ip-country` header) and device type (User-Agent),
 * so the shop owner can see who visited, from where, and how long they stayed.
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
    device: detectDevice(String(req.headers["user-agent"] ?? "")),
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
