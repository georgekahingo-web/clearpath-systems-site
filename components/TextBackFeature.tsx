"use client";

export default function TextBackFeature() {
  const handleTextBackCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/textback", {
        method: "POST",
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Text-Back checkout error:", err);
    }
  };

  return (
    <section
      id="text-back"
      className="border-y border-slate-200/60 bg-white px-6 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
            Never Miss a Lead Again
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            When a customer calls and no one answers, an automatic text can go
            out instantly — helping local businesses turn missed calls into real
            conversations.
          </p>
          <ul className="mt-8 space-y-3 text-slate-700">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Instant SMS response (within seconds)
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Turn missed calls into real conversations
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Built specifically for local service businesses
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Simple setup — no new tools to learn
            </li>
          </ul>
          <p className="mt-8 text-sm font-semibold leading-relaxed text-blue-600">
            Available as a standalone service or included in higher-tier website
            packages.
          </p>
          <div className="mt-10">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Start capturing missed leads today
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
                  Hey! Sorry we missed your call — how can we help?
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
