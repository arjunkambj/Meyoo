"use client";

import { Input } from "@heroui/react";
import type { InputProps } from "@heroui/react";

import { sanitizeDecimal } from "./sanitize";

type NumericInputProps = Omit<
  InputProps,
  "onValueChange" | "type" | "inputMode"
> & {
  onValueChange?: (value: string) => void;
};

export function NumericInput({ onValueChange, ...rest }: NumericInputProps) {
  return (
    <Input
      {...rest}
      variant="secondary"
      type="number"
      inputMode="decimal"
      onChange={(event) => {
        const val = event.currentTarget.value;
        onValueChange?.(sanitizeDecimal(val));
      }}
    />
  );
}
