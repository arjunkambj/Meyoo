import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

type MembershipRole = Doc<"memberships">["role"];
type MembershipSeatType = Doc<"memberships">["seatType"];

type EnsureMembershipOptions = {
  seatType?: MembershipSeatType;
  hasAiAddOn?: boolean;
  assignedAt?: number;
  assignedBy?: Id<"users">;
};

export async function ensureActiveMembership(
  ctx: MutationCtx,
  organizationId: Id<"organizations">,
  userId: Id<"users">,
  role: MembershipRole,
  options: EnsureMembershipOptions = {},
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("memberships")
    .withIndex("by_org_user", (q) =>
      q.eq("organizationId", organizationId).eq("userId", userId),
    )
    .first();

  const seatType: MembershipSeatType =
    existing?.seatType ?? options.seatType ?? "free";
  const hasAiAddOn = existing?.hasAiAddOn ?? options.hasAiAddOn ?? false;
  const hasAIAccess = seatType === "paid" || hasAiAddOn;
  const assignedAt = existing?.assignedAt ?? options.assignedAt ?? now;
  const assignedBy = existing?.assignedBy ?? options.assignedBy ?? userId;

  if (existing) {
    await ctx.db.patch("memberships", existing._id, {
      role,
      status: "active",
      seatType,
      hasAiAddOn,
      hasAIAccess,
      assignedAt,
      assignedBy,
      updatedAt: now,
    });
    return;
  }

  await ctx.db.insert("memberships", {
    organizationId,
    userId,
    role,
    status: "active",
    seatType,
    hasAiAddOn,
    hasAIAccess,
    assignedAt,
    assignedBy,
    createdAt: now,
    updatedAt: now,
  });
}
