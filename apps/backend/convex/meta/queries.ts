import { v } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { getUserAndOrg } from "../utils/auth";

export const getAdAccounts = query({
  args: {},
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return [];

    const accounts = await ctx.db
      .query("metaAdAccounts")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", auth.orgId as Id<"organizations">),
      )
      .collect();

    return accounts.map((account) => ({
      id: account._id,
      accountId: account.accountId,
      accountName: account.accountName,
      isActive: account.isActive,
      isPrimary: account.isPrimary,
      lastSyncAt: account.syncedAt,
    }));
  },
});

export const getInsights = query({
  args: {
    accountId: v.optional(v.id("metaAdAccounts")),
    dateRange: v.optional(
      v.object({
        startDate: v.string(),
        endDate: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return [];

    let insights: Doc<"metaInsights">[];

    if (args.accountId) {
      const account = await ctx.db.get(args.accountId);
      if (!account) return [];

      if (args.dateRange) {
        const { startDate, endDate } = args.dateRange;
        insights = (await ctx.db
          .query("metaInsights")
          .withIndex("by_entity_date", (q) =>
            q
              .eq("entityType", "account")
              .eq("entityId", account.accountId)
              .gte("date", startDate)
              .lte("date", endDate),
          )
          .take(1000)) as Doc<"metaInsights">[];
      } else {
        insights = (await ctx.db
          .query("metaInsights")
          .withIndex("by_entity_date", (q) =>
            q.eq("entityType", "account").eq("entityId", account.accountId),
          )
          .take(1000)) as Doc<"metaInsights">[];
      }
    } else if (args.dateRange) {
      const { startDate, endDate } = args.dateRange;
      insights = (await ctx.db
        .query("metaInsights")
        .withIndex("by_org_date", (q) =>
          q
            .eq("organizationId", auth.orgId as Id<"organizations">)
            .gte("date", startDate)
            .lte("date", endDate),
        )
        .take(1000)) as Doc<"metaInsights">[];
    } else {
      insights = (await ctx.db
        .query("metaInsights")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", auth.orgId as Id<"organizations">),
        )
        .take(1000)) as Doc<"metaInsights">[];
    }

    return insights;
  },
});

export const getCampaigns = query({
  args: {
    accountId: v.optional(v.id("metaAdAccounts")),
  },
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return [];

    // Campaign storage not implemented yet
    return [];
  },
});

export const metaQueries = {
  getAdAccounts,
  getInsights,
  getCampaigns,
};
