/**
 * WorldpayPayment
 *
 * Integrates the Worldpay Access Checkout (SDK v2) hosted card fields.
 * The SDK is loaded dynamically from Worldpay's CDN so no npm package is needed.
 *
 * Flow:
 *  1. Component mounts → loads SDK script from CDN
 *  2. SDK initialises 3 hosted iframes (card number, expiry, CVV) into the
 *     placeholder divs using the merchant's CLIENT_KEY
 *  3. On "Pay Now" → calls worldpay.generateSessionId() to tokenise the card
 *  4. Returns the session token to the parent via onSuccess(sessionId, amount)
 *     → parent sends it server-side to create a Worldpay payment order
 *
 * IMPORTANT: The CLIENT_KEY is a public-facing key (safe in frontend code).
 * The SERVICE_KEY / secret must NEVER appear in browser code.
 *
 * Docs: https://developer.worldpay.com/docs/access-worldpay/checkout
 */
import React, { useEffect, useRef, useState } from 'react';
import { Lock, CreditCard, ShieldCheck } from 'lucide-react';

const WP_SDK_URL = 'https://access.worldpay.com/access-checkout/v2/checkout.js';
const CLIENT_KEY = import.meta.env.VITE_WORLDPAY_CLIENT_KEY ?? '';

interface WorldpayPaymentProps {
  amountGBP: number;          // grand total in GBP (pence conversion handled internally)
  onSuccess: (sessionId: string, amountPence: number) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    // Worldpay Access Checkout global injected by the SDK script
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Worldpay?: any;
  }
}

const WorldpayPayment: React.FC<WorldpayPaymentProps> = ({ amountGBP, onSuccess, onCancel }) => {
  const [sdkReady, setSdkReady]   = useState(false);
  const [sdkError, setSdkError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [cardError, setCardError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkoutRef = useRef<any>(null);
  const mountedRef  = useRef(true);

  const amountPence = Math.round(amountGBP * 100);

  // ── Load & initialise Worldpay SDK ──────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    if (!CLIENT_KEY) {
      setSdkError('Worldpay client key not configured. Add VITE_WORLDPAY_CLIENT_KEY to your .env file.');
      return;
    }

    // Avoid double-loading if script already present
    const existing = document.getElementById('worldpay-sdk');
    const initSdk = () => {
      if (!mountedRef.current) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AccessCheckout = (window as any).Worldpay?.AccessCheckout;
        if (!AccessCheckout) { setSdkError('Worldpay SDK failed to initialise.'); return; }

        const checkout = new AccessCheckout({
          accessBaseUrl: 'https://access.worldpay.com',
          merchantId: CLIENT_KEY,
        });

        checkout.generateSessions(
          {
            pan:       '#card-pan',
            expiry:    '#card-expiry',
            cvv:       '#card-cvv',
          },
          {
            onSessionGenerated: (sessionId: string) => {
              if (mountedRef.current) onSuccess(sessionId, amountPence);
            },
            onError: (err: { message?: string }) => {
              if (mountedRef.current) {
                setCardError(err?.message ?? 'Card validation failed. Please check your details.');
                setLoading(false);
              }
            },
          }
        );

        checkoutRef.current = checkout;
        if (mountedRef.current) setSdkReady(true);
      } catch (err) {
        if (mountedRef.current) setSdkError('Could not initialise payment form. Please refresh and try again.');
      }
    };

    if (existing) {
      initSdk();
    } else {
      const script = document.createElement('script');
      script.id = 'worldpay-sdk';
      script.src = WP_SDK_URL;
      script.onload = initSdk;
      script.onerror = () => {
        if (mountedRef.current) setSdkError('Could not load payment SDK. Check your network connection.');
      };
      document.head.appendChild(script);
    }

    return () => { mountedRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePay = () => {
    if (!checkoutRef.current) return;
    setCardError('');
    setLoading(true);
    // generateSessions triggers onSessionGenerated or onError callbacks above
    checkoutRef.current.generateSessions();
  };

  // ── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-card border border-border rounded p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-brand-red-soft p-2 rounded">
          <CreditCard size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-extrabold text-base">Secure Card Payment</h3>
          <p className="text-xs text-muted-foreground">Powered by Worldpay</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-700 font-semibold">
          <Lock size={12} /> SSL Secured
        </div>
      </div>

      {/* Amount */}
      <div className="bg-muted/40 border border-border rounded px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-muted-foreground">Amount to pay</span>
        <span className="text-xl font-extrabold text-primary">£{amountGBP.toFixed(2)}</span>
      </div>

      {/* SDK error state */}
      {sdkError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded">
          <p className="font-bold mb-1">Payment form unavailable</p>
          <p>{sdkError}</p>
          {!CLIENT_KEY && (
            <p className="mt-2 text-xs font-mono bg-red-100 px-2 py-1 rounded">
              Add <code>VITE_WORLDPAY_CLIENT_KEY=your_client_key</code> to .env
            </p>
          )}
        </div>
      )}

      {/* Hosted card fields */}
      {!sdkError && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1 block">
              Card Number
            </label>
            {/* Worldpay injects an iframe into this div */}
            <div
              id="card-pan"
              className="border border-border rounded px-3 py-2.5 bg-background min-h-[40px] text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1 block">
                Expiry Date
              </label>
              <div
                id="card-expiry"
                className="border border-border rounded px-3 py-2.5 bg-background min-h-[40px] text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1 block">
                CVV / CVC
              </label>
              <div
                id="card-cvv"
                className="border border-border rounded px-3 py-2.5 bg-background min-h-[40px] text-sm"
              />
            </div>
          </div>

          {cardError && (
            <p className="text-sm text-red-600 font-semibold">{cardError}</p>
          )}

          {/* Loading skeleton while SDK wires up iframes */}
          {!sdkReady && !sdkError && (
            <p className="text-xs text-muted-foreground animate-pulse">Initialising secure payment form…</p>
          )}
        </div>
      )}

      {/* Trust badges */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-600" /> PCI-DSS Compliant</span>
        <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-600" /> 3D Secure</span>
        <span className="flex items-center gap-1"><Lock size={12} /> 256-bit TLS</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={handlePay}
          disabled={!sdkReady || loading || !!sdkError}
          className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">Processing…</span>
          ) : (
            <><Lock size={14} /> Pay £{amountGBP.toFixed(2)} Now</>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none border border-border text-muted-foreground font-semibold py-3 px-5 rounded hover:border-foreground hover:text-foreground transition-colors text-sm"
        >
          ← Back
        </button>
      </div>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Your card details are entered directly into Worldpay's secure hosted fields.
        C Hear Technologies never sees or stores your card number.
      </p>
    </div>
  );
};

export default WorldpayPayment;
