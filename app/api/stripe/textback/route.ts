import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeKey =
    process.env.NODE_ENV === "production"
      ? process.env.STRIPE_SECRET_KEY_LIVE
      : process.env.STRIPE_SECRET_KEY_TEST;

  if (!stripeKey) {
    throw new Error("Payment provider is not configured.");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-04-10",
  });

  const priceId =
    process.env.NODE_ENV === "production"
      ? process.env.STRIPE_TEXTBACK_PRICE_ID_LIVE!
      : process.env.STRIPE_TEXTBACK_PRICE_ID_TEST!;
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
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?product=textback`,
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
