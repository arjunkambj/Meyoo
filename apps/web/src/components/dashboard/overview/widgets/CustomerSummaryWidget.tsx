"use client";

import { Card, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
} from "@/libs/utils/format";

interface MetricProps {
  label: string;
  value: number | string;
  change?: number;
  format?: "number" | "percentage" | "currency";
  currency?: string;
  isPrimary?: boolean;
  hint?: string;
  goodWhenLower?: boolean;
}

function Metric({
  label,
  value,
  change,
  format = "number",
  currency = "USD",
  isPrimary = false,
  hint,
  goodWhenLower = false,
}: MetricProps) {
  const formatValue = () => {
    if (typeof value === "string") return value;

    switch (format) {
      case "currency": {
        return Math.abs(value) >= 10000000
          ? formatCurrencyCompact(value, currency)
          : formatCurrency(value, currency);
      }
      case "percentage":
        return `${value.toFixed(0)}%`;
      default:
        return formatNumber(value);
    }
  };

  // Align change chip design with Order/AdSpend widgets
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

interface CustomerSummaryWidgetProps {
  totalCustomers: number;
  totalCustomersChange?: number;
  returningCustomers: number;
  returningCustomersChange?: number;
  newCustomers: number;
  newCustomersChange?: number;
  repurchaseRate: number;
  repurchaseRateChange?: number;
  abandonedCustomers: number;
  abandonedRate: number;
  abandonedRateChange?: number;
  loading?: boolean;
}

export function CustomerSummaryWidget({
  totalCustomers,
  totalCustomersChange,
  returningCustomers,
  returningCustomersChange,
  newCustomers,
  newCustomersChange,
  repurchaseRate,
  repurchaseRateChange,
  abandonedCustomers,
  abandonedRate,
  abandonedRateChange,
  loading = false,
}: CustomerSummaryWidgetProps) {
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
            icon="solar:users-group-rounded-bold-duotone"
            width={24}
            className="text-muted"
          />
          <h3 className="text-lg font-semibold text-muted">
            Customer Summary
          </h3>
        </div>
      </div>

      <div className="space-y-1">
        <Metric
          change={totalCustomersChange}
          format="number"
          isPrimary
          label="Total Customers"
                    hint="Unique customers in the selected period"
          value={totalCustomers}
        />

        <Metric
          change={repurchaseRateChange}
          format="percentage"
          label="Repurchase Rate"
                    hint="Percentage of customers who purchased again"
          value={repurchaseRate}
        />

        <Metric
          change={returningCustomersChange}
          format="number"
          label="Returning Customers"
                    hint="Customers who purchased more than once"
          value={returningCustomers}
        />

        <Metric
          change={newCustomersChange}
          format="number"
          label="New Customers"
                    hint="First-time customers acquired"
          value={newCustomers}
        />

        <Metric
          change={abandonedRateChange}
          format="number"
          label="Abandoned Customers"
                    hint={`Customers without an order in this period • Rate: ${abandonedRate.toFixed(1)}%`}
          value={abandonedCustomers}
        />
      </div>
    </Card>
  );
}
