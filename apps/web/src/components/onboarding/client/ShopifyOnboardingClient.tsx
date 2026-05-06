"use client";

import { Button, Modal, Separator, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import IntegrationCard from "@/components/onboarding/IntegrationCard";
import SimpleNavigationButtons from "@/components/onboarding/SimpleNavigationButtons";
import StepLoadingState from "@/components/onboarding/StepLoadingState";
import { useUser } from "@/hooks";
import { trackOnboardingAction, trackOnboardingView } from "@/libs/analytics";
import { api } from "@/libs/convexApi";
import { useSetAtom } from "jotai";
import { setNavigationPendingAtom } from "@/store/onboarding";

type Props = { installUri?: string | null };

export default function ShopifyOnboardingClient({ installUri }: Props) {
  const user = useUser();
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);
  const joinDemoOrganization = useMutation(
    api.core.onboarding.joinDemoOrganization
  );
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [joiningDemo, setJoiningDemo] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const suppressCancelTracking = useRef(false);
  const setNavigationPending = useSetAtom(setNavigationPendingAtom);
  // Pending installation claim flow removed

  // Prefetch next page for faster navigation
  useEffect(() => {
    if (user?.hasShopifyConnection) {
      router.prefetch("/onboarding/billing");
    }
  }, [user?.hasShopifyConnection, router]);

  // Analytics: step view
  useEffect(() => {
    trackOnboardingView("shopify");
  }, []);

  const handleOpenDemoModal = () => {
    trackOnboardingAction("shopify", "join_demo_open");
    setDemoError(null);
    suppressCancelTracking.current = false;
    setIsDemoModalOpen(true);
  };

  const handleDismissDemoModal = (suppressTracking = false) => {
    if (joiningDemo && !suppressTracking) {
      return;
    }
    suppressCancelTracking.current = suppressTracking;
    setIsDemoModalOpen(false);
    setDemoError(null);
  };

  const handleJoinDemo = async () => {
    if (joiningDemo) {
      return;
    }
    trackOnboardingAction("shopify", "join_demo_confirm");
    setJoiningDemo(true);
    setDemoError(null);
    setNavigationPending(true);
    try {
      const result = await joinDemoOrganization({});
      if (result.success) {
        trackOnboardingAction("shopify", "join_demo_success");
        toast.success("Demo workspace enabled", { description: "You now have access to Meyoo's demo data set to explore the dashboard.", timeout: 4000 });
        handleDismissDemoModal(true);
        router.refresh();
      } else {
        setDemoError(result.message);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to join the demo workspace.";
      setDemoError(message);
    } finally {
      setJoiningDemo(false);
      setNavigationPending(false);
    }
  };

  if (!user) {
    return <StepLoadingState message="Loading your profile..." />;
  }

  return (
    <>
      {/* Integration Card */}
      <div>
        <IntegrationCard
          description="Connect your Shopify store to sync products, orders, customers, and inventory."
                    icon="logos:shopify"
          isConnected={user?.hasShopifyConnection || false}
          isLoading={connecting}
          name="Shopify Store"
          required={true}
          onConnect={() => {
            if (user?.hasShopifyConnection) return;
            if (installUri) {
              try {
                trackOnboardingAction("shopify", "connect_click");
                setConnecting(true);
                setNavigationPending(true);
                window.location.href = installUri;
              } catch (e) {
                console.error("Failed to navigate to APP install URI", e);
                toast.danger("Navigation failed", { description: "Please try again or contact support.", timeout: 5000 });
                setConnecting(false);
                setNavigationPending(false);
              }
            } else {
              // Non-error toast removed per onboarding policy
            }
          }}
          // Disconnect hidden during onboarding
        />
      </div>

      {/* Demo access CTA */}
      {!user?.hasShopifyConnection && (
        <>
          <div className="relative my-10">
            <Separator />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
              <span className="text-xs font-medium text-muted">OR</span>
            </div>
          </div>

          <div className="rounded-lg border border-surface-tertiary bg-surface-secondary p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="rounded-full bg-surface-secondary p-3">
                <Icon
                  aria-hidden="true"
                  className="text-muted"
                  icon="solar:planet-bold-duotone"
                  width={24}
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-medium text-muted">
                  Don&apos;t have a store yet?
                </h3>
                <p className="text-sm text-muted">
                  Explore Meyoo with our demo workspace to see how it works
                </p>
              </div>
              <Button
               
                variant="tertiary"
                size="md"
               
                onPress={handleOpenDemoModal}
              >
                View Demo
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <SimpleNavigationButtons
        isNextDisabled={!user?.hasShopifyConnection}
        nextLabel={
          user?.hasShopifyConnection ? "Continue" : "Continue Onboarding"
        }
        showPrevious={false}
        onNext={
          user?.hasShopifyConnection
            ? async () => {
                trackOnboardingAction("shopify", "continue");
                router.push("/onboarding/billing");
                return true;
              }
            : undefined
        }
      />

      <Modal>
        <Modal.Backdrop
          isDismissable={!joiningDemo}
          isOpen={isDemoModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              if (!suppressCancelTracking.current) {
                trackOnboardingAction("shopify", "join_demo_cancel");
              }
              suppressCancelTracking.current = false;
              setIsDemoModalOpen(false);
              setDemoError(null);
            } else {
              suppressCancelTracking.current = false;
              setIsDemoModalOpen(true);
            }
          }}
        >
          <Modal.Container placement="center" size="md">
            <Modal.Dialog>
          {() => (
            <>
              <Modal.Header className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-muted">
                  Join Demo Workspace
                </h2>
              </Modal.Header>
              <Modal.Body className="gap-4 pb-6">
                {demoError && (
                  <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3">
                    <Icon
                      aria-hidden="true"
                      className="mt-0.5 flex-shrink-0 text-danger"
                      icon="solar:danger-triangle-bold"
                      width={18}
                    />
                    <p className="text-sm text-danger">{demoError}</p>
                  </div>
                )}

                <p className="text-sm text-muted">
                  Explore the dashboard with sample e-commerce data. You can
                  leave anytime from team settings.
                </p>
              </Modal.Body>
              <Modal.Footer className="gap-2">
                <Button
                  variant="tertiary"
                  isDisabled={joiningDemo}
                  onPress={() => handleDismissDemoModal()}
                >
                  Cancel
                </Button>
                <Button variant="primary"
                 
                  isPending={joiningDemo}
                  onPress={handleJoinDemo}
                >
                  {joiningDemo ? "Joining..." : "Join Demo"}
                </Button>
              </Modal.Footer>
            </>
          )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
