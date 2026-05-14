import { v } from "convex/values";
import { internal, api } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../_generated/server";
import { ensureActiveMembership } from "./membershipHelpers";
import { getIntegrationStatusForOrg } from "./status";
import { createJob, PRIORITY } from "../engine/workpool";
import { findShopifyStoreByDomain, normalizeShopDomain } from "../utils/shop";
import {
  getUserAndOrg,
  requireUserAndOrg,
  type UserAndOrg,
} from "../utils/auth";
import { buildDateSpan } from "../utils/date";
import { getOrgTimeInfo } from "../utils/orgDateRange";
import { optionalEnv } from "../utils/env";
import { onboardingStatusValidator } from "../utils/onboardingValidators";
import {
  emptyIntegrationStatus,
  integrationStatusValidator,
} from "../utils/integrationStatus";
import { isIanaTimeZone } from "@repo/time";
import {
  ONBOARDING_STEP_KEYS,
  ONBOARDING_STEPS,
  type OnboardingStepKey,
  type OnboardingStepNumber,
} from "@repo/types";

/**
 * Onboarding flow management
 * Handles the 5-step onboarding process and triggers initial 60-day sync
 */

type SyncSessionStatus = Doc<"syncSessions">["status"];

const ACTIVE_SYNC_STATUSES = new Set<SyncSessionStatus>([
  "pending",
  "processing",
  "syncing",
]);

const ONBOARDING_STEP_NUMBER_VALUES = Object.values(
  ONBOARDING_STEPS,
) as OnboardingStepNumber[];
const ONBOARDING_STEP_KEY_VALUES = Object.values(
  ONBOARDING_STEP_KEYS,
) as OnboardingStepKey[];

const isOnboardingStepNumber = (value: number): value is OnboardingStepNumber =>
  ONBOARDING_STEP_NUMBER_VALUES.includes(value as OnboardingStepNumber);

const isOnboardingStepKey = (value: unknown): value is OnboardingStepKey =>
  typeof value === "string" &&
  ONBOARDING_STEP_KEY_VALUES.includes(value as OnboardingStepKey);

const isInitialSyncSession = (session: Doc<"syncSessions">): boolean =>
  session.type === "initial" || session.metadata?.isInitialSync === true;

type SyncStageFlags = {
  products: boolean;
  inventory: boolean;
  customers: boolean;
  orders: boolean;
};

const emptyStageFlags: SyncStageFlags = {
  products: false,
  inventory: false,
  customers: false,
  orders: false,
};

const extractStageFlags = (
  metadata: Record<string, unknown> | undefined,
): SyncStageFlags => {
  if (!metadata) {
    return emptyStageFlags;
  }

  const stageStatus = (metadata.stageStatus || {}) as Record<string, string>;
  const syncedEntities = Array.isArray(metadata.syncedEntities)
    ? new Set(metadata.syncedEntities as string[])
    : undefined;
  const isComplete = (key: keyof SyncStageFlags): boolean => {
    const value = stageStatus?.[key];
    if (typeof value === "string" && value.toLowerCase() === "completed") {
      return true;
    }
    return syncedEntities?.has(key) ?? false;
  };

  return {
    products: isComplete("products"),
    inventory: isComplete("inventory"),
    customers: isComplete("customers"),
    orders: isComplete("orders"),
  };
};

type OverallState = "unsynced" | "syncing" | "complete" | "failed";

const deriveOverallState = (sessions: Doc<"syncSessions">[]): OverallState => {
  if (!sessions.length) {
    return "unsynced";
  }

  const relevant = sessions.filter((session) => isInitialSyncSession(session));
  const targetSessions = relevant.length > 0 ? relevant : sessions;

  if (targetSessions.some((session) => session.status === "completed")) {
    return "complete";
  }

  if (
    targetSessions.some((session) =>
      ACTIVE_SYNC_STATUSES.has(session.status as SyncSessionStatus),
    )
  ) {
    return "syncing";
  }

  if (targetSessions.some((session) => session.status === "failed")) {
    return "failed";
  }

  return "unsynced";
};

// ============ QUERIES ============

const getOnboardingStatusForAuth = async (ctx: QueryCtx, auth: UserAndOrg) => {
  const { user, orgId } = auth;

  const onboarding = await ctx.db
    .query("onboarding")
    .withIndex("by_user_organization", (q) =>
      q.eq("userId", user._id).eq("organizationId", orgId),
    )
    .first();

  if (!onboarding) return null;

  const connections = {
    shopify: onboarding.hasShopifyConnection || false,
    meta: onboarding.hasMetaConnection || false,
  };

  // Prefer a small recent window for sync insight to keep the payload light.
  const shopifySessions = await ctx.db
    .query("syncSessions")
    .withIndex("by_org_platform_and_date", (q) =>
      q.eq("organizationId", orgId).eq("platform", "shopify"),
    )
    .order("desc")
    .take(5);
  const metaSessions = await ctx.db
    .query("syncSessions")
    .withIndex("by_org_platform_and_date", (q) =>
      q.eq("organizationId", orgId).eq("platform", "meta"),
    )
    .order("desc")
    .take(5);

  const latestShopifySession = shopifySessions[0];
  const latestMetaSession = metaSessions[0];

  let initialShopifySession = shopifySessions.find((session) =>
    isInitialSyncSession(session),
  );

  if (!initialShopifySession) {
    const oldestShopifySession = await ctx.db
      .query("syncSessions")
      .withIndex("by_org_platform_and_date", (q) =>
        q.eq("organizationId", orgId).eq("platform", "shopify"),
      )
      .order("asc")
      .first();

    if (oldestShopifySession && isInitialSyncSession(oldestShopifySession)) {
      initialShopifySession = oldestShopifySession;
    }
  }

  const shopifySessionsForStatus = initialShopifySession
    ? shopifySessions.some(
        (session) => session._id === initialShopifySession._id,
      )
      ? shopifySessions
      : [...shopifySessions, initialShopifySession]
    : shopifySessions;

  const shopifyMetadata = (initialShopifySession?.metadata ??
    latestShopifySession?.metadata ??
    {}) as Record<string, unknown> | undefined;
  const shopifyStages = extractStageFlags(shopifyMetadata);

  const shopifyOverall = deriveOverallState(shopifySessionsForStatus);
  const metaOverall = deriveOverallState(metaSessions);

  const rawCurrentStep = onboarding.onboardingStep ?? ONBOARDING_STEPS.SHOPIFY;
  const currentStep: OnboardingStepNumber = isOnboardingStepNumber(
    rawCurrentStep,
  )
    ? rawCurrentStep
    : ONBOARDING_STEPS.SHOPIFY;

  const completedStepsRaw = onboarding.onboardingData?.completedSteps ?? [];
  const completedSteps: OnboardingStepKey[] =
    completedStepsRaw.filter(isOnboardingStepKey);

  return {
    completed: onboarding.isCompleted || false,
    currentStep,
    completedSteps,
    connections,
    hasShopifySubscription: onboarding.hasShopifySubscription || false,
    isProductCostSetup: onboarding.isProductCostSetup || false,
    isExtraCostSetup: onboarding.isExtraCostSetup || false,
    isInitialSyncComplete: onboarding.isInitialSyncComplete || false,
    pendingSyncPlatforms:
      onboarding.onboardingData?.syncPendingPlatforms || undefined,
    analyticsTriggeredAt:
      onboarding.onboardingData?.analyticsTriggeredAt || undefined,
    lastSyncCheckAt: onboarding.onboardingData?.lastSyncCheckAt || undefined,
    syncCheckAttempts:
      onboarding.onboardingData?.syncCheckAttempts || undefined,
    syncStatus: {
      shopify: latestShopifySession
        ? {
            status: latestShopifySession.status,
            overallState: shopifyOverall,
            stages: shopifyStages,
            startedAt: latestShopifySession.startedAt,
            completedAt: latestShopifySession.completedAt,
            lastError: latestShopifySession.error,
          }
        : undefined,
      meta: latestMetaSession
        ? {
            status: latestMetaSession.status,
            overallState: metaOverall,
            recordsProcessed: latestMetaSession.recordsProcessed,
            startedAt: latestMetaSession.startedAt,
            completedAt: latestMetaSession.completedAt,
            lastError: latestMetaSession.error,
          }
        : undefined,
    },
  };
};

/**
 * Get current onboarding status.
 */
export const getOnboardingStatus = query({
  args: {},
  returns: onboardingStatusValidator,
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    return auth ? await getOnboardingStatusForAuth(ctx, auth) : null;
  },
});

/**
 * Get all status needed by onboarding UI with a single authenticated read.
 */
export const getOnboardingSnapshot = query({
  args: {},
  returns: v.object({
    status: onboardingStatusValidator,
    integrationStatus: integrationStatusValidator,
  }),
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);

    if (!auth) {
      return {
        status: null,
        integrationStatus: emptyIntegrationStatus(),
      };
    }

    return {
      status: await getOnboardingStatusForAuth(ctx, auth),
      integrationStatus: await getIntegrationStatusForOrg(ctx, auth.orgId),
    };
  },
});

// ============ HELPER FUNCTIONS ============

/**
 * Get or create onboarding record for user
 */
export const getOrCreateOnboarding = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  organizationId: Id<"organizations">,
) => {
  // Try to find existing onboarding record
  let onboarding = await ctx.db
    .query("onboarding")
    .withIndex("by_user_organization", (q) =>
      q.eq("userId", userId).eq("organizationId", organizationId),
    )
    .first();

  // Create if doesn't exist
  if (!onboarding) {
    const onboardingId = await ctx.db.insert("onboarding", {
      userId,
      organizationId,
      onboardingStep: 1,
      isCompleted: false,
      hasShopifyConnection: false,
      hasMetaConnection: false,
      isInitialSyncComplete: false,
      isProductCostSetup: false,
      isExtraCostSetup: false,
      onboardingData: {
        completedSteps: [],
        setupDate: new Date().toISOString(),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    onboarding = await ctx.db.get("onboarding", onboardingId);
  }

  return onboarding;
};

// ============ MUTATIONS ============

/**
 * Join demo organization for trial experience
 */
export const joinDemoOrganization = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    const demoOrgEnv = optionalEnv("DEMO_ORG");
    if (!demoOrgEnv) {
      return {
        success: false,
        message: "Demo organization is not configured yet.",
      };
    }

    const { user, orgId: currentOrgId } = await requireUserAndOrg(ctx);

    const demoOrgId = demoOrgEnv as Id<"organizations">;
    if (currentOrgId === demoOrgId) {
      return {
        success: true,
        message: "You already have access to the demo organization.",
      };
    }

    const demoOrg = await ctx.db.get("organizations", demoOrgId);
    if (!demoOrg) {
      return {
        success: false,
        message: "Demo organization is unavailable right now.",
      };
    }

    const demoOrgCurrency = await ctx.runQuery(
      api.core.currency.getPrimaryCurrencyForOrg,
      { orgId: demoOrgId },
    );
    const resolvedCurrency =
      demoOrgCurrency ?? demoOrg.primaryCurrency ?? "USD";

    const now = Date.now();

    if (resolvedCurrency !== demoOrg.primaryCurrency) {
      await ctx.db.patch("organizations", demoOrgId, {
        primaryCurrency: resolvedCurrency,
        updatedAt: now,
      });
    }

    const existingMembership = await ctx.db
      .query("memberships")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", currentOrgId).eq("userId", user._id),
      )
      .first();

    if (existingMembership && existingMembership.status !== "removed") {
      await ctx.db.patch("memberships", existingMembership._id, {
        status: "removed",
        updatedAt: now,
      });
    }

    await ctx.db.patch("users", user._id, {
      organizationId: demoOrgId,
      status: "active",
      isOnboarded: true,
      lastLoginAt: now,
      updatedAt: now,
    });

    await ensureActiveMembership(ctx, demoOrgId, user._id, "StoreTeam", {
      seatType: existingMembership?.seatType ?? "free",
      hasAiAddOn: existingMembership?.hasAiAddOn ?? false,
      assignedAt: now,
      assignedBy: demoOrg.ownerId,
    });

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const demoStepOrder = [
      "shopify",
      "billing",
      "marketing",
      "accounts",
      "products",
      "cost",
      "complete",
    ];

    const completedStepsSet = new Set(
      onboarding?.onboardingData?.completedSteps ?? [],
    );
    for (const step of demoStepOrder) {
      completedStepsSet.add(step);
    }

    const onboardingData = {
      ...onboarding?.onboardingData,
      completedSteps: demoStepOrder.filter((step) =>
        completedStepsSet.has(step),
      ),
      setupDate:
        onboarding?.onboardingData?.setupDate ?? new Date().toISOString(),
    };

    if (onboarding) {
      await ctx.db.patch("onboarding", onboarding._id, {
        organizationId: demoOrgId,
        onboardingStep: ONBOARDING_STEPS.COMPLETE,
        isCompleted: true,
        hasShopifyConnection: true,
        hasShopifySubscription: true,
        hasMetaConnection: true,
        isInitialSyncComplete: true,
        isProductCostSetup: true,
        isExtraCostSetup: true,
        onboardingData,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("onboarding", {
        userId: user._id,
        organizationId: demoOrgId,
        onboardingStep: ONBOARDING_STEPS.COMPLETE,
        isCompleted: true,
        hasShopifyConnection: true,
        hasShopifySubscription: true,
        hasMetaConnection: true,
        isInitialSyncComplete: true,
        isProductCostSetup: true,
        isExtraCostSetup: true,
        onboardingData,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      success: true,
      message: "Demo organization enabled. Explore Meyoo with sample data.",
    };
  },
});

/**
 * Complete onboarding and trigger initial sync
 */
type CompleteOnboardingResult = {
  success: boolean;
  analyticsScheduled: boolean;
  platformsSyncing: string[];
};

export const completeOnboarding = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    analyticsScheduled: v.boolean(),
    platformsSyncing: v.array(v.string()),
  }),
  handler: async (ctx): Promise<CompleteOnboardingResult> => {
    const { user, orgId } = await requireUserAndOrg(ctx);
    const onboarding = await getOrCreateOnboarding(ctx, user._id, orgId);
    if (!onboarding) throw new Error("Failed to get onboarding record");

    const platforms: Array<"shopify" | "meta"> = [];
    if (onboarding.hasShopifyConnection) platforms.push("shopify");
    if (onboarding.hasMetaConnection) platforms.push("meta");

    const syncStates = await Promise.all(
      platforms.map(async (platform) => {
        const latestSync = await ctx.db
          .query("syncSessions")
          .withIndex("by_org_platform_and_date", (q) =>
            q.eq("organizationId", orgId).eq("platform", platform),
          )
          .order("desc")
          .first();

        return { platform, latestSync };
      }),
    );

    const pendingPlatformsList = syncStates
      .filter(({ latestSync }) => latestSync?.status !== "completed")
      .map(({ platform }) => platform);
    const allSyncsComplete =
      platforms.length > 0 && pendingPlatformsList.length === 0;
    const now = Date.now();
    const onboardingData: Record<string, any> = {
      ...onboarding.onboardingData,
      syncCheckAttempts: 0,
      lastSyncCheckAt: now,
    };

    if (pendingPlatformsList.length > 0) {
      onboardingData.syncPendingPlatforms = pendingPlatformsList;
    } else {
      delete onboardingData.syncPendingPlatforms;
    }

    const onboardingPatch: Partial<Doc<"onboarding">> = {};
    if (!onboarding.isCompleted) onboardingPatch.isCompleted = true;
    if (onboarding.onboardingStep !== ONBOARDING_STEPS.COMPLETE) {
      onboardingPatch.onboardingStep = ONBOARDING_STEPS.COMPLETE;
    }
    if (onboarding.isInitialSyncComplete !== allSyncsComplete) {
      onboardingPatch.isInitialSyncComplete = allSyncsComplete;
    }
    onboardingPatch.onboardingData =
      onboardingData as Doc<"onboarding">["onboardingData"];
    onboardingPatch.updatedAt = now;

    await ctx.db.patch("onboarding", onboarding._id, onboardingPatch);

    if (!user.isOnboarded) {
      await ctx.db.patch("users", user._id, {
        isOnboarded: true,
        updatedAt: now,
      });
    }

    if (!onboarding.isCompleted) {
      await ctx.scheduler.runAfter(
        0,
        internal.core.onboarding.finishOnboardingInBackground,
        { organizationId: orgId },
      );
    }

    return {
      success: true,
      analyticsScheduled: false,
      platformsSyncing: pendingPlatformsList,
    };
  },
});

export const finishOnboardingInBackground = internalMutation({
  args: {
    organizationId: v.id("organizations"),
  },
  returns: v.object({
    syncJobs: v.number(),
    syncErrors: v.number(),
  }),
  handler: async (ctx, args) => {
    const now = Date.now();
    const kickstartAt = now + 10 * 60 * 1000;
    const existingProfile = await ctx.db
      .query("syncProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();

    if (!existingProfile) {
      await ctx.db.insert("syncProfiles", {
        organizationId: args.organizationId,
        activityScore: 20,
        lastActivityAt: now,
        activityHistory: [],
        syncFrequency: 4,
        syncInterval: 21600000,
        syncTier: "low",
        lastSync: undefined,
        nextScheduledSync: kickstartAt,
        businessHoursEnabled: true,
        timezone: undefined,
        platformSettings: undefined,
        createdAt: now,
        updatedAt: now,
      });
    } else if (
      !existingProfile.nextScheduledSync ||
      existingProfile.nextScheduledSync > kickstartAt
    ) {
      await ctx.db.patch("syncProfiles", existingProfile._id, {
        nextScheduledSync: kickstartAt,
        updatedAt: now,
      });
    }

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();
    const platforms: Array<"shopify" | "meta"> = [];
    if (onboarding?.hasShopifyConnection) platforms.push("shopify");
    if (onboarding?.hasMetaConnection) platforms.push("meta");

    let syncJobs = 0;
    let syncErrors = 0;
    for (const platform of platforms) {
      const latestSync = await ctx.db
        .query("syncSessions")
        .withIndex("by_org_platform_and_date", (q) =>
          q.eq("organizationId", args.organizationId).eq("platform", platform),
        )
        .order("desc")
        .first();

      if (
        latestSync &&
        latestSync.status !== "failed" &&
        latestSync.status !== "cancelled"
      ) {
        continue;
      }

      try {
        if (platform === "shopify") {
          const ensure = (await ctx.runMutation(
            internal.engine.syncJobs.ensureInitialSync,
            {
              organizationId: args.organizationId,
              platform: "shopify",
              dateRange: { daysBack: 60 },
            },
          )) as { jobId?: string };
          if (ensure.jobId) syncJobs += 1;
          continue;
        }

        const primaryAccount = await ctx.db
          .query("metaAdAccounts")
          .withIndex("by_organization_and_isPrimary", (q) =>
            q.eq("organizationId", args.organizationId).eq("isPrimary", true),
          )
          .first();
        await createJob(
          ctx,
          "sync:initial",
          PRIORITY.HIGH,
          {
            organizationId: args.organizationId,
            platform,
            accountId: primaryAccount?.accountId,
            dateRange: { daysBack: 60 },
          },
          {
            onComplete: internal.engine.syncJobs
              .onInitialSyncComplete as unknown,
            context: {
              organizationId: args.organizationId,
              platform,
            },
          },
        );
        syncJobs += 1;
      } catch (error) {
        console.warn("[ONBOARDING] Background sync kickoff failed", {
          organizationId: args.organizationId,
          platform,
          error,
        });
        syncErrors += 1;
      }
    }

    await ctx.scheduler.runAfter(
      0,
      internal.core.onboarding.triggerMonitorIfOnboardingComplete,
      {
        organizationId: args.organizationId,
        reason: "onboarding_complete",
      },
    );
    await ctx.scheduler.runAfter(
      0,
      internal.core.status.refreshIntegrationStatus,
      {
        organizationId: args.organizationId,
      },
    );

    return { syncJobs, syncErrors };
  },
});

/**
 * Trigger monitoring only when onboarding has been completed.
 * Prevents monitorInitialSyncs from running for organizations
 * that haven't reached the completion step yet.
 */
export const triggerMonitorIfOnboardingComplete = internalMutation({
  args: {
    organizationId: v.id("organizations"),
    reason: v.optional(v.string()),
  },
  returns: v.object({
    triggered: v.boolean(),
    reason: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();

    if (!onboarding) {
      return {
        triggered: false,
        reason: "onboarding_not_found",
      };
    }

    if (!onboarding.isCompleted) {
      return {
        triggered: false,
        reason: "onboarding_incomplete",
      };
    }

    await ctx.runMutation(internal.core.onboarding.monitorInitialSyncs, {
      organizationId: args.organizationId,
    });

    return {
      triggered: true,
      reason: args.reason,
    };
  },
});

export const monitorInitialSyncs = internalMutation({
  args: {
    organizationId: v.id("organizations"),
  },
  returns: v.object({
    checked: v.number(),
    completed: v.number(),
    analyticsTriggered: v.number(),
    pending: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx, args) => {
    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();

    let processed = 0;
    let completedCount = 0;
    let analyticsCount = 0;
    let pendingCount = 0;
    let skippedCount = 0;

    const now = Date.now();

    // Helper: Get latest sync session for a platform
    const getLatestSyncSession = async (
      orgId: Id<"organizations">,
      platform: "shopify" | "meta",
    ): Promise<Doc<"syncSessions"> | null> => {
      const sessions = await ctx.db
        .query("syncSessions")
        .withIndex("by_org_platform_and_date", (q) =>
          q.eq("organizationId", orgId).eq("platform", platform),
        )
        .order("desc")
        .take(5);

      // Find the latest initial sync session
      const initialSessions = sessions.filter(isInitialSyncSession);
      return initialSessions[0] || sessions[0] || null;
    };

    // Heal sync sessions that imported data but never flipped to "completed" so onboarding can finish.
    const attemptFinalizeSession = async (
      session: Doc<"syncSessions">,
    ): Promise<
      | {
          finalized: true;
          normalizedOrdersProcessed?: number;
        }
      | { finalized: false; shouldFail?: boolean; reason?: string }
    > => {
      if (session.status === "completed") {
        return { finalized: true };
      }

      const metadata = (session.metadata || {}) as Record<string, any>;
      const metadataLastActivity =
        typeof metadata.lastActivityAt === "number"
          ? metadata.lastActivityAt
          : typeof metadata.progressUpdatedAt === "number"
            ? metadata.progressUpdatedAt
            : undefined;
      const lastProgressAt =
        metadataLastActivity ?? session.completedAt ?? session.startedAt;

      const timeSinceLastActivity = Date.now() - lastProgressAt;
      const isActivelySyncing =
        (session.status === "processing" || session.status === "syncing") &&
        timeSinceLastActivity < 2 * 60 * 1000;

      if (isActivelySyncing) {
        console.log(
          `[MONITOR_CRON] Session still active - last activity ${Math.floor(timeSinceLastActivity / 1000)}s ago`,
        );
        return { finalized: false };
      }

      const inactiveMinutes = Math.floor(timeSinceLastActivity / (60 * 1000));
      console.log(
        `[MONITOR_CRON] Session inactive for ${Math.floor(timeSinceLastActivity / 1000)}s (${inactiveMinutes} minutes), checking completion criteria...`,
      );

      // Detect stuck sessions: inactive >30min with minimal progress
      const STUCK_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
      if (timeSinceLastActivity > STUCK_TIMEOUT_MS) {
        const completedBatches =
          typeof metadata.completedBatches === "number"
            ? metadata.completedBatches
            : 0;
        const totalBatches =
          typeof metadata.totalBatches === "number" ? metadata.totalBatches : 0;
        const progressPercent =
          totalBatches > 0
            ? Math.round((completedBatches / totalBatches) * 100)
            : 0;

        if (progressPercent < 50) {
          console.log(
            `[MONITOR_CRON] 🚨 STUCK SESSION DETECTED - Inactive ${inactiveMinutes}min with only ${progressPercent}% progress (${completedBatches}/${totalBatches} batches)`,
          );
          return {
            finalized: false,
            shouldFail: true,
            reason: `Stuck for ${inactiveMinutes} minutes with ${progressPercent}% progress`,
          };
        }

        console.log(
          `[MONITOR_CRON] Session inactive ${inactiveMinutes}min but has ${progressPercent}% progress - allowing more time`,
        );
      }

      const totalBatches =
        typeof metadata.totalBatches === "number"
          ? metadata.totalBatches
          : undefined;
      const completedBatches =
        typeof metadata.completedBatches === "number"
          ? metadata.completedBatches
          : undefined;
      const ordersQueued =
        typeof metadata.ordersQueued === "number"
          ? metadata.ordersQueued
          : undefined;
      const ordersProcessedMeta =
        typeof metadata.ordersProcessed === "number"
          ? metadata.ordersProcessed
          : undefined;
      const baselineRecords =
        typeof metadata.baselineRecords === "number"
          ? metadata.baselineRecords
          : undefined;
      const recordsProcessed =
        typeof session.recordsProcessed === "number"
          ? session.recordsProcessed
          : undefined;

      const normalizedOrdersProcessed =
        ordersProcessedMeta !== undefined
          ? ordersProcessedMeta
          : baselineRecords !== undefined && recordsProcessed !== undefined
            ? Math.max(0, recordsProcessed - baselineRecords)
            : undefined;

      const stageStatus = metadata.stageStatus as
        | Record<string, string>
        | undefined;

      const isBatchesComplete =
        totalBatches !== undefined &&
        completedBatches !== undefined &&
        totalBatches > 0 &&
        completedBatches >= totalBatches;
      const isOrdersComplete =
        ordersQueued !== undefined &&
        normalizedOrdersProcessed !== undefined &&
        ordersQueued >= 0 &&
        normalizedOrdersProcessed >= ordersQueued;
      const isStagesComplete = Boolean(
        stageStatus &&
          stageStatus.orders === "completed" &&
          stageStatus.products === "completed" &&
          stageStatus.inventory === "completed" &&
          stageStatus.customers === "completed",
      );

      console.log(
        `[MONITOR_CRON] Completion checks: batches=${isBatchesComplete} (${completedBatches}/${totalBatches}), orders=${isOrdersComplete} (${normalizedOrdersProcessed}/${ordersQueued}), stages=${isStagesComplete}`,
      );

      if (!isBatchesComplete && !isOrdersComplete && !isStagesComplete) {
        console.log(
          `[MONITOR_CRON] Session not ready to finalize - no completion criteria met`,
        );
        return { finalized: false };
      }

      console.log(
        `[MONITOR_CRON] Session meets completion criteria - finalizing...`,
      );

      const nextMetadata: Record<string, any> = { ...metadata };

      if (stageStatus) {
        nextMetadata.stageStatus = {
          ...stageStatus,
          orders: "completed",
        };
      }

      if (normalizedOrdersProcessed !== undefined) {
        nextMetadata.ordersProcessed = normalizedOrdersProcessed;
      }

      if (totalBatches !== undefined) {
        nextMetadata.totalBatches = totalBatches;
      }

      if (completedBatches !== undefined) {
        nextMetadata.completedBatches = Math.min(
          completedBatches,
          totalBatches ?? completedBatches,
        );
      }

      const syncedEntities = Array.isArray(metadata.syncedEntities)
        ? new Set(metadata.syncedEntities as string[])
        : new Set<string>();
      syncedEntities.add("orders");
      nextMetadata.syncedEntities = Array.from(syncedEntities);

      await ctx.db.patch("syncSessions", session._id, {
        status: "completed",
        completedAt: session.completedAt ?? Date.now(),
        recordsProcessed:
          recordsProcessed ?? normalizedOrdersProcessed ?? ordersQueued ?? 0,
        metadata: nextMetadata,
      });

      return { finalized: true, normalizedOrdersProcessed };
    };

    if (!onboarding) {
      return {
        checked: 0,
        completed: 0,
        analyticsTriggered: 0,
        pending: 0,
        skipped: 1,
      };
    }

    for (const currentOnboarding of [onboarding]) {
      const onboarding = currentOnboarding;
      const orgId = args.organizationId;
      const checkCount = (onboarding.monitorCheckCount ?? 0) + 1;

      processed += 1;

      try {
        if (!onboarding.isCompleted) {
          const skipUpdate: Record<string, any> = {
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
          };

          if (!onboarding.analyticsCalculationStatus) {
            skipUpdate.analyticsCalculationStatus = "not_started";
          }

          await ctx.db.patch("onboarding", onboarding._id, skipUpdate as any);
          skippedCount += 1;
          continue;
        }

        // Skip if analytics already calculated
        if (onboarding.analyticsCalculationStatus === "completed") {
          skippedCount += 1;
          continue;
        }

        // Skip if currently calculating (another process might be handling it)
        if (onboarding.analyticsCalculationStatus === "calculating") {
          skippedCount += 1;
          continue;
        }

        // Check Shopify connection and sync status
        if (!onboarding.hasShopifyConnection) {
          await ctx.db.patch("onboarding", onboarding._id, {
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
            analyticsCalculationStatus: "not_started",
          });
          skippedCount += 1;
          continue;
        }

        const shopifySession = await getLatestSyncSession(orgId, "shopify");
        const shopifyStatus = shopifySession?.status || "none";

        // Try to finalize Shopify session if needed
        let shopifyCompleted = shopifyStatus === "completed";
        let sessionStuckOrFailed = false;

        if (!shopifyCompleted && shopifySession) {
          const finalizeResult = await attemptFinalizeSession(shopifySession);

          if (finalizeResult.finalized) {
            shopifyCompleted = true;
          } else if (finalizeResult.shouldFail) {
            // Session is stuck - mark as failed and trigger analytics anyway
            await ctx.db.patch("syncSessions", shopifySession._id, {
              status: "failed",
              completedAt: now,
              metadata: {
                ...(shopifySession.metadata || {}),
                failureReason: finalizeResult.reason,
                partialSync: true,
              } as any,
            });

            sessionStuckOrFailed = true;
            shopifyCompleted = true; // Treat as "completed" for analytics trigger
          }
        }

        // Check if Shopify is still syncing (after finalization attempt)
        if (
          !shopifyCompleted &&
          !sessionStuckOrFailed &&
          ACTIVE_SYNC_STATUSES.has(shopifyStatus as any)
        ) {
          await ctx.db.patch("onboarding", onboarding._id, {
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
            analyticsCalculationStatus: "pending",
          });
          pendingCount += 1;
          continue;
        }

        // Check if Shopify failed
        if (shopifyStatus === "failed" && !shopifyCompleted) {
          await ctx.db.patch("onboarding", onboarding._id, {
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
            analyticsCalculationStatus: "failed",
          });
          continue;
        }

        // Shopify must be completed at this point
        if (!shopifyCompleted) {
          await ctx.db.patch("onboarding", onboarding._id, {
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
          });
          pendingCount += 1;
          continue;
        }

        // Check Meta if connected
        let metaCompleted = true; // Default to true if not connected
        if (onboarding.hasMetaConnection) {
          // Verify Meta session exists
          const metaIntegrationSession = await ctx.db
            .query("integrationSessions")
            .withIndex("by_org_platform_and_status", (q) =>
              q
                .eq("organizationId", orgId)
                .eq("platform", "meta")
                .eq("isActive", true),
            )
            .first();

          if (metaIntegrationSession) {
            const metaSession = await getLatestSyncSession(orgId, "meta");
            const metaStatus = metaSession?.status || "none";

            metaCompleted = metaStatus === "completed";

            if (ACTIVE_SYNC_STATUSES.has(metaStatus as any)) {
              await ctx.db.patch("onboarding", onboarding._id, {
                lastMonitorCheckAt: now,
                monitorCheckCount: checkCount,
                analyticsCalculationStatus: "pending",
              });
              pendingCount += 1;
              continue;
            }

            if (metaStatus === "failed") {
              metaCompleted = true; // Continue anyway
            }
          }
        }

        // All syncs complete - trigger analytics calculation
        if (shopifyCompleted && metaCompleted) {
          // Mark as calculating
          await ctx.db.patch("onboarding", onboarding._id, {
            analyticsCalculationStatus: "calculating",
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
            isInitialSyncComplete: true,
            onboardingData: {
              ...onboarding.onboardingData,
              analyticsTriggeredAt: now,
            },
          });

          // Create analytics rebuild jobs
          const timeInfo = await getOrgTimeInfo(ctx, orgId);
          const dateOptions = timeInfo.timeZone
            ? { timezone: timeInfo.timeZone }
            : typeof timeInfo.offsetMinutes === "number"
              ? { offsetMinutes: timeInfo.offsetMinutes }
              : undefined;
          const dates = buildDateSpan(
            ONBOARDING_COST_LOOKBACK_DAYS,
            undefined,
            dateOptions,
          );

          for (
            let index = 0;
            index < dates.length;
            index += ONBOARDING_ANALYTICS_REBUILD_CHUNK_SIZE
          ) {
            const chunk = dates.slice(
              index,
              index + ONBOARDING_ANALYTICS_REBUILD_CHUNK_SIZE,
            );

            if (chunk.length === 0) {
              continue;
            }

            await createJob(
              ctx,
              "analytics:rebuildDaily",
              PRIORITY.HIGH, // HIGH priority for onboarding
              {
                organizationId: orgId,
                dates: chunk,
              },
              {
                context: {
                  scope: "onboarding.analyticsRebuild",
                  chunkSize: chunk.length,
                  totalDates: dates.length,
                },
              },
            );
            analyticsCount += 1;
          }

          await ctx.db.patch("onboarding", onboarding._id, {
            analyticsCalculationStatus: "completed",
          });

          completedCount += 1;

          // Best-effort snapshot refresh
          try {
            await ctx.runMutation(
              internal.core.status.refreshIntegrationStatus,
              {
                organizationId: orgId,
              },
            );
          } catch (_error) {
            // Best-effort refresh; ignore failures
          }
        }
      } catch (error) {
        console.error(`[MONITOR_CRON] Org ${orgId}: ERROR during monitoring`, {
          onboardingId: onboarding._id,
          error,
        });

        // Mark as failed so we can investigate
        try {
          await ctx.db.patch("onboarding", onboarding._id, {
            analyticsCalculationStatus: "failed",
            lastMonitorCheckAt: now,
            monitorCheckCount: checkCount,
          });
        } catch (_patchError) {
          // Ignore patch errors
        }
      }
    }

    // Self-scheduling: If monitoring a specific org and still pending, reschedule
    if (pendingCount > 0) {
      await ctx.scheduler.runAfter(
        10000,
        internal.core.onboarding.monitorInitialSyncs,
        { organizationId: args.organizationId },
      );
    }

    return {
      checked: processed,
      completed: completedCount,
      analyticsTriggered: analyticsCount,
      pending: pendingCount,
      skipped: skippedCount,
    };
  },
});

/**
 * Save initial cost setup for historical data
 */
const ONBOARDING_COST_LOOKBACK_DAYS = 60;
const ONBOARDING_COST_LOOKBACK_MS =
  ONBOARDING_COST_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
const ONBOARDING_ANALYTICS_REBUILD_CHUNK_SIZE = 5;

export const saveInitialCosts = mutation({
  args: {
    shippingCost: v.optional(v.number()),
    paymentFeePercent: v.optional(v.number()),
    operatingCosts: v.optional(v.number()),
    manualReturnRate: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    nextStep: v.number(),
  }),
  handler: async (ctx, args) => {
    const { user } = await requireUserAndOrg(ctx);

    // Get or create onboarding record
    if (!user.organizationId) {
      throw new Error("User has no organization");
    }

    const onboarding = await getOrCreateOnboarding(
      ctx,
      user._id,
      user.organizationId,
    );

    if (!onboarding) {
      throw new Error("Failed to get onboarding record");
    }

    // If step 6 already completed, advance accordingly
    if (
      onboarding.onboardingStep === ONBOARDING_STEPS.COSTS &&
      onboarding.isExtraCostSetup
    ) {
      const nextStep = ONBOARDING_STEPS.COMPLETE;
      await ctx.db.patch("onboarding", onboarding._id, {
        onboardingStep: nextStep,
        updatedAt: Date.now(),
      });
      return { success: true, nextStep };
    }

    // Single source of truth: costs + per-variant components only (no historical defaults)

    // Create or update cost records for analytics (idempotent during onboarding)
    const now = Date.now();
    const retroactiveEffectiveFrom = now - ONBOARDING_COST_LOOKBACK_MS;
    let analyticsNeedsRefresh = false;

    // Create shipping cost record (flat per order)
    if (args.shippingCost !== undefined && args.shippingCost > 0) {
      const existingPerOrder = await ctx.db
        .query("globalCosts")
        .withIndex("by_org_type_frequency", (q) =>
          q
            .eq("organizationId", user.organizationId as Id<"organizations">)
            .eq("type", "shipping")
            .eq("frequency", "per_order"),
        )
        .first();

      if (existingPerOrder) {
        const shouldUpdate =
          existingPerOrder.calculation !== "fixed" ||
          existingPerOrder.frequency !== "per_order" ||
          existingPerOrder.value !== args.shippingCost ||
          !existingPerOrder.isActive ||
          !existingPerOrder.isDefault;

        if (shouldUpdate) {
          await ctx.db.patch("globalCosts", existingPerOrder._id, {
            calculation: "fixed",
            value: args.shippingCost,
            frequency: "per_order",
            isActive: true,
            isDefault: true,
            updatedAt: now,
            effectiveFrom:
              existingPerOrder.effectiveFrom &&
              existingPerOrder.effectiveFrom <= retroactiveEffectiveFrom
                ? existingPerOrder.effectiveFrom
                : retroactiveEffectiveFrom,
          } as any);
          analyticsNeedsRefresh = true;
        }
      } else {
        await ctx.db.insert("globalCosts", {
          organizationId: user.organizationId as Id<"organizations">,
          userId: user._id,
          type: "shipping",
          name: "Shipping Cost",
          description: "Initial shipping cost from onboarding",
          calculation: "fixed",
          value: args.shippingCost,
          frequency: "per_order",
          isActive: true,
          isDefault: true,
          effectiveFrom: retroactiveEffectiveFrom,
          createdAt: now,
          updatedAt: now,
        } as any);
        analyticsNeedsRefresh = true;
      }
    }

    // Create payment fee record if provided
    if (args.paymentFeePercent !== undefined && args.paymentFeePercent > 0) {
      const existingPayment = await ctx.db
        .query("globalCosts")
        .withIndex("by_org_and_type", (q) =>
          q
            .eq("organizationId", user.organizationId as Id<"organizations">)
            .eq("type", "payment"),
        )
        .first();

      if (existingPayment) {
        const shouldUpdate =
          existingPayment.calculation !== "percentage" ||
          existingPayment.frequency !== "percentage" ||
          existingPayment.value !== args.paymentFeePercent ||
          !existingPayment.isActive ||
          !existingPayment.isDefault;

        if (shouldUpdate) {
          await ctx.db.patch("globalCosts", existingPayment._id, {
            calculation: "percentage",
            value: args.paymentFeePercent,
            frequency: "percentage",
            isActive: true,
            isDefault: true,
            updatedAt: now,
            effectiveFrom:
              existingPayment.effectiveFrom &&
              existingPayment.effectiveFrom <= retroactiveEffectiveFrom
                ? existingPayment.effectiveFrom
                : retroactiveEffectiveFrom,
          } as any);
          analyticsNeedsRefresh = true;
        }
      } else {
        await ctx.db.insert("globalCosts", {
          organizationId: user.organizationId as Id<"organizations">,
          userId: user._id,
          type: "payment",
          name: "Payment Processing Fee",
          description: "Initial payment fee percentage from onboarding",
          calculation: "percentage",
          value: args.paymentFeePercent,
          frequency: "percentage",
          isActive: true,
          isDefault: true,
          effectiveFrom: retroactiveEffectiveFrom,
          createdAt: now,
          updatedAt: now,
        } as any);
        analyticsNeedsRefresh = true;
      }
    }

    // Create operating costs record if provided
    if (args.operatingCosts !== undefined && args.operatingCosts > 0) {
      const existingOp = await ctx.db
        .query("globalCosts")
        .withIndex("by_org_type_frequency", (q) =>
          q
            .eq("organizationId", user.organizationId as Id<"organizations">)
            .eq("type", "operational")
            .eq("frequency", "monthly"),
        )
        .first();

      if (existingOp) {
        const shouldUpdate =
          existingOp.calculation !== "fixed" ||
          existingOp.frequency !== "monthly" ||
          existingOp.value !== args.operatingCosts ||
          !existingOp.isActive ||
          !existingOp.isDefault;

        if (shouldUpdate) {
          await ctx.db.patch("globalCosts", existingOp._id, {
            calculation: "fixed",
            value: args.operatingCosts,
            frequency: "monthly",
            isActive: true,
            isDefault: true,
            updatedAt: now,
            effectiveFrom:
              existingOp.effectiveFrom &&
              existingOp.effectiveFrom <= retroactiveEffectiveFrom
                ? existingOp.effectiveFrom
                : retroactiveEffectiveFrom,
          } as any);
          analyticsNeedsRefresh = true;
        }
      } else {
        await ctx.db.insert("globalCosts", {
          organizationId: user.organizationId,
          userId: user._id,
          type: "operational",
          name: "Operating Costs",
          description: "Initial monthly operating costs from onboarding",
          calculation: "fixed",
          value: args.operatingCosts,
          frequency: "monthly",
          isActive: true,
          isDefault: true,
          effectiveFrom: retroactiveEffectiveFrom,
          createdAt: now,
          updatedAt: now,
        } as any);
        analyticsNeedsRefresh = true;
      }
    }

    // Update onboarding record without moving backwards.
    // If the user is at or beyond the COSTS step, advance to COMPLETE; otherwise keep current step.
    const advanceToComplete =
      (onboarding.onboardingStep || 1) >= ONBOARDING_STEPS.COSTS;
    const actualNextStep = advanceToComplete
      ? ONBOARDING_STEPS.COMPLETE
      : onboarding.onboardingStep || ONBOARDING_STEPS.MARKETING;
    await ctx.db.patch("onboarding", onboarding._id, {
      isExtraCostSetup: true,
      onboardingStep: actualNextStep,
      updatedAt: Date.now(),
    });

    if (args.manualReturnRate !== undefined) {
      const manualRateResult = await ctx.runMutation(
        internal.core.costs.upsertManualReturnRate,
        {
          organizationId: user.organizationId as Id<"organizations">,
          userId: user._id,
          ratePercent: args.manualReturnRate,
          isActive: (args.manualReturnRate ?? 0) > 0,
          effectiveFrom: retroactiveEffectiveFrom,
        },
      );
      if (manualRateResult.changed) {
        analyticsNeedsRefresh = true;
      }
    }

    if (analyticsNeedsRefresh) {
      await ctx.scheduler.runAfter(
        0,
        internal.engine.analytics.calculateAnalytics,
        {
          organizationId: user.organizationId,
          dateRange: { daysBack: 90 },
          syncType: "incremental",
        },
      );
    }

    // production: avoid noisy onboarding logs

    return {
      success: true,
      nextStep: actualNextStep,
    };
  },
});

/**
 * Connect Shopify store during onboarding
 */
export const connectShopifyStore = mutation({
  args: {
    domain: v.string(),
    accessToken: v.string(),
    scope: v.string(),
    shopData: v.optional(
      v.object({
        email: v.optional(v.string()),
        shopName: v.optional(v.string()),
        currency: v.optional(v.string()),
        timezone: v.optional(v.string()),
        country: v.optional(v.string()),
        timezoneAbbreviation: v.optional(v.string()),
        timezoneOffsetMinutes: v.optional(v.number()),
      }),
    ),
  },
  returns: v.object({
    success: v.boolean(),
    organizationId: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    console.log("[ONBOARDING] connectShopifyStore started", {
      domain: args.domain,
      hasAccessToken: Boolean(args.accessToken),
      scope: args.scope,
    });

    try {
      const { user } = await requireUserAndOrg(ctx);

      console.log("[ONBOARDING] connectShopifyStore auth resolved", {
        userId: user._id,
        organizationId: user.organizationId,
      });

      // Normalize the domain and check if store already exists
      const domain = normalizeShopDomain(args.domain);
      const existingStore = await findShopifyStoreByDomain(ctx.db, domain);

      console.log("[ONBOARDING] connectShopifyStore store lookup complete", {
        domain,
        existingStoreId: existingStore?._id,
        existingOrganizationId: existingStore?.organizationId,
      });

      const storeName = args.shopData?.shopName || domain;
      const currency = args.shopData?.currency || "USD";

      if (existingStore) {
        // Prevent reassigning a store connected to another organization
        if (
          existingStore.organizationId &&
          user.organizationId &&
          existingStore.organizationId !==
            (user.organizationId as Id<"organizations">)
        ) {
          throw new Error(
            "This Shopify store is already connected to another organization.",
          );
        }
        // Reactivate existing store
        await ctx.db.patch("shopifyStores", existingStore._id, {
          organizationId: user.organizationId,
          accessToken: args.accessToken,
          scope: args.scope,
          storeName: storeName,
          primaryCurrency: currency,
          operatingCountry: args.shopData?.country,
          isActive: true,
          updatedAt: Date.now(),
        });
      } else {
        // Create new store
        await ctx.db.insert("shopifyStores", {
          organizationId: user.organizationId as Id<"organizations">,
          userId: user._id,
          shopDomain: domain,
          storeName: storeName,
          accessToken: args.accessToken,
          scope: args.scope,
          primaryCurrency: currency,
          operatingCountry: args.shopData?.country,
          isActive: true,
        });
      }

      if (user.organizationId) {
        const orgId = user.organizationId as Id<"organizations">;
        const orgDoc = await ctx.db.get("organizations", orgId);
        if (!orgDoc || orgDoc.primaryCurrency !== currency) {
          await ctx.db.patch("organizations", orgId, {
            primaryCurrency: currency,
            updatedAt: Date.now(),
          });
        }
      }

      // Initialize trial for store organizations if needed
      const billingRecord = await ctx.db
        .query("billing")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", user.organizationId as Id<"organizations">),
        )
        .first();

      if (billingRecord) {
        const now = Date.now();
        const needsTrialInit =
          !billingRecord.trialStartDate || billingRecord.hasTrialExpired;

        if (needsTrialInit) {
          const trialEndDate = now + 28 * 24 * 60 * 60 * 1000;

          await ctx.db.patch("billing", billingRecord._id, {
            trialStartDate: now,
            trialEndDate,
            trialEndsAt: trialEndDate,
            isTrialActive: true,
            hasTrialExpired: false,
            updatedAt: Date.now(),
          });

          console.log(
            `[ONBOARDING] Initialized 28-day trial for store organization ${user.organizationId as Id<"organizations">}`,
          );
        } else {
          console.log(
            `[ONBOARDING] Trial already active for organization ${user.organizationId as Id<"organizations">}`,
          );
        }
      }

      // Ensure organization timezone is set if we received a valid IANA timezone during connect
      try {
        const tz = args.shopData?.timezone;
        if (tz && isIanaTimeZone(tz) && user.organizationId) {
          const org = await ctx.db.get(
            "organizations",
            user.organizationId as Id<"organizations">,
          );
          if (!org || org.timezone !== tz) {
            await ctx.db.patch(
              "organizations",
              user.organizationId as Id<"organizations">,
              {
                timezone: tz,
                updatedAt: Date.now(),
              },
            );
          }
        }
      } catch (e) {
        console.warn("[ONBOARDING] timezone set skipped", e);
      }

      if (user.organizationId) {
        await ctx.scheduler.runAfter(
          0,
          internal.core.time.refreshOrganizationTimezone,
          {
            organizationId: user.organizationId as Id<"organizations">,
          },
        );
      }

      // Update user with primary currency from shop
      // Determine next step: If trial is active, skip billing and go to costs
      // If trial has expired, go to billing step
      // Remain on SHOPIFY step for sub-steps (billing/costs) to align with UI enums
      const nextStep = ONBOARDING_STEPS.BILLING;

      // Get or create onboarding record
      const onboarding = await getOrCreateOnboarding(
        ctx,
        user._id,
        user.organizationId as Id<"organizations">,
      );

      if (!onboarding) {
        throw new Error("Failed to get onboarding record");
      }

      // Update onboarding progress
      const completedSteps = onboarding.onboardingData?.completedSteps || [];

      if (!completedSteps.includes("shopify")) {
        completedSteps.push("shopify");
      }

      interface OnboardingUpdateData {
        onboardingStep: number;
        hasShopifyConnection: boolean;
        onboardingData: {
          completedSteps: string[];
          setupDate?: string;
        };
        updatedAt: number;
      }

      const onboardingUpdates: OnboardingUpdateData = {
        onboardingStep: nextStep,
        hasShopifyConnection: true,
        onboardingData: {
          ...onboarding.onboardingData,
          completedSteps,
        },
        updatedAt: Date.now(),
      };

      await ctx.db.patch("onboarding", onboarding._id, onboardingUpdates);

      console.log(
        `[ONBOARDING] Successfully connected Shopify store for ${user.email}. Sync will be triggered by callback.`,
      );

      return {
        success: true,
        organizationId: user.organizationId as Id<"organizations">,
      };
    } catch (error) {
      console.error("[ONBOARDING] connectShopifyStore failed", {
        domain: args.domain,
        error,
      });
      throw error;
    }
  },
});

/**
 * Get onboarding record by organization ID
 * Used by admin tools to mark analytics as completed
 */
export const getOnboardingByOrganization = internalQuery({
  args: { organizationId: v.id("organizations") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("onboarding"),
      analyticsCalculationStatus: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("onboarding")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();

    if (!record) return null;

    return {
      _id: record._id,
      analyticsCalculationStatus: record.analyticsCalculationStatus,
    };
  },
});

/**
 * Mark analytics calculation as completed
 * Called when admin manually triggers analytics via dev tools
 * This stops the cron from continuing to check this org
 */
export const markAnalyticsCompleted = internalMutation({
  args: {
    onboardingId: v.id("onboarding"),
    triggeredBy: v.string(),
    jobCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get("onboarding", args.onboardingId);

    if (!existing) {
      console.warn(
        `[ONBOARDING] Cannot mark analytics completed - onboarding ${args.onboardingId} not found`,
      );
      return;
    }

    await ctx.db.patch("onboarding", args.onboardingId, {
      analyticsCalculationStatus: "completed",
      lastMonitorCheckAt: Date.now(),
      onboardingData: {
        ...(existing.onboardingData || {}),
        analyticsTriggeredAt: Date.now(),
        manuallyTriggered: true,
        triggeredBy: args.triggeredBy,
        manualJobCount: args.jobCount,
      } as any,
    });

    console.log(
      `[ONBOARDING] Analytics marked as completed for ${args.onboardingId} by ${args.triggeredBy}${args.jobCount ? ` (${args.jobCount} jobs)` : ""} - cron will stop monitoring`,
    );
  },
});

// (Removed unused internal mutations: resetOnboarding, needsOnboarding)
