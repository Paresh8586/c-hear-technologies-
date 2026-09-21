import { createHmac, timingSafeEqual } from 'node:crypto';

export const config = { api: { bodyParser: false } };

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json').send(body);
};

const readRawBody = async (req) => {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];
  if (!secret || typeof signature !== 'string') {
    return json(res, 503, { error: 'Stripe webhook verification is not configured.' });
  }

  const rawBody = await readRawBody(req);
  const timestamp = signature.match(/(?:^|,)t=(\d+)/)?.[1];
  const signed = signature.match(/(?:^|,)v1=([a-f0-9]+)/)?.[1];
  if (!timestamp || !signed || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
    return json(res, 400, { error: 'Invalid Stripe webhook signature.' });
  }

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  if (signed.length !== expected.length ||
      !timingSafeEqual(Buffer.from(signed), Buffer.from(expected))) {
    return json(res, 401, { error: 'Invalid Stripe webhook signature.' });
  }

  const event = JSON.parse(rawBody);
  console.info('Verified Stripe webhook received', {
    type: event.type,
    orderId: event.data?.object?.metadata?.order_id,
  });
  return json(res, 202, { received: true });
}
