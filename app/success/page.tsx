"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FLOW_TEXTBACK = "textback";

const SUCCESS_TITLE = {
  website: "Your Website Project Is Underway",
  textback: "Your Customer Response System Is Activated",
} as const;

const SUCCESS_LEAD = {
  website:
    "We're getting started on your website. You'll be contacted shortly to begin the build process.",
  textback:
    "We're setting up your missed-call text and email automation. You'll be contacted shortly to finalize your setup.",
} as const;

const ONBOARDING_CARD_COPY = {
  website:
    "This is required for us to begin building your website. It takes less than 2 minutes.",
  textback:
    "This is required to configure your missed-call automation. It takes less than 2 minutes.",
} as const;

const TEXTBACK_REASSURANCE = [
  "Works with your existing phone number",
  "Setup typically completed within 24 hours",
  "No website required",
] as const;

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-slate-900 md:py-32">
          <div className="mx-auto max-w-lg text-center text-sm text-slate-500">
            Loading…
          </div>
        </main>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");
  const product = searchParams.get("product");
  const isTextBackFlow =
    flow === FLOW_TEXTBACK || product === FLOW_TEXTBACK;

  const title = isTextBackFlow ? SUCCESS_TITLE.textback : SUCCESS_TITLE.website;
  const lead = isTextBackFlow ? SUCCESS_LEAD.textback : SUCCESS_LEAD.website;
  const onboardingCardText = isTextBackFlow
    ? ONBOARDING_CARD_COPY.textback
    : ONBOARDING_CARD_COPY.website;

  const onboardingHref = isTextBackFlow
    ? "/onboarding?flow=textback"
    : "/onboarding";

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-slate-900 md:py-32">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
          {title}
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-slate-600 md:text-xl">
          {lead}
        </p>

        {isTextBackFlow ? (
          <ul className="mx-auto mt-6 max-w-md space-y-1 text-left text-sm text-slate-500">
            {TEXTBACK_REASSURANCE.map((line) => (
              <li key={line}>✔ {line}</li>
            ))}
          </ul>
        ) : null}

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
              {isTextBackFlow
                ? "We'll reach out to finalize your Text-Back setup"
                : "We'll reach out to gather your business details"}
            </span>
          </li>
        </ul>

        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-blue-100/90 bg-blue-50/80 px-6 py-8 text-center shadow-sm ring-1 ring-blue-100/40 backdrop-blur-sm md:px-8 md:py-9">
          <h2 className="text-lg font-bold leading-snug text-slate-900 md:text-xl">
            Next Step: Tell us about your business
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            {onboardingCardText}
          </p>

          <Link
            href={onboardingHref}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/40"
          >
            Complete Setup → Start My Project
          </Link>

          <p className="mt-4 text-xs leading-relaxed text-slate-500 md:text-sm">
            {isTextBackFlow
              ? "Activation continues only after this step is completed."
              : "Projects begin only after this step is completed."}
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
