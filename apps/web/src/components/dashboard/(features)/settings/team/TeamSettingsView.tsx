"use client";

import { Card, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useTeamStats, useUser } from "@/hooks";
import LeaveOrganizationButton from "./LeaveOrganizationButton";
import TeamMembersList from "./TeamMembersList";

export default function TeamSettingsView() {
  const { membershipRole } = useUser();
  const { teamStats, isLoading } = useTeamStats();
  const canManageTeam = membershipRole === "StoreOwner";

  // Loading state for stats
  const StatsLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <Card
          key={i}
          className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary dark:bg-surface"
        >
          <Card.Content className="px-5 py-5">
            <Skeleton className="rounded-lg">
              <div className="h-16 rounded-lg bg-surface-tertiary" />
            </Skeleton>
          </Card.Content>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-muted">
            Team Management
          </h2>
          <p className="text-sm text-muted mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        {!canManageTeam ? <LeaveOrganizationButton /> : null}
      </div>

      {/* Team Stats - moved before Organization Section */}
      {isLoading ? (
        <StatsLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary dark:bg-surface">
            <Card.Content className="px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Icon
                    className="text-accent"
                    icon="solar:users-group-two-rounded-bold-duotone"
                    width={20}
                  />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-muted">
                    {teamStats?.totalMembers ?? 0}
                  </p>
                  <p className="text-xs text-muted">Total Members</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary dark:bg-surface">
            <Card.Content className="px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Icon
                    className="text-success"
                    icon="solar:check-circle-bold-duotone"
                    width={20}
                  />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-muted">
                    {teamStats?.activeMembers ?? 0}
                  </p>
                  <p className="text-xs text-muted">Active Members</p>
                </div>
              </div>
            </Card.Content>
          </Card>

        </div>
      )}

      {/* Team Members List */}
      <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary dark:bg-surface">
        <Card.Content className="p-0">
          <TeamMembersList />
        </Card.Content>
      </Card>

      {/* Info for non-owners */}
      {!canManageTeam && (
        <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary dark:bg-surface">
          <Card.Content className="px-5 py-5">
            <div className="flex items-start gap-3">
              <Icon
                className="text-muted mt-1"
                icon="solar:info-circle-bold-duotone"
                width={20}
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted">
                  Team Member Access
                </p>
                <p className="text-sm text-muted">
                  As a team member, you have access to all features except
                  billing and team management. Contact your store owner to make
                  changes to the team.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
