Fix prerender error on /onboard by moving useSearchParams into a client component.

The current page incorrectly uses useSearchParams in a server component, which breaks the build.

GOAL:
- Keep /onboard/page.tsx as a server component
- Create a client component to safely access search params
- Pass session_id from client → form submission