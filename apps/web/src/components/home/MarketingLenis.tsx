"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

interface MarketingLenisProps {
  children: React.ReactNode;
}

export function MarketingLenis({ children }: MarketingLenisProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        anchors: true,
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
