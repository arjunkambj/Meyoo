"use client";

interface MinimalProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function MinimalProgressBar({
  currentStep,
  totalSteps,
}: MinimalProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1.5 bg-surface-secondary/60 relative overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-accent via-accent to-accent/90 relative transition-[width] duration-500 ease-out"
        style={{ width: `${progress}%` }}
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
