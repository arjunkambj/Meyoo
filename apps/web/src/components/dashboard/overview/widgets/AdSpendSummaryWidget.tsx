"use client";

import { Card, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { formatCurrency, formatCurrencyCompact } from "@/libs/utils/format";

interface MetricProps {
  label: string;
  value: number | string;
  change?: number;
  format?: "currency" | "decimal" | "percentage";
  currency?: string;
  isPrimary?: boolean;
  hint?: string;
  goodWhenLower?: boolean;
}

function Metric({
  label,
  value,
  change,
  format = "decimal",
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
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(2);
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
      ? "bg-surface-secondary/80 text-foreground"
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
            className={`${isPrimary ? "text-sm font-semibold" : "text-xs font-medium"} text-foreground`}
          >
            {label}
          </span>
          {hint && (
            <Tooltip delay={200} closeDelay={50}>
              <Tooltip.Trigger>
                <span className="text-foreground cursor-help hover:text-foreground transition-colors">
                <Icon icon="solar:info-circle-bold-duotone" width={16} />
              </span>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top">{hint}</Tooltip.Content>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className={`${isPrimary ? "text-xl font-bold" : "text-sm font-bold"} text-foreground`}
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

interface AdSpendSummaryWidgetProps {
  totalAdSpend: number;
  adSpendChange?: number;
  roas: number;
  roasChange?: number;
  poas: number;
  poasChange?: number;
  ncROAS: number;
  ncROASChange?: number;
  roasUTM: number;
  roasUTMChange?: number;
  currency?: string;
  loading?: boolean;
}

export function AdSpendSummaryWidget({
  totalAdSpend,
  adSpendChange,
  roas,
  roasChange,
  poas,
  poasChange,
  ncROAS,
  ncROASChange,
  roasUTM,
  roasUTMChange,
  currency = "USD",
  loading = false,
}: AdSpendSummaryWidgetProps) {
  if (loading) {
    return (
      <Card
        className="p-6 bg-surface-secondary rounded-2xl border border-surface-tertiary/50"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-surface-tertiary rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-surface-tertiary rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-5 bg-surface-secondary border border-surface-tertiary rounded-2xl h-full"
    >
      <div className="mb-4 pb-4 border-b border-surface-tertiary">
        <div className="flex items-center gap-2.5">
          <Icon
            icon="solar:chart-square-bold-duotone"
            width={20}
            className="text-foreground"
          />
          <h3 className="text-lg font-semibold text-foreground">
            Ad Spend Summary
          </h3>
        </div>
      </div>

      <div className="space-y-1">
        <Metric
          change={adSpendChange}
          currency={currency}
          format="currency"
          isPrimary={true}
          label="Total Ad Spend"
                    hint="Total advertising spend across all channels"
          goodWhenLower
          value={totalAdSpend}
        />

        <Metric
          change={roasChange}
          format="decimal"
          label="ROAS"
                    hint="Return on Ad Spend (Revenue / Ad Spend)"
          value={roas}
        />

        <Metric
          change={poasChange}
          format="decimal"
          label="POAS"
                    hint="Profit on Ad Spend (Profit / Ad Spend)"
          value={poas}
        />

        <Metric
          change={ncROASChange}
          format="decimal"
          label="NC ROAS"
                    hint="New Customer Return on Ad Spend"
          value={ncROAS}
        />

        <Metric
          change={roasUTMChange}
          format="decimal"
          label="UTM ROAS"
                    hint="ROAS calculated from UTM-tracked conversions"
          value={roasUTM}
        />
      </div>
    </Card>
  );
}
