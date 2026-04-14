import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { provisionPhoneNumber } from "@/lib/twilio";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
const resend = new Resend(process.env.RESEND_API_KEY);

function getStripe(): Stripe {
  const stripeKey =
    process.env.NODE_ENV === "production"
      ? process.env.STRIPE_SECRET_KEY_LIVE
      : process.env.STRIPE_SECRET_KEY_TEST;

  if (!stripeKey) {
    throw new Error("Payment provider is not configured.");
  }

  return new Stripe(stripeKey, {
    apiVersion: "2024-04-10",
  });
}

export async function POST(request: NextRequest) {
  console.log(
    "🚀 Stripe mode:",
    process.env.STRIPE_SECRET_KEY?.includes("test") ? "TEST" : "LIVE"
  );
  console.log("🔔 Stripe webhook triggered");
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is missing");
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const businessName = session.metadata?.business_name || "New Client";
    const phone = session.metadata?.phone || "Not provided";
    const product = session.metadata?.product;

    if (product !== "text-back") {
      return NextResponse.json({ received: true });
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

  return NextResponse.json({ received: true });
}
