"use client";

import { HeroUIProvider } from "@heroui/react";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import { FeatureAccessProvider } from "@/hooks/mainapp/useFeatureAccess";
import { OnboardingProvider } from "@/hooks/onboarding/useOnboarding";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexClientProvider>
      <JotaiProvider>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <OnboardingProvider>
              <FeatureAccessProvider>{children}</FeatureAccessProvider>
            </OnboardingProvider>
          </ThemeProvider>
        </HeroUIProvider>
      </JotaiProvider>
    </ConvexClientProvider>
  );
}
