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
            A clear path from discovery to booking
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.06]">
            Websites that turn visitors into booked clients.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">
            Capture more leads with fast load times, conversion-focused layouts,
            and clear CTAs—so traffic becomes calls and bookings, not bounces.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://calendly.com/george-clearpath/30min"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:scale-105 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30"
            >
              Get Your Website
            </a>

            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/70 px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition hover:scale-105 hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              View Demo
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-0.5 text-amber-500" aria-hidden>
              ★★★★★
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden />
            <span>Trusted by local businesses</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-2xl lg:justify-self-end">
          <div
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/60 transition duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/15"
          >
            <div className="relative aspect-video w-full max-h-[400px] min-h-[180px]">
              <Image
                src="/barber-demo.png"
                alt="Website preview: modern local business site with booking focus"
                fill
                className="object-cover object-top transition duration-700 ease-out group-hover:brightness-[0.98]"
                sizes="(max-width: 1024px) 100vw, 672px"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-slate-900/5"
                aria-hidden
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm rounded-md">
              Barber Shop Website
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
