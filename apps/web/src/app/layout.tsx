import { ToastProvider } from "@heroui/react";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StackProvider } from "@stackframe/stack";
import { Suspense } from "react";
import { stackServerApp } from "@/stack/server";

import { Providers } from "@/components/Providers";
import { siteConfig } from "@/constants/config/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: {
    default: "Meyoo — Profit Analytics for D2C Brands",
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Meyoo - Profit Analytics for D2C Brands",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meyoo - Profit Analytics for D2C Brands",
    description: siteConfig.description,
    images: [siteConfig.ogImage.url],
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
