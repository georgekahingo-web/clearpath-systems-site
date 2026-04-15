import twilio from "twilio";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ClientLike = {
  twilio_number?: string | null;
  auto_reply?: string | null;
  business_email?: string | null;
} | null;

/**
 * Single shared path for missed-call customer SMS + business email.
 * Preserves existing behavior from the Twilio status webhook.
 */
export async function notifyMissedCall(
  client: ClientLike,
  callerPhone: string
): Promise<{ smsSent: boolean; emailSent: boolean }> {
  let smsSent = false;
  let emailSent = false;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom =
    client?.twilio_number ?? process.env.TWILIO_PHONE_NUMBER;

  try {
    if (!accountSid || !authToken || !twilioFrom || !callerPhone) {
      console.error("❌ Missed-call SMS skipped: missing Twilio env or caller From");
    } else {
      if (!client?.auto_reply) {
        console.warn(
          "⚠️ Missed-call: missing client auto_reply; using fallback SMS"
        );
      }
      const twilioSdk = twilio(accountSid, authToken);
      await twilioSdk.messages.create({
        body:
          client?.auto_reply ||
          "Hey! Sorry we missed your call — how can we help?",
        from: twilioFrom,
        to: callerPhone,
      });
      smsSent = true;
    }
  } catch (err) {
    console.error("❌ Missed-call SMS error:", err);
  }

  try {
    if (client?.business_email && callerPhone) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: client.business_email,
        subject: "Missed Call Alert",
        html: `
        <h2>Missed Call</h2>
        <p>You missed a call from:</p>
        <p><strong>${callerPhone}</strong></p>
      `,
      });
      emailSent = true;
    } else if (!client?.business_email) {
      console.warn("⚠️ Missed-call: missing business_email; email skipped");
    }
  } catch (err) {
    console.error("❌ Missed-call email error:", err);
  }

  return { smsSent, emailSent };
}
