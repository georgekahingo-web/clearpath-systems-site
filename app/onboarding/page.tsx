"use client";

import { type FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FLOW_TEXTBACK = "textback";

const ONBOARDING_HEADLINE = {
  website: "Let's get your website started",
  textback: "Activate Your Customer Response System",
} as const;

const ONBOARDING_DESCRIPTION = {
  website:
    "Tell us about your business so we can begin building immediately.",
  textback:
    "We'll use this information to configure your missed-call text and email automation.",
} as const;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

type BusinessType = "" | "HVAC" | "Barber" | "Med Spa" | "Other";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-16 text-slate-900 md:py-24">
          <div className="mx-auto max-w-xl text-center text-sm text-slate-500">
            Loading…
          </div>
        </main>
      }
    >
      <OnboardingPageContent />
    </Suspense>
  );
}

function OnboardingPageContent() {
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");
  const isTextBackFlow = flow === FLOW_TEXTBACK;

  const headline = isTextBackFlow
    ? ONBOARDING_HEADLINE.textback
    : ONBOARDING_HEADLINE.website;
  const description = isTextBackFlow
    ? ONBOARDING_DESCRIPTION.textback
    : ONBOARDING_DESCRIPTION.website;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [city, setCity] = useState("");
  const [hasLogo, setHasLogo] = useState<"yes" | "no" | "">("");
  const [hasDomain, setHasDomain] = useState<"yes" | "no" | "">("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("[onboarding] Form submit triggered");

    setSubmitError(null);
    setSubmitting(true);

    if (isTextBackFlow) {
      const businessNameValue = businessName.trim();
      const forwardPhoneNumber = phone.trim();
      const businessEmail = email.trim();
      const autoReplyMessage = additionalNotes.trim();

      if (
        !businessNameValue ||
        !forwardPhoneNumber ||
        !businessEmail ||
        !autoReplyMessage
      ) {
        setSubmitError("Please complete all TextBack onboarding fields.");
        setSubmitting(false);
        return;
      }

      try {
        const businessName = businessNameValue;
        console.log("🚀 Sending form data:", {
          businessName,
          forwardPhoneNumber,
          businessEmail,
          autoReplyMessage,
        });

        const res = await fetch("/api/stripe/textback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessName,
            forwardPhoneNumber,
            businessEmail,
            autoReplyMessage,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.url) {
          throw new Error(data.error || "Checkout failed");
        }

        window.location.href = data.url;
        return;
      } catch (error) {
        console.error("TextBack checkout error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to start checkout. Please try again.";
        setSubmitError(message);
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      name: fullName,
      businessName,
      email,
      phone,
      businessType,
      services: servicesOffered,
      location: city,
      hasLogo,
      hasDomain,
      notes: additionalNotes,
    };

    console.log("Submitting onboarding form:", payload);

    const apiUrl = `${window.location.origin}/api/onboarding`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server.");
      }

      console.log("API response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-slate-900 md:py-32">
        <div className="mx-auto max-w-lg text-center">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700"
            aria-hidden
          >
            ✓
          </div>
          <h1 className="text-xl font-semibold leading-relaxed text-slate-900 md:text-2xl">
            You&apos;re all set. We&apos;ll begin your project and contact you
            shortly.
          </h1>
          <Link
            href="/"
            className="mt-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-16 text-slate-900 md:py-24">
      <div className="mx-auto max-w-xl">
        <header className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {description}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-lg shadow-slate-200/40 backdrop-blur-sm md:p-10"
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="businessName" className={labelClass}>
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="businessType" className={labelClass}>
                Type of Business
              </label>
              <select
                id="businessType"
                name="businessType"
                required
                value={businessType}
                onChange={(e) =>
                  setBusinessType(e.target.value as BusinessType)
                }
                className={`${inputClass} cursor-pointer`}
              >
                <option value="" disabled>
                  Select a type
                </option>
                <option value="HVAC">HVAC</option>
                <option value="Barber">Barber</option>
                <option value="Med Spa">Med Spa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="servicesOffered" className={labelClass}>
                Services Offered
              </label>
              <textarea
                id="servicesOffered"
                name="servicesOffered"
                rows={4}
                required
                value={servicesOffered}
                onChange={(e) => setServicesOffered(e.target.value)}
                className={`${inputClass} resize-y min-h-[100px]`}
                placeholder="List the main services customers book with you."
              />
            </div>

            <div>
              <label htmlFor="city" className={labelClass}>
                City / Location
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                placeholder="e.g. Austin, TX"
              />
            </div>

            <fieldset>
              <legend className={labelClass}>Do you have a logo?</legend>
              <div className="mt-2 flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="hasLogo"
                    value="yes"
                    checked={hasLogo === "yes"}
                    onChange={() => setHasLogo("yes")}
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="hasLogo"
                    value="no"
                    checked={hasLogo === "no"}
                    onChange={() => setHasLogo("no")}
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  No
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>Do you have a domain?</legend>
              <div className="mt-2 flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="hasDomain"
                    value="yes"
                    checked={hasDomain === "yes"}
                    onChange={() => setHasDomain("yes")}
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="hasDomain"
                    value="no"
                    checked={hasDomain === "no"}
                    onChange={() => setHasDomain("no")}
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  No
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="additionalNotes" className={labelClass}>
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className={`${inputClass} resize-y min-h-[80px]`}
                placeholder="Anything else we should know?"
              />
            </div>
          </div>

          {submitError ? (
            <p
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-10 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/35 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {submitting ? "Submitting..." : "Start My Project"}
          </button>
        </form>
      </div>
    </main>
  );
}
