import twilio from "twilio";

export async function provisionPhoneNumber(): Promise<string> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured");
  }

  const client = twilio(accountSid, authToken);
  const local = await client.availablePhoneNumbers("US").local.list({ limit: 1 });
  if (!local.length) {
    throw new Error("No Twilio phone numbers available");
  }
  const incoming = await client.incomingPhoneNumbers.create({
    phoneNumber: local[0].phoneNumber,
  });
  return incoming.phoneNumber;
}
