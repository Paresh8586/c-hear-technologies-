/**
 * C-Hear Pricing Engine
 *
 * Rules:
 *  - Supplier CSV contains COST prices ex-VAT.
 *  - Sell price = cost × (1 + MARGIN_RATE)   → 10% net profit target
 *  - VAT is applied on top of sell price for UK (20%), zero-rated for EU/US/Other
 *  - Delivery charge is weight-based (Royal Mail / courier tiers)
 */

export const MARGIN_RATE = 0.10; // 10% net profit on cost

export const VAT_RATES: Record<string, number> = {
  GB: 0.20,
  EU: 0,
  US: 0,
  OTHER: 0,
};

/** Apply margin to cost price → sell price ex-VAT */
export function applyMargin(costExVat: number): number {
  return costExVat * (1 + MARGIN_RATE);
}

/** Calculate VAT amount on the sell price */
export function calcVat(sellExVat: number, country: string): number {
  return sellExVat * (VAT_RATES[country] ?? 0);
}

// ---------------------------------------------------------------------------
// Weight-based delivery tiers (GBP, based on UK Royal Mail / DPD tiers)
// ---------------------------------------------------------------------------
export interface DeliveryTier {
  maxKg: number;
  label: string;
  price: number; // GBP ex-VAT
}

export const DELIVERY_TIERS: DeliveryTier[] = [
  { maxKg: 0.1,  label: 'Letter / Small Packet',   price: 2.50  },
  { maxKg: 0.5,  label: 'Standard Packet',          price: 4.50  },
  { maxKg: 1.0,  label: 'Small Parcel (up to 1kg)', price: 6.95  },
  { maxKg: 2.0,  label: 'Medium Parcel (up to 2kg)',price: 9.95  },
  { maxKg: 5.0,  label: 'Large Parcel (up to 5kg)', price: 14.95 },
  { maxKg: 10.0, label: 'Heavy Parcel (up to 10kg)',price: 19.95 },
  { maxKg: 20.0, label: 'Freight (up to 20kg)',     price: 29.95 },
  { maxKg: Infinity, label: 'Heavy Freight (20kg+)',price: 49.95 },
];

/** Return the delivery tier for a given total order weight in kg */
export function getDeliveryTier(totalWeightKg: number): DeliveryTier {
  return DELIVERY_TIERS.find(t => totalWeightKg <= t.maxKg) ?? DELIVERY_TIERS[DELIVERY_TIERS.length - 1];
}

/** Default weight to use per product when weight_kg is not set */
export const DEFAULT_WEIGHT_KG = 1.0;
