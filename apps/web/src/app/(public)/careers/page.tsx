"use client";

import { Card, Chip, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";

import CareerApplicationButton from "@/components/home/components/CareerApplicationButton";
import EmailButton from "@/components/home/components/EmailButton";

const openPositions = [
  {
    id: "full-stack-dev",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "India",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "We're looking for a talented Full Stack Developer to join our engineering team. You'll work on building and scaling our profit intelligence platform using Next.js, TypeScript, and Convex.",
    requirements: [
      "Strong experience with React, Next.js, and TypeScript",
      "Experience with real-time databases and WebSocket connections",
      "Familiarity with modern UI libraries and responsive design",
      "Experience with REST APIs and third-party integrations",
      "Strong problem-solving skills and attention to detail",
    ],
    nice: [
      "Experience with Convex or similar real-time databases",
      "Knowledge of e-commerce platforms (Shopify, WooCommerce)",
      "Experience with data visualization and analytics",
      "Familiarity with Meta and Google Ads APIs",
    ],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    department: "Design",
    location: "India",
    type: "Full-time",
    experience: "2-4 years",
    description:
      "Join our design team to create intuitive and beautiful experiences for e-commerce merchants. You'll design interfaces that make complex data simple and actionable.",
    requirements: [
      "Portfolio demonstrating strong UX/UI design skills",
      "Experience designing data-heavy dashboards and analytics tools",
      "Proficiency in Figma, Sketch, or similar design tools",
      "Understanding of user research and usability testing",
      "Ability to create and maintain design systems",
    ],
    nice: [
      "Experience in e-commerce or SaaS products",
      "Knowledge of front-end development (HTML, CSS)",
      "Experience with motion design and micro-interactions",
      "Background in designing for B2B applications",
    ],
  },
  {
    id: "content-creator",
    title: "Content Creator",
    department: "Marketing",
    location: "India",
    type: "Full-time",
    experience: "2-3 years",
    description:
      "We're seeking a creative Content Creator to help tell the Meyoo story. You'll create engaging content that educates and inspires e-commerce entrepreneurs.",
    requirements: [
      "Excellent writing skills with a portfolio of published content",
      "Experience creating content for B2B SaaS or e-commerce",
      "Ability to simplify complex technical concepts",
      "Experience with SEO and content optimization",
      "Proficiency in creating various content formats (blog, video, social)",
    ],
    nice: [
      "Experience running an e-commerce business",
      "Video editing and production skills",
      "Knowledge of analytics and profit optimization",
      "Active presence on LinkedIn or Twitter",
    ],
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background pt-28">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-surface-secondary/70 to-transparent dark:via-surface-secondary/40" />
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-surface/70 dark:bg-surface/50 backdrop-blur-md border border-surface-tertiary rounded-full px-4 py-2 mb-6">
            <Icon
              className="text-accent"
              icon="solar:case-round-bold-duotone"
              width={16}
            />
            <span className="text-sm font-semibold text-muted">
              Careers
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Join Our Mission</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Help us empower e-commerce businesses with profit intelligence.
            We&apos;re building the future of financial analytics for online
            merchants.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Open Positions */}
          <div className="mb-16">
            <div className="space-y-6">
              {openPositions.map((position) => (
                <Card
                  key={position.id}
                  className="bg-surface/70 dark:bg-surface/40 backdrop-blur-md border border-surface-tertiary rounded-2xl shadow-none transition-transform hover:-translate-y-0.5"
                >
                  <Card.Content className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-3">
                              {position.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-5">
                              <Chip
                                className="bg-surface/60 dark:bg-surface/40 border border-surface-tertiary/60 text-muted"
                                size="sm"
                                variant="soft"
                              >
                                {position.department}
                              </Chip>
                              <Chip
                                className="bg-surface/60 dark:bg-surface/40 border border-surface-tertiary/60 text-muted"
                                size="sm"
                                variant="soft"
                              >
                                <Icon
                                  className="w-3 h-3 mr-1 text-muted"
                                  icon="solar:map-point-bold"
                                />
                                {position.location}
                              </Chip>
                              <Chip
                                className="bg-surface/60 dark:bg-surface/40 border border-surface-tertiary/60 text-muted"
                                size="sm"
                                variant="soft"
                              >
                                {position.type}
                              </Chip>
                              <Chip
                                className="text-accent bg-accent/10 border border-accent/20"
                                color="accent"
                                size="sm"
                                variant="soft"
                              >
                                {position.experience}
                              </Chip>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted mb-5 leading-relaxed">
                          {position.description}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Requirements:
                            </h4>
                            <ul className="space-y-1.5">
                              {position.requirements.map((req) => (
                                <li
                                  key={req}
                                  className="text-sm text-muted flex items-start gap-2"
                                >
                                  <Icon
                                    className="w-4 h-4 text-accent mt-0.5 shrink-0"
                                    icon="solar:check-circle-bold"
                                  />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Nice to Have:
                            </h4>
                            <ul className="space-y-1.5">
                              {position.nice.map((item) => (
                                <li
                                  key={item}
                                  className="text-sm text-muted flex items-start gap-2"
                                >
                                  <Icon
                                    className="w-4 h-4 text-accent mt-0.5 shrink-0"
                                    icon="solar:add-circle-bold"
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <CareerApplicationButton
                          positionTitle={position.title}
                        />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Our Hiring Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Application",
                  description: "Send your resume and cover letter",
                  icon: "solar:document-text-bold-duotone",
                },
                {
                  step: "2",
                  title: "Initial Screening",
                  description: "Quick chat about your experience",
                  icon: "solar:phone-calling-bold-duotone",
                },
                {
                  step: "3",
                  title: "Technical Interview",
                  description: "Deep dive into your skills",
                  icon: "solar:code-square-bold-duotone",
                },
                {
                  step: "4",
                  title: "Team Fit",
                  description: "Meet the team and culture fit",
                  icon: "solar:users-group-rounded-bold-duotone",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-surface/70 dark:bg-surface/40 backdrop-blur-md border border-surface-tertiary flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-8 h-8 text-accent" icon={item.icon} />
                  </div>
                  <h3 className="font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-accent/10 to-accent/10 border border-accent/20 rounded-2xl shadow-none">
            <Card.Content className="p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Don&apos;t See Your Role?
              </h2>
              <p className="text-muted mb-6 max-w-2xl mx-auto">
                We&apos;re always looking for exceptional talent. If you&apos;re
                passionate about e-commerce and data analytics, we&apos;d love
                to hear from you.
              </p>
              <EmailButton
                className="min-w-[180px]"
                email="arjun@meyoo.io"
                size="md"
                subject="General Application - Meyoo"
              >
                Send Your Resume
              </EmailButton>
              <p className="text-sm text-muted mt-4">
                Contact: arjun@meyoo.io
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
}
