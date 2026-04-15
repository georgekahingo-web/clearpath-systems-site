export const runtime = "nodejs";

import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("🚨 WEBHOOK HIT");

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("🚀 Stripe mode:", stripeSecretKey?.includes("test") ? "TEST" : "LIVE");
  console.log("🔑 STRIPE_SECRET_KEY exists:", !!stripeSecretKey);
  console.log("🔐 STRIPE_WEBHOOK_SECRET exists:", !!webhookSecret);

  if (!stripeSecretKey || !webhookSecret) {
    console.error("❌ Missing Stripe env variables");
    return new Response("Missing config", { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing Stripe signature");
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("✅ Event type:", event.type);

  // ✅ SAFE HANDLER
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;

    console.log("💰 Payment success for:", email);

    // 🔒 SAFE EMAIL (NO CRASH)
    try {
      console.log("📩 Sending admin email...");
      console.log("📨 ADMIN EMAIL TARGET:", "george.clearpath@gmail.com");
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Clearpath <onboarding@clearpathsystems.dev>",
          to: ["george.clearpath@gmail.com"],
          subject: "🚀 New Client",
          html: `
  <h2>🚀 New Client Signup</h2>
  <p><strong>Email:</strong> ${email}</p>
`,
        }),
      });

      console.log("✅ Admin email sent");
    } catch (err) {
      console.error("❌ Admin email failed:", err);
    }

    if (!email) {
      console.log("⚠️ No client email found — Stripe session missing customer email");
    } else {
      console.log(`📩 Sending client email to: ${email}`);

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Clearpath <onboarding@clearpathsystems.dev>",
            to: [email],
            subject: "Payment Confirmation - Clearpath Systems",
            html: "<p>Thank you for your purchase. We will contact you shortly.</p>",
          }),
        });

        console.log("✅ Client email sent");
      } catch (err) {
        console.error("❌ Client email failed:", err);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
