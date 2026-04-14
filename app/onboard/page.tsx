"use client";

import { FormEvent, useState } from "react";

type FormDataState = {
  business_name: string;
  forward_to_number: string;
  business_email: string;
  auto_reply: string;
};

const initialFormData: FormDataState = {
  business_name: "",
  forward_to_number: "",
  business_email: "",
  auto_reply: "",
};

export default function OnboardPage() {
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to onboard client.");
        return;
      }

      setSuccessMessage("Client onboarded successfully.");
      setFormData(initialFormData);
    } catch {
      setErrorMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Client Onboarding</h1>
      <p className="mt-2 text-sm text-slate-600">
        Add a new client record to Supabase.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            Business Name
          </label>
          <input
            value={formData.business_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, business_name: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Acme Plumbing"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            Forward Phone Number
          </label>
          <input
            value={formData.forward_to_number}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                forward_to_number: e.target.value,
              }))
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="+15551234567"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            Business Email
          </label>
          <input
            type="email"
            value={formData.business_email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, business_email: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="owner@business.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            Auto Reply Message
          </label>
          <textarea
            value={formData.auto_reply}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, auto_reply: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            rows={4}
            placeholder="Hey! Sorry we missed your call - how can we help?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Create Client"}
        </button>
      </form>

      {successMessage ? (
        <p className="mt-4 text-sm text-green-700">{successMessage}</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-4 text-sm text-red-700">{errorMessage}</p>
      ) : null}
    </main>
  );
}
