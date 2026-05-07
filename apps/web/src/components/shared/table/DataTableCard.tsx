"use client";

import { Skeleton } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/libs/utils";

export const DATA_TABLE_CONTAINER_CLASS =
  "rounded-3xl bg-surface-secondary dark:bg-surface backdrop-blur-md";
export const DATA_TABLE_INNER_CLASS = "space-y-4 p-5 sm:p-6";
export const DATA_TABLE_SHELL_CLASS =
  "overflow-hidden rounded-2xl border bg-surface shadow-none";
export const DATA_TABLE_TABLE_CLASS = `${DATA_TABLE_SHELL_CLASS} !bg-surface !p-0 gap-0 [&>div]:!gap-0 [&>div]:!rounded-none [&>div]:!bg-transparent [&>div]:!p-0 [&>div]:!shadow-none [&_table]:!w-full [&_table]:!min-w-fit [&_table]:!border-separate [&_table]:!border-spacing-0 [&_table]:!text-sm [&_thead]:!bg-surface-secondary [&_th]:!h-auto [&_th]:!rounded-none [&_th]:!border-b [&_th]:!bg-surface-secondary [&_th]:!px-3 [&_th]:!py-3 [&_th]:!text-left [&_th]:!text-xs [&_th]:!font-medium [&_th]:!text-foreground [&_th:not(:first-child)]:!border-l [&_tbody_tr]:!border-b-0 [&_td]:!rounded-none [&_td]:!border-b [&_td]:!px-3 [&_td]:!py-2 [&_tbody_tr]:transition-all [&_tbody_tr]:duration-200 [&_tbody_tr:hover]:bg-surface [&_tbody_tr:last-child>*]:!border-b-0 [&_tbody_tr:only-child>*]:!border-b-0`;
export const DATA_TABLE_HEADER_CLASS =
  "bg-transparent text-muted font-semibold uppercase tracking-wide text-[11px]";
export const DATA_TABLE_GROUP_ROW_BORDER_CLASS = "";
export const DATA_TABLE_ROW_BASE_BG = "";
export const DATA_TABLE_ROW_STRIPE_BG = "";
export const DATA_TABLE_ROW_STRIPE_CHILD_BG = "";
export const DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS =
  "transition-all duration-200 hover:bg-surface";
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
