"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type React from "react";

export function HomeMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
