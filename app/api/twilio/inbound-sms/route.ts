import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const twiml = new twilio.twiml.MessagingResponse();

  let from = "";
  let body = "";

  try {
    const formData = await req.formData();
    from = formData.get("From")?.toString() ?? "";
    body = formData.get("Body")?.toString() ?? "";
  } catch {
    // Invalid or missing body — still return TwiML
  }

  console.log("📩 Incoming SMS:", from, body);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
  const forwardTo = process.env.FORWARD_TO_NUMBER;

  if (accountSid && authToken && twilioFrom && forwardTo) {
    try {
      const client = twilio(accountSid, authToken);
      await client.messages.create({
        body: `New message from ${from}: ${body}`,
        from: twilioFrom,
        to: forwardTo,
      });
    } catch (err) {
      console.error("❌ Forward inbound SMS error:", err);
    }
  } else {
    console.warn("⚠️ Forward inbound SMS skipped: missing Twilio env vars");
  }

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
