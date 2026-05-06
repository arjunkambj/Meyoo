"use client";

import { Icon } from "@iconify/react";
import { designSystem } from "@/libs/design-system";

type FeatureCard = {
  id: number;
  icon: string;
  title: string;
  description: string;
  badge: string;
};

const featureData: FeatureCard[] = [
  {
    id: 1,
    icon: "solar:chart-bold-duotone",
    title: "Real Profit Dashboard",
    description:
      "See revenue, costs, ad spend, and profit in one place.",
    badge: "Live Insights",
  },
  {
    id: 2,
    icon: "solar:graph-new-bold-duotone",
    title: "60+ Analytics Metrics",
    description:
      "Track AOV, CAC, margins, LTV, returns, and more.",
    badge: "Deep Analytics",
  },
  {
    id: 3,
    icon: "solar:chat-round-line-bold-duotone",
    title: "Meyoo AI Copilot",
    description:
      "Ask questions about your store and get clear answers.",
    badge: "AI Powered",
  },
  {
    id: 4,
    icon: "solar:box-bold-duotone",
    title: "Inventory & Orders",
    description:
      "Monitor stock, orders, returns, and backorders.",
    badge: "Smart Stock",
  },
  {
    id: 5,
    icon: "solar:link-circle-bold-duotone",
    title: "Integrations & Imports",
    description:
      "Connect your tools or upload costs and shipping rules.",
    badge: "Plug & Play",
  },
];

const featureCardSpan = (index: number) =>
  index < 2 ? "lg:col-span-3" : "lg:col-span-2";

const featureIconArea = (index: number) =>
  index < 2 ? "aspect-[4/3] lg:aspect-[16/7]" : "aspect-[4/3]";

const Feature = () => {
  return (
    <section
      className={`relative flex w-full items-center justify-center overflow-hidden ${designSystem.spacing.section} ${designSystem.background.gradient}`}
    >
      <div
        className={`${designSystem.spacing.container} flex w-full flex-col items-center justify-center`}
      >
        <div className={designSystem.typography.sectionChip}>
          <span className="text-sm uppercase tracking-[0.15em] font-medium text-primary/70">
            Features
          </span>
        </div>
        <h2 className={`relative z-20 ${designSystem.typography.sectionTitle}`}>
          Everything You Need to Grow
        </h2>
        <p className={`${designSystem.typography.sectionSubtitle} max-w-2xl mx-auto`}>
          Powerful features designed specifically for D2C brands. Track every metric that matters and make data-driven decisions with confidence.
        </p>

        <div className="mx-auto mt-16 grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-6">
          {featureData.map((item, index) => (
            <article
              key={item.id}
              className={`${designSystem.card.base} group relative flex h-full flex-col rounded-3xl p-1.5 transition-all duration-300 hover:scale-[1.02] ${featureCardSpan(index)}`}
            >
              <div className={`relative ${featureIconArea(index)} overflow-hidden rounded-[20px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center`}>
                <Icon
                  icon={item.icon}
                  className="text-primary/40 group-hover:text-primary/60 transition-colors duration-300"
                  width={120}
                  height={120}
                />
              </div>
              <div className="mt-5 w-full space-y-3 p-4">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">
                    {item.badge}
                  </p>
                </div>
                <h3 className="text-xl font-semibold tracking-tight leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature };
