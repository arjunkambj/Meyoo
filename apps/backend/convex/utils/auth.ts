import type { Doc, Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import type { FunctionReference } from "convex/server";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { stackServerApp } from "../../stack/server";

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;

type StackIdentity = {
  stackId: string;
};

export async function getStackIdentity(
  ctx: AnyCtx,
): Promise<StackIdentity | null> {
  const user = await stackServerApp.getPartialUser({ from: "convex", ctx });
  if (!user) return null;

  return { stackId: user.id };
}

async function loadUserByStackId(ctx: AnyCtx, stackId: string) {
  if ("db" in ctx) {
    return await ctx.db
      .query("users")
      .withIndex("by_stack_id", (q) => q.eq("stackId", stackId))
      .first();
  }

  return await ctx.runQuery(
    (
      internal as unknown as {
        "core/users": {
          getUserByStackIdInternal: FunctionReference<"query", "internal">;
        };
      }
    )["core/users"].getUserByStackIdInternal,
    { stackId },
  );
}

async function loadOrganizationById(
  ctx: AnyCtx,
  organizationId: Id<"organizations">,
) {
  if ("db" in ctx) {
    return await ctx.db.get(organizationId);
  }

  return await ctx.runQuery(internal.core.organizations.getByIdInternal, {
    organizationId,
  });
}

async function loadMembership(
  ctx: AnyCtx,
  orgId: Id<"organizations">,
  userId: Id<"users">,
) {
  if ("db" in ctx) {
    return await ctx.db
      .query("memberships")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", orgId).eq("userId", userId),
      )
      .first();
  }

  return await ctx.runQuery(
    internal.core.memberships.getMembershipForUserInternal,
    {
      orgId,
      userId,
    },
  );
}

export type UserAndOrg = {
  user: Doc<"users">;
  orgId: Id<"organizations">;
  membership: Doc<"memberships"> | null;
};

// Non-throwing helper: return null when not available
export async function getUserAndOrg(ctx: AnyCtx): Promise<UserAndOrg | null> {
  const stack = await getStackIdentity(ctx);
  if (!stack) return null;
  const user = await loadUserByStackId(ctx, stack.stackId);
  if (!user) return null;

  const organization = user.organizationId
    ? await loadOrganizationById(
        ctx,
        user.organizationId as Id<"organizations">,
      )
    : null;
  if (!organization) return null;

  const membership = await loadMembership(ctx, organization._id, user._id);
  return { user, orgId: organization._id, membership };
}

// Throwing variant for paths which expect hard failures
export async function requireUserAndOrg(ctx: AnyCtx): Promise<UserAndOrg> {
  const stack = await getStackIdentity(ctx);
  if (!stack) throw new ConvexError("Not authenticated");
  const user = await loadUserByStackId(ctx, stack.stackId);
  if (!user) throw new ConvexError("User not found");
  const organization = user.organizationId
    ? await loadOrganizationById(
        ctx,
        user.organizationId as Id<"organizations">,
      )
    : null;
  if (!organization) throw new ConvexError("Team not found");
  const membership = await loadMembership(ctx, organization._id, user._id);
  return { user, orgId: organization._id, membership };
}
