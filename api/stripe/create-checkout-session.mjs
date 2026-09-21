import { randomUUID } from 'node:crypto';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json').send(body);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return json(res, 503, { error: 'Stripe Checkout is not configured.' });
  }

  const { amount, currency, customerEmail, orderId } = req.body || {};
  if (
    typeof amount !== 'number' ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    currency !== 'GBP' ||
    typeof customerEmail !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
  ) {
    return json(res, 400, { error: 'Invalid payment request.' });
  }

  const reference =
    typeof orderId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(orderId)
      ? orderId
      : `CHE-${randomUUID()}`;
  const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  const params = new URLSearchParams({
    mode: 'payment',
    'payment_method_types[0]': 'card',
    'payment_method_options[card][request_three_d_secure]': 'automatic',
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/payment/failed`,
    customer_email: customerEmail,
    'line_items[0][price_data][currency]': 'gbp',
    'line_items[0][price_data][product_data][name]': `C-Hear order ${reference}`,
    'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
    'line_items[0][quantity]': '1',
    'metadata[order_id]': reference,
  });

  const upstream = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await upstream.json();
  if (!upstream.ok || typeof data.url !== 'string') {
    console.error('Stripe Checkout session creation failed', upstream.status, data.error?.type);
    return json(res, 502, { error: 'Stripe could not create a checkout session.' });
  }

  return json(res, 200, { url: data.url, orderId: reference });
}
