import { Suspense, type ReactNode } from "react";
import { ensureNeedsOnboarding } from "@/app/onboarding-functions";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { OnboardingLayoutClient } from "@/components/onboarding/layouts/OnboardingLayoutClient";
import { UserProvider } from "@/contexts/UserContext";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  await ensureNeedsOnboarding();

  return (
    <Suspense fallback={null}>
      <ConvexClientProvider>
        <UserProvider>
          <section>
            <OnboardingLayoutClient>
              <div className="w-full h-full">{children}</div>
            </OnboardingLayoutClient>
          </section>
        </UserProvider>
      </ConvexClientProvider>
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
