Before doing anything:

1. Read Project Context
2. Read Current Task

---

TASK:

Fix Twilio voice flow so:
- Calls ring like a real business phone
- SMS is only sent AFTER a missed call (not during ringing)

---

CONTEXT:

Current issue:
- Calls ring for ~1 second and hang up
- SMS triggers at the wrong time

Goal flow:
Customer calls → phone rings normally → if not answered → SMS sent

---

STEP 1: Open file

/app/api/twilio/voice/route.ts

---

STEP 2: Extract CallStatus

Add this at the top inside POST handler:

const formData = await req.formData();

const callStatus = formData.get("CallStatus")?.toString();
const from = formData.get("From")?.toString();

console.log("📞 Call status:", callStatus);
console.log("📞 From:", from);

---

STEP 3: Add call forwarding (CRITICAL)

Replace your TwiML response with:

const twiml = new twilio.twiml.VoiceResponse();

twiml.dial(
  {
    timeout: 15,
  },
  process.env.FORWARD_TO_NUMBER
);

---

STEP 4: Send SMS ONLY after missed call

Add this BELOW the dial logic:

if (callStatus === "completed") {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: "Hey! Sorry we missed your call — how can we help?",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: from,
    });

    console.log("✅ Auto text sent");
  } catch (err) {
    console.error("❌ SMS error:", err);
  }
}

---

STEP 5: Return TwiML

return new NextResponse(twiml.toString(), {
  headers: {
    "Content-Type": "text/xml",
  },
});

---

STEP 6: Add environment variable (Vercel)

FORWARD_TO_NUMBER=+1XXXXXXXXXX

(This is the business phone that should ring)

---

STEP 7: DO NOT modify anything else

- Keep Stripe logic untouched
- Keep other API routes untouched

---

EXPECTED RESULT:

1. Call Twilio number
2. Phone rings for ~15 seconds
3. If not answered → call ends
4. Customer receives SMS

---

SUCCESS CRITERIA:

- Phone rings normally (not instant hang up)
- Logs show:
  - "Call status: ringing"
  - "Call status: completed"
- SMS only sends after call ends

---

OUTPUT:

- Show updated route.ts
- Confirm call forwarding is active
- Confirm SMS triggers on completed calls only