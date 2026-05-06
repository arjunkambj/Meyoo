"use client";

import { Avatar, Button, Chip, Skeleton, Table, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { useSetAtom } from "jotai";
import { setSettingsPendingAtom } from "@/store/atoms";
import { api } from "@/libs/convexApi";
import type { GenericId as Id } from "convex/values";
import { useTeamMembersWithManagement, useUser } from "@/hooks";
import { formatDate } from "@/libs/utils/format";

const TableBody = Table.Body;
const TableCell = Table.Cell;
const TableColumn = Table.Column;
const TableHeader = Table.Header;
const TableRow = Table.Row;

// Use inferred return type from Convex API; no local TeamMember type

export default function TeamMembersList() {
  const { membershipRole: currentUserRole } = useUser();
  const { teamMembers, canManageTeam, isLoading } =
    useTeamMembersWithManagement();
  const [removingUserId, setRemovingUserId] = useState<Id<"users"> | null>(
    null
  );
  const setPending = useSetAtom(setSettingsPendingAtom);

  const removeTeamMember = useMutation(api.core.teams.removeTeamMember);

  const handleRemoveMember = useCallback(
    async (userId: Id<"users">) => {
      setRemovingUserId(userId);
      setPending(true);
      try {
        const result = await removeTeamMember({ memberId: userId });

        if (result.success) {
          toast(result.message);
        } else {
          toast.danger(result.message);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to remove team member";
        toast.danger(message);
      } finally {
        setRemovingUserId(null);
        setPending(false);
      }
    },
    [removeTeamMember, setPending]
  );

  if (isLoading) {
    return (
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Loading team members">
            <TableHeader>
              <TableColumn id="member" isRowHeader>
                MEMBER
              </TableColumn>
              <TableColumn id="role">ROLE</TableColumn>
              <TableColumn id="status">STATUS</TableColumn>
              <TableColumn id="joined">JOINED</TableColumn>
              <TableColumn id="actions">{canManageTeam ? "ACTIONS" : ""}</TableColumn>
            </TableHeader>
            <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index} id={`skeleton-${index}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-3 w-40 rounded-lg" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
            </TableBody>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  }

  if (teamMembers && teamMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center mb-4">
            <Icon
              className="text-accent"
              icon="solar:users-group-two-rounded-bold-duotone"
              width={48}
            />
          </div>
          <p className="text-lg font-medium text-foreground">
            No team members yet
          </p>
          <p className="text-sm text-muted">
            Invite team members to collaborate on your store. They will have
            access to all features except billing and team management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members">
          <TableHeader>
            <TableColumn id="member" isRowHeader>
              MEMBER
            </TableColumn>
            <TableColumn id="role">ROLE</TableColumn>
            <TableColumn id="status">STATUS</TableColumn>
            <TableColumn id="joined">JOINED</TableColumn>
            <TableColumn id="actions">{canManageTeam ? "ACTIONS" : ""}</TableColumn>
          </TableHeader>
          <TableBody>
        {(teamMembers || []).map((member) => (
          <TableRow key={member._id} id={member._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar
                  size="sm"
                >
                  <Avatar.Image src={member.image} alt={member.name || member.email || "Team member"} />
                  <Avatar.Fallback>{(member.name || member.email || "TM").slice(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.name || "Unnamed"}
                  </p>
                  <p className="text-xs text-muted">{member.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Chip
                color={member.role === "StoreOwner" ? "accent" : "default"}
                size="sm"
              >
                {member.role === "StoreOwner" ? "Owner" : "Team"}
              </Chip>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Chip
                  color={member.status === "active" ? "success" : "warning"}
                  size="sm"
                  variant="soft"
                >
                  {member.status === "active" ? "Active" : "Invited"}
                </Chip>
                {/* Additional invite details removed to align with server types */}
              </div>
            </TableCell>
            <TableCell>
              <p className="text-sm text-muted">
                {member.createdAt ? formatDate(member.createdAt) : "—"}
              </p>
            </TableCell>
            <TableCell>
              {canManageTeam &&
              member.role !== "StoreOwner" &&
              currentUserRole === "StoreOwner" ? (
                <Button
                 
                  isPending={removingUserId === member._id}
                  size="sm"
                 
                  variant="tertiary"
                  onPress={() => handleRemoveMember(member._id)}
                >
                  Remove
                </Button>
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
