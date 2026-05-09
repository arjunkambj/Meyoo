import { type NextRequest, NextResponse } from "next/server";

import { createLogger } from "@/libs/logging/Logger";
import { stackConvexToken } from "@/libs/stackConvex";

interface OAuthHandlerOptions {
  platform: string;
  scope: string | string[];
  authorizationUrl: string;
  clientId: string;
  // Accept a static string or compute from the incoming request
  redirectUri: string | ((req: NextRequest) => string);
  additionalParams?: Record<string, string>;
}

/**
 * Factory function to create OAuth authorization handlers
 * This standardizes the OAuth flow across different platforms
 */
export function createOAuthHandler(options: OAuthHandlerOptions) {
  const {
    platform,
    scope,
    authorizationUrl,
    clientId,
    redirectUri,
    additionalParams = {},
  } = options;

  const logger = createLogger(`${platform}.Auth`);

  return async (req: NextRequest) => {
    try {
      logger.info(`Starting ${platform} OAuth flow`);

      const token = await stackConvexToken(req);

      logger.info(`Token check for ${platform} OAuth`, {
        hasToken: !!token,
      });

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Create state parameter for CSRF protection
      const state = Math.random().toString(36).substring(7);

      // Build authorization URL
      const authUrl = new URL(authorizationUrl);

      const finalRedirectUri =
        typeof redirectUri === "function" ? redirectUri(req) : redirectUri;

      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", finalRedirectUri);
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set(
        "scope",
        Array.isArray(scope) ? scope.join(" ") : scope,
      );

      // Add any additional parameters (e.g., access_type for Google)
      Object.entries(additionalParams).forEach(([key, value]) => {
        authUrl.searchParams.set(key, value);
      });

      logger.info(`Redirecting to ${platform} authorization`, {
        authUrl: authUrl.toString(),
        hasToken: !!token,
      });

      return NextResponse.redirect(authUrl.toString());
    } catch (error) {
      logger.error(`${platform} OAuth error`, error as Error);

      return NextResponse.json(
        { error: `Failed to start ${platform} OAuth flow` },
        { status: 500 },
      );
    }
  };
}
