"use client";

import { Button, Card, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";

import type { Frequency, Tier } from "@/components/home/pricing/types";
import { cn } from "@/libs/utils";

export type PricingTierCardButton = {
  label: string;
  className?: string;
  color?: string;
  variant?: "solid" | "flat" | "primary" | "secondary" | "tertiary" | "outline" | "danger" | "danger-soft" | "ghost";
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  endContent?: React.ReactNode;
};

export type PricingTierCardProps = {
  tier: Tier;
  selectedFrequency: Frequency;
  button: PricingTierCardButton;
  highlight?: "active" | "popular" | null;
  className?: string;
};

const highlightClassNames: Record<
  NonNullable<PricingTierCardProps["highlight"]>,
  string
> = {
  active: "border-success ring-2 ring-success/20",
  popular: "border-accent/70 ring-2 ring-accent/20",
};

export function PricingTierCard({
  tier,
  selectedFrequency,
  button,
  highlight = null,
  className,
}: PricingTierCardProps) {
  const {
    color: _color,
    disabled,
    fullWidth: _fullWidth,
    isLoading,
    label,
    variant,
    ...buttonProps
  } = button;
  const buttonVariant =
    variant === "solid"
      ? "primary"
      : variant === "flat"
        ? "secondary"
        : variant;
  const price =
    typeof tier.price === "string"
      ? tier.price
      : (tier.price?.[selectedFrequency.key] ?? "--");
  const periodCopy =
    tier.period?.[selectedFrequency.key] ??
    tier.priceSuffix ??
    selectedFrequency.priceSuffix;

  const cardClassName = cn(
    "flex h-full w-full flex-col rounded-2xl border bg-surface-secondary dark:bg-surface shadow-none transition duration-300",
    highlight
      ? highlightClassNames[highlight]
      : "border-surface-tertiary hover:border-accent/30",
    className
  );

  return (
    <Card className={cardClassName}>
      <Card.Header className="flex flex-col gap-4 py-6">
        <div className="flex items-center gap-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-center tracking-tight text-foreground">
              {tier.title}
            </h3>
            {tier.description ? (
              <p className="text-sm text-center text-muted">
                {tier.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-3xl font-semibold text-center tracking-tight text-foreground">
            {price}
          </div>
          <div className="text-xs font-medium text-center text-muted">
            {periodCopy}
          </div>
        </div>

        <Button
          {...buttonProps}
          className={cn("mt-2", button.className)}
          isDisabled={disabled}
          isPending={isLoading}
          variant={buttonVariant}
        >
          {label}
        </Button>
      </Card.Header>

      {tier.features && tier.features.length > 0 ? (
        <>
          <Separator className="my-2 bg-surface-tertiary" />
          <Card.Content className="flex flex-col px-6 pb-6 pt-2">
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Icon
                    icon="hugeicons:tick-02"
                    className="mt-0.5 size-5 text-accent/60"
                  />
                  <span className="text-sm leading-relaxed text-muted">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </>
      ) : null}
    </Card>
  );
}
