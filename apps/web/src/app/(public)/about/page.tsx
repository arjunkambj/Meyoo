import { Card, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { designSystem } from "@/libs/design-system";
import CTAButton from "@/components/home/components/CTAButton";

const values = [
  {
    icon: "solar:shield-check-bold",
    title: "Privacy First",
    description: "Bank-level encryption. Your data stays yours.",
  },
  {
    icon: "solar:rocket-2-bold",
    title: "Real-Time",
    description: "Instant profit tracking. No delays.",
  },
  {
    icon: "solar:heart-bold",
    title: "Customer Focus",
    description: "Built from real merchant feedback.",
  },
];

const milestones = [{ year: "October 2025", event: "Public launch" }];

export default function AboutPage() {
  return (
    <div className={`min-h-screen ${designSystem.background.gradient}`}>
      {/* Hero Section */}
      <section className="relative px-4 pb-8 pt-14 sm:pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${designSystem.typography.sectionChip} mb-4`}>
            <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
              About
            </span>
          </div>
          <h1 className={`${designSystem.typography.sectionTitle} mb-3`}>
            Real Profit Intelligence
          </h1>
          <p className={designSystem.typography.sectionSubtitle}>
            Helping e‑commerce brands track what really matters.
            <br />
            <span className="text-accent font-medium">
              Launching October 2025
            </span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-14">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-6 text-foreground">
              Our Story
            </h2>
            <Card className="rounded-[2rem] bg-surface shadow-none">
              <Card.Content className="p-6 sm:p-8">
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    We spent years in spreadsheets trying to calculate real
                    profit after ad spend, shipping, and fees.
                  </p>
                  <p>
                    Revenue dashboards are everywhere. True profit intelligence
                    is missing.
                  </p>
                  <p>
                    We’re building Meyoo — the profit tracking platform we
                    always wanted — and opening access in October 2025.
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>

          <Separator className="my-8 bg-surface-secondary" />

          {/* Our Values */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-6 text-foreground">
              Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="rounded-[2rem] bg-surface shadow-none transition-all duration-300 hover:scale-[1.02]"
                >
                  <Card.Content className="p-6">
                    <div className="w-11 h-11 rounded-xl bg-surface-secondary flex items-center justify-center mb-4">
                      <Icon
                        className="text-foreground"
                        icon={value.icon}
                        width={24}
                      />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8 bg-surface-secondary" />

          {/* Timeline */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-6 text-foreground">
              Timeline
            </h2>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={`${milestone.year}-${milestone.event}`}
                  className="flex items-center gap-4 rounded-[2rem] bg-surface p-4 shadow-none transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="w-16 text-accent font-bold">
                    {milestone.year}
                  </div>
                  <Separator
                    className="h-6 bg-surface-secondary"
                    orientation="vertical"
                  />
                  <p className="text-muted">{milestone.event}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8 bg-surface-secondary" />

          {/* Company Info */}
          <div className="mb-8">
            <Card className="rounded-[2rem] bg-surface shadow-none">
              <Card.Content className="p-6 sm:p-8">
                <h3 className="font-medium text-foreground mb-4">Company</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Pyro Labs Private Limited
                  <br />
                  Operating as Meyoo
                  <br />
                  Noida, India
                </p>
              </Card.Content>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="rounded-[2rem] bg-surface p-6 text-center shadow-none sm:p-8">
              <Card.Content className="p-0">
                <h3 className="text-2xl font-medium mb-3 text-foreground">
                  Be first to try Meyoo
                </h3>
                <p className="text-muted mb-6">
                  Launching October 2025 — join the waitlist and we’ll notify
                  you when we open access.
                </p>
                <CTAButton
                  endIcon="solar:alt-arrow-right-linear"
                  href="/signup"
                >
                  Join the waitlist
                </CTAButton>
              </Card.Content>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
