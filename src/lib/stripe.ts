const stripeEnabled = import.meta.env.VITE_STRIPE_ENABLED === 'true';

export const stripeStatus = { enabled: stripeEnabled };

export const startStripeCheckout = async (order: {
  amount: number;
  currency: string;
  customerEmail: string;
  orderId?: string;
}) => {
  if (!stripeStatus.enabled) {
    throw new Error('Stripe Checkout is not configured for this deployment.');
  }

  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...order,
      orderId: order.orderId || `CHE-${Date.now()}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Stripe Checkout could not be started (${response.status}).`);
  }

  const result: unknown = await response.json();
  if (
    typeof result !== 'object' ||
    result === null ||
    !('url' in result) ||
    typeof result.url !== 'string' ||
    !result.url.startsWith('https://')
  ) {
    throw new Error('Stripe returned an invalid Checkout URL.');
  }

  window.location.assign(result.url);
};
