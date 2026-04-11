import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callStatus = formData.get("CallStatus")?.toString();

  console.log("📞 Call status:", callStatus);

  if (callStatus === "completed") {
    const from = formData.get("From")?.toString();
    const to = process.env.TWILIO_PHONE_NUMBER;

    if (from && to) {
      try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken) {
          console.error("❌ SMS error: Twilio credentials not configured");
        } else {
          const client = twilio(accountSid, authToken);

          await client.messages.create({
            body: "Hey! Sorry we missed your call — how can we help?",
            from: to,
            to: from,
          });

          console.log("✅ Auto text sent");
        }
      } catch (err) {
        console.error("❌ SMS error:", err);
      }
    }
  }

  const twiml = new twilio.twiml.VoiceResponse();

  const forwardTo = process.env.FORWARD_TO_NUMBER;

  console.log("📞 Voice webhook hit");
  console.log("📞 Forwarding to:", process.env.FORWARD_TO_NUMBER);

  const origin = req.headers.get("origin") || "https://clearpathsystems.dev";

  if (forwardTo) {
    twiml.dial(
      {
        timeout: 20,
        answerOnBridge: true,
        action: `${origin}/api/twilio/status`,
        method: "POST",
      },
      process.env.FORWARD_TO_NUMBER
    );
  } else {
    twiml.say("No forwarding number configured.");
  }

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
