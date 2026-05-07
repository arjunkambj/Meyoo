"use client";

import { Button, Card } from "@heroui/react";
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
  active: "ring-2 ring-success/20",
  popular: "ring-2 ring-accent/20",
};

const parsePrice = (price: string) => {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? null : numeric;
};

export function PricingTierCard({
  tier,
  selectedFrequency,
  button,
  highlight = null,
  className,
}: PricingTierCardProps) {
  const {
    color,
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
        ? "tertiary"
        : variant;
  const price =
    typeof tier.price === "string"
      ? tier.price
      : (tier.price?.[selectedFrequency.key] ?? "--");
  const periodCopy =
    tier.period?.[selectedFrequency.key] ??
    tier.priceSuffix ??
    selectedFrequency.priceSuffix;
  const priceValue = parsePrice(price);

  const cardClassName = cn(
    "flex h-full w-full flex-col rounded-[2rem] bg-surface-secondary px-5 py-5 shadow-none transition-all duration-300",
    highlight ? highlightClassNames[highlight] : null,
    className
  );

  return (
    <Card className={cardClassName}>
      <Card.Content className="flex h-full flex-col p-0">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium tracking-tight text-foreground">
            {tier.title}
          </h3>

          <div>
            <div className="flex items-end gap-1.5 text-4xl font-bold tracking-tight text-foreground">
              {priceValue === null ? (
                <span className="text-2xl font-medium text-muted">{price}</span>
              ) : (
                <>
                  <span className="text-2xl font-medium text-muted">$</span>
                  <span>{priceValue}</span>
                </>
              )}
            </div>
            <div className="mt-1 text-xs font-medium text-muted">
              {periodCopy}
            </div>
            {tier.description ? (
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {tier.description}
              </p>
            ) : null}
          </div>

          <Button
            {...buttonProps}
            className={cn(
              "h-10 w-full font-semibold transition-all duration-200 active:scale-100",
              button.className
            )}
            isDisabled={disabled}
            isPending={isLoading}
            color={color}
            size={button.size ?? "md"}
            variant={buttonVariant}
          >
            {label}
          </Button>
        </div>

        {tier.features && tier.features.length > 0 ? (
          <div className="mt-6 flex-1">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted">
              Included
            </p>
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Icon
                    icon="hugeicons:tick-02"
                    className="mt-0.5 size-4 shrink-0 text-foreground"
                  />
                  <span className="text-sm leading-relaxed text-muted">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card.Content>
    </Card>
  );
}
