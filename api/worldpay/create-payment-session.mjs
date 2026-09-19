import { randomUUID } from 'node:crypto';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json').send(body);
};

const requiredEnv = ['WORLDPAY_HPP_ENDPOINT', 'WORLDPAY_USERNAME', 'WORLDPAY_PASSWORD'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const missing = requiredEnv.filter(name => !process.env[name]);
  if (missing.length > 0) {
    return json(res, 503, {
      error: 'Worldpay Hosted Payments is not configured.',
      missing,
    });
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

  const merchantReference =
    typeof orderId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(orderId)
      ? orderId
      : `CHE-${randomUUID()}`;
  const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  const auth = Buffer.from(
    `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`,
  ).toString('base64');

  let upstream;
  try {
    upstream = await fetch(process.env.WORLDPAY_HPP_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/vnd.worldpay.payment_pages-v1.hal+json',
        Accept: 'application/vnd.worldpay.payment_pages-v1.hal+json',
      },
      body: JSON.stringify({
        transactionAmount: {
          value: Math.round(amount * 100),
          currency,
        },
        merchantReference,
        customer: { email: customerEmail },
        redirectUrls: {
          successUrl: `${origin}/payment/success?orderId=${encodeURIComponent(merchantReference)}`,
          failureUrl: `${origin}/payment/failed?orderId=${encodeURIComponent(merchantReference)}`,
        },
        installationId: process.env.WORLDPAY_INSTALLATION_ID || undefined,
      }),
    });
  } catch (error) {
    console.error('Worldpay HPP request failed', error);
    return json(res, 502, { error: 'Worldpay could not be reached.' });
  }

  if (!upstream.ok) {
    console.error('Worldpay HPP session creation failed', upstream.status);
    return json(res, 502, { error: 'Worldpay could not create a payment session.' });
  }

  const data = await upstream.json();
  const redirectUrl = data?._links?.payment_page?.href;
  if (typeof redirectUrl !== 'string' || !redirectUrl.startsWith('https://')) {
    console.error('Worldpay HPP response did not contain a valid payment page URL');
    return json(res, 502, { error: 'Worldpay returned an invalid payment session.' });
  }

  return json(res, 200, { redirectUrl, orderId: merchantReference });
}
