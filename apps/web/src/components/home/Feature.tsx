"use client";

import Image from "next/image";
import { designSystem } from "@/libs/design-system";

type FeatureCard = {
  id: number;
  image: string;
  title: string;
  description: string;
};

const featureData: FeatureCard[] = [
  {
    id: 1,
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLNEIl86KqUOgHlR2fA8GZXSot4LNkiFe9jWVQs",
    title: "Real Profit Dashboard",
    description:
      "See revenue, costs, ad spend, and profit in one place.",
  },
  {
    id: 2,
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLNeBFkfFiIzwo6svuTP13JYgDA9LpSlXh0QGUq",
    title: "60+ Analytics Metrics",
    description:
      "Track AOV, CAC, margins, LTV, returns, and more.",
  },
  {
    id: 3,
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLN0U7nTMrJ3gLK5EO8wvzZDWiNxQdRrukVjFAo",
    title: "Meyoo AI Copilot",
    description:
      "Ask questions about your store and get clear answers.",
  },
  {
    id: 4,
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLNXACwtg5ELvwaj49AUkyIYz5JTWnZ32FVrB7f",
    title: "Inventory & Orders",
    description:
      "Monitor stock, orders, returns, and backorders.",
  },
  {
    id: 5,
    image: "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLNNlMOrOLL71m9hQqztgu2kvUVSlxYjHCasEAc",
    title: "Integrations & Imports",
    description:
      "Connect your tools or upload costs and shipping rules.",
  },
];

const featureCardSpan = (index: number) =>
  index < 2 ? "lg:col-span-3" : "lg:col-span-2";

const featureImageArea = (index: number) =>
  index < 2 ? "aspect-[4/3] lg:aspect-[16/9]" : "aspect-[4/3]";

const featureImageScale = (index: number) =>
  index < 2 ? "" : "scale-110";

const Feature = () => {
  return (
    <section
      className={`relative flex w-full items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24 ${designSystem.background.gradient}`}
    >
      <div
        className={`${designSystem.spacing.container} flex w-full flex-col items-center justify-center`}
      >
        <div className={designSystem.typography.sectionChip}>
          <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
            Features
          </span>
        </div>
        <h2 className={`relative z-20 ${designSystem.typography.sectionTitle}`}>
          Everything You Need to Grow
        </h2>
        <p className={`${designSystem.typography.sectionSubtitle} max-w-2xl mx-auto`}>
          Powerful features designed specifically for D2C brands. Track every metric that matters and make data-driven decisions with confidence.
        </p>

        <div className="mx-auto mt-16 grid w-full max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-6">
          {featureData.map((item, index) => (
            <article
              key={item.id}
              className={`group relative flex h-full flex-col rounded-[2rem] bg-surface-secondary p-1.5 transition-all duration-300 hover:scale-[1.02] ${featureCardSpan(index)}`}
            >
              <div className="flex h-full flex-col rounded-[2rem] bg-surface p-1.5">
                <div className={`relative ${featureImageArea(index)} overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent/5 via-accent/[0.025] to-transparent`}>
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes={index < 2 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                    className={`object-cover ${featureImageScale(index)}`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
                <div className="mt-5 w-full flex-1 p-4">
                  <h3 className="mb-3 text-xl font-medium tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature };
