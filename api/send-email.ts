/**
 * Vercel serverless function that relays transactional emails to Resend.
 *
 * The Resend API key lives server-side only (`RESEND_API_KEY`) — it is never
 * shipped to the browser. The client posts the already-rendered email payload
 * (to, subject, html, ...) to this endpoint, and this function forwards it to
 * api.resend.com. Doing it server-to-server also avoids Resend's CORS
 * restriction: direct browser calls to api.resend.com are blocked because the
 * API does not send Access-Control-Allow-Origin headers.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY      — the Resend API key (recommended name)
 *   VITE_RESEND_API_KEY — accepted as a fallback if RESEND_API_KEY is unset
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  // Vercel parses the JSON body automatically for Node.js functions.
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "RESEND_API_KEY not configured" });
    return;
  }

  const body = req.body ?? {};
  const { from, to, subject, html, text, bcc } = body;
  if (!to || !subject || !html) {
    res
      .status(400)
      .json({ error: "Missing required fields: to, subject, html" });
    return;
  }

  const payload: Record<string, unknown> = {
    from:
      typeof from === "string" && from.length > 0
        ? from
        : "MYICON <info@my-icon.shop>",
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (typeof text === "string" && text.length > 0) payload.text = text;
  if (bcc) payload.bcc = Array.isArray(bcc) ? bcc : [bcc];

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
