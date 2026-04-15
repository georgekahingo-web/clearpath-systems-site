CURRENT TASK:

Upgrade Twilio call handling to support call forwarding workflows WITHOUT breaking existing SaaS logic, SMS behavior, or missed-call email notifications.

CRITICAL CONTEXT:
- This is a live SaaS app using Supabase
- Businesses onboard via a form → data stored in Supabase
- The field `forward_to_number` stores the destination phone number
- Existing system:
    - Sends SMS to customer when call is missed
    - Sends email notification to business when call is missed
- DO NOT break or modify:
    - Supabase schema
    - onboarding flow
    - SMS logic
    - email notification logic

PROBLEM:
- Current missed-call detection relies on timeout and fails when calls are forwarded into Twilio

GOAL:
- Detect missed calls using Twilio `DialCallStatus`
- Trigger BOTH:
    1. Customer SMS
    2. Business email notification
  ONLY when call is not completed

CHANGES REQUIRED:

1. Update Twilio Voice route:
   - Ensure `twiml.dial()` uses `forward_to_number`
   - Add:
     action: "/api/twilio/status"
     method: "POST"

2. Create or update `/api/twilio/status/route.ts`:
   - Parse Twilio POST request
   - Extract:
       - DialCallStatus
       - From (customer number)
       - To (Twilio number)

3. Logic:

   IF DialCallStatus !== "completed":
     → trigger EXISTING missed-call workflow:
         - send SMS to customer
         - send email to business
   ELSE:
     → do nothing

4. IMPORTANT:
   - DO NOT duplicate SMS logic
   - DO NOT duplicate email logic
   - Reuse existing functions/services
   - Ensure both SMS + email still fire together

5. Add logging:
   - DialCallStatus
   - Caller number
   - Whether SMS/email were triggered

6. Ensure:
   - Backward compatibility with current direct-call workflow
   - No schema changes
   - No breaking changes

OUTCOME:
- Forwarded calls are handled correctly
- Missed calls trigger BOTH SMS + email reliably
- Existing SaaS behavior remains fully intact