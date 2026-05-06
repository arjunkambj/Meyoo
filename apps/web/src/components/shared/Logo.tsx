"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/libs/utils";

interface LogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  spacing?: "sm" | "md" | "lg";
  className?: string;
  href?: Route;
  ariaLabel?: string;
  mobileStacked?: boolean;
}

const SIZES = {
  sm: { image: 28, text: "text-lg", touch: "min-h-10 px-2 -mx-2" },
  md: { image: 34, text: "text-xl", touch: "min-h-11 px-2.5 -mx-2.5" },
  lg: { image: 42, text: "text-2xl", touch: "min-h-12 px-3 -mx-3" },
} as const;

const SPACING = {
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-3",
} as const;

export function Logo({
  variant = "full",
  size = "md",
  spacing = "md",
  className = "",
  href,
  ariaLabel,
  mobileStacked = false,
}: LogoProps) {
  const { image, text, touch } = SIZES[size];
  const textSizeClass = mobileStacked ? "text-sm sm:text-xl" : text;
  const containerClass = mobileStacked
    ? "flex-col items-start gap-0.5 sm:flex-row sm:items-center"
    : "items-center";

  const mark = (
    <>
      <Image
        alt={variant === "icon" ? "Meyoo" : ""}
        aria-hidden={variant === "full" ? true : undefined}
        className="block shrink-0 object-contain dark:hidden"
        height={image}
        src="/logo-black.svg"
        width={image}
      />
      <Image
        alt={variant === "icon" ? "Meyoo" : ""}
        aria-hidden={variant === "full" ? true : undefined}
        className="hidden shrink-0 object-contain dark:block"
        height={image}
        src="/logo-white.svg"
        width={image}
      />
    </>
  );

  const content = (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 select-none rounded-lg",
        variant === "full" ? cn("flex", containerClass, SPACING[spacing]) : "",
        href ? cn(touch, "items-center transition-colors") : "items-center",
        className,
      )}
    >
      {variant === "full" ? (
        <>
          {mark}
          <span
            className={cn(
              "font-bold leading-none text-foreground transition-colors group-hover:text-primary",
              textSizeClass,
            )}
          >
            Meyoo
          </span>
        </>
      ) : (
        mark
      )}
    </span>
  );

  return href ? (
    <Link
      aria-label={
        ariaLabel ??
        (href === "/overview" ? "Go to overview" : "Go to Meyoo home")
      }
      className="group inline-flex rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      href={href}
    >
      {content}
    </Link>
  ) : (
    content
  );
}
