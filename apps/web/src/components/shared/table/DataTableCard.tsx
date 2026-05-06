"use client";

import { Skeleton } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/libs/utils";

export const DATA_TABLE_CONTAINER_CLASS =
  "rounded-3xl bg-surface-secondary dark:bg-surface backdrop-blur-md";
export const DATA_TABLE_INNER_CLASS = "space-y-4 p-5 sm:p-6";
export const DATA_TABLE_TABLE_CLASS =
  "overflow-hidden rounded-2xl border bg-surface";
export const DATA_TABLE_HEADER_CLASS =
  "bg-transparent text-muted font-semibold uppercase tracking-wide text-[11px]";
export const DATA_TABLE_GROUP_ROW_BORDER_CLASS =
  "border-t border-default-border";
export const DATA_TABLE_ROW_BASE_BG = "bg-background";
export const DATA_TABLE_ROW_STRIPE_BG =
  "bg-surface-secondary dark:bg-surface/50";
export const DATA_TABLE_ROW_STRIPE_CHILD_BG =
  "bg-surface-secondary/40 dark:bg-surface/30";
export const DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS =
  "bg-background even:bg-surface-secondary dark:even:bg-surface/50 border-t border-default-border";
export const DATA_TABLE_INPUT_WRAPPER_CLASS =
  "bg-surface-secondary dark:bg-surface-secondary focus-within:ring-1 focus-within:ring-surface-tertiary";
export const DATA_TABLE_INPUT_CLASS = "text-sm text-muted";

interface DataTableCardProps {
  children: ReactNode;
  className?: string;
  topContent?: ReactNode;
  footerContent?: ReactNode;
  loading?: boolean;
  /** Number of skeleton rows to render when loading */
  skeletonRows?: number;
  /** Custom skeleton content for loading states */
  skeletonContent?: ReactNode;
  /** Height to use for the default skeleton rows */
  skeletonRowClassName?: string;
}

export function DataTableCard({
  children,
  className,
  topContent,
  footerContent,
  loading,
  skeletonRows = 5,
  skeletonContent,
  skeletonRowClassName = "h-12 w-full rounded-lg",
}: DataTableCardProps) {
  return (
    <section className={cn(DATA_TABLE_CONTAINER_CLASS, className)}>
      <div className={DATA_TABLE_INNER_CLASS}>
        {topContent}
        {loading
          ? (skeletonContent ?? (
              <div className="space-y-3">
                {Array.from({ length: skeletonRows }, (_, index) => (
                  <Skeleton
                    key={`data-table-card-skeleton-${index}`}
                    className={skeletonRowClassName}
                  />
                ))}
              </div>
            ))
          : children}
        {footerContent}
      </div>
    </section>
  );
}
