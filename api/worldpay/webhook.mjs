import { createHmac, timingSafeEqual } from 'node:crypto';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json').send(body);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const secret = process.env.WORLDPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-worldpay-webhook-signature'];
  if (!secret || typeof signature !== 'string') {
    return json(res, 503, { error: 'Worldpay webhook verification is not configured.' });
  }

  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const valid = signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) {
    return json(res, 401, { error: 'Invalid webhook signature.' });
  }

  const event = typeof req.body === 'object' ? req.body : JSON.parse(rawBody);
  console.info('Verified Worldpay webhook received', {
    eventType: event?.type,
    orderId: event?.merchantReference,
  });

  return json(res, 202, { received: true });
}
