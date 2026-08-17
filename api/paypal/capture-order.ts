/**
 * Vercel serverless function that captures an approved PayPal order
 * (Orders v2 API). Called with the PayPal order id after the customer has
 * approved the payment on paypal.com. On success the money is captured and
 * the function returns the capture id, amount and payer email — the client
 * then creates the shop order in Firebase.
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

  const { orderId } = req.body ?? {};
  if (typeof orderId !== "string" || orderId.length === 0) {
    res.status(400).json({ error: "Missing orderId" });
    return;
  }

  try {
    const token = await getAccessToken();
    const r = await fetch(
      `${BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data });
      return;
    }
    const capture =
      data.purchase_units?.[0]?.payments?.captures?.[0] ?? null;
    res.status(200).json({
      status: data.status ?? "UNKNOWN",
      captureId: capture?.id ?? null,
      amount: capture?.amount?.value ?? null,
      currency: capture?.amount?.currency_code ?? null,
      payerEmail: data.payer?.email_address ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
