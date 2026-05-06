import type { ReactNode } from "react";
import { OnboardingLayoutClient } from "@/components/onboarding/layouts/OnboardingLayoutClient";
import { UserProvider } from "@/contexts/UserContext";
import { OnboardingProvider } from "@/hooks/onboarding/useOnboarding";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Removed server-side status check to avoid duplicate queries
  // OnboardingLayoutClient handles redirect logic via client-side query
  return (
    <UserProvider>
      <OnboardingProvider>
        <section>
          <OnboardingLayoutClient>
            <div className="w-full h-full">{children}</div>
          </OnboardingLayoutClient>
        </section>
      </OnboardingProvider>
    </UserProvider>
  );
}
export const dynamic = "force-dynamic";
