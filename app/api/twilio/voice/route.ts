import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = formData.get("From"); // caller number
  const callStatus = formData.get("CallStatus");

  console.log("Incoming call from:", from);
  console.log("Call status:", callStatus);

  if (callStatus === "no-answer") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    if (
      accountSid &&
      authToken &&
      twilioFrom &&
      typeof from === "string" &&
      from.length > 0
    ) {
      const client = twilio(accountSid, authToken);
      await client.messages.create({
        to: from,
        from: twilioFrom,
        body: "Hey! Sorry we missed your call — how can we help?",
      });
    }
  }

  return new NextResponse(`<Response></Response>`, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
