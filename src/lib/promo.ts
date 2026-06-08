import type { CartItem, PromoCode, AppliedPromo } from "@/types";

/**
 * Compute the discount amount (in €) a promo code grants for the given cart items.
 *
 * - "all" scope discounts the whole subtotal.
 * - "specific" scope discounts only the line items whose productId is in productIds.
 * - "percentage" applies value% to the eligible amount.
 * - "fixed" subtracts value€, capped at the eligible amount (never negative).
 */
export function computeDiscount(promo: PromoCode | AppliedPromo, items: CartItem[]): number {
  const eligible =
    promo.appliesTo === "all"
      ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      : items
          .filter((i) => promo.productIds.includes(i.productId))
          .reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (eligible <= 0) return 0;

  const raw =
    promo.discountType === "percentage"
      ? eligible * (promo.discountValue / 100)
      : promo.discountValue;

  // Never discount more than the eligible amount, round to cents.
  return Math.round(Math.min(raw, eligible) * 100) / 100;
}

export type PromoValidationError =
  | "not_found"
  | "inactive"
  | "min_order"
  | "no_eligible_items";

export interface PromoValidationResult {
  ok: boolean;
  error?: PromoValidationError;
  discountAmount?: number;
  applied?: AppliedPromo;
}

/**
 * Validate a fetched promo against the current cart and build the AppliedPromo snapshot.
 */
export function validatePromo(
  promo: PromoCode | null,
  items: CartItem[],
  subtotal: number
): PromoValidationResult {
  if (!promo) return { ok: false, error: "not_found" };
  if (!promo.active) return { ok: false, error: "inactive" };
  if (promo.minOrderValue && subtotal < promo.minOrderValue) {
    return { ok: false, error: "min_order" };
  }

  const discountAmount = computeDiscount(promo, items);
  if (discountAmount <= 0) return { ok: false, error: "no_eligible_items" };

  const applied: AppliedPromo = {
    code: promo.code.trim().toUpperCase(),
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    appliesTo: promo.appliesTo,
    productIds: promo.productIds ?? [],
    discountAmount,
  };

  return { ok: true, discountAmount, applied };
}

/** Human-readable German error message for a validation error. */
export function promoErrorMessage(error: PromoValidationError, minOrderValue?: number): string {
  switch (error) {
    case "not_found":
      return "Dieser Code ist ungültig.";
    case "inactive":
      return "Dieser Code ist nicht mehr aktiv.";
    case "min_order":
      return `Mindestbestellwert von ${minOrderValue?.toFixed(2)} € nicht erreicht.`;
    case "no_eligible_items":
      return "Dieser Code gilt für keine Artikel in Ihrem Warenkorb.";
    default:
      return "Code konnte nicht angewendet werden.";
  }
}
