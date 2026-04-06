import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PLAN_CONFIG = {
  starter: {
    unitAmountCents: 499 * 100,
    productName: "Starter Website Deposit",
  },
  growth: {
    unitAmountCents: 999 * 100,
    productName: "Growth Website Deposit",
  },
} as const;

type PlanKey = keyof typeof PLAN_CONFIG;

export async function POST(request: NextRequest) {
  console.log("CHECKOUT: request started");

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Payment provider is not configured." },
      { status: 500 }
    );
  }

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

  const config = PLAN_CONFIG[plan as PlanKey];
  const amount = config.unitAmountCents / 100;

  console.log("CHECKOUT: selected plan:", plan);
  console.log("CHECKOUT: calculated amount (USD):", amount);

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

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
          price_data: {
            currency: "usd",
            product_data: {
              name: config.productName,
            },
            unit_amount: config.unitAmountCents,
          },
        },
      ],
      metadata: {
        plan,
      },
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/",
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
      amount,
      sessionId: session.id,
      url: session.url,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return NextResponse.json(
      { error: "Checkout session failed" },
      { status: 500 }
    );
  }
}
