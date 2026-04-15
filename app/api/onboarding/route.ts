import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    })
  : null;

const MAKE_WEBHOOK_URL =
  "https://hook.us2.make.com/qkklon2lbvo69h65801ncn8g2l819qkk";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Basic check before sending client confirmation (does not replace full validation). */
function isPlausibleClientEmail(addr: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
}

const CLIENT_CONFIRMATION_HTML = `
<p>Thank you for choosing Clearpath Systems.</p>
<p>Your project has been successfully secured and is now in our onboarding queue.</p>
<p><strong>Here&rsquo;s what happens next:</strong></p>
<ul>
  <li>We&rsquo;ll review your submission</li>
  <li>You&rsquo;ll receive a follow-up within 24 hours</li>
  <li>We begin building your high-converting website immediately after</li>
</ul>
<p>If you have any immediate questions, feel free to reply to this email.</p>
<p>&mdash; Clearpath Systems<br />
&ldquo;Websites that turn visitors into booked clients.&rdquo;</p>
`;

export async function POST(request: NextRequest) {
  console.log("ONBOARDING API: POST received");

  console.log("🔥 ONBOARDING API HIT");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const stripeSessionId =
    typeof b.stripeSessionId === "string" ? b.stripeSessionId : null;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const businessName =
    typeof b.businessName === "string" ? b.businessName.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const businessType =
    typeof b.businessType === "string" ? b.businessType.trim() : "";
  const services = typeof b.services === "string" ? b.services.trim() : "";
  const location = typeof b.location === "string" ? b.location.trim() : "";
  const hasLogo = typeof b.hasLogo === "string" ? b.hasLogo.trim() : "";
  const hasDomain = typeof b.hasDomain === "string" ? b.hasDomain.trim() : "";
  const notes =
    typeof b.notes === "string" ? b.notes.trim() : "";

  if (
    !name ||
    !businessName ||
    !email ||
    !phone ||
    !businessType ||
    !services ||
    !location ||
    !hasLogo ||
    !hasDomain
  ) {
    console.log("ONBOARDING API: validation failed (missing fields)");
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  console.log("ONBOARDING API: validation OK, sending to Make webhook…");

  let textbackData = {
    businessName: "N/A",
    forwardPhoneNumber: "N/A",
    businessEmail: "N/A",
    autoReplyMessage: "N/A",
  };

  if (stripeSessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

      textbackData = {
        businessName: session.metadata?.businessName || "N/A",
        forwardPhoneNumber: session.metadata?.forwardPhoneNumber || "N/A",
        businessEmail: session.metadata?.businessEmail || "N/A",
        autoReplyMessage: session.metadata?.autoReplyMessage || "N/A",
      };

      console.log("✅ Retrieved Stripe metadata:", textbackData);
    } catch (err) {
      console.error("❌ Failed to retrieve Stripe session:", err);
    }
  }

  try {
    const webhookRes = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        businessName,
        email,
        phone,
        businessType,
        services,
        location,
        hasLogo,
        hasDomain,
        notes,
        createdAt: new Date().toISOString(),
      }),
    });
    console.log("ONBOARDING API: Make webhook HTTP status:", webhookRes.status);
    if (!webhookRes.ok) {
      console.error(
        "MAKE WEBHOOK ERROR:",
        webhookRes.status,
        await webhookRes.text()
      );
    }
  } catch (webhookErr) {
    console.error("MAKE WEBHOOK ERROR:", webhookErr);
  }

  const safe = {
    name: escapeHtml(name),
    businessName: escapeHtml(businessName),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    businessType: escapeHtml(businessType),
    services: escapeHtml(services),
    location: escapeHtml(location),
    hasLogo: escapeHtml(hasLogo),
    hasDomain: escapeHtml(hasDomain),
    notes: escapeHtml(notes),
  };
  const safeTextback = {
    businessName: escapeHtml(textbackData.businessName),
    forwardPhoneNumber: escapeHtml(textbackData.forwardPhoneNumber),
    businessEmail: escapeHtml(textbackData.businessEmail),
    autoReplyMessage: escapeHtml(textbackData.autoReplyMessage),
  };

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "ONBOARDING: RESEND_API_KEY not set; skipping email (webhook already sent)"
    );
    return NextResponse.json({ success: true });
  }

  try {
    await resend.emails.send({
      from: "Clearpath Systems <onboarding@resend.dev>",
      to: "george.clearpath@gmail.com",
      subject: "New Clearpath Client Submission 🚀",
      html: `
    <h2>New Client Submission</h2>
    <p><strong>Name:</strong> ${safe.name}</p>
    <p><strong>Business Name:</strong> ${safe.businessName}</p>
    <p><strong>Email:</strong> ${safe.email}</p>
    <p><strong>Phone:</strong> ${safe.phone}</p>
    <p><strong>Business Type:</strong> ${safe.businessType}</p>
    <p><strong>Services:</strong> ${safe.services}</p>
    <p><strong>Location:</strong> ${safe.location}</p>
    <p><strong>Has Logo:</strong> ${safe.hasLogo}</p>
    <p><strong>Has Domain:</strong> ${safe.hasDomain}</p>
    <p><strong>Notes:</strong> ${safe.notes || "—"}</p>
    <h3>TextBack Setup</h3>
    <p><strong>Business Name:</strong> ${safeTextback.businessName}</p>
    <p><strong>Forward Phone:</strong> ${safeTextback.forwardPhoneNumber}</p>
    <p><strong>Business Email:</strong> ${safeTextback.businessEmail}</p>
    <p><strong>Auto Reply:</strong> ${safeTextback.autoReplyMessage}</p>
  `,
    });

    if (isPlausibleClientEmail(email)) {
      try {
        await resend.emails.send({
          from: "Clearpath Systems <onboarding@resend.dev>",
          to: email,
          subject: "You're booked with Clearpath 🚀",
          html: CLIENT_CONFIRMATION_HTML,
        });
      } catch (clientErr) {
        console.error("CLIENT CONFIRMATION EMAIL ERROR:", clientErr);
      }
    } else {
      console.warn(
        "ONBOARDING: skipped client confirmation email (invalid email):",
        email
      );
    }

    console.log("ONBOARDING API: emails sent, returning success");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ONBOARDING EMAIL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send onboarding email." },
      { status: 500 }
    );
  }
}
