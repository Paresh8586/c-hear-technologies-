# C-Hear Technologies Limited — Website Deployment Guide

> **Production site:** [www.c-hear.online](https://www.c-hear.online)
> **Tech stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase

## Stripe Checkout

The checkout uses a Vercel Function to create a Stripe Checkout session. Card details are entered on Stripe, not on this website. Stripe secret keys must never be prefixed with `VITE_`, committed to Git, or placed in the frontend bundle.

The Checkout session requests Stripe's automatic 3-D Secure policy. Stripe will use a frictionless 3DS2 flow when the issuer and transaction qualify; otherwise it can present a 3DS challenge. No gateway can guarantee frictionless authentication for every card or issuer.

Add these variables in Vercel project settings:

```env
VITE_STRIPE_ENABLED=true
STRIPE_SECRET_KEY=<Stripe secret key>
STRIPE_WEBHOOK_SECRET=<Stripe webhook signing secret>
```

The Vercel Functions are:

- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/webhook`

Register this webhook URL in Stripe:

```text
https://www.c-hear.online/api/stripe/webhook
```

Enable the relevant Checkout events in Stripe, especially `checkout.session.completed`. The webhook currently verifies Stripe's signature and acknowledges the event; connecting it to a Supabase `orders` table requires the final order schema and payment event handling to be confirmed.

For the Vercel deployment, set `VITE_STRIPE_ENABLED=true` only after the secret key and webhook signing secret have been added. Use Stripe's test-mode `sk_test_...` key first, configure a test-mode endpoint, and switch to `sk_live_...` plus a live webhook endpoint only after successful 3DS test transactions.

## Supabase reactivation

Supabase project suspension/reactivation is controlled from the Supabase Dashboard by the project owner. Open the project there and use the displayed restore/reactivate action, or contact Supabase support if the project is no longer eligible for self-service restoration. After it is active, verify the project URL and anon key in Vercel environment variables and redeploy.
