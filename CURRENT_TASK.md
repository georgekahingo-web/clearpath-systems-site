Before making any changes:

1. Read CURRENT_TASK.md
2. Do NOT break existing Stripe flow
3. Do NOT break onboarding
4. Keep Resend email logic intact

---

TASK: Add email notifications for Text Back purchases using Stripe webhook

GOAL:

When a customer purchases the TEXT BACK service:

1. Send INTERNAL email (to admin)
2. Send CUSTOMER confirmation email

---

SUCCESS CRITERIA:

- Emails send ONLY for text-back purchases
- Includes customer details
- Uses Resend
- Does NOT affect website package flow