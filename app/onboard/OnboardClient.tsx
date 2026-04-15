"use client";

import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

type OnboardClientProps = {
  children: (sessionId: string | null) => ReactNode;
};

export default function OnboardClient({ children }: OnboardClientProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return children(sessionId);
}
