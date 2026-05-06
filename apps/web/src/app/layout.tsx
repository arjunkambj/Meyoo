import "@/styles/globals.css";
import { ToastProvider } from "@heroui/toast";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StackProvider } from "@stackframe/stack";
import { Suspense } from "react";
import { stackServerApp } from "@/stack/server";

import { Providers } from "@/components/Providers";
import { siteConfig } from "@/constants/config/site";

const description =
  "Meyoo gives D2C teams one clean view of revenue, ad spend, costs, and true profit.";
const ogImageUrl = "https://hsuvzu8f2y.ufs.sh/f/7HGbSLA9igLNnKyY0SOVxEvhuNrTFGK39MspOgHXizj2kSPl";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  title: {
    default: "Meyoo — Profit Analytics for D2C Brands",
    template: `%s - ${siteConfig.name}`,
  },
  description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Meyoo - Profit Analytics for D2C Brands",
    description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Meyoo profit analytics dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meyoo - Profit Analytics for D2C Brands",
    description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <StackProvider app={stackServerApp}>
          <Suspense fallback={null}>
            <Providers>
              <main className={`h-dvh w-full antialiased ${inter.className}`}>
                <ToastProvider />
                {children}
              </main>
            </Providers>
          </Suspense>
        </StackProvider>
      </body>
    </html>
  );
}
