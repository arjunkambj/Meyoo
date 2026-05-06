"use client";

import { Avatar } from "@heroui/react";
import React from "react";
import { Icon } from "@iconify/react";
import { designSystem } from "@/libs/design-system";

const testimonials = [
  {
    id: "1",
    title: "We finally trust every margin call",
    description:
      "Within two weeks we spotted three SKUs that looked profitable in Shopify but were underwater after shipping. Killing them paid for Meyoo twice over.",
    user: {
      name: "Noah Patel",
      location: "CRO, Brightside Apparel",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "2",
    title: "One dashboard for the whole growth squad",
    description:
      "Our merch, finance, and paid teams finally look at the same numbers. Meyoo replaced five spreadsheets and gave us a daily profit standup.",
    user: {
      name: "Jessie Han",
      location: "VP Growth, Kinfield Labs",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "3",
    title: "AI answers what I used to DM the analyst",
    description:
      "The Copilot surfaces blended CAC, refund drag, and cash impact in plain English. I make decisions in minutes instead of waiting for a deck.",
    user: {
      name: "Lena Ortiz",
      location: "COO, Ember Living",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    },
  },
];

const Testimonial = () => {
  return (
    <section
      className={`relative flex w-full flex-col items-center justify-center py-16 sm:py-20 lg:py-24 ${designSystem.background.gradient}`}
    >
      <div className={designSystem.spacing.container}>
        <div className="text-center">
          <div className={designSystem.typography.sectionChip}>
            <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
              Testimonial
            </span>
          </div>
        </div>
        <h2 className={designSystem.typography.sectionTitle}>What customers say</h2>
        <p className={designSystem.typography.sectionSubtitle}>Loved by operators and teams.</p>
      </div>
      <div
        className={`relative mx-auto mt-16 grid w-full max-w-7xl items-stretch gap-5 px-4 sm:px-6 lg:px-8 md:grid-cols-2 lg:grid-cols-3`}
      >
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="group relative flex h-full min-h-[22rem] flex-col rounded-[2rem] bg-surface px-6 py-5 transition-all duration-300 hover:-translate-y-1 sm:px-7 sm:py-6"
          >
              <div className="mb-4">
                <div className="inline-flex text-accent">
                  <Icon icon="ri:double-quotes-l" width={40} />
                </div>
              </div>

              <h3 className="text-xl font-medium leading-tight tracking-tight text-foreground">
                {testimonial.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                {testimonial.description}
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-foreground/10 pt-4">
                <Avatar
                  size="md"
                  className="ring-2 ring-background"
                >
                  <Avatar.Image src={testimonial.user.avatar} alt={testimonial.user.name} />
                  <Avatar.Fallback>{testimonial.user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {testimonial.user.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {testimonial.user.location}
                  </p>
                </div>
              </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export { Testimonial };
