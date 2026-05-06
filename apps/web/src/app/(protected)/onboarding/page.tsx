import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "@/libs/convexApi";
import { stackServerApp } from "@/stack/server";

// Server entry for "/onboarding" to route users to the right step
export default async function OnboardingIndexPage() {
  const user = await stackServerApp.getUser();

  if (user?.clientReadOnlyMetadata?.onboarded) {
    redirect("/overview");
  }

  let status:
    | Awaited<ReturnType<typeof fetchQuery<typeof api.core.onboarding.getOnboardingStatus>>>
    | null
    | undefined;

  try {
    const token = await stackServerApp.getConvexHttpClientAuth({
      tokenStore: "nextjs-cookie",
    }).catch(() => null);
    if (token) {
      status = await fetchQuery(
        api.core.onboarding.getOnboardingStatus,
        {},
        { token },
      );
    } else {
      status = await fetchQuery(
        api.core.onboarding.getOnboardingStatus,
        {},
      );
    }
  } catch {
    status = null;
  }

  // Completed setup -> Overview
  if (status?.completed) {
    redirect("/overview");
  }

  // No Shopify connection yet -> Shopify connect
  if (!status?.connections?.shopify) {
    redirect("/onboarding/shopify");
  }

  // No billing subscription yet -> Billing
  if (!status?.hasShopifySubscription) {
    redirect("/onboarding/billing");
  }

  // Check current step and redirect accordingly
  const currentStep = status?.currentStep || 1;

  if (currentStep === 1) {
    redirect("/onboarding/shopify");
  } else if (currentStep === 2) {
    redirect("/onboarding/billing");
  } else if (currentStep === 3) {
    redirect("/onboarding/marketing");
  } else if (currentStep === 4) {
    redirect("/onboarding/accounts");
  } else if (currentStep === 5) {
    redirect("/onboarding/products");
  } else if (currentStep === 6) {
    redirect("/onboarding/cost");
  } else if (currentStep === 7) {
    redirect("/onboarding/complete");
  }

  // Default to marketing if unsure
  redirect("/onboarding/marketing");
}
