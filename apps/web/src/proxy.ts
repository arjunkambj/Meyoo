import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

const createRouteMatcher =
  (patterns: string[]) =>
  (request: Request & { nextUrl: URL }) => {
    const pathname = request.nextUrl.pathname;
    return patterns.some((pattern) => {
      const prefix = pattern.replace("(.*)", "");
      return pathname === prefix || pathname.startsWith(prefix);
    });
  };

const redirect = (request: Request, path: string) => {
  const url = new URL(path, request.url);
  return NextResponse.redirect(url);
};

const safeReturnPath = (value: string | null) => {
  if (!value?.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/careers(.*)",
  "/contact(.*)",
  "/cookies(.*)",
  "/pricing(.*)",
  "/data-protection(.*)",
  "/privacy(.*)",
]);

// Auth routes
const isAuthRoute = createRouteMatcher([
  "/sign-in",
  "/signin",
  "/signup",
  "/handler(.*)",
]);

export default async function proxy(request: Request & { nextUrl: URL }) {
    const url = request.nextUrl;
    const pathname = url.pathname;
    const method = request.method;

    // Simple logging for all API routes without affecting behavior
    if (pathname.startsWith("/api/")) {
      try {
        console.log(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            kind: "api",
            method,
            path: pathname,
          })
        );
      } catch (error) {
        console.warn("Failed to log API request metadata", error);
      }
      return; // Do not apply auth logic to API handlers
    }

    // Special handling for Shopify app installation with shop parameter
    if (pathname === "/" && request.nextUrl.searchParams.has("shop")) {
      const shop = request.nextUrl.searchParams.get("shop");

      if (shop) {
        const redirectUrl = new URL(`/api/v1/shopify/auth`, request.url);

        request.nextUrl.searchParams.forEach((value, key) => {
          redirectUrl.searchParams.set(key, value);
        });

        return NextResponse.redirect(redirectUrl);
      }
    }

    // Short-circuit early for public routes to avoid unnecessary auth checks
    if (isPublicRoute(request)) {
      return;
    }

    // Check if user is authenticated only for non-public routes
    const user = await stackServerApp.getUser({ tokenStore: request });
    const isAuthenticated = Boolean(user);

    if (!isAuthenticated) {
      // Allow auth routes when unauthenticated
      if (isAuthRoute(request)) {
        if (pathname === "/signin") {
          return redirect(request, "/sign-in");
        }

        return;
      }

      return redirect(request, "/sign-in");
    }

    if (isAuthRoute(request)) {
      const returnUrl = safeReturnPath(url.searchParams.get("returnUrl"));
      if (returnUrl) {
        return redirect(request, returnUrl);
      }
    }

    return;
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets and specific API routes that handle their own auth
  matcher: [
    "/((?!.*\\..*|_next|api/v1/meta/auth|api/v1/meta/callback|api/v1/shopify/auth|api/v1/shopify/callback).*)",
    "/",
  ],
};
