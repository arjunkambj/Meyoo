"use client";

import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";

import { useQuery } from "convex-helpers/react/cache/hooks";

import { tiers } from "@/components/home/pricing/constants";
import { TiersEnum } from "@/components/home/pricing/types";
import { PlanOverviewSkeleton } from "@/components/shared/skeletons";
import { api } from "@/libs/convexApi";

type PlanKey = "free" | "starter" | "growth" | "business";

const PLAN_KEY_TO_LABEL: Record<PlanKey, string> = {
  free: "Free Plan",
  starter: "Starter Plan",
  growth: "Growth Plan",
  business: "Business Plan",
};

const PLAN_KEY_TO_TIER: Record<PlanKey, TiersEnum> = {
  free: TiersEnum.Free,
  starter: TiersEnum.Pro,
  growth: TiersEnum.Team,
  business: TiersEnum.Custom,
};

const PLAN_PRICES: Record<PlanKey, string> = {
  free: "$0/month",
  starter: "$40/month",
  growth: "$90/month",
  business: "$160/month",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  trial: "Trial",
  cancelled: "Cancelled",
  suspended: "Suspended",
};

export default function PlanOverview() {
  const userBilling = useQuery(api.core.organizationBilling.getCurrentBilling);
  const userUsage = useQuery(api.core.organizationBilling.getCurrentUsage);

  const currentPlanKey = (userBilling?.plan ?? "free") as PlanKey;
  const planLabel = PLAN_KEY_TO_LABEL[currentPlanKey];
  const planPrice = PLAN_PRICES[currentPlanKey];

  const currentTier = useMemo(
    () =>
      tiers.find((tier) => tier.key === PLAN_KEY_TO_TIER[currentPlanKey]) ?? null,
    [currentPlanKey],
  );

  if (userBilling === undefined || userUsage === undefined) {
    return <PlanOverviewSkeleton />;
  }

  const statusLabel = userBilling?.status
    ? STATUS_LABELS[userBilling.status] ?? userBilling.status
    : STATUS_LABELS.active;

  const ordersLast30Days = userUsage?.ordersLast30Days ?? 0;
  const orderLimit = userUsage?.orderLimit ?? 300;
  const remainingOrders = Math.max(0, orderLimit - ordersLast30Days);
  const usageStats = [
    {
      label: "Used",
      value: ordersLast30Days.toLocaleString(),
      helper: "Last 30 days",
    },
    {
      label: "Limit",
      value: orderLimit.toLocaleString(),
      helper: "Orders/month",
    },
    {
      label: "Remaining",
      value: remainingOrders.toLocaleString(),
      helper: "Before overage",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              Current Plan
            </h3>
            <Chip
              color={currentPlanKey === "free" ? "default" : "accent"}
              size="sm"
              variant="soft"
            >
              {currentTier?.title ?? planLabel.replace(" Plan", "")}
            </Chip>
            <Chip color="success" size="sm" variant="soft">
              {statusLabel}
            </Chip>
          </div>
          <p className="text-xs text-muted">
            Usage resets monthly based on the last 30 days of synced orders.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 md:text-right">
          <Icon
            className="text-accent"
            icon="solar:card-bold-duotone"
            width={18}
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{planPrice}</p>
            <p className="text-xs text-muted">
              {currentTier?.title ?? planLabel.replace(" Plan", "")} billing
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {usageStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-surface px-3 py-2 shadow-none"
          >
            <p className="text-xs font-medium text-muted">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted">{stat.helper}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
