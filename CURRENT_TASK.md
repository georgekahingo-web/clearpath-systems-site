Fix TextBack checkout so it sends JSON body to /api/stripe/textback.

Currently the route is being triggered without a request body, causing metadata to be empty.

GOAL:
Ensure the TextBack form sends a POST request with JSON containing:
- businessName
- forwardPhoneNumber
- businessEmail
- autoReplyMessage

Then redirect user to Stripe checkout using the returned session URL.