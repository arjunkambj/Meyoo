"use client";

import React from "react";

import { cn } from "@/libs/utils";
import { designSystem } from "@/libs/design-system";
import Image from "next/image";
import { Icon } from "@iconify/react";

type IntegrationLogo =
  | { name: string; className?: string; icon: string; image?: never }
  | { name: string; className?: string; icon?: never; image: string };

const howItWorks = [
  {
    number: "01",
    title: "Connect your store",
    description:
      "Link Shopify in a few clicks. We’ll import orders, refunds, discounts, and fees automatically.",
    icon: "solar:shop-bold-duotone",
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLN51FsJANNnCB10JKLaEDMTSIoxHbtPY2WeFZr",
    imageOrder: "order-1",
    contentOrder: "order-2",
  },
  {
    number: "02",
    title: "Link your ad channels",
    description:
      "Sync Meta Ads, Google Ads, TikTok Ads, and Snapchat to see spend right next to revenue.",
    icon: "solar:graph-up-bold-duotone",
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLN9il3bgYZC4ekwYD5RjMGWca2d7vLIsxfbXrU",
    imageOrder: "order-2",
    contentOrder: "order-1",
  },
  {
    number: "03",
    title: "Track profit automatically",
    description:
      "See true profit by order, SKU, and campaign—updated throughout the day. Spot trends, anomalies, and waste before they snowball.",
    icon: "solar:wallet-money-bold-duotone",
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLNEkflsWqUOgHlR2fA8GZXSot4LNkiFe9jWVQs",
    imageOrder: "order-1",
    contentOrder: "order-2",
  },
];

const Integration = () => {
  const logos: IntegrationLogo[] = [
    { icon: "logos:shopify", name: "Shopify", className: "" },
    { icon: "logos:meta-icon", name: "Meta Ads", className: "" },
    { icon: "logos:google-ads", name: "Google Ads", className: "" },
    { icon: "logos:tiktok-icon", name: "TikTok Ads", className: "" },
    { icon: "ri:snapchat-fill", name: "Snapchat Ads", className: "text-[#FFFC00]" },
  ];

  return (
    <section
      className={`relative flex w-full flex-col items-center justify-center py-16 sm:py-20 lg:py-24 ${designSystem.background.gradient}`}
    >
      <div className={designSystem.spacing.container}>
        <div className="text-center">
          <div className={designSystem.typography.sectionChip}>
            <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
              Integrations
            </span>
          </div>
        </div>
        <h2 className={designSystem.typography.sectionTitle}>How Meyoo Works</h2>
        <p className={`${designSystem.typography.sectionSubtitle} max-w-2xl mx-auto`}>
          From setup to scale in three simple steps: connect your tools, unlock insights, and make better decisions to grow your brand.
        </p>

        <div className="relative mt-16">
          <div className="flex overflow-hidden p-2 [--duration:25s] [--gap:1rem] [gap:var(--gap)]">
            {Array.from({ length: 4 }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                className="flex shrink-0 animate-marquee justify-around [gap:var(--gap)]"
              >
                {logos.map((logo) => (
                  <div
                    key={`${groupIndex}-${logo.name}`}
                    className="flex items-center justify-center gap-3.5 rounded-xl bg-surface-secondary px-6 py-2 backdrop-blur-md ring-1 ring-surface-tertiary transition-all duration-200 hover:scale-105 hover:ring-accent/30"
                  >
                    {"image" in logo ? (
                      <Image
                        alt={logo.name}
                        className={cn("size-6", logo.className)}
                        height={24}
                        src={logo.image as string}
                        unoptimized
                        width={24}
                      />
                    ) : (
                      <Icon
                        icon={logo.icon}
                        width={24}
                        height={24}
                        className={cn(logo.className)}
                      />
                    )}
                    <p className="text-base font-medium">{logo.name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent"></div>
        </div>
      </div>
      <div className="relative mx-auto mt-16 grid min-h-[28rem] w-full max-w-7xl items-stretch gap-5 px-4 sm:px-6 lg:px-8 md:grid-cols-2 lg:grid-cols-3">
        {howItWorks.map((feature, index) => (
          <PinContainer
            key={index}
            className="group w-full rounded-[2rem] bg-surface-secondary p-1.5 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex h-full flex-col rounded-[2rem] bg-surface p-1.5">
              <div className={cn("relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent/5 via-accent/[0.025] to-transparent", feature.imageOrder)}>
                <div className="relative h-64 w-full sm:h-72">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-surface backdrop-blur-sm rounded-lg px-4 py-1.5">
                  <p className="text-xs uppercase tracking-[0.15em] text-accent font-semibold">
                    Step {feature.number}
                  </p>
                </div>
              </div>
              <div className={`mt-5 w-full p-4 flex-1 ${feature.contentOrder}`}>
                <h2 className="mb-3 text-xl font-medium tracking-tight leading-tight">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </PinContainer>
        ))}
      </div>
    </section>
  );
};

export { Integration };

export const PinContainer = ({
  children,
  title,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div className={cn("relative h-full ", containerClassName)}>
      <div className={cn("relative h-full flex flex-col", className)}>
        {children}
      </div>
      {title && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-zinc-950 text-white text-xs font-bold px-4 py-0.5 rounded-full ring-1 ring-white/10">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};
