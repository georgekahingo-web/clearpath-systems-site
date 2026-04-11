MANDATORY FIRST STEP:
Read Project Context and Current Task before making changes.

---

CURRENT TASK: Implement Twilio Voice Webhook for Missed Call Detection

Objective:
Detect when a forwarded call is not answered and trigger an automatic SMS response to the caller.

---

GOALS:

1. Create Twilio voice webhook endpoint
2. Read incoming call data
3. Detect missed calls (no-answer)
4. Send SMS to caller

---

CONSTRAINTS:

* Do NOT modify Stripe logic
* Do NOT modify existing Twilio provisioning logic
* Only add new Twilio route
* Keep implementation minimal and safe

---

EXPECTED OUTCOME:

When a call is missed, the system automatically sends an SMS to the caller
