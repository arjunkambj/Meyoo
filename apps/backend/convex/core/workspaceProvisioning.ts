import { DEFAULT_DASHBOARD_CONFIG } from "@repo/types";

import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { ensureActiveMembership } from "./membershipHelpers";

type WorkspaceUser = {
  name?: string | null;
  email?: string | null;
};

export async function createNewUserData(
  ctx: MutationCtx,
  userId: Id<"users">,
  profile: WorkspaceUser,
) {
  const now = Date.now();

  const orgId = await ctx.db.insert("organizations", {
    name: profile.name ? `${profile.name}'s Store` : "My Store",
    ownerId: userId,
    isPremium: false,
    requiresUpgrade: false,
    locale: "en-US",
    timezone: "America/New_York",
    primaryCurrency: "USD",
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.patch("users", userId, {
    organizationId: orgId,
    status: "active",
    isOnboarded: false,
    loginCount: 1,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  });

  await ensureActiveMembership(ctx, orgId, userId, "StoreOwner", {
    assignedAt: now,
    assignedBy: userId,
  });

  await ctx.db.insert("onboarding", {
    userId,
    organizationId: orgId,
    onboardingStep: 1,
    isCompleted: false,
    hasShopifyConnection: false,
    hasMetaConnection: false,
    hasGoogleConnection: false,
    isInitialSyncComplete: false,
    isProductCostSetup: false,
    isExtraCostSetup: false,
    onboardingData: {
      completedSteps: [],
      setupDate: new Date().toISOString(),
    },
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("dashboards", {
    organizationId: orgId,
    name: "Main Dashboard",
    type: "main",
    isDefault: true,
    visibility: "private",
    createdBy: userId,
    updatedAt: now,
    config: {
      kpis: [...DEFAULT_DASHBOARD_CONFIG.kpis],
      widgets: [...DEFAULT_DASHBOARD_CONFIG.widgets],
    },
  });
}
