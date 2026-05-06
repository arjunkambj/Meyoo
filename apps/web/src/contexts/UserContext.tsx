"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useUser as useStackUser } from "@stackframe/stack";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { api } from "@/libs/convexApi";
import type { Doc } from "@repo/convex/dataModel";

type StackUserProfile = {
  _id?: string;
  stackId?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  organizationId?: string;
  isOnboarded?: boolean;
};

type UserContextValue = {
  user: StackUserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  membershipRole: Doc<"memberships">["role"] | null;
  organizationId: string | undefined;
  primaryCurrency: string;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const getOnboarded = (metadata: unknown) =>
  Boolean(
    metadata &&
      typeof metadata === "object" &&
      "onboarded" in metadata &&
      metadata.onboarded,
  );

export function UserProvider({ children }: { children: ReactNode }) {
  const stackUser = useStackUser();
  const membership = useQuery(api.core.memberships.getCurrentMembership);
  const organization = useQuery(api.core.organizations.getCurrentOrganization);
  const userLoading = stackUser === undefined;
  const error = !stackUser && !userLoading ? "User not found" : null;
  const user = useMemo(
    () =>
      stackUser
        ? {
            _id: stackUser.id,
            stackId: stackUser.id,
            name: stackUser.displayName ?? undefined,
            email: stackUser.primaryEmail ?? undefined,
            image: stackUser.profileImageUrl ?? undefined,
            organizationId: organization?.id,
            isOnboarded: getOnboarded(stackUser.clientReadOnlyMetadata),
          }
        : null,
    [organization?.id, stackUser],
  );

  const userContextValue: UserContextValue = {
    user,
    loading: userLoading,
    error,
    isAuthenticated: !!user,
    membershipRole: membership?.role ?? null,
    organizationId: organization?.id,
    primaryCurrency: organization?.primaryCurrency ?? "USD",
  };

  useEffect(() => {
    console.log("[auth-debug] UserProvider state", {
      stackUserLoading: userLoading,
      stackUserId: stackUser?.id,
      email: stackUser?.primaryEmail,
      membershipLoaded: membership !== undefined,
      membershipRole: membership?.role ?? null,
      organizationLoaded: organization !== undefined,
      organizationId: organization?.id ?? null,
      userContextUser: user,
    });
  }, [
    membership,
    organization,
    stackUser?.id,
    stackUser?.primaryEmail,
    user,
    userLoading,
  ]);

  return (
    <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
