import { Pricing } from "@/components/home/Pricing";
import { siteConfig } from "@/constants/config/site";
import { designSystem } from "@/libs/design-system";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Meyoo",
  description:
    "Simple, transparent pricing. Start free for 28 days. Scale as you grow. Cancel anytime.",
  openGraph: {
    title: "Pricing — Meyoo",
    description:
      "Simple, transparent pricing. Start free for 28 days. Scale as you grow. Cancel anytime.",
    url: "/pricing",
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Meyoo",
    description:
      "Simple, transparent pricing. Start free for 28 days. Scale as you grow. Cancel anytime.",
    images: [siteConfig.ogImage.url],
  },
};

export default function PricingPage() {
  return (
    <div className={`min-h-screen ${designSystem.background.gradient}`}>
      <Pricing />
    </div>
  );
}
