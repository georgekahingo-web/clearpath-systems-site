## TASK: Make Clearpath Systems fully dynamic (multi-client SaaS)

Goal:
Remove all hardcoding and make the system fully database-driven using Supabase.

We need to:

1. Personalize SMS per client
   - Use `client.auto_reply` instead of hardcoded message

2. Send email to correct business
   - Use `client.business_email`

3. Route inbound SMS replies to business
   - Use `client.forward_to_number`

4. Remove ALL environment-based routing
   - Remove `FORWARD_TO_NUMBER` usage completely

5. Ensure all Twilio routes:
   - Fetch client using `To` number
   - Use Supabase as source of truth

6. Maintain TwiML response format (NO JSON returns)

Routes to update:
- /api/twilio/voice
- /api/twilio/status
- /api/twilio/inbound-sms

Important:
- Do NOT break existing working Twilio flow
- Preserve logging
- Use optional chaining safely (client?.field)
- Ensure system still works if client is null (fallbacks)