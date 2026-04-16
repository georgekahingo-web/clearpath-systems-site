import twilio from "twilio";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ClientLike = {
  twilio_number?: string | null;
  auto_reply?: string | null;
  business_email?: string | null;
} | null;

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

  /**
   * =========================
   * 📩 SMS LOGIC
   * =========================
   */
  try {
    if (!accountSid || !authToken || !twilioFrom || !callerPhone) {
      console.error(
        "❌ Missed-call SMS skipped: missing Twilio config or caller"
      );
    } else {
      if (!client?.auto_reply) {
        console.warn(
          "⚠️ Missing client auto_reply; using fallback SMS message"
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

      console.log("📩 SMS sent to:", callerPhone);
      smsSent = true;
    }
  } catch (err) {
    console.error("❌ Missed-call SMS error:", err);
  }

  /**
   * =========================
   * 📧 EMAIL LOGIC
   * =========================
   */
  try {
    if (client?.business_email && callerPhone) {
      const cleanEmail = client.business_email.trim();

      console.log("📧 Attempting email send to:", cleanEmail);

      const response = await resend.emails.send({
        // ✅ USE YOUR DOMAIN (since verified)
        from: "Clearpath <alerts@clearpathsystems.dev>",

        to: cleanEmail,

        subject: `📞 Missed Call from ${callerPhone}`,

        html: `
          <h2>📞 Missed Call</h2>
          <p>You missed a call from:</p>
          <p><strong>${callerPhone}</strong></p>
          <br/>
          <p>Call them back ASAP to secure the job.</p>
        `,
      });

      console.log("📧 Resend response:", response);

      emailSent = true;
    } else if (!client?.business_email) {
      console.warn("⚠️ Missing business_email; email skipped");
    }
  } catch (err) {
    console.error("❌ Missed-call email error:", err);
  }

  return { smsSent, emailSent };
}