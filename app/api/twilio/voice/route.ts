import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const twiml = new twilio.twiml.VoiceResponse();

  const forwardTo = process.env.FORWARD_TO_NUMBER;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log("📞 Voice webhook hit");
  console.log("📞 Forwarding to:", forwardTo);

  if (forwardTo && appUrl) {
    twiml.dial(
      {
        timeout: 20,
        answerOnBridge: true,
        action: `${appUrl}/api/twilio/status`,
        method: "POST",
      },
      forwardTo
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
