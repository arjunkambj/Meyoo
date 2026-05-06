"use client";

import { Button } from "@heroui/react";
import type { Route } from "next";
import Link from "next/link";
import type React from "react";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "danger"
    | "danger-soft"
    | "ghost";
  endIcon?: string;
  startIcon?: string;
  className?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

export default function CTAButton({
  href,
  children,
  size = "lg",
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  return (
    <Link href={href as Route}>
      <Button
        className={`font-semibold ${className}`}
        size={size}
        variant={variant}
      >
        {children}
      </Button>
    </Link>
  );
}
