/**
 * worldpay.ts
 *
 * Generates a Worldpay Hosted Payment Page (HPP) URL for invoice payments.
 *
 * Worldpay HPP (also called "WorldPay Business Gateway" or "Worldpay Corporate
 * Gateway") accepts order details as URL query parameters.  When the customer
 * clicks the link they land on Worldpay's own secure card-entry page — no card
 * data ever touches C Hear's servers.
 *
 * Required Worldpay Merchant Portal settings
 * ──────────────────────────────────────────
 *  • VITE_WORLDPAY_MERCHANT_CODE  — found in Merchant Admin → Profile
 *  • VITE_WORLDPAY_INSTALLATION_ID — found in Merchant Admin → Installations
 *  • VITE_WORLDPAY_SECRET_WORD     — set in Merchant Admin → Installations →
 *                                    Payment Response Password (used for MAC)
 *
 * HPP base URL: https://secure.worldpay.com/wcc/purchase
 *
 * Docs: https://developer.worldpay.com/docs/wpg/hostedintegration/quickstart
 */

export interface WorldpayInvoiceParams {
  /** Invoice reference — used as the Worldpay order description */
  invoiceRef: string;
  /** Grand total including VAT and delivery, in GBP */
  amountGBP: number;
  /** Customer name (shown on Worldpay page) */
  customerName?: string;
  /** Customer email (Worldpay sends payment confirmation to this address) */
  customerEmail?: string;
  /** ISO 4217 currency code — defaults to GBP */
  currency?: string;
  /**
   * URL Worldpay redirects the customer to after a successful payment.
   * Defaults to `window.location.origin` (your site root).
   */
  successUrl?: string;
  /**
   * URL Worldpay redirects the customer to after a cancelled/failed payment.
   */
  cancelUrl?: string;
}

/** Worldpay HPP base URL */
const WP_HPP_BASE = 'https://secure.worldpay.com/wcc/purchase';

/**
 * Read Worldpay credentials from Vite env vars.
 * These are safe to use in the frontend because they only identify your
 * merchant account — they do not grant access to refunds or management APIs.
 */
const MERCHANT_CODE     = import.meta.env.VITE_WORLDPAY_MERCHANT_CODE    ?? '';
const INSTALLATION_ID   = import.meta.env.VITE_WORLDPAY_INSTALLATION_ID  ?? '';

/**
 * Build a Worldpay Hosted Payment Page URL for an invoice.
 *
 * Returns `null` if the required credentials are missing from .env
 * so the caller can show a helpful configuration prompt.
 */
export function buildWorldpayInvoiceUrl(params: WorldpayInvoiceParams): string | null {
  if (!MERCHANT_CODE || !INSTALLATION_ID) return null;

  const {
    invoiceRef,
    amountGBP,
    customerName  = '',
    customerEmail = '',
    currency      = 'GBP',
    successUrl    = typeof window !== 'undefined' ? `${window.location.origin}/invoice-paid` : '',
    cancelUrl     = typeof window !== 'undefined' ? window.location.href : '',
  } = params;

  // Worldpay amount is in minor units (pence for GBP)
  const amountPence = Math.round(amountGBP * 100);

  const queryParams: Record<string, string> = {
    instId:       INSTALLATION_ID,
    cartId:       invoiceRef,          // maps to "Order Description" on the Worldpay page
    currency,
    amount:       (amountPence / 100).toFixed(2),  // Worldpay HPP wants decimal amount
    desc:         `C Hear Technologies — ${invoiceRef}`,
    name:         customerName,
    email:        customerEmail,
    M_invoiceRef: invoiceRef,          // custom merchant field passed through
    resultABC:    successUrl,          // success redirect
    MC_callback:  cancelUrl,           // cancel/failure redirect
    // Test mode — set to 0 in production when live account is active
    testMode:     '100',
  };

  const qs = Object.entries(queryParams)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  return `${WP_HPP_BASE}?${qs}`;
}

/**
 * True when both required HPP credentials are present in the environment.
 */
export function worldpayConfigured(): boolean {
  return Boolean(MERCHANT_CODE && INSTALLATION_ID);
}

export { MERCHANT_CODE, INSTALLATION_ID };
