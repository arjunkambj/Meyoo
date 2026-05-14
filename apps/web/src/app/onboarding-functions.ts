"use server";

import { redirect } from "next/navigation";

import { stackServerApp } from "@/stack/server";

const getOnboarded = (metadata: unknown) =>
  Boolean(
    metadata &&
      typeof metadata === "object" &&
      "onboarded" in metadata &&
      metadata.onboarded,
  );

export async function ensureOnboarded() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!getOnboarded(user.clientReadOnlyMetadata)) {
    redirect("/onboarding/shopify");
  }
}

export async function ensureNeedsOnboarding() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (getOnboarded(user.clientReadOnlyMetadata)) {
    redirect("/overview");
  }
}

export async function markOnboardingComplete() {
  const user = await stackServerApp.getUser({ or: "throw" });

  await user.setClientReadOnlyMetadata({
    ...user.clientReadOnlyMetadata,
    onboarded: true,
    onboardedAt: new Date().toISOString(),
  });
}
