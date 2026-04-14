Before making any changes:

1. Read CURRENT_TASK.md for full project context
2. Do NOT break existing Stripe checkout or webhook functionality
3. Only refactor environment variable usage (no logic changes)

---

TASK: Refactor Stripe environment variable usage to remove all _TEST and _LIVE references

GOAL:

- Use ONE consistent set of environment variables across the entire codebase
- Remove all hardcoded references to:
  - _TEST
  - _LIVE
- Ensure Stripe behavior is controlled ONLY by environment variables (Vercel)

---

TARGET VARIABLES:

Replace all Stripe-related env usage with:

process.env.STRIPE_SECRET_KEY
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
process.env.STRIPE_TEXTBACK_PRICE_ID

---

SUCCESS CRITERIA:

- No references to _TEST or _LIVE remain in the codebase
- All Stripe routes still function
- Checkout still works
- Webhook still works
- No runtime errors