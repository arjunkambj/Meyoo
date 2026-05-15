"use client";

import { ReactLenis } from "lenis/react";

interface MarketingLenisProps {
  children: React.ReactNode;
}

export function MarketingLenis({ children }: MarketingLenisProps) {
  return (
    <ReactLenis
      root
      options={{
        anchors: true,
        autoRaf: true,
        lerp: 0.08,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
