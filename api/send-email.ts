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

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    // Preflight for cross-origin calls (Vercel functions respond same-origin,
    // but keep this for safety with custom domains).
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { from, to, subject, html, text, bcc } = body ?? {};
  if (!to || !subject || !html) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: to, subject, html" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
