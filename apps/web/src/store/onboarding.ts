"use client";

import { atom } from "jotai";
export interface OnboardingState {
  currentStep: number;
  currentRoute: string;
  completedSteps: number[];
  isLoading: boolean;
  error: string | null;
}

export const onboardingStateAtom = atom<OnboardingState>({
  currentStep: 1,
  currentRoute: "/onboarding/shopify",
  completedSteps: [],
  isLoading: false,
  error: null,
});

export const navigationStateAtom = atom<{
  nextRoute: string | null;
  previousRoute: string | null;
  prefetchedRoutes: Set<string>;
}>({
  nextRoute: null,
  previousRoute: null,
  prefetchedRoutes: new Set<string>(),
});

export const navigationPendingAtom = atom<boolean>(false);
export const setNavigationPendingAtom = atom(
  null,
  (_get, set, pending: boolean) => {
    set(navigationPendingAtom, pending);
  }
);

export const navigateToStepAtom = atom(
  null,
  (get, set, { step, route }: { step: number; route: string }) => {
    const currentState = get(onboardingStateAtom);
    // Avoid redundant updates
    if (
      currentState.currentStep === step &&
      currentState.currentRoute === route
    ) {
      return;
    }
    
    set(onboardingStateAtom, {
      ...currentState,
      currentStep: step,
      currentRoute: route,
    });
  }
);

export const completeStepAtom = atom(
  null,
  (get, set, stepId: number) => {
    const currentState = get(onboardingStateAtom);
    // Skip if already marked complete
    if (currentState.completedSteps.includes(stepId)) {
      return;
    }
    
    const updatedCompletedSteps = [
      ...currentState.completedSteps,
      stepId,
    ];
    
    set(onboardingStateAtom, {
      ...currentState,
      completedSteps: updatedCompletedSteps,
    });
  }
);

export const prefetchRouteAtom = atom(
  null,
  (get, set, route: string) => {
    const navState = get(navigationStateAtom);
    if (navState.prefetchedRoutes.has(route)) return;
    set(navigationStateAtom, {
      ...navState,
      prefetchedRoutes: new Set([...navState.prefetchedRoutes, route]),
    });
  }
);

export const optimisticNavigationAtom = atom(
  null,
  (get, set, { step, route }: { step: number; route: string }) => {
    set(navigateToStepAtom, { step, route });
    
    const currentState = get(onboardingStateAtom);
    if (step > currentState.currentStep) {
      set(completeStepAtom, currentState.currentStep);
    }
  }
);
