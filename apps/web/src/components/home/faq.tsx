"use client";

import { Accordion, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { designSystem } from "@/libs/design-system";

const faqs = [
  {
    question: "How does Meyoo calculate profit?",
    answer:
      "We combine revenue with product cost (COGS), shipping, discounts, transaction fees, refunds, and ad spend to show true profit by order, SKU, and campaign.",
  },
  {
    question: "What do I need to get started?",
    answer:
      "Connect Shopify and your ad channels. Add product costs (upload or edit inline). You’ll see profit start to populate right away.",
  },
  {
    question: "Which integrations are available?",
    answer:
      "Shopify, Meta Ads, Google Ads, TikTok Ads, and Snapchat—with more coming soon.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. Export CSVs or copy to clipboard for quick shares. (API and scheduled exports on Growth+ plans.)",
  },
  {
    question: "Is my data secure?",
    answer:
      "We use modern encryption and strict access controls. Your data is yours—we never sell it. (Add your formal security/legal language here.)",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Manage your plan from your account settings with one click.",
  },
];

const Faq = () => {
  return (
    <section
      id="faq"
      className={`relative pt-16 sm:pt-20 lg:pt-24 2xl:pt-28 pb-16 sm:pb-20 lg:pb-24 2xl:pb-28 ${designSystem.background.gradient} w-full scroll-mt-24`}
    >
      <div className={`${designSystem.spacing.container} mx-auto max-w-7xl`}>
        <div className="text-center mb-16">
          <div className={designSystem.typography.sectionChip}>
            <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
              FAQ
            </span>
          </div>
          <h2 className={designSystem.typography.sectionTitle}>Common Questions</h2>
          <p className={designSystem.typography.sectionSubtitle}>
            We&apos;re here to help you get the most out of Meyoo.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:gap-14">
          <div className="flex flex-col justify-center gap-4">
              <h3 className="text-2xl font-medium tracking-tight">
                Need personalized help?
              </h3>
              <p className="text-base leading-relaxed text-muted">
                Drop a note to our
                <a
                  href="mailto:hey@meyoo.io"
                  className="mx-1 whitespace-nowrap underline text-accent hover:text-accent/80 transition-colors"
                >
                  support team
                </a>
                and we&apos;ll point you in the right direction.
              </p>
              <a href="mailto:hey@meyoo.io" className="w-full sm:w-fit">
                <Button variant="primary" size="lg" className="w-full sm:w-fit">
                  Email hey@meyoo.io
                </Button>
              </a>
          </div>
          <Accordion hideSeparator className="w-full">
            {faqs.map((faq) => (
              <Accordion.Item
                key={faq.question}
                id={faq.question}
                className="border-none"
              >
                <Accordion.Heading>
                  <Accordion.Trigger className="py-4 text-lg font-medium sm:text-xl">
                    {faq.question}
                    <Accordion.Indicator>
                      <Icon icon="solar:alt-arrow-down-outline" />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body className="px-5 pb-5 pt-3">
                    <p className="text-base leading-relaxed text-muted sm:text-lg">
                      {faq.answer}
                    </p>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export { Faq };
