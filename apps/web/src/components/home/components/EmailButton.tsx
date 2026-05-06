"use client";

import { Button } from "@heroui/react";
import type React from "react";

interface EmailButtonProps {
  email: string;
  subject?: string;
  body?: string;
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
  startIcon?: string;
  className?: string;
}

export default function EmailButton({
  email,
  subject = "",
  body = "",
  children,
  size = "lg",
  variant = "primary",
  className = "",
}: EmailButtonProps) {
  const mailtoLink = `mailto:${email}${subject || body ? "?" : ""}${
    subject ? `subject=${encodeURIComponent(subject)}` : ""
  }${subject && body ? "&" : ""}${body ? `body=${encodeURIComponent(body)}` : ""}`;

  return (
    <a href={mailtoLink}>
      <Button
        className={className}
        size={size}
       
        variant={variant}
      >
        {children}
      </Button>
    </a>
  );
}
