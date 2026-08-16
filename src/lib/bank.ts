/**
 * Bank account details shown to customers who choose "Vorkasse / Überweisung".
 *
 * NOTE: These are FAKE placeholder details for the prototype. Replace them
 * with the real business account before going live.
 */
export const BANK_ACCOUNT = {
  /** Account holder shown to the customer */
  holder: "MYICON GmbH",
  /** Fake German IBAN */
  iban: "DE12 3456 7890 1234 5678 90",
  /** Fake BIC */
  bic: "MYICDEFFXXX",
  /** Bank name */
  bankName: "Musterbank eG",
  /** Reference prefix used to match incoming payments to an order */
  referencePrefix: "MYICON-",
  /** Days the customer has to transfer the money before the order is cancelled */
  paymentDeadlineDays: 7,
} as const;

/**
 * The payment reference the customer must include with the transfer so the
 * admin can match the incoming payment to the right order.
 */
export function paymentReference(orderId: string): string {
  return `${BANK_ACCOUNT.referencePrefix}${orderId}`;
}
