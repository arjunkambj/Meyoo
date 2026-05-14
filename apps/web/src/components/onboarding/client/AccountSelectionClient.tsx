"use client";

import { Button, Card, Radio, RadioGroup, Spinner, toast } from "@heroui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/libs/convexApi";
import { useOnboarding } from "@/hooks";
import { Icon } from "@iconify/react";
import { trackOnboardingAction, trackOnboardingView } from "@/libs/analytics";
import { useSetAtom } from "jotai";
import { setNavigationPendingAtom } from "@/store/onboarding";

export default function AccountSelectionClient() {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPrimarySet, setHasPrimarySet] = useState(false);
  const { status } = useOnboarding();
  const setNavigationPending = useSetAtom(setNavigationPendingAtom);

  // Fetch ad accounts
  const adAccounts = useQuery(api.meta.queries.getAdAccounts);
  const setPrimaryAccount = useMutation(api.meta.mutations.setPrimaryAdAccount);

  // Analytics: step view
  useEffect(() => {
    trackOnboardingView("accounts");
  }, []);

  // Minimal prerequisite guard: ensure Shopify + Billing before accounts
  useEffect(() => {
    if (!status) return;
    if (!status.connections?.shopify) {
      router.replace("/onboarding/shopify");
    } else if (!status.hasShopifySubscription) {
      router.replace("/onboarding/billing");
    }
  }, [status, router]);

  // Auto-select primary account if exists
  useEffect(() => {
    if (adAccounts && adAccounts.length > 0) {
      const primary = adAccounts.find((acc) => acc.isPrimary);
      if (primary) {
        setSelectedAccount(primary.accountId);
        setHasPrimarySet(true);
      } else if (!selectedAccount) {
        // Auto-select first account if no primary
        setSelectedAccount(adAccounts[0]?.accountId || "");
      }
    }
  }, [adAccounts, selectedAccount]);

  const handleContinue = async () => {
    // If already has primary set, just navigate
    if (hasPrimarySet) {
      trackOnboardingAction("accounts", "continue", { selected: selectedAccount });
      setNavigationPending(true);
      router.push("/onboarding/products");
      return;
    }

    if (!selectedAccount) {
      // No non-error toast per policy
      return;
    }

    setIsLoading(true);

    try {
      // Set the primary account
      await setPrimaryAccount({ accountId: selectedAccount });

      // Success toasts removed per onboarding policy

      setNavigationPending(true);
      router.push("/onboarding/products");
    } catch (error) {
      console.error("Failed to set primary account:", error);
      toast.danger("Failed to set account", { description: "Please try again", timeout: 3000 });
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    trackOnboardingAction("accounts", "skip");
    setNavigationPending(true);
    router.push("/onboarding/products");
  };

  // Loading state
  if (!adAccounts) {
    return (
      <Card>
        <Card.Content className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-muted">Loading ad accounts...</p>
        </Card.Content>
      </Card>
    );
  }

  // No accounts state
  if (adAccounts.length === 0) {
    return (
      <Card>
        <Card.Content className="text-center py-12">
          <Icon
            icon="solar:user-cross-bold-duotone"
            className="w-16 h-16 mx-auto mb-4 text-muted"
          />
          <h3 className="text-lg font-semibold mb-2">No Ad Accounts Found</h3>
          <p className="text-muted mb-6">
            We couldn&apos;t find any ad accounts associated with your Meta connection.
            You can skip this step and continue.
          </p>
          <Button variant="primary"
           
            onPress={handleSkip}
           
          >
            Continue to Products
          </Button>
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Icon
              icon="logos:meta-icon"
              className="w-6 h-6"
            />
            <h2 className="text-lg font-semibold">Meta Ad Accounts</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <RadioGroup
                                    value={selectedAccount}
            onChange={hasPrimarySet ? undefined : (v) => {
              setSelectedAccount(v);
              trackOnboardingAction("accounts", "select_account", { accountId: v });
            }}
            isDisabled={hasPrimarySet}
          >
            {adAccounts.map((account) => (
              <Radio
                key={account.accountId}
                value={account.accountId}
                              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{account.accountName}</span>
                  {account.isPrimary && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                      Current Primary
                    </span>
                  )}
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="tertiary"
          onPress={handleSkip}
          isDisabled={isLoading}
        >
          Skip this step
        </Button>
        <Button variant="primary"
         
          onPress={hasPrimarySet ? () => router.push("/onboarding/products") : handleContinue}
          isPending={isLoading && !hasPrimarySet}
          isDisabled={!selectedAccount && !hasPrimarySet}
         
        >
          {hasPrimarySet ? "Continue to Products" : isLoading ? "Saving..." : "Set Primary & Continue"}
        </Button>
      </div>
    </>
  );
}
