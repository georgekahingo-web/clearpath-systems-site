import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getClientByTwilioNumber } from "@/lib/getClient";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const twiml = new twilio.twiml.MessagingResponse();

  let from = "";
  let body = "";
  let to: string | undefined;

  try {
    const formData = await req.formData();
    from = formData.get("From")?.toString() ?? "";
    body = formData.get("Body")?.toString() ?? "";
    to = formData.get("To")?.toString();
  } catch {
    // Invalid or missing body — still return TwiML
  }

  console.log("📩 Incoming SMS:", from, body);
  console.log("📞 Incoming To:", to);

  let client = null;

  if (to) {
    client = await getClientByTwilioNumber(to);
  }

  console.log("🔍 CLIENT LOOKUP:", {
    to,
    client,
  });
  console.log("🧪 TEST CLIENT:", client);

  const forwardTo = client?.forward_to_number;

  console.log("📞 Forwarding to:", forwardTo);

  if (!to) {
    console.warn("⚠️ Inbound SMS: missing To; forward skipped");
  } else if (!client) {
    console.warn("⚠️ Inbound SMS: no client for To; forward skipped");
  } else if (!forwardTo) {
    console.warn("⚠️ Inbound SMS: client has no forward_to_number; forward skipped");
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom =
    client?.twilio_number ?? process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && twilioFrom && forwardTo) {
    try {
      const twilioSdk = twilio(accountSid, authToken);
      await twilioSdk.messages.create({
        body: `New message from ${from}: ${body}`,
        from: twilioFrom,
        to: forwardTo,
      });
    } catch (err) {
      console.error("❌ Forward inbound SMS error:", err);
    }
  } else if (forwardTo || client) {
    console.warn("⚠️ Forward inbound SMS skipped: missing Twilio credentials or from number");
  }

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
