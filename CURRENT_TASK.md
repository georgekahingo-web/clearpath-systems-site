CURRENT TASK:

You are enhancing the Twilio missed-call system to send an EMAIL notification when a call is missed.

Scope:
Modify ONLY:
app/api/twilio/status/route.ts

DO NOT modify:
- voice route
- inbound-sms route
- any other files

OBJECTIVE:
When a call is missed:
1. Send SMS to customer (already exists)
2. ALSO send EMAIL to business owner with caller number

REQUIREMENTS:
- Use Resend for email
- Add environment variables:
  RESEND_API_KEY
  BUSINESS_EMAIL
- Email subject:
  "Missed Call Alert"
- Email content must include:
  - Caller phone number
  - Simple message: "You missed a call from [number]"
- Wrap email logic in try/catch
- DO NOT break Twilio response
- Always return valid TwiML

SUCCESS CRITERIA:
- Missed call triggers BOTH SMS + EMAIL
- No Twilio errors
- Clean logs