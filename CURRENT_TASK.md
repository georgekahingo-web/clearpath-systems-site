MANDATORY FIRST STEP:
Read Project Context and Current Task before making changes.

---

CURRENT TASK: Add Twilio Status Webhook + Debug Logging

Objective:
Create a dedicated status endpoint for Twilio call lifecycle handling
and add debug logging to ensure call forwarding is working correctly.

---

GOALS:

1. Create /api/twilio/status route
2. Add missed call detection logic
3. Send SMS ONLY when call is missed
4. Add debug logs for call flow visibility

---

CONSTRAINTS:

- DO NOT modify Stripe logic
- DO NOT modify existing UI
- DO NOT remove working Twilio voice route
- Only ADD functionality, do not refactor existing working code
- Keep implementation minimal and safe

---

EXPECTED RESULT:

- Call rings normally
- Missed calls trigger SMS
- Logs clearly show call flow