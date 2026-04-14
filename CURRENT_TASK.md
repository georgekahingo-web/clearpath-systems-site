Before making any changes:

1. Read CURRENT_TASK.md for context
2. Do NOT break existing Stripe checkout or webhook logic
3. Only add safe logging — no functional changes

---

TASK: Add Stripe environment mode logging to help debug test vs live usage

GOAL:

Whenever a Stripe route runs, log whether the system is using TEST or LIVE keys.

This will help prevent accidental live charges and ensure correct environment usage.