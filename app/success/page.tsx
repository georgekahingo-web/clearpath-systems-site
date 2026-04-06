import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're booked | Clearpath Systems",
  description:
    "Your project is secured. We'll be in touch within 24 hours to begin.",
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-slate-900 md:py-32">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
          You&apos;re booked 🎉
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-slate-600 md:text-xl">
          Your project has been secured. We&apos;ll be in touch within 24 hours
          to begin.
        </p>

        <ul className="mx-auto mt-12 max-w-md space-y-4 text-left text-slate-600">
          <li className="flex gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-700"
              aria-hidden
            >
              ✓
            </span>
            <span className="leading-relaxed">
              Check your email for confirmation
            </span>
          </li>
          <li className="flex gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-700"
              aria-hidden
            >
              ✓
            </span>
            <span className="leading-relaxed">
              We&apos;ll reach out to gather your business details
            </span>
          </li>
        </ul>

        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-blue-100/90 bg-blue-50/80 px-6 py-8 text-center shadow-sm ring-1 ring-blue-100/40 backdrop-blur-sm md:px-8 md:py-9">
          <h2 className="text-lg font-bold leading-snug text-slate-900 md:text-xl">
            Next Step: Tell us about your business
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            This is required for us to begin building your website. It takes less
            than 2 minutes.
          </p>

          <Link
            href="/onboarding"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/40"
          >
            Complete Setup → Start My Project
          </Link>

          <p className="mt-4 text-xs leading-relaxed text-slate-500 md:text-sm">
            Projects begin only after this step is completed.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-700 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
