import { v } from "convex/values";
import { DEFAULT_DASHBOARD_CONFIG } from "@repo/types";

import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation, internalQuery } from "../_generated/server";
import { ensureActiveMembership } from "./membershipHelpers";

const ensureOnboarding = async (
  ctx: Parameters<typeof ensureActiveMembership>[0],
  userId: Id<"users">,
  organizationId: Id<"organizations">,
  now: number,
) => {
  const existing = await ctx.db
    .query("onboarding")
    .withIndex("by_user_organization", (q) =>
      q.eq("userId", userId).eq("organizationId", organizationId),
    )
    .first();

  if (existing) return;

  await ctx.db.insert("onboarding", {
    userId,
    organizationId,
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
      setupDate: new Date(now).toISOString(),
    },
    createdAt: now,
    updatedAt: now,
  });
};

const ensureDefaultDashboard = async (
  ctx: Parameters<typeof ensureActiveMembership>[0],
  userId: Id<"users">,
  organizationId: Id<"organizations">,
  now: number,
) => {
  const existing = await ctx.db
    .query("dashboards")
    .withIndex("by_organizationId_and_isDefault", (q) =>
      q.eq("organizationId", organizationId).eq("isDefault", true),
    )
    .first();

  if (existing) return;

  await ctx.db.insert("dashboards", {
    organizationId,
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
};

const ensureStackUserWorkspace = async (
  ctx: Parameters<typeof ensureActiveMembership>[0],
  userId: Id<"users">,
  organizationId: Id<"organizations">,
  now: number,
) => {
  await ensureActiveMembership(ctx, organizationId, userId, "StoreOwner", {
    assignedAt: now,
    assignedBy: userId,
  });
  await ensureOnboarding(ctx, userId, organizationId, now);
  await ensureDefaultDashboard(ctx, userId, organizationId, now);
};

export const getUserByStackIdInternal = internalQuery({
  args: {
    stackId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stack_id", (q) => q.eq("stackId", args.stackId))
      .first();
  },
});

export const upsertFromStackWebhook = internalMutation({
  args: {
    stackId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const email = args.email.trim().toLowerCase();
    const existingUserByStackId = await ctx.db
      .query("users")
      .withIndex("by_stack_id", (q) => q.eq("stackId", args.stackId))
      .first();
    const existingUserByEmail = email
      ? await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", email))
          .first()
      : null;
    const existingUser = existingUserByStackId ?? existingUserByEmail;

    if (existingUser) {
      let organizationId = existingUser.organizationId;
      if (!organizationId) {
        organizationId = await ctx.db.insert("organizations", {
          stackTeamId: args.stackId,
          name: args.name ? `${args.name}'s Store` : "My Organization",
          ownerId: existingUser._id,
          isPremium: false,
          requiresUpgrade: false,
          locale: "en-US",
          primaryCurrency: "USD",
          createdAt: now,
          updatedAt: now,
        });
      } else {
        const organization = await ctx.db.get(
          "organizations",
          organizationId as Id<"organizations">,
        );
        if (organization && !organization.stackTeamId) {
          await ctx.db.patch("organizations", organization._id, {
            stackTeamId: args.stackId,
            ownerId: organization.ownerId ?? existingUser._id,
            updatedAt: now,
          });
        }
      }

      const patch: Partial<Doc<"users">> = {
        stackId: args.stackId,
        name: args.name,
        email,
        image: args.imageUrl,
        imageUrl: args.imageUrl,
        organizationId,
        selectedTeamId: existingUser.selectedTeamId ?? args.stackId,
        teamIds: Array.from(
          new Set([...(existingUser.teamIds ?? []), args.stackId]),
        ),
        status: "active",
        updatedAt: now,
      };

      await ctx.db.patch("users", existingUser._id, patch);
      await ensureStackUserWorkspace(
        ctx,
        existingUser._id,
        organizationId as Id<"organizations">,
        now,
      );
      return existingUser._id;
    }

    const organizationId = await ctx.db.insert("organizations", {
      stackTeamId: args.stackId,
      name: args.name ? `${args.name}'s Store` : "My Organization",
      isPremium: false,
      requiresUpgrade: false,
      locale: "en-US",
      primaryCurrency: "USD",
      createdAt: now,
      updatedAt: now,
    });

    const insertDoc = {
      stackId: args.stackId,
      name: args.name,
      email,
      organizationId,
      teamIds: [args.stackId],
      selectedTeamId: args.stackId,
      imageUrl: args.imageUrl,
      image: args.imageUrl,
      status: "active" as const,
      updatedAt: now,
      createdAt: now,
    } satisfies Omit<Doc<"users">, "_id" | "_creationTime">;

    const userId = await ctx.db.insert("users", insertDoc);
    await ctx.db.patch("organizations", organizationId, { ownerId: userId });
    await ensureStackUserWorkspace(ctx, userId, organizationId, now);

    return userId;
  },
});

export const deleteFromStackWebhook = internalMutation({
  args: {
    stackId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_stack_id", (q) => q.eq("stackId", args.stackId))
      .first();

    if (!existingUser) return;

    await ctx.db.patch("users", existingUser._id, {
      status: "deleted",
      appDeletedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
