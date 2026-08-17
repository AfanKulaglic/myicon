/**
 * Bank account details shown to customers who choose "Vorkasse / Überweisung".
 * These are the REAL business details provided by the shop owner.
 */
export const BANK_ACCOUNT = {
  /** Account holder shown to the customer */
  holder: "Ivan Muzeka",
  /** German IBAN */
  iban: "DE85 3707 0024 0319 8488 00",
  /** BIC */
  bic: "DEUTDEDBKOE",
  /** Bank name */
  bankName: "Deutsche Bank",
  /** Days the customer has to transfer the money before the order is cancelled */
  paymentDeadlineDays: 7,
} as const;

/**
 * Unique proforma invoice number (Rechnungsnummer) for an order.
 *
 * Derived from the order id (`ord_xxxxxxxx` — already unique) and prefixed
 * with the year, so every order gets its own number without needing a shared
 * counter:  RE-2026-3F9A2C1B
 *
 * The customer receives this number with the order confirmation, and it is
 * exactly the reference (Verwendungszweck) they enter for the transfer — the
 * admin can then match the incoming payment to the right order.
 */
export function invoiceNumber(orderId: string, ts: number | Date = Date.now()): string {
  const year = new Date(ts).getFullYear();
  const suffix = orderId.replace(/^ord_/i, "").toUpperCase();
  return `RE-${year}-${suffix}`;
}

/**
 * The payment reference (Verwendungszweck) the customer must include with the
 * transfer. It IS the proforma invoice number — one unique reference per order.
 */
export function paymentReference(orderId: string, ts?: number | Date): string {
  return invoiceNumber(orderId, ts);
}
