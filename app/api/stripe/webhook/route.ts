import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { provisionPhoneNumber } from "@/lib/twilio";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log("🚨 WEBHOOK HIT");
  console.log(
    "🚀 Stripe mode:",
    process.env.STRIPE_SECRET_KEY?.includes("test") ? "TEST" : "LIVE"
  );
  console.log("🔑 STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log(
    "🔐 STRIPE_WEBHOOK_SECRET exists:",
    !!process.env.STRIPE_WEBHOOK_SECRET
  );

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("❌ Missing Stripe environment variables in webhook");
    return new Response("Missing Stripe config", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10",
  });

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing stripe-signature header");
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Stripe signature verification failed:", message);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("✅ Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    console.log("💰 Checkout session completed");

    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const businessName = session.metadata?.business_name || "New Client";
    const phone = session.metadata?.phone || "Not provided";
    const product = session.metadata?.product;

    if (product !== "text-back") {
      return new Response("OK", { status: 200 });
    }

    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    const customerData: {
      email: string | undefined | null;
      customerId: string;
      subscriptionId: string;
      product: string;
      createdAt: string;
      phoneNumber?: string;
    } = {
      email: customerEmail,
      customerId,
      subscriptionId,
      product: "text-back",
      createdAt: new Date().toISOString(),
    };

    const phoneNumber = await provisionPhoneNumber();
    customerData.phoneNumber = phoneNumber;

    console.log("📞 Twilio number assigned:", phoneNumber);
    console.log(`Text-Back subscription activated for ${customerEmail}`);
    console.log("✅ NEW TEXTBACK CUSTOMER:", customerData);

    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Clearpath Systems <onboarding@resend.dev>",
          to: process.env.TEXTBACK_INTERNAL_NOTIFY_EMAIL || "george.clearpath@gmail.com",
          subject: "🚨 New Text-Back Customer",
          html: `
            <h2>New Customer Signup</h2>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          `,
        });
        console.log("📧 Internal email sent");

        await resend.emails.send({
          from: "Clearpath Systems <onboarding@resend.dev>",
          to: customerEmail,
          subject: "You're all set with Clearpath Systems 🎉",
          html: `
            <h2>Welcome to Clearpath Systems</h2>
            <p>Your Text-Back system is almost ready.</p>
            <p>Please complete setup below:</p>
            <a href="https://clearpathsystems.dev/onboard">Complete Setup</a>
          `,
        });
        console.log("📧 Customer email sent");
      } catch (emailError) {
        console.error("TEXT-BACK EMAIL ERROR:", emailError);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
