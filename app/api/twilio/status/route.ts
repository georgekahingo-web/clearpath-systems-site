import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const dialCallStatus = formData.get("DialCallStatus")?.toString();
  const from = formData.get("From")?.toString();

  console.log("📞 Status webhook hit");
  console.log("📞 DialCallStatus:", dialCallStatus);
  console.log("📞 From:", from);

  // Only send SMS if call was NOT answered
  if (dialCallStatus && dialCallStatus !== "completed") {
    const caller = formData.get("From")?.toString();

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

    try {
      if (process.env.BUSINESS_EMAIL && caller) {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: process.env.BUSINESS_EMAIL,
          subject: "Missed Call Alert",
          html: `
        <h2>Missed Call</h2>
        <p>You missed a call from:</p>
        <p><strong>${caller}</strong></p>
      `,
        });

        console.log("📧 Missed call email sent");
      }
    } catch (err) {
      console.error("❌ Email error:", err);
    }
  }

  const twiml = new twilio.twiml.VoiceResponse();

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
