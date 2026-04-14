# CURRENT TASK — FIX STRIPE WEBHOOK (CRITICAL)

## Objective
Fix the Stripe webhook crashing with:
"Payment provider is not configured"

## Problem
- Webhook route is throwing an error when STRIPE_SECRET_KEY is missing
- Stripe requires webhook to ALWAYS return a response (no crashes)
- Current implementation likely:
  - Throws error instead of returning response
  - May be using req.json() instead of raw body
  - May not be validating webhook signature correctly

## Goals
1. Remove ALL "throw new Error('Payment provider is not configured')" from webhook route
2. Replace with safe error handling (return Response)
3. Ensure webhook uses raw body (req.text())
4. Ensure Stripe signature verification is correct
5. Add debug logs for:
   - webhook hit
   - stripe mode (test vs live)
   - webhook secret presence
   - event type

## Success Criteria
- Webhook returns 200 (no 500 errors)
- Stripe test event succeeds
- Logs show:
  - "WEBHOOK HIT"
  - Event type logged
- No crashes in Vercel logs

## Files In Scope
- app/api/stripe/webhook/route.ts

## Notes
- DO NOT break existing checkout flow
- DO NOT modify frontend
- Focus ONLY on webhook stability