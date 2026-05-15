"use client";

import { Provider as JotaiProvider } from "jotai";
import React from "react";

import { FeatureAccessProvider } from "@/hooks/mainapp/useFeatureAccess";
import { ThemeProvider } from "./theme/ThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <JotaiProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <FeatureAccessProvider>{children}</FeatureAccessProvider>
      </ThemeProvider>
    </JotaiProvider>
  );
}
