import { supabase } from "./supabase";

export async function getClientByTwilioNumber(twilioNumber: string) {
  if (!twilioNumber) {
    console.error("❌ No Twilio number provided");
    return null;
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("twilio_number", twilioNumber)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase error:", error.message);
    return null;
  }

  if (!data) {
    console.warn("⚠️ No client found for Twilio number:", twilioNumber);
    return null;
  }

  console.log("👤 Client found:", data);
  return data;
}

/** Dial action callback sends `To` as the dialed party (forward_to_number), not the Twilio inbound number. */
export async function getClientByForwardToNumber(forwardToNumber: string) {
  if (!forwardToNumber) {
    return null;
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("forward_to_number", forwardToNumber)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase error (forward_to_number):", error.message);
    return null;
  }

  if (!data) {
    console.warn("⚠️ No client found for forward_to_number:", forwardToNumber);
    return null;
  }

  console.log("👤 Client found by forward_to_number:", data);
  return data;
}

/**
 * Resolve business row for Dial status webhooks: prefer inbound Twilio number (`?to=` from Voice),
 * else match `forward_to_number` from Twilio's Dial `To` parameter.
 */
export async function getClientForDialCallback(params: {
  twilioInboundNumber?: string | null;
  dialedNumber?: string | null;
}) {
  if (params.twilioInboundNumber) {
    const byTwilio = await getClientByTwilioNumber(params.twilioInboundNumber);
    if (byTwilio) {
      return byTwilio;
    }
  }
  if (params.dialedNumber) {
    return getClientByForwardToNumber(params.dialedNumber);
  }
  return null;
}
