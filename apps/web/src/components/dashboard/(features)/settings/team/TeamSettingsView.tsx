"use client";

import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useUser as useStackUser } from "@stackframe/stack";
import { useState } from "react";

import { useUser } from "@/hooks";
import LeaveOrganizationButton from "./LeaveOrganizationButton";
import TeamInviteModal from "./TeamInviteModal";
import TeamMembersList from "./TeamMembersList";

export default function TeamSettingsView() {
  const stackUser = useStackUser();
  const { membershipRole } = useUser();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const canManageTeam = membershipRole === "StoreOwner";

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Team Management
          </h2>
          <p className="text-sm text-foreground mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        {canManageTeam ? (
          <Button
            className="min-h-10"
            variant="primary"
            onPress={() => setIsInviteOpen(true)}
          >
            <Icon icon="solar:user-plus-bold-duotone" width={18} />
            Invite
          </Button>
        ) : (
          <LeaveOrganizationButton />
        )}
      </div>

      {/* Team Members List */}
      <TeamMembersList />

      <TeamInviteModal
        isOpen={isInviteOpen}
        team={stackUser?.selectedTeam}
        onClose={() => setIsInviteOpen(false)}
      />

      {/* Info for non-owners */}
      {!canManageTeam && (
        <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary">
          <Card.Content className="px-5 py-5">
            <div className="flex items-start gap-3">
              <Icon
                className="text-foreground mt-1"
                icon="solar:info-circle-bold-duotone"
                width={20}
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Team Member Access
                </p>
                <p className="text-sm text-foreground">
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
