/**
 * Vercel serverless function that creates a PayPal order (Orders v2 API).
 *
 * The PayPal credentials live server-side only (`PAYPAL_CLIENT_ID` +
 * `PAYPAL_CLIENT_SECRET`) — they are never shipped to the browser. The client
 * posts the order total + return/cancel URLs here, and this function talks to
 * api-m.paypal.com, returning the PayPal order id and the approval link the
 * customer is redirected to.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   PAYPAL_CLIENT_ID     — PayPal REST app client id
 *   PAYPAL_CLIENT_SECRET — PayPal REST app secret
 *   PAYPAL_ENV           — optional; set to "sandbox" to use the sandbox API
 */

const BASE =
  process.env.PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET not configured");
  }
  const r = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await r.json();
  if (!r.ok) {
    throw new Error(`PayPal auth failed (${r.status}): ${JSON.stringify(data)}`);
  }
  return data.access_token as string;
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

  const { amount, returnUrl, cancelUrl } = req.body ?? {};
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0 || value > 100000) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }
  if (
    typeof returnUrl !== "string" ||
    typeof cancelUrl !== "string" ||
    !/^https?:\/\//.test(returnUrl) ||
    !/^https?:\/\//.test(cancelUrl)
  ) {
    res.status(400).json({ error: "Invalid return/cancel URL" });
    return;
  }

  try {
    const token = await getAccessToken();
    const r = await fetch(`${BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: value.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "MYICON",
          user_action: "PAY_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data });
      return;
    }
    const approval =
      (data.links ?? []).find((l: { rel: string }) => l.rel === "approve")?.href ??
      null;
    res.status(200).json({ id: data.id, status: data.status, approvalUrl: approval });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
