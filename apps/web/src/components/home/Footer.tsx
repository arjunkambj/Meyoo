"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import { footerNavigation } from "@/constants/navigation/footerNavigation";

import { Logo } from "@/components/shared/Logo";
import { designSystem } from "@/libs/design-system";
import Link from "next/link";
import type { Route } from "next";

const navigationSections = [
  {
    title: "Product",
    links: footerNavigation.product.slice(0, 4),
  },
  {
    title: "Company",
    links: footerNavigation.company.slice(0, 4),
  },
  {
    title: "Legal",
    links: footerNavigation.legal.slice(0, 5),
  },
];

const socialLinks = [
  { icon: "ri:twitter-x-line", href: "https://x.com/arjunkambj", label: "X" },
];

const Footer = () => {
  return (
    <section className={`relative pt-20 pb-16 sm:pt-24`}>
      <div className={`${designSystem.spacing.container} mx-auto max-w-7xl`}>
        <footer>
          {/* CTA Section */}
          <div
            className="mx-auto mb-16 flex max-w-5xl flex-col items-center gap-4 rounded-[2rem] bg-surface p-6 text-center transition-all duration-300 sm:mb-24 sm:p-8 md:p-10 lg:p-12"
          >
              <h2 className="max-w-[640px] text-xl leading-tight font-bold tracking-tight text-balance sm:text-2xl lg:text-3xl text-foreground">
                See how much profit your store actually makes.
              </h2>
              <p className="max-w-[520px] text-sm text-muted sm:text-base">
                Connect Shopify, add costs, and track profit without the spreadsheet mess.
              </p>
              <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto font-medium"
                    variant="primary"
                   
                  >
                    <span className="flex items-center gap-2">
                      Start 28-day trial
                      <Icon
                        icon="solar:alt-arrow-right-linear"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Button>
                </Link>
              </div>
          </div>

          {/* Navigation Section */}
          <nav className="grid grid-cols-1 gap-y-8 py-10 sm:gap-y-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-x-16 lg:py-16">
            <div className="max-w-sm">
              <Logo href="/" size="md" />
              <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                Meyoo centralizes your eCommerce insights so you can act on
                accurate, real-time profitability.
              </p>
            </div>
            <div className="grid w-fit grid-cols-2 gap-x-14 gap-y-6 sm:grid-cols-[repeat(3,max-content)] sm:gap-x-32 sm:gap-y-8 lg:justify-self-end">
              {navigationSections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-3 text-base sm:text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        {link.href?.startsWith("/") ? (
                          <Link
                            href={link.href as Route}
                            className="inline-block text-sm sm:text-base text-muted-foreground transition-colors duration-300 hover:text-accent"
                          >
                            {link.name}
                          </Link>
                        ) : (
                          <a
                            href={link.href || "#"}
                            className="inline-block text-sm sm:text-base text-muted-foreground transition-colors duration-300 hover:text-accent"
                          >
                            {link.name}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="mx-auto mt-4 border-t border-surface-tertiary/70 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
              <p className="text-sm sm:text-base text-muted-foreground">
                © 2025 Meyoo Inc. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
                {socialLinks.map((link) => (
                  <a                     key={link.href}
                    href={link.href}
                    className="text-muted-foreground transition-all duration-300 hover:text-accent hover:scale-110"
                  >
                    <Icon
                      icon={link.icon}
                      width={20}
                      className="transition-transform hover:scale-110"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
