"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import UserProfile from "../../shared/UserProfile";
import { useUserContext } from "@/contexts/UserContext";

import SidebarToggle from "./SidebarToggle";

export default function DashBoardHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUserContext();

  // Fast redirect for non-onboarded users
  const isOnboardingRoute = pathname?.startsWith("/onboarding");
  const shouldRedirectToOnboarding = Boolean(
    !loading && user && user.isOnboarded === false && !isOnboardingRoute
  );

  useEffect(() => {
    if (shouldRedirectToOnboarding) {
      router.replace("/onboarding/shopify");
    }
  }, [router, shouldRedirectToOnboarding]);

  if (shouldRedirectToOnboarding) {
    return null;
  }

  // Map pathnames to page titles
  const getPageTitle = () => {
    if (!pathname) return "Dashboard";

    const pathnameWithoutQuery = pathname.split("?")[0] ?? "";
    const [, firstSegment] = pathnameWithoutQuery.split("/");
    const basePath = firstSegment ? `/${firstSegment}` : "/overview";

    const titles: Record<string, string> = {
      "/overview": "Overview",
      "/pnl": "P&L Insights",
      "/orders": "Orders",
      "/orders-insights": "Order Insights",
      "/inventory": "Product & Inventory",
      "/cost-management": "Cost & Expenses",
      "/integrations": "Integrations",
      "/settings": "Settings",
      "/reports": "Reports",
    };

    return titles[basePath] ?? "Dashboard";
  };

  const pageTitle = getPageTitle();

  return (
    <header
      className={`flex bg-surface-secondary dark:bg-surface px-6 py-3.5 rounded-2xl justify-between items-center w-full min-h-[68px] ${className || ""}`}
    >
      {/* Left side - Sidebar toggle and page title */}
      <div className="flex items-center gap-4 min-w-0">
        <SidebarToggle />
        <div aria-hidden className="h-6 w-px bg-surface-tertiary" />
        <h1 className="text-xl font-bold text-muted tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 min-w-0">
        <UserProfile />
      </div>
    </header>
  );
}
