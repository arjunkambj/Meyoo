"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/libs/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  return (
    <span
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className,
      )}
      {...props}
    >
      {Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(value)}
    </span>
  );
}
