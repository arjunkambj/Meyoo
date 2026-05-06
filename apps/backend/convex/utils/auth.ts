import type { Doc, Id } from '../_generated/dataModel';
import { internal } from '../_generated/api';
import type { FunctionReference } from 'convex/server';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import { ConvexError } from 'convex/values';

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;

type StackIdentity = {
  stackId: string;
  teamId: string;
};

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return undefined;
}

export async function getStackIdentity(ctx: AnyCtx): Promise<StackIdentity | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const claims = identity as unknown as Record<string, unknown>;
  const stackId = firstString(
    claims.stackId,
    claims.stack_id,
    claims.userId,
    claims.sub,
    identity.subject,
    identity.tokenIdentifier,
  );
  const teamId = firstString(
    claims.teamId,
    claims.team_id,
    claims.selectedTeamId,
    claims.selected_team_id,
    claims['https://stack-auth.com/team_id'],
  );

  if (!stackId) return null;
  return { stackId, teamId: teamId ?? stackId };
}

async function loadUserByStackId(ctx: AnyCtx, stackId: string) {
  if ('db' in ctx) {
    return await ctx.db
      .query('users')
      .withIndex('by_stack_id', (q) => q.eq('stackId', stackId))
      .first();
  }

  return await ctx.runQuery(
    (internal as unknown as {
      'core/users': {
        getUserByStackIdInternal: FunctionReference<'query', 'internal'>;
      };
    })['core/users'].getUserByStackIdInternal,
    { stackId },
  );
}

async function loadOrganizationByTeamId(ctx: AnyCtx, teamId: string) {
  if ('db' in ctx) {
    return await ctx.db
      .query('organizations')
      .withIndex('by_stack_team', (q) => q.eq('stackTeamId', teamId))
      .first();
  }

  return await ctx.runQuery(internal.core.organizations.getByStackTeamIdInternal, {
    stackTeamId: teamId,
  });
}

async function loadOrganizationById(
  ctx: AnyCtx,
  organizationId: Id<'organizations'>,
) {
  if ('db' in ctx) {
    return await ctx.db.get(organizationId);
  }

  return await ctx.runQuery(internal.core.organizations.getByIdInternal, {
    organizationId,
  });
}

async function loadMembership(
  ctx: AnyCtx,
  orgId: Id<'organizations'>,
  userId: Id<'users'>,
) {
  if ('db' in ctx) {
    return await ctx.db
      .query('memberships')
      .withIndex('by_org_user', (q) =>
        q.eq('organizationId', orgId).eq('userId', userId),
      )
      .first();
  }

  return await ctx.runQuery(internal.core.memberships.getMembershipForUserInternal, {
    orgId,
    userId,
  });
}

export type UserAndOrg = {
  user: Doc<'users'>;
  orgId: Id<'organizations'>;
  teamId: string;
  membership: Doc<'memberships'> | null;
};

// Non-throwing helper: return null when not available
export async function getUserAndOrg(ctx: AnyCtx): Promise<UserAndOrg | null> {
  const stack = await getStackIdentity(ctx);
  if (!stack) return null;
  const user = await loadUserByStackId(ctx, stack.stackId);
  if (!user) return null;

  const organization =
    (await loadOrganizationByTeamId(ctx, stack.teamId)) ??
    (user.organizationId
      ? await loadOrganizationById(ctx, user.organizationId as Id<'organizations'>)
      : null);
  if (!organization) return null;

  const membership = await loadMembership(ctx, organization._id, user._id);
  return { user, orgId: organization._id, teamId: stack.teamId, membership };
}

// Throwing variant for paths which expect hard failures
export async function requireUserAndOrg(ctx: AnyCtx): Promise<UserAndOrg> {
  const stack = await getStackIdentity(ctx);
  if (!stack) throw new ConvexError('Not authenticated');
  const user = await loadUserByStackId(ctx, stack.stackId);
  if (!user) throw new ConvexError('User not found');
  const organization =
    (await loadOrganizationByTeamId(ctx, stack.teamId)) ??
    (user.organizationId
      ? await loadOrganizationById(ctx, user.organizationId as Id<'organizations'>)
      : null);
  if (!organization) throw new ConvexError('Team not found');
  const membership = await loadMembership(ctx, organization._id, user._id);
  return { user, orgId: organization._id, teamId: stack.teamId, membership };
}
