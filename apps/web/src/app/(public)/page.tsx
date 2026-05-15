import Separator from "@/components/home/Divider";
import { Faq } from "@/components/home/faq";
import { Feature } from "@/components/home/Feature";
import { Hero } from "@/components/home/Hero";
import { Integration } from "@/components/home/Integration";
import { Pricing } from "@/components/home/Pricing";
import { Testimonial } from "@/components/home/Testimonial";
import { siteConfig } from "@/constants/config/site";
import type { Metadata } from "next";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      <Hero />
      <Separator />
      <Integration />
      <Separator />
      <Feature />
      <Separator />
      <Testimonial />
      <Separator />
      <Pricing />
      <Separator />
      <Faq />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Meyoo — Profit Analytics for D2C Brands",
  description:
    "See real profit by order, SKU, and campaign. Meyoo unifies sales, ad spend, and costs so D2C teams can cut waste and scale what works. Start free for 28 days—no credit card.",
  openGraph: {
    title: "Know your true profit.",
    description:
      "One clean view of revenue, costs, spend, and profit—plus a 28-day free trial so you can grow with confidence.",
    url: "/",
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
    title: "Know your true profit.",
    description:
      "One clean view of revenue, costs, spend, and profit—plus a 28-day free trial so you can grow with confidence.",
    images: [siteConfig.ogImage.url],
  },
};
