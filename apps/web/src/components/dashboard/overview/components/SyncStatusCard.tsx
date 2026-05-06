"use client";

import { Card, Chip, Spinner } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";

export type SyncCardState = "syncing" | "waiting" | "failed";

export type SyncStageInfo = {
  key: "products" | "inventory" | "customers" | "orders";
  label: string;
  completed: boolean;
};

export type SyncStatusCardData = {
  platform: "shopify";
  state: SyncCardState;
  message: string;
  progress: null;
  stages: SyncStageInfo[];
  lastUpdated: number | null;
  error?: string | null;
  pendingPlatforms: string[];
};

type Props = {
  isLoading: boolean;
  data: SyncStatusCardData | null;
};

type ChipColor = "default" | "accent" | "success" | "warning" | "danger";

const STATE_META: Record<
  SyncCardState,
  { label: string; color: ChipColor; icon: string }
> = {
  syncing: {
    label: "Sync in ProgressBar",
    color: "warning",
    icon: "solar:refresh-circle-bold-duotone",
  },
  waiting: {
    label: "Awaiting Sync",
    color: "accent",
    icon: "solar:clock-circle-broken",
  },
  failed: {
    label: "Sync Failed",
    color: "danger",
    icon: "solar:danger-triangle-bold-duotone",
  },
};

const formatLastUpdated = (timestamp: number | null) => {
  if (!timestamp) {
    return null;
  }

  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (_error) {
    return null;
  }
};

export function SyncStatusCard({ isLoading, data }: Props) {
  if (isLoading && !data) {
    return (
      <Card className="border border-warning-200/70 bg-warning-50/40 dark:border-warning-200/30 dark:bg-warning-100/10">
        <Card.Content className="flex items-center gap-2 py-3 text-sm text-warning-700 dark:text-warning-400">
          <Spinner size="sm" color="warning" />
          Checking sync status...
        </Card.Content>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const stateMeta = STATE_META[data.state];
  const lastUpdated = formatLastUpdated(data.lastUpdated);
  return (
    <Card className="border border-warning-200/70 bg-warning-50/40 dark:border-warning-200/30 dark:bg-warning-100/10">
      <Card.Content className="space-y-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Chip
              color={stateMeta.color}
              variant="soft"
              className="px-2"
                          >
              {stateMeta.label}
            </Chip>
            <p className="text-sm font-medium text-foreground">
              {data.message}
            </p>
          </div>
          {lastUpdated && (
            <p className="text-xs text-foreground">{lastUpdated}</p>
          )}
        </div>

        {data.error && (
          <div className="rounded-md bg-danger/60 px-3 py-2 text-xs text-danger dark:bg-danger/10 dark:text-danger">
            {data.error}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
