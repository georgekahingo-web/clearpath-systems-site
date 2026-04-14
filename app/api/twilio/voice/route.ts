import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getClientByTwilioNumber } from "@/lib/getClient";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("🚨 VOICE ROUTE HIT");
  const formData = await req.formData();
  const to = formData.get("To")?.toString();
  console.log("📞 Incoming To:", to);

  let client = null;

  if (to) {
    client = await getClientByTwilioNumber(to);
  }

  if (!client) {
    console.warn("⚠️ No client found for number:", to);
  }

  console.log("🔍 CLIENT LOOKUP:", {
    to,
    client,
  });
  console.log("🧪 TEST CLIENT:", client);

  const twiml = new twilio.twiml.VoiceResponse();

  const forwardTo = client?.forward_to_number;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log("📞 Voice webhook hit");
  console.log("📞 Forwarding to:", forwardTo);

  if (!client?.forward_to_number) {
    console.warn("⚠️ Missing forward_to_number for client");
    twiml.say("We are unable to connect your call at this time.");
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (forwardTo && appUrl) {
    twiml.dial(
      {
        timeout: 20,
        answerOnBridge: true,
        action: `${appUrl}/api/twilio/status?to=${encodeURIComponent(to || "")}`,
        method: "POST",
      },
      forwardTo
    );
  } else {
    if (!appUrl) {
      console.warn("⚠️ Voice: NEXT_PUBLIC_APP_URL missing; forwarding skipped");
    }
    twiml.say("No forwarding number configured.");
  }

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
