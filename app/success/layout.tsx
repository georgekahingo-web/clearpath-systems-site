import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're booked | Clearpath Systems",
  description:
    "Your project is secured. We'll be in touch within 24 hours to begin.",
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
