import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getClientByTwilioNumber } from "@/lib/getClient";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const to = formData.get("To")?.toString();
  console.log("📞 Incoming To:", to);

console.log("📞 Incoming To:", to); 


  if (to) {
    const client = await getClientByTwilioNumber(to);
    console.log("🧪 TEST CLIENT:", client);
  }

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
