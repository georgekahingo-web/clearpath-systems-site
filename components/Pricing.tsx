export default function Pricing() {
  return (
    <section className="px-6 py-40 bg-gray-50">
      
      {/* HEADER */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Simple, transparent pricing.
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Everything you need to launch a modern, high-converting website.
        </p>
      </div>

      {/* PRICING CARD */}
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white shadow-md p-10 border border-gray-100">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">

            {/* LEFT SIDE */}
            <div>
              <h3 className="text-2xl font-semibold">
                Website Build
              </h3>

              <p className="mt-2 text-gray-600">
                Custom-designed website built to make your business stand out and convert clients.
              </p>

              <ul className="mt-6 space-y-2 text-gray-600">
                <li>• Fully custom design</li>
                <li>• Mobile optimized</li>
                <li>• Booking integration</li>
                <li>• Fast load speeds</li>
              </ul>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-left md:text-right">
              <div className="text-4xl font-semibold">
                $499–$799
              </div>

              <p className="text-sm text-gray-500 mt-2">
                One-time payment
              </p>

              <p className="mt-4 text-sm text-gray-600">
                50% upfront, 50% upon delivery
              </p>

              <p className="mt-6 text-sm text-gray-500">
                + $50/month hosting & maintenance
              </p>

              <div className="mt-6">
                <a
                  href="https://calendly.com/george-clearpath/30min"
                  className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-500"
                >
                  Start Your Website
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}