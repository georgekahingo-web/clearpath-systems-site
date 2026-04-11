import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { provisionPhoneNumber } from "@/lib/twilio";

export const dynamic = "force-dynamic";

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
    const email = session.customer_details?.email;
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
      email,
      customerId,
      subscriptionId,
      product: "textback",
      createdAt: new Date().toISOString(),
    };

    const phoneNumber = await provisionPhoneNumber();
    customerData.phoneNumber = phoneNumber;

    console.log("📞 Twilio number assigned:", phoneNumber);
    console.log(`Text-Back subscription activated for ${email}`);
    console.log("✅ NEW TEXTBACK CUSTOMER:", customerData);
  }

  return NextResponse.json({ received: true });
}
