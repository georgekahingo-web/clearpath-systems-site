import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log(
    "🚀 Stripe mode:",
    process.env.STRIPE_SECRET_KEY?.includes("test") ? "TEST" : "LIVE"
  );
  console.log("📦 Creating Stripe checkout session");
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Missing STRIPE_SECRET_KEY");
  }
  if (!process.env.STRIPE_TEXTBACK_PRICE_ID) {
    console.error("❌ Missing STRIPE_TEXTBACK_PRICE_ID");
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    throw new Error("Payment provider is not configured.");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-04-10",
  });

  const priceId = process.env.STRIPE_TEXTBACK_PRICE_ID;
  console.log("TEXTBACK ENV:", process.env.NODE_ENV);
  console.log("TEXTBACK PRICE ID:", priceId);
  console.log("STRIPE KEY EXISTS:", !!stripeKey);
  const origin =
    req.headers.get("origin") || "http://localhost:3000";

  if (!priceId) {
    return NextResponse.json(
      { error: "Text-Back subscription is not configured." },
      { status: 500 }
    );
  }

  try {
    console.log("✅ Redirecting Text Back customer to onboarding");
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        product: "text-back",
      },
      success_url: `${origin}/onboard`,
      cancel_url: `${origin}/#text-back`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("🔥 FULL STRIPE ERROR:", error);
    console.error("🔥 MESSAGE:", error?.message);
    console.error("🔥 TYPE:", error?.type);

    return NextResponse.json(
      { error: error.message || "Stripe session failed" },
      { status: 500 }
    );
  }
}
