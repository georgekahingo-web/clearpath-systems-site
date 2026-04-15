OBJECTIVE:
Fix email delivery in Stripe webhook so both admin and client receive emails after payment.

WHAT NEEDS TO HAPPEN:
1. Replace invalid sender email
2. Send email to admin (you)
3. Send email to client (from Stripe session)
4. Add clear logs for debugging
5. Keep everything inside webhook route

REQUIREMENTS:
- Use Resend API (already in code)
- Do NOT modify Stripe logic
- Do NOT restructure file
- Only update email logic section

EXPECTED RESULT:
- Admin receives "New Client" email
- Client receives "Payment Confirmation" email
- Logs confirm both emails were sent