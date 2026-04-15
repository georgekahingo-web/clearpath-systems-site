import { headers } from "next/headers";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("🚨 WEBHOOK HIT");

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("❌ Missing Stripe env vars");
    return new Response("Missing config", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10",
  });

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Signature failed:", message);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("✅ Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const product = session.metadata?.product;

    if (product === "text-back") {
      const resendKey = process.env.RESEND_API_KEY;
      const from = "Clearpath Systems <onboarding@resend.dev>";
      const adminTo =
        process.env.TEXTBACK_INTERNAL_NOTIFY_EMAIL || "george.clearpath@gmail.com";

      if (resendKey) {
        try {
          const adminRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from,
              to: [adminTo],
              subject: "🚀 New TextBack Client",
              html: `<p>New client signed up: ${customerEmail ?? "(no email on session)"}</p>`,
            }),
          });
          if (!adminRes.ok) {
            console.error(
              "❌ Admin email API error:",
              adminRes.status,
              await adminRes.text()
            );
          }
        } catch (err) {
          console.error("❌ Admin email failed:", err);
        }

        if (customerEmail) {
          try {
            const clientRes = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from,
                to: [customerEmail],
                subject: "Welcome to Clearpath Text-Back",
                html: `<p>Your service is now active.</p>`,
              }),
            });
            if (!clientRes.ok) {
              console.error(
                "❌ Client email API error:",
                clientRes.status,
                await clientRes.text()
              );
            }
          } catch (err) {
            console.error("❌ Client email failed:", err);
          }
        } else {
          console.log("⚠️ No customer email on session; skipped client confirmation");
        }

        console.log("✅ Emails triggered for:", customerEmail);
      } else {
        console.log(
          "⚠️ RESEND_API_KEY not set; skipped admin/client emails for:",
          customerEmail
        );
      }

      console.log(
        "📞 Twilio: provision deferred — add inline fetch/API calls here when ready (no shared helpers)"
      );
    }
  }

  return new Response("OK", { status: 200 });
}
