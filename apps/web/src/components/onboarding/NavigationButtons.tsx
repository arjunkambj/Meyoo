"use client";

import { Button } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import type { Route } from "next";
import { memo, useCallback, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import {
  getNextStep,
  getPreviousStep,
  getStepByRoute,
  COMPLETE_ROUTE,
} from "@/constants/onboarding";
import { optimisticNavigationAtom, completeStepAtom, setNavigationPendingAtom } from "@/store/onboarding";

interface NavigationButtonsProps {
  onNext?: () => Promise<boolean> | boolean; // Return false to prevent navigation
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  showPrevious?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  className?: string;
  variant?: "inline" | "floating"; // floating = fixed bottom-right like reference
}

const NavigationButtons = memo(function NavigationButtons({
  onNext,
  onPrevious,
  nextLabel,
  previousLabel = "Back",
  isNextDisabled = false,
  isNextLoading = false,
  showPrevious = true,
  showSkip = false,
  onSkip,
  className = "",
  variant = "floating",
}: NavigationButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [internalLoading, setInternalLoading] = useState(false);
  
  const optimisticNavigation = useSetAtom(optimisticNavigationAtom);
  const completeStep = useSetAtom(completeStepAtom);
  const setNavigationPending = useSetAtom(setNavigationPendingAtom);

  // Get current step info
  const currentStepInfo = useMemo(() => {
    const stepInfo = getStepByRoute(pathname);
    return {
      stepId: stepInfo?.id || 1,
      isComplete: pathname === COMPLETE_ROUTE,
    };
  }, [pathname]);

  // Get navigation routes with memoization
  const { nextRoute, previousRoute, isLastStep } = useMemo(() => {
    const next = getNextStep(currentStepInfo.stepId, pathname);
    const previous = getPreviousStep(currentStepInfo.stepId, pathname);
    
    return {
      nextRoute: next?.route,
      previousRoute: previous?.route,
      isLastStep: currentStepInfo.isComplete || !next,
    };
  }, [currentStepInfo, pathname]);

  // Dynamic next button label
  const computedNextLabel = useMemo(() => {
    if (nextLabel) return nextLabel;
    if (isLastStep) return "Complete Setup";
    return "Save & Continue";
  }, [nextLabel, isLastStep]);

  // Optimistic navigation handlers
  const handleNext = useCallback(async () => {
    if (isNextDisabled || !nextRoute) return;

    console.log(`[NavigationButtons] handleNext called - currentStep: ${currentStepInfo.stepId}, nextRoute: ${nextRoute}`);

    try {
      setInternalLoading(true);
      setNavigationPending(true);
      // Run custom onNext validation if provided
      if (onNext) {
        const canProceed = await onNext();
        if (canProceed === false) {
          console.log('[NavigationButtons] onNext validation returned false, cancelling navigation');
          setInternalLoading(false);
          setNavigationPending(false);
          return;
        }
      }

      // Complete current step
      completeStep(currentStepInfo.stepId);

      // Optimistic navigation with Jotai
      const nextStepInfo = getStepByRoute(nextRoute);
      if (nextStepInfo) {
        optimisticNavigation({ step: nextStepInfo.id, route: nextRoute });
      }

      router.push(nextRoute as Route);
    } catch (error) {
      console.error("Navigation error:", error);
      setInternalLoading(false);
      setNavigationPending(false);
    }
  }, [
    isNextDisabled,
    nextRoute,
    onNext,
    completeStep,
    currentStepInfo.stepId,
    optimisticNavigation,
    router,
    setNavigationPending,
  ]);

  const handlePrevious = useCallback(() => {
    if (!previousRoute) return;

    // Run custom onPrevious if provided
    if (onPrevious) {
      onPrevious();
    }

    // Optimistic navigation
    const previousStepInfo = getStepByRoute(previousRoute);
    if (previousStepInfo) {
      optimisticNavigation({
        step: previousStepInfo.id,
        route: previousRoute,
      });
    }

    // Navigate
    setNavigationPending(true);
    router.push(previousRoute as Route);
  }, [
    previousRoute,
    onPrevious,
    optimisticNavigation,
    router,
    setNavigationPending,
  ]);

  const containerBase = "flex items-center justify-between gap-4";
  const isFloating = variant !== "inline";

  return (
    <div className={
      isFloating
        ? `${containerBase} fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 pointer-events-none ${className}`
        : `${containerBase} mt-8 ${className}`
    }>
      {/* Previous Button */}
      <div className={isFloating ? "pointer-events-auto" : ""}>
        {showPrevious && previousRoute ? (
          <Button
            variant="tertiary"
            onPress={handlePrevious}
            isDisabled={internalLoading || isNextLoading}
           
            className="font-semibold"
          >
            {previousLabel}
          </Button>
        ) : (
          <div /> // Spacer to maintain layout
        )}
      </div>

      <div className={`flex items-center gap-3 ${isFloating ? "pointer-events-auto" : ""}`}>
        {/* Skip Button */}
        {showSkip && onSkip && (
          <Button
            variant="tertiary"
            onPress={onSkip}
            className="font-semibold"
          >
            Skip for now
          </Button>
        )}

        {/* Next Button */}
        {nextRoute && (
          <Button variant="primary"
           
            size="lg"
            onPress={handleNext}
            isDisabled={isNextDisabled || internalLoading || isNextLoading}
            isPending={isNextLoading || internalLoading}
           
            className="font-bold min-w-40"
          >
            {computedNextLabel}
          </Button>
        )}
      </div>
    </div>
  );
});

export default NavigationButtons;
