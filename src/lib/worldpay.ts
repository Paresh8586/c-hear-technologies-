const worldpayEnabled = import.meta.env.VITE_WORLDPAY_ENABLED === 'true';
const checkoutEndpoint = (
  import.meta.env.VITE_WORLDPAY_CHECKOUT_ENDPOINT?.trim() ||
  '/api/worldpay/create-payment-session'
);

export const worldpayStatus = {
  enabled: worldpayEnabled && Boolean(checkoutEndpoint),
  configured: Boolean(checkoutEndpoint),
};

export const startWorldpayCheckout = async (order: {
  amount: number;
  currency: string;
  customerEmail: string;
  orderId?: string;
}) => {
  if (!worldpayStatus.enabled || !checkoutEndpoint) {
    throw new Error('Worldpay Hosted Payments is not configured for this deployment.');
  }

  const response = await fetch(checkoutEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...order,
      orderId: order.orderId || `CHE-${Date.now()}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Worldpay checkout session could not be created (${response.status}).`);
  }

  const result: unknown = await response.json();
  if (
    typeof result !== 'object' ||
    result === null ||
    !('redirectUrl' in result) ||
    typeof result.redirectUrl !== 'string' ||
    result.redirectUrl.length === 0
  ) {
    throw new Error('Worldpay returned an invalid checkout session.');
  }

  window.location.assign(result.redirectUrl);
};
