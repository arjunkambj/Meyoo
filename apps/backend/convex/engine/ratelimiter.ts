import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

/**
 * Simple token-bucket rate limiter per platform using platformRateLimits table.
 * Window = current hour (UTC). Limit for Meta defaults to 10_000 tokens/hour.
 */

function currentHourWindow() {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const start = Math.floor(now / hourMs) * hourMs;
  return { start, end: start + hourMs };
}

const HOURLY_LIMIT = 10_000;

export const getBucket = internalQuery({
  args: { platform: v.string() },
  handler: async (ctx, args) => {
    const { start, end } = currentHourWindow();
    const existing = await (ctx.db as any)
      .query("platformRateLimits")
      .withIndex("by_platform_and_window_start", (q: any) =>
        q.eq("platform", args.platform).eq("windowStart", start),
      )
      .first();
    if (!existing) {
      return {
        platform: args.platform,
        windowStart: start,
        windowEnd: end,
        used: 0,
        limit: HOURLY_LIMIT,
        updatedAt: Date.now(),
      };
    }
    return existing;
  },
});

export const acquire = internalMutation({
  args: { platform: v.string(), cost: v.number() },
  returns: v.object({ ok: v.boolean(), resetAt: v.number() }),
  handler: async (ctx, args) => {
    const { start, end } = currentHourWindow();

    let doc = await (ctx.db as any)
      .query("platformRateLimits")
      .withIndex("by_platform_and_window_start", (q: any) =>
        q.eq("platform", args.platform).eq("windowStart", start),
      )
      .first();

    if (!doc) {
      const id = await (ctx.db as any).insert("platformRateLimits", {
        platform: args.platform,
        windowStart: start,
        windowEnd: end,
        used: 0,
        limit: HOURLY_LIMIT,
        updatedAt: Date.now(),
      });
      doc = await (ctx.db as any).get(id);
    }

    if (!doc) return { ok: false, resetAt: end };

    if (doc.used + args.cost > doc.limit) {
      return { ok: false, resetAt: doc.windowEnd };
    }

    await (ctx.db as any).patch(doc._id, {
      used: doc.used + args.cost,
      updatedAt: Date.now(),
    });

    return { ok: true, resetAt: doc.windowEnd };
  },
});
