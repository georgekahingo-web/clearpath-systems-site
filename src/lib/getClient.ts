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
