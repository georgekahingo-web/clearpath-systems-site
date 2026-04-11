import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const dialCallStatus = formData.get("DialCallStatus")?.toString();
  const from = formData.get("From")?.toString();

  console.log("📞 Status webhook hit");
  console.log("📞 DialCallStatus:", dialCallStatus);
  console.log("📞 From:", from);

  // Only send SMS if call was NOT answered
  if (dialCallStatus && dialCallStatus !== "completed") {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
      if (!accountSid || !authToken || !twilioFrom || !from) {
        console.error("❌ SMS error: missing Twilio env or From");
      } else {
        const client = twilio(accountSid, authToken);

        await client.messages.create({
          body: "Hey! Sorry we missed your call — how can we help?",
          from: twilioFrom,
          to: from,
        });

        console.log("✅ Missed call text sent");
      }
    } catch (err) {
      console.error("❌ SMS error:", err);
    }
  }

  return NextResponse.json({ success: true });
}
