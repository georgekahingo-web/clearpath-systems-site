# CURRENT TASK — Stripe Webhook Hardening, Payment Errors, Email Readiness

## Architecture context (Clearpath Systems)

This repo is the **Clearpath Systems** marketing and product surface: a **Next.js App Router** site (`clearpath-systems-site`) that ties together:

- **Stripe** — Checkout sessions for deposits / **TextBack** subscription flows; a **`POST /api/stripe/webhook`** handler for `checkout.session.completed` and related events.
- **Twilio** — Phone provisioning (`provisionPhoneNumber`) and SMS/voice routes under `app/api/twilio/*` for the TextBack product.
- **Resend** — Transactional email (internal alerts and customer messages) when the webhook completes successfully.

The **happy path** for TextBack: customer completes Stripe Checkout → webhook verifies the event → optional product filter (`metadata.product === "text-back"`) → Twilio number assigned → emails sent via Resend. **Future work** is to persist customers in **Supabase** and to formalize email content and triggers.

---

## Objective

1. **Stabilize the Stripe webhook** so Stripe always receives correct HTTP responses: use the **raw request body** for signature verification and **verify** events with `stripe.webhooks.constructEvent` and the matching **webhook signing secret** (test vs live).
2. **Eliminate misleading or avoidable “payment provider” failures** in the payment flow (checkout API and webhook) so errors reflect real misconfiguration, not thrown helpers or mixed environments.
3. **Prepare email triggers** — confirm Resend usage, env flags, and a clean separation so post-webhook email can be extended (templates, internal vs customer) without blocking webhook reliability.

---

## Step-by-step tasks

### 1. Webhook: raw body and signature (required)

- Confirm the webhook route uses **`await request.text()`** for the payload passed to `constructEvent` (not `request.json()`), so the signature matches what Stripe sent.
- Confirm **`stripe-signature`** is read from headers and that **`STRIPE_WEBHOOK_SECRET`** matches the **same** Stripe mode as `STRIPE_SECRET_KEY` (test dashboard → test secret + test key; live → live).
- Keep **`constructEvent(rawBody, signature, webhookSecret)`** in a `try/catch`; return **400** on verification failure with safe logging (no full secret in logs).
- If the App Router or hosting layer ever parses the body before the handler, document or fix **route segment config** so the raw bytes Stripe signed are what the handler reads (verify in deployment logs after deploy).

### 2. Remove / narrow “payment provider” errors

- **Checkout (`app/api/checkout/route.ts`)** — Replace bare `throw new Error("Payment provider is not configured.")` with a **JSON error response** (e.g. 503) and structured logging, or ensure the error is only thrown when the server truly has no `STRIPE_SECRET_KEY` (no user-facing stack traces).
- **Webhook (`app/api/stripe/webhook/route.ts`)** — Avoid calling **`getStripe()`** in a way that throws that same message **before** or **after** verification in confusing order. Prefer: validate `STRIPE_SECRET_KEY` once with a clear log line; return **500** with a stable JSON body if the server cannot call Stripe APIs, without conflating “missing key” with “bad signature.”
- Remove or gate **debug logs** that print raw key material (e.g. “STRIPE KEY RAW”) in checkout; log mode (test/live) only.

### 3. Prepare email triggers (structure, not full product copy)

- Ensure **`RESEND_API_KEY`**, **`TEXTBACK_INTERNAL_NOTIFY_EMAIL`** (or fallback), and **from-address** policy are documented in `.env.example` and set in production.
- Keep internal + customer sends **idempotent-friendly** (same event may retry): log clearly when email is skipped vs sent; consider extracting send logic to **`lib/email`** later for tests.
- Define placeholders for **next** improvements: templated subjects/bodies, onboarding link, and failure alerting if Resend fails after Twilio provision.

### 4. Operational checks

- In Stripe Dashboard: webhook endpoint URL matches production; only the intended events are subscribed; use **Stripe CLI** or “Send test webhook” and confirm **200** and structured logs.
- Align **Vercel** (or host) env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and any price IDs — **no mixing** test and live secrets on one deployment.

---

## Success criteria

| Criterion | Target |
|-----------|--------|
| Webhook HTTP behavior | **2xx** for verified, handled events; **400** for bad/missing signature; no unhandled 500s from signature or body parsing. |
| Raw body | Handler uses **raw string body** for `constructEvent`; Stripe “Signing secret” matches deployed env. |
| Payment errors | No spurious **“Payment provider is not configured”** in paths where Stripe is configured; checkout returns controlled JSON errors when misconfigured. |
| Observability | Logs show webhook receipt, **event type**, and **session id** (and TextBack-specific fields) without leaking secrets. |
| Email readiness | With env set, webhook path can send or clearly skip internal/customer email with logged reason; ready for template and copy iteration. |

---

## Next steps (after this task)

### Email

- Move copy to small templates or shared constants; add **bcc** or **second internal address** if needed; verify **domain** in Resend (replace `onboarding@resend.dev` in production).
- Add **retry-safe** behavior: Stripe may deliver the same event more than once — document whether duplicate Twilio provision / duplicate emails are acceptable or gated by idempotency keys / DB.

### Database sync (Supabase)

- On `checkout.session.completed` for TextBack: **upsert** customer record with **email**, **Stripe customer id**, **subscription id**, **plan/metadata**, **phone assigned**, and **status**.
- Use DB as source of truth for “already provisioned” to support **webhook retries** and future **admin** and **billing** views.

---

## Constraints and reminders

- **Never mix** Stripe test and live keys or webhook secrets on the same deployment.
- Webhook verification **requires** the exact raw body; changing JSON parsing breaks signatures.
- Twilio provisioning and Resend sends are **side effects** — keep the webhook response reliable even when a downstream service fails (log + optional follow-up job later).
