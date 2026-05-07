"use client";

import { Pagination } from "@heroui/react";

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
    <Pagination className="justify-center" size={size}>
      <Pagination.Content className="gap-1 rounded-xl bg-content1 px-1 py-1">
        <Pagination.Item>
          <Pagination.Previous
            aria-label="Previous page"
            className="!size-7 !min-w-7 !gap-0 !rounded-[10px] !px-0"
            isDisabled={current === 1}
            onPress={() => onChange(current - 1)}
          >
            <Pagination.PreviousIcon />
          </Pagination.Previous>
        </Pagination.Item>
        {getPages(current, safeTotal).map((item) => (
          <Pagination.Item key={item}>
            <Pagination.Link
              className="!size-7 !rounded-[10px] data-[active=true]:!bg-accent data-[active=true]:!text-white"
              isActive={item === current}
              onPress={() => onChange(item)}
            >
              {item}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            aria-label="Next page"
            className="!size-7 !min-w-7 !gap-0 !rounded-[10px] !px-0"
            isDisabled={current === safeTotal}
            onPress={() => onChange(current + 1)}
          >
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
