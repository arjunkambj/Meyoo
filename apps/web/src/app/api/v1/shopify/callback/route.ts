import crypto from "node:crypto";
import { fetchMutation } from "convex/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { api } from "@/libs/convexApi";
import { createLogger } from "@/libs/logging/Logger";
import shopify, { configuredScopes } from "@/libs/shopify/shopify";
import { genRequestId, tagFromToken } from "@/libs/logging/trace";
import { optionalEnv, requireEnv } from "@/libs/env";
import { stackConvexToken } from "@/libs/stackConvex";
import {
  normalizeShopDomain,
  fetchShopData,
  createAuthSignature,
  registerStoreWebhooks,
  triggerInitialSync,
  getRedirectUrl,
  withRetry,
} from "./helpers";

const logger = createLogger("Shopify.Callback");

export const runtime = "nodejs";
const NEXT_PUBLIC_APP_URL = requireEnv("NEXT_PUBLIC_APP_URL");
const SHOPIFY_WEBHOOK_DEBUG = optionalEnv("SHOPIFY_WEBHOOK_DEBUG") === "1";

const errorData = (error: unknown) =>
  error instanceof Error
    ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause,
        data: "data" in error ? error.data : undefined,
      }
    : { message: String(error), raw: error };

export async function GET(req: NextRequest) {
  try {
    const requestId = genRequestId(req);

    const baseUrl = NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");

    // Process the OAuth callback from Shopify
    const response = await shopify.auth.callback({
      rawRequest: req,
    });

    const session = response.session;

    logger.info("OAuth callback session created", {
      requestId,
      shop: session.shop,
      hasAccessToken: Boolean(session.accessToken),
      scope: session.scope,
    });

    // Parse granted scopes from session
    const grantedScopes = new Set(
      (session.scope || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );

    // Normalize scopes: if write_products is granted, consider read_products as granted too
    const normalizedScopes = new Set(grantedScopes);
    if (grantedScopes.has('write_products')) {
      normalizedScopes.add('read_products');
    }
    if (grantedScopes.has('write_orders')) {
      normalizedScopes.add('read_orders');
    }

    // Check if all configured scopes are granted (using normalized set)
    const missingScopes = configuredScopes.filter(scope => !normalizedScopes.has(scope));
    
    // Only log scopes in debug mode
    if (SHOPIFY_WEBHOOK_DEBUG) {
      logger.info("Scope validation", { 
        configured: configuredScopes,
        granted: Array.from(grantedScopes),
        normalized: Array.from(normalizedScopes),
        missing: missingScopes 
      });
    }

    // If scopes are missing after normalization, the app needs to be reinstalled
    if (missingScopes.length > 0) {
      logger.warn("OAuth session missing required scopes after normalization", {
        missing: missingScopes,
        granted: Array.from(grantedScopes),
        normalized: Array.from(normalizedScopes),
        shop: session.shop
      });
      
      // For critical missing scopes, we should request a re-authorization
      const criticalMissing = missingScopes.filter(s => 
        s === 'read_products' || s === 'read_orders'
      );
      
      if (criticalMissing.length > 0 && !normalizedScopes.has('write_products') && !normalizedScopes.has('write_orders')) {
        // Only fail if we don't have the write permissions either
        logger.error("Critical scopes missing, app needs reinstallation", {
          critical: criticalMissing,
          shop: session.shop
        });
      }
    }

    // Check if user is authenticated (coming from onboarding flow)
    const token = await stackConvexToken(req);

    logger.info("OAuth callback Convex auth resolved", {
      requestId,
      hasToken: Boolean(token),
      tokenTag: token ? tagFromToken(token) : undefined,
    });

    if (token) {
      // Authenticated flow: User is logged in and connecting from onboarding
      // Minimal logging (avoid shop domain)

      // Fetch shop data to get currency and other info
      const shopData = await fetchShopData(session);

      // Before connecting, check if this shop already belongs to a different organization
      const shopDomain = normalizeShopDomain(session.shop);


      try {
        const { fetchQuery } = await import("convex/nextjs");
        const currentOrganization = await fetchQuery(
          api.core.organizations.getCurrentOrganization,
          {},
          { token },
        );

        const existing = await fetchQuery(
          api.shopify.publicQueries.getPublicStoreByDomain,
          { shopDomain },
          { token },
        );

        if (
          existing &&
          currentOrganization?.id &&
          existing.organizationId !== currentOrganization.id
        ) {
          logger.warn("Shopify store already linked to another organization", {
            requestId,
          });
          const redirect = NextResponse.redirect(
            `${baseUrl}/onboarding/shopify?error=store-already-connected`,
            { status: 303 },
          );
          redirect.headers.set("X-Request-Id", requestId);
          return redirect;
        }
      } catch (_precheckError) {
        // If precheck fails, fall back to normal connect flow
        void 0;
      }

      // Normal connect (either same org or first-time connect)
      const connectionResult = await fetchMutation(
        api.core.onboarding.connectShopifyStore,
        {
          domain: session.shop,
          accessToken: session.accessToken || "",
          scope: session.scope || "",
          shopData,
        },
        {
          token,
        },
      ).catch((error: unknown) => {
        logger.error("connectShopifyStore mutation failed", error as Error, {
          requestId,
          details: errorData(error),
        });
        throw error;
      });

      // Register webhooks for the store if not already registered
      if (connectionResult.success) {
        await registerStoreWebhooks(session, token);
      }

      // Trigger initial sync for new user if products are not present yet
      if (connectionResult.success && connectionResult.organizationId) {
        await triggerInitialSync(token, connectionResult.organizationId);
      }

      // Success logging only in debug mode
      if (SHOPIFY_WEBHOOK_DEBUG) {
        const userTag = tagFromToken(token) || "anon";
        logger.info("Shopify connected", { user: userTag, connected: true, requestId });
      }

      // Decide next step based on billing state
      const redirectUrl = await getRedirectUrl(token, session.shop);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set("X-Request-Id", requestId);
      return res;
    } else {
      // Unauthenticated flow: Install from Shopify App Store (no email claim)
      // Minimal logging for unauthenticated flow

      // Fetch shop data to help provision user/org
      const shopData = await fetchShopData(session);

      // Create or attach a user/org and connect the store
      const nonce = crypto.randomBytes(16).toString("hex");
      const shopDomain = normalizeShopDomain(session.shop);
      const sig = createAuthSignature(shopDomain, nonce);

      // Provision user/organization with retry

      const _provision = await withRetry(
        () =>
          fetchMutation(
            api.installations.createOrAttachFromShopifyOAuth,
            {
              shop: session.shop,
              accessToken: session.accessToken || "",
              scope: session.scope || "",
              shopData,
              nonce,
              sig,
            },
          ),
        "provisioning user/org",
      );

      await registerStoreWebhooks(session);

      const res = NextResponse.redirect(
        `${baseUrl}/sign-in?returnUrl=${encodeURIComponent(`/onboarding/billing?shop=${session.shop}`)}`,
      );
      res.headers.set("X-Request-Id", requestId);
      return res;
    }
  } catch (error) {
    const requestId = genRequestId(req);
    logger.error("OAuth callback error", error as Error, { requestId });
    return NextResponse.json(
      { error: "OAuth error", requestId },
      { status: 500 },
    );
  }
}
