CURRENT TASK: Safely fix /onboard deployment errors and preserve existing onboarding structure.

Goal:
Keep the current onboarding flow intact while capturing Stripe session_id safely and sending it with the existing onboarding submission.

Requirements:
1. Do NOT introduce new wrapper components or function-as-children patterns
2. Do NOT change existing form fields or business logic
3. Do NOT move API logic
4. Only make the minimum changes needed to:
   - stop the prerender/build error
   - read session_id safely on the client
   - include stripeSessionId in the existing onboarding POST request

Success criteria:
- /onboard deploys successfully
- existing onboarding form still works
- stripeSessionId is included in the existing submit payload
- no function-as-children pattern
- no useSearchParams in a server component