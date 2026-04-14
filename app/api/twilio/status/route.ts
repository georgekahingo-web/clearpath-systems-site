import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { Resend } from "resend";
import { getClientByTwilioNumber } from "@/lib/getClient";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const to = url.searchParams.get("to");

  let client = null;

  if (to) {
    client = await getClientByTwilioNumber(to);
  }

  console.log("📞 Incoming To:", to);
  console.log("🔍 CLIENT LOOKUP:", {
    to,
    client,
  });

  if (!client && to) {
    console.warn("⚠️ Status: no client found for To:", to);
  } else if (!to) {
    console.warn("⚠️ Status: missing ?to= query param; using fallbacks where applicable");
  }

  const formData = await req.formData();

  const dialCallStatus = formData.get("DialCallStatus")?.toString();
  const from = formData.get("From")?.toString();

  console.log("📞 Status webhook hit");
  console.log("📞 DialCallStatus:", dialCallStatus);
  console.log("📞 From:", from);

  // Only send SMS if call was NOT answered
  if (dialCallStatus && dialCallStatus !== "completed") {
    const caller = formData.get("From")?.toString();
    const forwardTo = client?.forward_to_number;
    console.log("📞 Forwarding to:", forwardTo);

    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom =
        client?.twilio_number ?? process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !twilioFrom || !from) {
        console.error("❌ SMS error: missing Twilio env or From");
      } else if (!client?.auto_reply) {
        console.warn("⚠️ Status: missing client auto_reply; SMS skipped");
      } else {
        const twilioSdk = twilio(accountSid, authToken);

        await twilioSdk.messages.create({
          body: client?.auto_reply,
          from: twilioFrom,
          to: from,
        });

        console.log("✅ Missed call text sent");
      }
    } catch (err) {
      console.error("❌ SMS error:", err);
    }

    try {
      if (client?.business_email && caller) {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: client.business_email,
          subject: "Missed Call Alert",
          html: `
        <h2>Missed Call</h2>
        <p>You missed a call from:</p>
        <p><strong>${caller}</strong></p>
      `,
        });

        console.log("📧 Missed call email sent");
      } else if (!client?.business_email) {
        console.warn("⚠️ Status: missing client business_email; email skipped");
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
