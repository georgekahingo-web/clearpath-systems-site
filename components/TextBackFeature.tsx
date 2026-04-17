"use client";

export default function TextBackFeature() {
  const handleTextBackCheckout = () => {
    window.location.href = "/onboarding?flow=textback";
  };

  return (
    <section
      id="text-back"
      className="border-y border-slate-200/60 bg-white px-6 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
          Every Missed Call Is a Lost Customer — We Fix That
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
          When you miss a call, that customer usually moves on to the next business.
          Our Missed Call Recovery System instantly texts them back while also notifying you in real time
          — so you can follow up, stay in control, and turn lost opportunities into booked jobs.
          </p>
          <ul className="mt-8 space-y-3 text-slate-700">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Instant SMS response (within seconds)
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Real-time email alerts so you never miss a lead
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Convert missed calls into paying customers
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Works with your existing phone system — no disruption
            </li>
          </ul>
          <p className="mt-8 text-sm font-semibold leading-relaxed text-blue-600">
            Available as a standalone service or included in higher-tier website
            packages.
          </p>
          <div className="mt-10">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Start Recovering Missed Customers — Automatically
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Use Text-Back on its own or get it included with a high-converting
              website.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleTextBackCheckout}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
              >
                Get Text-Back
              </button>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                View Website Packages
              </a>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mx-auto mb-2 max-w-sm text-xs font-semibold text-blue-600">
            Auto-response sent after missed call
          </p>
          <div className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-900/10">
            <div className="space-y-3 rounded-2xl bg-white p-4">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-sm text-white">
                  Your custom auto-reply (configured per business in the dashboard)
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  Ac Repair services. 
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-sm text-white">
                  Got it! Your business is valuable to us. Our technicians will be contacting you shortly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
