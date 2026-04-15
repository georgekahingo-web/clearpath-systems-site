Enhance onboarding flow to merge Stripe metadata (TextBack form data) with onboarding form data into a single unified admin email.

Current system:
- /api/stripe/textback creates Stripe session with metadata ✅
- Webhook sends basic email ✅
- /api/onboarding sends onboarding email ✅

Goal:
- Pass Stripe session ID to onboarding page
- Retrieve metadata from Stripe inside onboarding API
- Merge metadata + onboarding form data
- Send ONE combined admin email with full client details

Constraints:
- DO NOT break existing Stripe flow
- DO NOT break existing onboarding submission
- DO NOT remove current fields
- Only extend functionality safely