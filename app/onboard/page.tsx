import { Suspense } from "react";
import OnboardClient from "./OnboardClient";
import OnboardForm from "./OnboardForm";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OnboardClient>
        {(sessionId) => <OnboardForm sessionId={sessionId} />}
      </OnboardClient>
    </Suspense>
  );
}
