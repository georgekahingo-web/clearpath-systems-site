Fix missing JSON body being sent from onboarding form to /api/stripe/textback.

The backend is working correctly and expects:

{
  businessName,
  forwardPhoneNumber,
  businessEmail,
  autoReplyMessage
}

But currently NO JSON is being sent, causing metadata to be empty.

GOAL:
Ensure the onboarding form sends a proper POST request with JSON body before redirecting to Stripe.