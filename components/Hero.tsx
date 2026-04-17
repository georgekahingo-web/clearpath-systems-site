import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-24 md:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -right-24 -top-28 h-[28rem] w-[28rem] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -left-32 top-1/4 h-[22rem] w-[22rem] rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="max-w-xl lg:max-w-none">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          A Clear Path to Every Customer — Even the Ones You Miss
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.06]">
          Turn Every Customer Interaction Into a Booking
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">
          We build systems that capture, respond, and convert every lead — from website visit to missed call — so you don’t lose revenue.
          </p>

          <div className="mt-10 flex flex-col items-start gap-3">
            <a
              href="https://calendly.com/george-clearpath/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/80 px-5 py-3.5 text-sm font-semibold tracking-tight text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-white"
            >
              Book a Consultation
            </a>

            <div className="flex flex-wrap gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:scale-105 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30"
              >
                Get Your Website
              </a>

              <a
                href="#portfolio"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/70 px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition hover:scale-105 hover:border-slate-300 hover:bg-white hover:shadow-md"
              >
                View Demo
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-0.5 text-amber-500" aria-hidden>
              ★★★★★
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden />
            <span>Trusted by local businesses</span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-xl justify-end lg:justify-self-end">
          <div className="relative h-[320px] w-full max-w-xl sm:h-[360px] md:h-[400px]">
            <div className="relative z-30 ml-auto h-[58%] w-[76%] overflow-hidden rounded-xl border border-white/10 shadow-xl transition-all duration-300">
              <Image
                src="/barber-hero.png"
                alt="Barber demo hero section preview"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
            </div>

            <div className="absolute bottom-3 left-0 z-20 hidden h-[36%] w-[44%] -translate-y-2 overflow-hidden rounded-xl border border-white/10 shadow-xl transition-all duration-300 md:block">
              <Image
                src="/barber-reviews.png"
                alt="Barber demo reviews section preview"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 28vw, 220px"
              />
            </div>

            <div className="absolute bottom-0 right-0 z-10 hidden h-[42%] w-[52%] overflow-hidden rounded-xl border border-white/10 shadow-xl transition-all duration-300 md:block">
              <Image
                src="/images/barber-services.png"
                alt="Barber demo booking section preview"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 32vw, 260px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
