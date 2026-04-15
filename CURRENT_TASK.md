Fix Next.js prerender error on /onboard page caused by useSearchParams.

The page is currently being statically generated, but it depends on runtime URL params (session_id).

GOAL:
Mark /onboard page as dynamic so it runs only at request time and avoids prerender errors.