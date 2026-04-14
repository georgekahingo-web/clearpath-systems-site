"use client";

const CORE_FEATURES = [
  "Conversion-optimized design",
  "Mobile-first experience",
  "Fast load speeds",
  "Lead capture forms",
  "Booking-ready layout",
  "SEO-ready structure",
  "1–3 day turnaround",
] as const;

const GROWTH_EXTRAS = [
  "Text-Back feature included (never miss a lead)",
  "Priority delivery",
  "Custom branding",
  "Conversion optimization tweaks",
] as const;

const SCALE_EXTRAS = [
  "Text-Back + CRM integration",
  "Advanced automation workflows",
  "Dedicated strategy support",
] as const;

const checkoutButtonClass =
  "mt-10 block w-full rounded-xl bg-blue-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/35 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100";

export default function Pricing() {
  const handleCheckout = async (plan: "starter" | "growth") => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error("❌ Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <section id="pricing" className="bg-white px-6 py-24 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center md:mb-16">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
            Simple, transparent pricing.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Everything you need to launch a high-converting website that brings
            in real customers.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {/* Starter */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/40 p-8 shadow-lg ring-1 ring-slate-200/60 md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Starter</h3>
              <p className="mt-1 text-sm font-medium text-blue-700">
                For businesses that need a professional online presence.
              </p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  $999
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Does not include Text-Back lead recovery
              </p>
            </div>

            <ul className="mt-8 flex-1 space-y-3 text-sm leading-relaxed text-slate-600">
              {CORE_FEATURES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-600" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleCheckout("starter")}
              className={checkoutButtonClass}
            >
              Get My Website
            </button>
          </div>

          {/* Growth — highlighted */}
          <div className="relative flex flex-col rounded-xl border-2 border-blue-500/50 bg-white p-8 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20 md:p-10 lg:scale-[1.03]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
              Most Popular
            </span>

            <div className="pt-2">
              <h3 className="text-xl font-semibold text-slate-900">Growth</h3>
              <p className="mt-1 text-sm font-medium text-blue-700">
                For businesses that want more leads, faster responses, and more booked jobs.
              </p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  $1,999
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Everything in Starter, plus built-in lead recovery
              </p>
            </div>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
              {CORE_FEATURES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-600" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-4 space-y-3 border-t border-slate-200/80 pt-4 text-sm font-medium text-slate-800">
              {GROWTH_EXTRAS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-600" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleCheckout("growth")}
              className={checkoutButtonClass}
            >
              Get More Leads
            </button>
          </div>

          {/* Scale */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/40 p-8 shadow-lg ring-1 ring-slate-200/60 md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Scale</h3>
              <p className="mt-1 text-sm font-medium text-blue-700">
                For businesses ready to scale aggressively and automate their growth.
              </p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  $2,999+
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Everything in Growth, plus advanced automation
              </p>
            </div>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
              {CORE_FEATURES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-600" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-4 flex-1 space-y-3 border-t border-slate-200/80 pt-4 text-sm font-medium text-slate-800">
              {SCALE_EXTRAS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-600" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://calendly.com/george-clearpath/30min"
              className="mt-10 block w-full rounded-xl bg-blue-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/35"
            >
              Book Scale Plan
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <div
            className="mx-auto mb-6 h-px w-16 bg-gray-300"
            aria-hidden
          />
          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold text-gray-900 lg:text-lg">
                +$50/month Website Care Plan{" "}
                <span className="text-sm font-normal text-gray-500">
                  (optional)
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Includes hosting, maintenance, updates, and ongoing support
              </p>
            </div>

            <p className="font-medium text-gray-800">
              50% upfront, 50% upon completion
            </p>

            <p className="text-sm text-gray-500">
              Designed to generate leads—not just look good.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
