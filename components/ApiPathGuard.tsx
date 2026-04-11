"use client";

import { useEffect } from "react";

/** Redirects away from /api/* if the user lands there (e.g. back button). */
export default function ApiPathGuard() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/api")) {
        window.location.replace("/");
      }
    }
  }, []);

  return null;
}
