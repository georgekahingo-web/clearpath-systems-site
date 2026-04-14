import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const DEPOSIT_PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_DEPOSIT_PRICE_ID!,
  growth: process.env.STRIPE_GROWTH_DEPOSIT_PRICE_ID!,
} as const;

type PlanKey = keyof typeof DEPOSIT_PRICE_IDS;

export async function POST(request: NextRequest) {
  console.log("CHECKOUT: request started");
  console.log("🚨 STRIPE KEY RAW:", process.env.STRIPE_SECRET_KEY);
  console.log(
    "🚀 Stripe mode:",
    process.env.STRIPE_SECRET_KEY?.includes("test") ? "TEST" : "LIVE"
  );

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Missing STRIPE_SECRET_KEY");
  }

  if (!stripeKey) {
    throw new Error("Payment provider is not configured.");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-04-10",
  });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("plan" in body) ||
    typeof (body as { plan: unknown }).plan !== "string"
  ) {
    return NextResponse.json(
      { error: 'Body must be JSON with { "plan": "starter" | "growth" }.' },
      { status: 400 }
    );
  }

  const plan = (body as { plan: string }).plan;
  if (plan !== "starter" && plan !== "growth") {
    return NextResponse.json(
      { error: 'Invalid plan. Expected "starter" or "growth".' },
      { status: 400 }
    );
  }

  const depositPriceId = DEPOSIT_PRICE_IDS[plan as PlanKey];
  if (!depositPriceId) {
    console.error("❌ Missing price ID for plan:", plan);
    return NextResponse.json(
      { error: "Deposit pricing is not configured correctly." },
      { status: 500 }
    );
  }

  console.log("CHECKOUT: selected plan:", plan);
  console.log("CHECKOUT: deposit price ID:", depositPriceId);

  const origin =
    request.headers.get("origin") || "http://localhost:3000";

  try {
    console.log("ENV:", process.env.NODE_ENV);
    console.log("STARTER PRICE:", process.env.STRIPE_STARTER_DEPOSIT_PRICE_ID);
    console.log("GROWTH PRICE:", process.env.STRIPE_GROWTH_DEPOSIT_PRICE_ID);
    console.log("SELECTED PRICE ID:", depositPriceId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_creation: "always",
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          quantity: 1,
          price: depositPriceId,
        },
      ],
      metadata: {
        plan,
      },
      success_url: `${origin}/success?plan=${plan}`,
      cancel_url: `${origin}/`,
    });

    if (!session.url) {
      console.error("CHECKOUT: session created but missing url", session.id);
      return NextResponse.json(
        { error: "Checkout session failed" },
        { status: 500 }
      );
    }

    console.log("NEW CHECKOUT SESSION CREATED:");
    console.log({
      plan,
      depositPriceId,
      sessionId: session.id,
      url: session.url,
    });

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
