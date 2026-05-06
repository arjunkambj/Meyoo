import { useUser as useStackUser } from "@stackframe/stack";

import { useUserContext } from "@/contexts/UserContext";
import { useOnboarding } from "@/hooks/onboarding/useOnboarding";

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
  const { status: onboardingStatus } = useOnboarding();
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
    hasShopifyConnection: onboardingStatus?.connections?.shopify || false,
    hasMetaConnection: onboardingStatus?.connections?.meta || false,
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
  const { status: onboardingStatus } = useOnboarding();

  return {
    hasShopify: onboardingStatus?.connections?.shopify || false,
    hasMeta: onboardingStatus?.connections?.meta || false,
    isInitialSyncComplete: onboardingStatus?.isInitialSyncComplete || false,
    hasAnyIntegration: !!(
      onboardingStatus?.connections?.shopify ||
      onboardingStatus?.connections?.meta
    ),
  };
}
