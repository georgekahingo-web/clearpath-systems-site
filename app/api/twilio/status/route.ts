import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getClientForDialCallback } from "@/lib/getClient";
import { notifyMissedCall } from "@/lib/missedCallNotifications";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const twilioInboundFromQuery = url.searchParams.get("to");

  const formData = await req.formData();

  const dialStatus = formData.get("DialCallStatus")?.toString();
  const from = formData.get("From")?.toString();
  const to = formData.get("To")?.toString();

  console.log("📞 Status webhook (Dial callback)");
  console.log("📞 DialCallStatus:", dialStatus);
  console.log("📞 Caller (From):", from);
  console.log("📞 Dialed party (To):", to);
  console.log("📞 Twilio inbound hint (?to=):", twilioInboundFromQuery);

  const client = await getClientForDialCallback({
    twilioInboundNumber: twilioInboundFromQuery,
    dialedNumber: to,
  });

  console.log("🔍 CLIENT LOOKUP:", {
    twilioInboundFromQuery,
    dialedTo: to,
    clientFound: !!client,
  });

  if (!client) {
    console.warn(
      "⚠️ Status: no client resolved (try ?to= Twilio number or Dial To = forward_to_number)"
    );
  }

  const twiml = new twilio.twiml.VoiceResponse();

  const missedStatuses = ["no-answer", "busy", "failed", "canceled"];

if (!dialStatus || !missedStatuses.includes(dialStatus)) {
  console.log("✅ Dial outcome: no missed-call workflow", {
    DialCallStatus: dialStatus,
  });

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}

  if (!from) {
    console.warn("⚠️ Status: missing From; cannot run missed-call workflow");
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }

  const { smsSent, emailSent } = await notifyMissedCall(client, from);

  console.log("📊 Missed-call workflow result:", {
    DialCallStatus: dialStatus,
    caller: from,
    smsTriggered: smsSent,
    emailTriggered: emailSent,
  });

  return new NextResponse(twiml.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
