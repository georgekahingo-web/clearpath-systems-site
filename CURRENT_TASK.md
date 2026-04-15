Fix Vercel build failure by preventing static prerendering of /onboard page.

The page depends on runtime data (session_id) and must not be statically generated during build.

Goal:
Ensure /onboard is always rendered dynamically at request time.