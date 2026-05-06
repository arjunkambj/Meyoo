import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

export async function requireAuth(
  ctx: Pick<QueryCtx | MutationCtx | ActionCtx, "auth">,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
}

export async function getAuth(
  ctx: Pick<QueryCtx | MutationCtx | ActionCtx, "auth">,
) {
  return await ctx.auth.getUserIdentity();
}
