"use client";

import { Button } from "@heroui/react";

interface PaginationControlsProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  size?: "sm" | "md" | "lg";
}

const getPages = (page: number, total: number) => {
  const start = Math.max(1, page - 1);
  const end = Math.min(total, page + 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export function PaginationControls({
  page,
  total,
  onChange,
  size = "sm",
}: PaginationControlsProps) {
  const safeTotal = Math.max(1, total);
  const current = Math.min(Math.max(1, page), safeTotal);

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        isIconOnly         isDisabled={current <= 1}
        size={size}
        variant="tertiary"
        onPress={() => onChange(current - 1)}
      >
        Prev
      </Button>
      {getPages(current, safeTotal).map((item) => (
        <Button
          key={item}
          isIconOnly           size={size}
          variant={item === current ? "primary" : "tertiary"}
          onPress={() => onChange(item)}
        >
          {item}
        </Button>
      ))}
      <Button
        isIconOnly         isDisabled={current >= safeTotal}
        size={size}
        variant="tertiary"
        onPress={() => onChange(current + 1)}
      >
        Next
      </Button>
    </div>
  );
}
