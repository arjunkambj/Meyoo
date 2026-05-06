import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { getShopTimeInfo as fetchShopTimeInfo } from "../../libs/time/shopTime";
import { internal } from "../_generated/api";
import { getUserAndOrg } from "../utils/auth";

export const getShopTimeInfo = action({
  args: {
    organizationId: v.optional(v.id("organizations")),
  },
  returns: v.object({
    offsetMinutes: v.number(),
    timezoneAbbreviation: v.optional(v.string()),
    timezoneIana: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    let orgId: Id<"organizations"> | undefined = args.organizationId as Id<
      "organizations"
    > | undefined;

    if (!orgId) {
      const auth = await getUserAndOrg(ctx);
      orgId = auth?.orgId;
    }

    if (!orgId) {
      return { offsetMinutes: 0, timezoneAbbreviation: undefined, timezoneIana: undefined };
    }

    const info = await fetchShopTimeInfo(ctx, String(orgId));
    return {
      offsetMinutes: info.offsetMinutes ?? 0,
      timezoneAbbreviation: info.timezoneAbbreviation,
      timezoneIana: info.timezoneIana,
    };
  },
});

export const refreshOrganizationTimezone = internalAction({
  args: {
    organizationId: v.id("organizations"),
  },
  returns: v.object({
    success: v.boolean(),
    timezone: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const info = await fetchShopTimeInfo(ctx, String(args.organizationId));
      if (info.timezoneIana) {
        await ctx.runMutation(internal.core.organizations.setOrganizationTimezoneInternal, {
          organizationId: args.organizationId,
          timezone: info.timezoneIana,
        });
        return {
          success: true,
          timezone: info.timezoneIana,
        };
      }
      return {
        success: false,
        timezone: undefined,
      };
    } catch (error) {
      console.warn("[Time] Failed to refresh organization timezone", {
        organizationId: args.organizationId,
        error,
      });
      return {
        success: false,
        timezone: undefined,
      };
    }
  },
});
