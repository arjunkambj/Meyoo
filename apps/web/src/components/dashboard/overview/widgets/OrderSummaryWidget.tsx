"use client";

import { Card, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from "@/libs/utils/format";

interface MetricProps {
  label: string;
  value: number | string;
  change?: number;
  format?: "currency" | "number" | "percent";
  currency?: string;
  isPrimary?: boolean;
  hint?: string;
  goodWhenLower?: boolean;
  decimals?: number;
}

function Metric({
  label,
  value,
  change,
  format = "currency",
  currency = "USD",
  isPrimary = false,
  hint,
  goodWhenLower = false,
  decimals,
}: MetricProps) {
  const formatValue = () => {
    if (typeof value === "string") return value;

    switch (format) {
      case "currency": {
        return Math.abs(value) >= 10000000
          ? formatCurrencyCompact(value, currency)
          : formatCurrency(value, currency);
      }
      case "percent":
        return formatPercent(value, decimals ?? 1);
      default:
        if (decimals !== undefined) {
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(value);
        }
        return formatNumber(value);
    }
  };

  const isGood =
    change === undefined || change === 0
      ? null
      : goodWhenLower
        ? change < 0
        : change > 0;

  const changeBadgeClasses =
    change === undefined
      ? "bg-surface-secondary/80 dark:bg-surface-secondary/10 text-muted"
      : change === 0
        ? "bg-warning-100/60 dark:bg-warning-500/20 text-warning-700"
        : isGood
          ? "bg-success-100/60 dark:bg-success-500/20 text-success-700"
          : "bg-danger/60 dark:bg-danger/20 text-danger";

  // Match Customer metric container styles
  const containerClasses = isPrimary
    ? "py-2 px-3 bg-background border border-surface-tertiary rounded-xl hover:bg-surface-secondary transition-colors"
    : "py-2.5 px-3 border-b border-surface-tertiary last:border-0 hover:bg-surface-secondary transition-colors";

  return (
    <div className={containerClasses} >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className={`${isPrimary ? "text-sm font-semibold" : "text-xs font-medium"} text-muted`}
          >
            {label}
          </span>
          {hint && (
            <Tooltip delay={200} closeDelay={50}>
              <Tooltip.Trigger>
                <span className="text-muted cursor-help hover:text-muted transition-colors">
                <Icon icon="solar:info-circle-bold-duotone" width={16} />
              </span>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top">{hint}</Tooltip.Content>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className={`${isPrimary ? "text-xl font-bold" : "text-sm font-bold"} text-muted`}
          >
            {formatValue()}
          </span>
          {change !== undefined && (
            <div               className={`flex items-center gap-0.5 px-2 py-1 rounded-lg ${changeBadgeClasses}`}
            >
              <span className="text-xs font-semibold">
                {change >= 0 ? "+" : "-"}
                {Math.abs(change).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface OrderSummaryWidgetProps {
  avgOrderValue: number;
  avgOrderValueChange?: number;
  adSpendPerOrder: number;
  adSpendPerOrderChange?: number;
  avgOrderProfit: number;
  avgOrderProfitChange?: number;
  prepaidRate?: number;
  prepaidRateChange?: number;
  repeatRate?: number;
  repeatRateChange?: number;
  currency?: string;
  loading?: boolean;
}

export function OrderSummaryWidget({
  avgOrderValue,
  avgOrderValueChange,
  adSpendPerOrder,
  adSpendPerOrderChange,
  avgOrderProfit,
  avgOrderProfitChange,
  prepaidRate = 0,
  prepaidRateChange,
  repeatRate = 0,
  repeatRateChange,
  currency = "USD",
  loading = false,
}: OrderSummaryWidgetProps) {
  if (loading) {
    return (
      <Card
        className="p-6 bg-surface-secondary dark:bg-surface rounded-2xl border border-surface-tertiary/50"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-surface-tertiary rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-surface-tertiary rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-5 bg-surface-secondary dark:bg-surface border border-surface-tertiary rounded-2xl h-full"
    >
      <div className="mb-4 pb-4 border-b border-surface-tertiary">
        <div className="flex items-center gap-2.5">
          <Icon
            icon="solar:bag-check-bold-duotone"
            width={24}
            className="text-muted"
          />
          <h3 className="text-lg font-semibold text-muted">
            Order Summary
          </h3>
        </div>
      </div>

      <div className="space-y-1">
        <Metric
          change={avgOrderValueChange}
          currency={currency}
          format="currency"
          isPrimary={true}
          label="Average Order Value"
                    hint="Average revenue per order"
          value={avgOrderValue}
        />

        <Metric
          change={adSpendPerOrderChange}
          currency={currency}
          format="currency"
          label="Ad Spend / Order"
                    hint="Average ad spend associated with each order"
          goodWhenLower
          value={adSpendPerOrder}
        />

        <Metric
          change={avgOrderProfitChange}
          currency={currency}
          format="currency"
          label="Average Order Profit"
                    hint="Average profit per order (revenue - costs)"
          value={avgOrderProfit}
        />

        <Metric
          change={repeatRateChange}
          format="percent"
          label="Repeat Rate"
                    hint="Percentage of orders from returning customers"
          value={repeatRate}
        />

        <Metric
          change={prepaidRateChange}
          format="percent"
          label="Prepaid Rate"
                    hint="Share of orders paid in advance"
          value={prepaidRate}
        />
      </div>
    </Card>
  );
}
