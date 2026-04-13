CURRENT TASK:

You are implementing Supabase client integration for a Next.js app.

Scope is STRICTLY LIMITED to creating and testing database connection utilities.

DO NOT modify:
- /api/twilio/voice/route.ts
- /api/twilio/status/route.ts
- /api/twilio/inbound-sms/route.ts
- any existing API logic

YOU MAY ONLY:
1. Create:
   - src/lib/supabase.ts
   - src/lib/getClient.ts

2. Add temporary test logic inside ONE existing route (voice route) ONLY for logging

OBJECTIVE:
- Connect app to Supabase
- Create helper to fetch client by twilio_number
- Verify connection by logging client data

REQUIREMENTS:
- Use @supabase/supabase-js
- Use environment variables:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
- Handle errors safely
- Do NOT break existing Twilio functionality

SUCCESS CRITERIA:
- Supabase client initializes correctly
- getClientByTwilioNumber returns correct data
- Logs show client data when Twilio number is called
- No crashes