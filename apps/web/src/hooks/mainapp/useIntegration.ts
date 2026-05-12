import { useMemo } from "react";
import { usePaginatedQuery } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { api } from "@/libs/convexApi";

/**
 * Get integration status for all platforms
 */
export function useIntegration() {
  const overview = useQuery(api.core.integrationOverview.getOverview);
  const loading = overview === undefined;

  const disconnectMeta = async () => {
    try {
      // TODO: Implement meta disconnection
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  };

  return {
    shopify: {
      connected: Boolean(overview?.shopify.connected),
      store: overview?.shopify.store ?? null,
      loading,
    },
    meta: {
      connected: Boolean(overview?.meta.connected),
      accounts: overview?.meta.accounts ?? [],
      primaryAccountId: overview?.meta.primaryAccountId ?? null,
      activeAccountCount: overview?.meta.activeAccountCount ?? 0,
      loading,
      disconnect: disconnectMeta,
    },
    google: {
      connected: Boolean(overview?.google.connected),
      accounts: [],
      loading,
      comingSoon: Boolean(overview?.google.comingSoon ?? true),
      disconnect: async () => ({
        success: false,
        error: "Google Ads integration is currently unavailable.",
      }),
    },
    loading,
    hasAnyIntegration: Boolean(overview?.hasAnyIntegration),
    connectedIntegrations: overview?.connectedIntegrations ?? [],
    disconnectedIntegrations: overview?.disconnectedIntegrations ?? [],
  };
}

/**
 * Get Shopify product variants with pagination (server-side)
 */
export function useShopifyProductVariantsPaginated(
  pageSize: number = 100,
  searchTerm?: string,
) {
  const args = useMemo(() => ({ searchTerm }), [searchTerm]);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.shopify.publicQueries.getProductVariantsPaginated,
    args,
    { initialNumItems: pageSize },
  );

  return {
    data: results,
    loading: isLoading && results.length === 0,
    loadingMore: status === "LoadingMore",
    hasMore: status === "CanLoadMore" || status === "LoadingMore",
    loadMore,
    status,
    error: null,
  };
}
