import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Clearpath Systems",
  description:
    "Tell us about your business so we can begin building your website.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
