import { useUser as useStackUser } from "@stackframe/stack";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { useUserContext } from "@/contexts/UserContext";
import { api } from "@/libs/convexApi";

/**
 * Get current authenticated user
 */
export type UserProfile = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  organizationId?: string;
  isOnboarded?: boolean;
  hasMetaConnection?: boolean;
  [key: string]: unknown;
};

export function useUser() {
  const stackUser = useStackUser();
  const {
    user,
    loading,
    error,
    membershipRole,
    organizationId,
    primaryCurrency,
  } = useUserContext();
  const typedUser = user ? (user as UserProfile) : null;
  const integrationOverview = useQuery(api.core.integrationOverview.getOverview);
  const updateProfile = async (data: {
    name?: string;
    email?: string;
    phone?: string;
    timezone?: string;
  }) => {
    await stackUser?.update({
      ...(data.name !== undefined ? { displayName: data.name } : {}),
      ...(data.email !== undefined ? { primaryEmail: data.email } : {}),
      ...(data.phone !== undefined || data.timezone !== undefined
        ? {
            clientMetadata: {
              ...(data.phone !== undefined ? { phone: data.phone } : {}),
              ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
            },
          }
        : {}),
    });
    return { success: true };
  };

  return {
    user: typedUser,
    loading,
    error,
    isAuthenticated: !!typedUser,
    role: membershipRole ?? null,
    membershipRole,
    organizationId,
    hasShopifyConnection: integrationOverview?.shopify.connected || false,
    hasMetaConnection: integrationOverview?.meta.connected || false,
    primaryCurrency,
    isLoading: loading,
    updateProfile,
  };
}

export function useIsOnboarded() {
  const { user } = useUser();

  return user?.isOnboarded || false;
}

export function useIntegrationStatus() {
  const integrationOverview = useQuery(api.core.integrationOverview.getOverview);

  return {
    hasShopify: integrationOverview?.shopify.connected || false,
    hasMeta: integrationOverview?.meta.connected || false,
    hasAnyIntegration: !!(
      integrationOverview?.shopify.connected ||
      integrationOverview?.meta.connected
    ),
  };
}
