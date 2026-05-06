/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as core_costs from "../core/costs.js";
import type * as core_currency from "../core/currency.js";
import type * as core_dashboard from "../core/dashboard.js";
import type * as core_integrationBase from "../core/integrationBase.js";
import type * as core_integrationOverview from "../core/integrationOverview.js";
import type * as core_membershipHelpers from "../core/membershipHelpers.js";
import type * as core_memberships from "../core/memberships.js";
import type * as core_onboarding from "../core/onboarding.js";
import type * as core_organizationBilling from "../core/organizationBilling.js";
import type * as core_organizationLookup from "../core/organizationLookup.js";
import type * as core_organizations from "../core/organizations.js";
import type * as core_shopDomainHelper from "../core/shopDomainHelper.js";
import type * as core_status from "../core/status.js";
import type * as core_teams from "../core/teams.js";
import type * as core_time from "../core/time.js";
import type * as core_userLookup from "../core/userLookup.js";
import type * as core_users from "../core/users.js";
import type * as core_workspaceProvisioning from "../core/workspaceProvisioning.js";
import type * as crons from "../crons.js";
import type * as engine_analytics from "../engine/analytics.js";
import type * as engine_customers from "../engine/customers.js";
import type * as engine_events from "../engine/events.js";
import type * as engine_inventory from "../engine/inventory.js";
import type * as engine_metaScheduler from "../engine/metaScheduler.js";
import type * as engine_orchestrator from "../engine/orchestrator.js";
import type * as engine_profiler from "../engine/profiler.js";
import type * as engine_ratelimiter from "../engine/ratelimiter.js";
import type * as engine_scheduler from "../engine/scheduler.js";
import type * as engine_syncJobs from "../engine/syncJobs.js";
import type * as engine_workpool from "../engine/workpool.js";
import type * as http from "../http.js";
import type * as httpSync from "../httpSync.js";
import type * as installations from "../installations.js";
import type * as jobs_helpers from "../jobs/helpers.js";
import type * as jobs_maintenance from "../jobs/maintenance.js";
import type * as jobs_maintenanceHandlers from "../jobs/maintenanceHandlers.js";
import type * as jobs_syncHandlers from "../jobs/syncHandlers.js";
import type * as meta_actions from "../meta/actions.js";
import type * as meta_client from "../meta/client.js";
import type * as meta_integration from "../meta/integration.js";
import type * as meta_internal from "../meta/internal.js";
import type * as meta_mutations from "../meta/mutations.js";
import type * as meta_queries from "../meta/queries.js";
import type * as meta_storage from "../meta/storage.js";
import type * as meta_sync from "../meta/sync.js";
import type * as meta_tokenManager from "../meta/tokenManager.js";
import type * as meta_tokens from "../meta/tokens.js";
import type * as meta_types from "../meta/types.js";
import type * as meyoo_admin from "../meyoo/admin.js";
import type * as schema_core from "../schema/core.js";
import type * as schema_costs from "../schema/costs.js";
import type * as schema_meta from "../schema/meta.js";
import type * as schema_metrics from "../schema/metrics.js";
import type * as schema_security from "../schema/security.js";
import type * as schema_shopify from "../schema/shopify.js";
import type * as schema_sync from "../schema/sync.js";
import type * as shopify_cleanup from "../shopify/cleanup.js";
import type * as shopify_client from "../shopify/client.js";
import type * as shopify_collectionMutations from "../shopify/collectionMutations.js";
import type * as shopify_customerMutations from "../shopify/customerMutations.js";
import type * as shopify_gdpr from "../shopify/gdpr.js";
import type * as shopify_integration from "../shopify/integration.js";
import type * as shopify_internalQueries from "../shopify/internalQueries.js";
import type * as shopify_inventoryMutations from "../shopify/inventoryMutations.js";
import type * as shopify_lifecycle from "../shopify/lifecycle.js";
import type * as shopify_orderMutations from "../shopify/orderMutations.js";
import type * as shopify_processingUtils from "../shopify/processingUtils.js";
import type * as shopify_productMutations from "../shopify/productMutations.js";
import type * as shopify_publicMutations from "../shopify/publicMutations.js";
import type * as shopify_publicQueries from "../shopify/publicQueries.js";
import type * as shopify_shared from "../shopify/shared.js";
import type * as shopify_shopMutations from "../shopify/shopMutations.js";
import type * as shopify_status from "../shopify/status.js";
import type * as shopify_storeMetadata from "../shopify/storeMetadata.js";
import type * as shopify_sync from "../shopify/sync.js";
import type * as shopify_types from "../shopify/types.js";
import type * as shopify_webhooks from "../shopify/webhooks.js";
import type * as utils_analytics_channelRevenue from "../utils/analytics/channelRevenue.js";
import type * as utils_analytics_orders from "../utils/analytics/orders.js";
import type * as utils_analytics_overview from "../utils/analytics/overview.js";
import type * as utils_analytics_platform from "../utils/analytics/platform.js";
import type * as utils_analytics_pnl from "../utils/analytics/pnl.js";
import type * as utils_analytics_shared from "../utils/analytics/shared.js";
import type * as utils_analyticsAggregations from "../utils/analyticsAggregations.js";
import type * as utils_analyticsLoader from "../utils/analyticsLoader.js";
import type * as utils_analyticsSource from "../utils/analyticsSource.js";
import type * as utils_auth from "../utils/auth.js";
import type * as utils_billing from "../utils/billing.js";
import type * as utils_crypto from "../utils/crypto.js";
import type * as utils_customerJourney from "../utils/customerJourney.js";
import type * as utils_dailyMetrics from "../utils/dailyMetrics.js";
import type * as utils_dashboardConfig from "../utils/dashboardConfig.js";
import type * as utils_date from "../utils/date.js";
import type * as utils_env from "../utils/env.js";
import type * as utils_integrationStatus from "../utils/integrationStatus.js";
import type * as utils_onboarding from "../utils/onboarding.js";
import type * as utils_onboardingValidators from "../utils/onboardingValidators.js";
import type * as utils_org from "../utils/org.js";
import type * as utils_orgDateRange from "../utils/orgDateRange.js";
import type * as utils_shop from "../utils/shop.js";
import type * as utils_shopify from "../utils/shopify.js";
import type * as web_analytics from "../web/analytics.js";
import type * as web_analyticsShared from "../web/analyticsShared.js";
import type * as web_dashboard from "../web/dashboard.js";
import type * as web_integrationRequests from "../web/integrationRequests.js";
import type * as web_inventory from "../web/inventory.js";
import type * as web_orders from "../web/orders.js";
import type * as web_pnl from "../web/pnl.js";
import type * as web_sync from "../web/sync.js";
import type * as webhooks_gdpr from "../webhooks/gdpr.js";
import type * as webhooks_processor from "../webhooks/processor.js";
import type * as webhooks_shopify from "../webhooks/shopify.js";
import type * as webhooks_stack from "../webhooks/stack.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "core/costs": typeof core_costs;
  "core/currency": typeof core_currency;
  "core/dashboard": typeof core_dashboard;
  "core/integrationBase": typeof core_integrationBase;
  "core/integrationOverview": typeof core_integrationOverview;
  "core/membershipHelpers": typeof core_membershipHelpers;
  "core/memberships": typeof core_memberships;
  "core/onboarding": typeof core_onboarding;
  "core/organizationBilling": typeof core_organizationBilling;
  "core/organizationLookup": typeof core_organizationLookup;
  "core/organizations": typeof core_organizations;
  "core/shopDomainHelper": typeof core_shopDomainHelper;
  "core/status": typeof core_status;
  "core/teams": typeof core_teams;
  "core/time": typeof core_time;
  "core/userLookup": typeof core_userLookup;
  "core/users": typeof core_users;
  "core/workspaceProvisioning": typeof core_workspaceProvisioning;
  crons: typeof crons;
  "engine/analytics": typeof engine_analytics;
  "engine/customers": typeof engine_customers;
  "engine/events": typeof engine_events;
  "engine/inventory": typeof engine_inventory;
  "engine/metaScheduler": typeof engine_metaScheduler;
  "engine/orchestrator": typeof engine_orchestrator;
  "engine/profiler": typeof engine_profiler;
  "engine/ratelimiter": typeof engine_ratelimiter;
  "engine/scheduler": typeof engine_scheduler;
  "engine/syncJobs": typeof engine_syncJobs;
  "engine/workpool": typeof engine_workpool;
  http: typeof http;
  httpSync: typeof httpSync;
  installations: typeof installations;
  "jobs/helpers": typeof jobs_helpers;
  "jobs/maintenance": typeof jobs_maintenance;
  "jobs/maintenanceHandlers": typeof jobs_maintenanceHandlers;
  "jobs/syncHandlers": typeof jobs_syncHandlers;
  "meta/actions": typeof meta_actions;
  "meta/client": typeof meta_client;
  "meta/integration": typeof meta_integration;
  "meta/internal": typeof meta_internal;
  "meta/mutations": typeof meta_mutations;
  "meta/queries": typeof meta_queries;
  "meta/storage": typeof meta_storage;
  "meta/sync": typeof meta_sync;
  "meta/tokenManager": typeof meta_tokenManager;
  "meta/tokens": typeof meta_tokens;
  "meta/types": typeof meta_types;
  "meyoo/admin": typeof meyoo_admin;
  "schema/core": typeof schema_core;
  "schema/costs": typeof schema_costs;
  "schema/meta": typeof schema_meta;
  "schema/metrics": typeof schema_metrics;
  "schema/security": typeof schema_security;
  "schema/shopify": typeof schema_shopify;
  "schema/sync": typeof schema_sync;
  "shopify/cleanup": typeof shopify_cleanup;
  "shopify/client": typeof shopify_client;
  "shopify/collectionMutations": typeof shopify_collectionMutations;
  "shopify/customerMutations": typeof shopify_customerMutations;
  "shopify/gdpr": typeof shopify_gdpr;
  "shopify/integration": typeof shopify_integration;
  "shopify/internalQueries": typeof shopify_internalQueries;
  "shopify/inventoryMutations": typeof shopify_inventoryMutations;
  "shopify/lifecycle": typeof shopify_lifecycle;
  "shopify/orderMutations": typeof shopify_orderMutations;
  "shopify/processingUtils": typeof shopify_processingUtils;
  "shopify/productMutations": typeof shopify_productMutations;
  "shopify/publicMutations": typeof shopify_publicMutations;
  "shopify/publicQueries": typeof shopify_publicQueries;
  "shopify/shared": typeof shopify_shared;
  "shopify/shopMutations": typeof shopify_shopMutations;
  "shopify/status": typeof shopify_status;
  "shopify/storeMetadata": typeof shopify_storeMetadata;
  "shopify/sync": typeof shopify_sync;
  "shopify/types": typeof shopify_types;
  "shopify/webhooks": typeof shopify_webhooks;
  "utils/analytics/channelRevenue": typeof utils_analytics_channelRevenue;
  "utils/analytics/orders": typeof utils_analytics_orders;
  "utils/analytics/overview": typeof utils_analytics_overview;
  "utils/analytics/platform": typeof utils_analytics_platform;
  "utils/analytics/pnl": typeof utils_analytics_pnl;
  "utils/analytics/shared": typeof utils_analytics_shared;
  "utils/analyticsAggregations": typeof utils_analyticsAggregations;
  "utils/analyticsLoader": typeof utils_analyticsLoader;
  "utils/analyticsSource": typeof utils_analyticsSource;
  "utils/auth": typeof utils_auth;
  "utils/billing": typeof utils_billing;
  "utils/crypto": typeof utils_crypto;
  "utils/customerJourney": typeof utils_customerJourney;
  "utils/dailyMetrics": typeof utils_dailyMetrics;
  "utils/dashboardConfig": typeof utils_dashboardConfig;
  "utils/date": typeof utils_date;
  "utils/env": typeof utils_env;
  "utils/integrationStatus": typeof utils_integrationStatus;
  "utils/onboarding": typeof utils_onboarding;
  "utils/onboardingValidators": typeof utils_onboardingValidators;
  "utils/org": typeof utils_org;
  "utils/orgDateRange": typeof utils_orgDateRange;
  "utils/shop": typeof utils_shop;
  "utils/shopify": typeof utils_shopify;
  "web/analytics": typeof web_analytics;
  "web/analyticsShared": typeof web_analyticsShared;
  "web/dashboard": typeof web_dashboard;
  "web/integrationRequests": typeof web_integrationRequests;
  "web/inventory": typeof web_inventory;
  "web/orders": typeof web_orders;
  "web/pnl": typeof web_pnl;
  "web/sync": typeof web_sync;
  "webhooks/gdpr": typeof webhooks_gdpr;
  "webhooks/processor": typeof webhooks_processor;
  "webhooks/shopify": typeof webhooks_shopify;
  "webhooks/stack": typeof webhooks_stack;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  mainWorkpool: import("@convex-dev/workpool/_generated/component.js").ComponentApi<"mainWorkpool">;
  actionRetrier: import("@convex-dev/action-retrier/_generated/component.js").ComponentApi<"actionRetrier">;
};
