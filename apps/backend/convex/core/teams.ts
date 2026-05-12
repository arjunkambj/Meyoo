import { v } from "convex/values";
import type { MutationCtx } from "../_generated/server";
import { mutation, query } from "../_generated/server";
import { createNewUserData } from "./workspaceProvisioning";
import { ensureActiveMembership } from "./membershipHelpers";
import {
  getStackIdentity,
  getUserAndOrg,
  requireUserAndOrg,
} from "../utils/auth";

/**
 * Team Management
 * Handles team member invitations, roles, and permissions
 */

/**
 * Check if current user can manage team
 */
export const canManageTeam = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return false;
    return auth.membership?.role === "StoreOwner";
  },
});

/**
 * Sync an accepted Stack Auth team invitation into Convex membership state.
 */
export const syncCurrentStackTeamMembership = mutation({
  args: {
    teamId: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      role: v.union(v.literal("StoreOwner"), v.literal("StoreTeam")),
    }),
  ),
  handler: async (ctx, args) => {
    const stack = await getStackIdentity(ctx);
    if (!stack)
      throw new Error("User must be signed in to sync team membership");

    const user = await ctx.db
      .query("users")
      .withIndex("by_stack_id", (q) => q.eq("stackId", stack.stackId))
      .first();
    if (!user) throw new Error("User not found");

    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_stack_team", (q) => q.eq("stackTeamId", args.teamId))
      .first();
    if (!organization) return null;

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", organization._id).eq("userId", user._id),
      )
      .first();

    if (membership?.status === "active") {
      const role =
        membership.role === "StoreOwner" ? "StoreOwner" : "StoreTeam";
      return { role } as const;
    }

    const now = Date.now();
    await ensureActiveMembership(
      ctx as unknown as MutationCtx,
      organization._id,
      user._id,
      "StoreTeam",
      {
        assignedAt: now,
        assignedBy: organization.ownerId,
      },
    );

    await ctx.db.patch("users", user._id, {
      organizationId: organization._id,
      selectedTeamId: args.teamId,
      teamIds: Array.from(new Set([...(user.teamIds ?? []), args.teamId])),
      status: "active",
      updatedAt: now,
    });

    return { role: "StoreTeam" } as const;
  },
});

/**
 * Get team members for an organization
 */
export const getTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return [];

    // Allow any member of the organization to view team members
    // Actions (invite/remove) are controlled separately by role checks

    const orgId = auth.orgId;
    const memberships = (
      await ctx.db
        .query("memberships")
        .withIndex("by_org", (q) => q.eq("organizationId", orgId))
        .collect()
    ).filter((membership) => membership.status !== "removed");

    const users = await Promise.all(
      memberships.map((m) => ctx.db.get("users", m.userId)),
    );

    return memberships.map((m, i) => {
      const u = users[i]!;
      return {
        _id: u._id,
        _creationTime: u._creationTime,
        email: u.email,
        name: u.name,
        image: u.image,
        role: m.role,
        status: m.status,
        isOnboarded: u.isOnboarded,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    });
  },
});

/**
 * Get team membership stats for the current organization
 */
export const getTeamStats = query({
  args: {},
  returns: v.object({
    totalMembers: v.number(),
    activeMembers: v.number(),
    suspendedMembers: v.number(),
    owners: v.number(),
    teamMembers: v.number(),
    freeSeats: v.number(),
    paidSeats: v.number(),
    aiSeats: v.number(),
  }),
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        suspendedMembers: 0,
        owners: 0,
        teamMembers: 0,
        freeSeats: 0,
        paidSeats: 0,
        aiSeats: 0,
      };
    }

    const memberships = (
      await ctx.db
        .query("memberships")
        .withIndex("by_org", (q) => q.eq("organizationId", auth.orgId))
        .collect()
    ).filter((membership) => membership.status !== "removed");

    return {
      totalMembers: memberships.length,
      activeMembers: memberships.filter(
        (membership) => membership.status === "active",
      ).length,
      suspendedMembers: memberships.filter(
        (membership) => membership.status === "suspended",
      ).length,
      owners: memberships.filter(
        (membership) => membership.role === "StoreOwner",
      ).length,
      teamMembers: memberships.filter(
        (membership) => membership.role === "StoreTeam",
      ).length,
      freeSeats: memberships.filter(
        (membership) => membership.seatType === "free",
      ).length,
      paidSeats: memberships.filter(
        (membership) => membership.seatType === "paid",
      ).length,
      aiSeats: memberships.filter((membership) => membership.hasAIAccess)
        .length,
    };
  },
});

/**
 * Remove team member
 */
export const removeTeamMember = mutation({
  args: {
    memberId: v.id("users"),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const { user, orgId, membership } = await requireUserAndOrg(ctx);

    if (membership?.role !== "StoreOwner") {
      throw new Error("Only the store owner can remove team members");
    }

    const memberToRemove = await ctx.db.get("users", args.memberId);

    if (!memberToRemove) {
      throw new Error("Member not found");
    }

    // Verify member belongs to same organization
    if (memberToRemove.organizationId !== orgId) {
      throw new Error("Member not found in your organization");
    }

    // Cannot remove owners or other admins (via membership)
    const memberMembership = await ctx.db
      .query("memberships")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", orgId).eq("userId", args.memberId),
      )
      .first();
    if (memberMembership && memberMembership.role === "StoreOwner") {
      throw new Error("Cannot remove the store owner");
    }

    // Cannot remove self
    if (memberToRemove._id === user._id) {
      throw new Error("Cannot remove yourself");
    }

    const now = Date.now();

    // Mark membership removed before resetting the user's workspace context
    if (memberMembership && memberMembership.status !== "removed") {
      await ctx.db.patch("memberships", memberMembership._id, {
        status: "removed",
        updatedAt: now,
      });
    }

    // Move removed member into a fresh personal organization so they can re-onboard elsewhere
    await createNewUserData(ctx as unknown as MutationCtx, memberToRemove._id, {
      name: memberToRemove.name || null,
      email: memberToRemove.email || null,
    });

    return {
      success: true,
      message: "Team member access removed",
    };
  },
});

/**
 * Leave organization (for non-owners)
 * Resets the current user to a new organization like a fresh signup
 */
export const leaveOrganization = mutation({
  args: {},
  returns: v.object({ success: v.boolean(), message: v.string() }),
  handler: async (ctx) => {
    const { user, orgId, membership } = await requireUserAndOrg(ctx);

    // Owners cannot leave their own organization via this endpoint
    if (membership?.role === "StoreOwner") {
      throw new Error("Store owners cannot leave their own organization");
    }

    const existingMembership = await ctx.db
      .query("memberships")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", orgId).eq("userId", user._id),
      )
      .first();
    const now = Date.now();

    if (existingMembership && existingMembership.status !== "removed") {
      await ctx.db.patch("memberships", existingMembership._id, {
        status: "removed",
        updatedAt: now,
      });
    }

    await createNewUserData(ctx as unknown as MutationCtx, user._id, {
      name: user.name || null,
      email: user.email || null,
    });

    return { success: true, message: "You have left the organization" };
  },
});
