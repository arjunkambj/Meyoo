import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export async function findExistingUser(
  ctx: MutationCtx,
  email: string | null | undefined,
  excludeUserId?: Id<"users">,
) {
  if (!email) return null;

  const rawEmail = email;
  const normalized = normalizeEmail(email);

  let user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", normalized))
    .first();

  if (!user && normalized !== rawEmail) {
    user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", rawEmail))
      .first();
  }

  if (user && excludeUserId && user._id === excludeUserId) return null;

  return user;
}
