"use client";

import type React from "react";
import { useCallback, useRef } from "react";

import { cn } from "@/libs/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    const input = inputRefs.current[index];
    input?.focus();
    input?.select();
  }, []);

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const char = e.target.value.slice(-1).toUpperCase();
      if (!char) return;

      const nextValue = value.split("");
      nextValue[index] = char;
      onChange(nextValue.join("").slice(0, length));

      if (index < length - 1) focusInput(index + 1);
    },
    [value, onChange, length, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const nextValue = value.split("");
        if (value[index]) {
          nextValue[index] = "";
          onChange(nextValue.join(""));
          return;
        }

        if (index > 0) {
          nextValue[index - 1] = "";
          onChange(nextValue.join(""));
          focusInput(index - 1);
        }
      }

      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      }

      if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [value, onChange, length, focusInput],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .toUpperCase()
        .slice(0, length);
      onChange(pasted);
      focusInput(Math.min(pasted.length, length - 1));
    },
    [onChange, length, focusInput],
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className={cn(
            "flex h-12 w-11 items-center justify-center rounded-lg border bg-background text-center text-lg font-semibold tracking-widest transition-colors",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            value[index] ? "border-foreground/20" : "border-surface-tertiary",
          )}
          disabled={disabled}
          inputMode="text"
          maxLength={1}
          type="text"
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
