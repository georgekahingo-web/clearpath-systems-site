CURRENT TASK: Connect onboarding form data to Stripe checkout flow

Goal:
Ensure that the onboarding form (Business Name, Forward Phone Number, Business Email, Auto Reply Message) is properly sent to /api/stripe/textback and then stored in Stripe metadata so it appears in the webhook email.

Requirements:

1. FRONTEND (onboarding form page):
- When the user submits the form or clicks the payment button:
  - Send a POST request to /api/stripe/textback
  - Include JSON body with:
    {
      businessName,
      forwardPhoneNumber,
      businessEmail,
      autoReplyMessage
    }
  - Include headers:
    "Content-Type": "application/json"

2. BACKEND (/api/stripe/textback/route.ts):
- Safely parse JSON body (already handled with try/catch)
- Pass all 4 fields into Stripe checkout session metadata:
  metadata: {
    businessName,
    forwardPhoneNumber,
    businessEmail,
    autoReplyMessage
  }

3. WEBHOOK (/api/stripe/webhook/route.ts):
- Extract metadata from session:
  const metadata = session.metadata;

- Include ALL fields in admin email:
  - businessName
  - forwardPhoneNumber
  - businessEmail
  - autoReplyMessage

4. DO NOT BREAK:
- Existing Stripe checkout logic
- Existing redirect flow
- Existing email sending logic

5. SUCCESS CRITERIA:
After a test payment:
- No 500 errors
- Stripe checkout works
- Webhook fires
- Admin email contains ALL onboarding form fields