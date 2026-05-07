"use server";

import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";

import { api } from "@/libs/convexApi";
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

  const token = await stackServerApp.getConvexHttpClientAuth({
    tokenStore: "nextjs-cookie",
  }).catch(() => null);
  const syncedMembership = token
    ? await fetchMutation(
        api.core.teams.syncCurrentStackTeamMembership,
        {},
        { token },
      ).catch(() => null)
    : null;

  const shouldAutoOnboardTeamMember =
    syncedMembership?.role === "StoreTeam" &&
    !getOnboarded(user.clientReadOnlyMetadata);

  if (shouldAutoOnboardTeamMember) {
    await user.setClientReadOnlyMetadata({
      ...user.clientReadOnlyMetadata,
      onboarded: true,
      onboardedAt: new Date().toISOString(),
    });
  }

  if (!shouldAutoOnboardTeamMember && !getOnboarded(user.clientReadOnlyMetadata)) {
    redirect("/onboarding");
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
