"use client";

import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "@/libs/convexApi";
import type { OnboardingStatus } from "@repo/types";

export function useOnboarding() {
  const snapshot = useQuery(api.core.onboarding.getOnboardingSnapshot);
  const status = snapshot?.status as OnboardingStatus | null | undefined;
  const integrationStatus = snapshot?.integrationStatus;
  type Overall = "unsynced" | "syncing" | "complete" | "failed";
  const syncStatus = status?.syncStatus;
  const completeMutation = useMutation(api.core.onboarding.completeOnboarding);

  const shopifyOverall = syncStatus?.shopify?.overallState as
    | Overall
    | undefined;
  const shopifySyncStatus = syncStatus?.shopify?.status ?? null;
  const shopifyExpectedOrders =
    integrationStatus?.shopify?.expectedOrders ?? null;
  const shopifyOrdersInDb = integrationStatus?.shopify?.ordersInDb ?? null;
  const isInitialSyncComplete = status?.isInitialSyncComplete || false;
  const isShopifySynced =
    integrationStatus?.shopify?.initialSynced === true ||
    shopifyOverall === "complete" ||
    isInitialSyncComplete ||
    shopifySyncStatus === "completed";
  const isShopifySyncing = integrationStatus?.shopify?.initialSynced
    ? false
    : shopifyOverall
      ? shopifyOverall === "syncing"
      : shopifySyncStatus
        ? ["pending", "syncing", "processing"].includes(shopifySyncStatus)
        : false;
  const hasShopifySyncError = shopifyOverall
    ? shopifyOverall === "failed"
    : shopifySyncStatus === "failed";
  const shopifyStages = syncStatus?.shopify?.stages ?? null;
  const shopifySyncProgress = {
    status: shopifySyncStatus,
    startedAt: syncStatus?.shopify?.startedAt ?? null,
    completedAt: syncStatus?.shopify?.completedAt ?? null,
    lastError: syncStatus?.shopify?.lastError ?? null,
    stages: shopifyStages,
  } as const;
  const isShopifyProductsSynced = Boolean(shopifyStages?.products);
  const isShopifyInventorySynced = Boolean(shopifyStages?.inventory);
  const isShopifyCustomersSynced = Boolean(shopifyStages?.customers);
  const isShopifyOrdersSynced = Boolean(shopifyStages?.orders);

  // Finish onboarding
  const finishOnboarding = async () => {
    try {
      const result = await completeMutation({});

      return {
        success: true,
        analyticsScheduled: result.analyticsScheduled,
        platformsSyncing: result.platformsSyncing,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  };

  return {
    status,
    loading: snapshot === undefined,
    error:
      status === null && snapshot !== undefined
        ? "Failed to load onboarding status"
        : null,
    isCompleted: status?.completed || false,
    currentStep: status?.currentStep || 1,
    completedSteps: status?.completedSteps || [],
    connections: status?.connections || {
      shopify: false,
      meta: false,
    },
    syncStatus,
    integrationStatus,
    finishOnboarding,
    // Connection status helpers
    hasShopify: status?.connections?.shopify || false,
    isProductCostSetup: status?.isProductCostSetup || false,
    isExtraCostSetup: status?.isExtraCostSetup || false,
    isInitialSyncComplete: status?.isInitialSyncComplete || false,
    pendingSyncPlatforms: status?.pendingSyncPlatforms || [],
    analyticsTriggeredAt: status?.analyticsTriggeredAt,
    lastSyncCheckAt: status?.lastSyncCheckAt,
    syncCheckAttempts: status?.syncCheckAttempts ?? 0,
    hasMeta: status?.connections?.meta || false,
    // Enum-like sync state for Shopify
    shopifySyncState: shopifyOverall,
    shopifySyncStatus,
    isShopifySynced,
    isShopifySyncing,
    hasShopifySyncError,
    shopifySyncProgress,
    shopifyStages,
    isShopifyProductsSynced,
    isShopifyInventorySynced,
    isShopifyCustomersSynced,
    isShopifyOrdersSynced,
    shopifyExpectedOrders,
    shopifyOrdersInDb,
  };
}
