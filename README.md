# C-Hear Technologies Limited — Website Deployment Guide

> **Production site:** [www.c-hear.online](https://www.c-hear.online)
> **Tech stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase

## Stripe Checkout

The checkout uses a Vercel Function to create a Stripe Checkout session. Card details are entered on Stripe, not on this website. Stripe secret keys must never be prefixed with `VITE_`, committed to Git, or placed in the frontend bundle.

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

## Supabase reactivation

Supabase project suspension/reactivation is controlled from the Supabase Dashboard by the project owner. Open the project there and use the displayed restore/reactivate action, or contact Supabase support if the project is no longer eligible for self-service restoration. After it is active, verify the project URL and anon key in Vercel environment variables and redeploy.
