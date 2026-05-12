"use client";

import { Button, Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

import Image from "next/image";
import Link from "next/link";
import { designSystem } from "@/libs/design-system";

const d2cBrands = [
  { name: "Allbirds", logo: "/logos/d2c/allbirds.svg", width: 96 },
  { name: "Glossier", logo: "/logos/d2c/glossier.svg", width: 104 },
  { name: "Warby Parker", logo: "/logos/d2c/warby-parker.svg", width: 122 },
  { name: "Outdoor Voices", logo: "/logos/d2c/outdoor-voices.svg", width: 128 },
  { name: "Everlane", logo: "/logos/d2c/everlane.svg", width: 108 },
  { name: "Gymshark", logo: "/logos/d2c/gymshark.svg", width: 118 },
];

const Hero = () => {
  return (
    <section
      className={`relative w-full min-h-[calc(90vh)] flex items-center justify-center overflow-hidden mt-13 ${designSystem.background.gradient} pb-10 sm:pb-14 lg:pb-16`}
    >
      <div className={`${designSystem.spacing.container} relative z-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start px-2 sm:px-0">
            {/* Category Chip */}
            <div className="group mb-6 cursor-pointer rounded-xl bg-surface-secondary px-1 py-1">
              <Chip
                className="rounded-lg bg-surface px-1.5 text-xs uppercase tracking-[0.05em] font-medium"
                variant="soft"
              >
                Built for D2C brands
                <Icon
                  className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5"
                  icon="solar:alt-arrow-right-linear"
                />
              </Chip>
            </div>
            {/* Header  */}
            <h1 className="mb-6 flex max-w-3xl flex-col text-pretty font-semibold leading-[1.02] tracking-normal">
              <span className="block text-balance text-5xl sm:text-6xl lg:text-7xl">
                Make Better Decisions
              </span>

              <span className="block text-balance text-4xl font-medium leading-[1.08] sm:text-5xl lg:text-6xl">
                For your <span className="text-accent">Shopify store</span>
              </span>
            </h1>

            {/* Professional info */}
            <p className="text-sm sm:text-base lg:text-lg text-muted leading-relaxed text-pretty text-center sm:text-left max-w-2xl mx-auto sm:mx-0 mb-0">
              Meyoo tracks sales, ad spend, product costs, shipping, discounts,
              and fees in one dashboard, so you know what each order, ad, and
              SKU actually makes.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 sm:mt-12 flex flex-row flex-wrap justify-center sm:justify-start items-center gap-4">
              <Link href="/sign-in">
                <Button
                  variant="primary"
                  className="w-auto h-10 sm:h-11 transition-all duration-200 active:scale-100"
                  size="lg"
                >
                  Start 28-day Trial
                  <Icon className="ml-1" icon="solar:alt-arrow-right-linear" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="tertiary"
                  size="lg"
                  className="w-auto h-10 sm:h-11 transition-all duration-200 active:scale-100"
                >
                  View pricing
                </Button>
              </Link>
            </div>

            {/* Trust line */}
            <div className="mt-3 sm:mt-4">
              <div className="inline-flex items-center text-xs sm:text-sm text-muted">
                <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0 font-medium sm:justify-start sm:gap-x-3">
                  <span>Free for 300 orders/month/store</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative flex justify-center lg:justify-end px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Card className="relative h-[320px] shadow-none w-full max-w-[720px] rounded-2xl sm:rounded-3xl bg-surface-secondary p-1 sm:p-1.5 backdrop-blur-sm sm:h-[420px] md:h-[560px] lg:h-[640px] ring-1 ring-surface-tertiary">
              <Card.Content className="relative size-full rounded-[16px] sm:rounded-[20px] bg-surface-secondary overflow-hidden p-0">
                {/* Light mode preview */}
                <Image
                  alt="Meyoo dashboard preview (light)"
                  className="block dark:hidden size-full rounded-[16px] sm:rounded-[20px] object-cover object-left-top transition-transform duration-300 scale-[1.02]  hover:scale-[1.03]"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src="/light.png"
                />
                {/* Dark mode preview */}
                <Image
                  alt="Meyoo dashboard preview (dark)"
                  className="hidden dark:block size-full rounded-[16px] sm:rounded-[20px] object-cover object-left-top transition-transform duration-300 scale-[1.02] hover:scale-[1.03]"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src="/dark.png"
                />
              </Card.Content>
            </Card>
          </div>
        </div>

        <div className="mt-20">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
            <div className="grid grid-cols-3 sm:flex sm:flex-nowrap items-center justify-between gap-6 sm:gap-8 lg:gap-12 text-muted">
              {d2cBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex items-center justify-center  transition-all duration-200 hover:opacity-100 hover:scale-105"
                >
                  <Image
                    alt={`${brand.name} logo`}
                    src={brand.logo}
                    width={brand.width}
                    height={32}
                    className="h-5 sm:h-7 lg:h-9 w-auto max-w-[70px] sm:max-w-[100px] lg:max-w-[120px] grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
