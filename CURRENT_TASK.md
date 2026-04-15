# CURRENT TASK — ELIMINATE WEBHOOK CRASH (STRIPE)

## 🚨 Problem
Stripe webhook endpoint `/api/stripe/webhook` is returning 500 errors.

Error observed in Vercel logs:
"Payment provider is not configured."

## 🧠 Root Cause
The webhook route (or a shared Stripe utility it imports) is THROWING an error when STRIPE_SECRET_KEY is missing or misread.

Webhooks must NEVER throw — they must ALWAYS return a response.

Additionally:
- Webhook may be incorrectly using `req.json()` instead of `req.text()`
- Webhook may be importing shared Stripe logic that throws errors
- Debug visibility is currently insufficient

## 🎯 Objective
Stabilize webhook so it:
1. NEVER throws runtime errors
2. ALWAYS returns a valid Response
3. Correctly verifies Stripe signature
4. Uses raw request body (`req.text()`)
5. Logs critical debug information

## ✅ Required Fixes

### 1. Remove ALL throwing logic
- Find ANY instance of:
  throw new Error("Payment provider is not configured")
- Remove or replace with safe response handling

### 2. Remove shared Stripe helper usage (if present)
- DO NOT import Stripe from any shared utility that may throw
- Instantiate Stripe directly inside webhook route

### 3. Use raw request body
- Must use:
  const body = await req.text();

- Must NOT use:
  req.json()

### 4. Add defensive env checks
- If STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing:
  → log error
  → return Response (DO NOT throw)

### 5. Add debug logs
Must log:
- webhook hit
- stripe mode (test/live)
- env existence
- event type

### 6. Ensure ALWAYS returns a response
Even on failure

## 📁 File Scope
- app/api/stripe/webhook/route.ts

## ❌ Do NOT modify
- checkout route
- frontend
- other APIs

## ✅ Success Criteria
- No more 500 errors in webhook
- Stripe event replay returns 200
- Logs show:
  - "WEBHOOK HIT"
  - Event type printed
- System ready for email integration
