"use client";

import { Button, Card, Switch } from "@heroui/react";
import React, { useMemo, useState } from "react";

import { Icon } from "@iconify/react";
import { frequencies, tiers } from "./pricing/constants";
import { type Frequency, FrequencyEnum, TiersEnum } from "./pricing/types";
import { designSystem } from "@/libs/design-system";
import type { Route } from "next";
import Link from "next/link";
import { NumberTicker } from "@/components/shared/NumberTicker";

const usePrevious = <T,>(value: T) => {
  const ref = React.useRef<T>(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const getTierPrice = (
  tier: (typeof tiers)[number],
  cycle: FrequencyEnum
): string => {
  if (typeof tier.price === "string") {
    return tier.price;
  }
  return tier.price[cycle];
};

const parsePrice = (price: string): number => {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? NaN : numeric;
};

const showcasedTiers = tiers.filter(
  (tier) => tier.key !== TiersEnum.Enterprise
);
const freeTier = tiers.find((tier) => tier.key === TiersEnum.Free);
const paidTiers = showcasedTiers.filter((tier) => tier.key !== TiersEnum.Free);

const Pricing = () => {
  const defaultFrequency = frequencies[0];

  if (!defaultFrequency) {
    throw new Error("No pricing frequencies configured");
  }

  const [billingCycle, setBillingCycle] = useState<FrequencyEnum>(
    FrequencyEnum.Monthly
  );
  usePrevious(billingCycle);

  const selectedFrequency = useMemo<Frequency>(
    () =>
      frequencies.find((frequency) => frequency.key === billingCycle) ??
      defaultFrequency,
    [billingCycle, defaultFrequency]
  );

  return (
    <section
      id="pricing"
      className={`relative py-16 sm:py-20 lg:py-24 ${designSystem.background.gradient} w-full`}
    >
      <div
        className={`${designSystem.spacing.container} mx-auto max-w-7xl flex flex-col gap-4 sm:gap-5`}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className={designSystem.typography.sectionChip}>
            <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
              Plans
            </span>
          </div>
          <h2 className={designSystem.typography.sectionTitle}>
            Simple, transparent pricing
          </h2>
          <p
            className={`${designSystem.typography.sectionSubtitle} max-w-2xl mx-auto`}
          >
            Start free for 28 days. Scale as you grow. Cancel anytime.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <span
            className={`font-medium transition-colors ${billingCycle === FrequencyEnum.Monthly ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <Switch
            aria-label="Toggle yearly billing"
            isSelected={billingCycle === FrequencyEnum.Yearly}
            onChange={(isSelected) => {
              setBillingCycle(
                isSelected ? FrequencyEnum.Yearly : FrequencyEnum.Monthly
              );
            }}
            size="lg"
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
          <div className="flex items-center gap-2">
            <span
              className={`font-medium transition-colors ${billingCycle === FrequencyEnum.Yearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Yearly
            </span>
            <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-xs font-medium text-success">
              Save 20%
            </span>
          </div>
        </div>

        {freeTier ? (
          <Card
            className="mx-auto w-full max-w-3xl rounded-3xl bg-surface-secondary p-1.5 shadow-none"
          >
            <Card.Content className="flex flex-col gap-2 rounded-2xl bg-surface px-6 py-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2.5">
                <Icon
                  icon="solar:bolt-bold"
                  className="size-10 shrink-0 text-accent"
                />
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium tracking-tight text-foreground">
                    Start free with your first 300 orders
                  </h3>
                  <p className="text-sm text-muted">
                    {freeTier.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center">
                <Link href={freeTier.href as Route}>
                  <Button
                    className="h-10 font-semibold transition-all duration-200 active:scale-100"
                    variant={freeTier.buttonVariant}
                    size="md"
                  >
                    {freeTier.buttonText}
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        ) : null}

        <div className="grid items-stretch gap-5 md:grid-cols-3">
          {paidTiers.map((tier) => {
            const price = getTierPrice(tier, billingCycle);
            const periodCopy =
              tier.period?.[billingCycle] ?? selectedFrequency.priceSuffix;
            const currentPriceValue = parsePrice(price);
            const shouldAnimate = Number.isFinite(currentPriceValue);

            return (
              <Card
                key={tier.key}
                className="flex h-full w-full flex-col rounded-[2rem] bg-surface px-5 py-5 shadow-none transition-all duration-300"
              >
                <Card.Content className="flex h-full flex-col p-0">
                  <div className="flex flex-col gap-2">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-medium tracking-tight text-foreground">
                        {tier.title}
                      </h3>
                    </div>
                    <div>
                      <div className="flex items-end gap-1.5 text-4xl font-bold tracking-tight text-foreground">
                        {shouldAnimate ? (
                          <>
                            <span className="text-2xl font-medium text-muted">
                              $
                            </span>
                            <NumberTicker
                              value={currentPriceValue}
                              decimalPlaces={0}
                            />
                          </>
                        ) : (
                          <span className="text-2xl font-medium text-muted">
                            {price}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted font-medium">
                        {periodCopy}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {tier.description}
                      </p>
                    </div>

                    <Link href={tier.href as Route} className="w-full">
                      <Button
                        className="w-full h-10 font-semibold transition-all duration-200 active:scale-100"
                        variant={tier.buttonVariant}
                        size="md"
                      >
                        {tier.buttonText}
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 flex-1">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted">
                      Included
                    </p>
                    <ul className="space-y-3">
                      {tier.features?.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2"
                        >
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
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Pricing };
