"use client";

import { Card, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const lastUpdated = "January 15, 2025";

const dataProtectionPrinciples = [
  {
    icon: "solar:lock-keyhole-bold-duotone",
    title: "Security First",
    description:
      "Industry-standard encryption and security measures to protect your data at rest and in transit.",
  },
  {
    icon: "solar:minimize-square-bold-duotone",
    title: "Data Minimization",
    description:
      "We only collect and process data necessary for providing our services.",
  },
  {
    icon: "solar:eye-bold-duotone",
    title: "Transparency",
    description:
      "Clear communication about what data we collect and how we use it.",
  },
  {
    icon: "solar:user-check-bold-duotone",
    title: "User Control",
    description:
      "You maintain control over your data with easy access and management tools.",
  },
];

const gdprRights = [
  {
    icon: "solar:download-square-bold-duotone",
    title: "Right to Access",
    description: "Request a copy of your personal data we hold",
    details: [
      "Categories of data processed",
      "Purposes of processing",
      "Recipients of your data",
      "Data retention periods",
    ],
  },
  {
    icon: "solar:pen-new-square-bold-duotone",
    title: "Right to Rectification",
    description:
      "Correct inaccurate personal data and complete incomplete data",
  },
  {
    icon: "solar:trash-bin-trash-bold-duotone",
    title: "Right to Erasure",
    description:
      "Request deletion of your personal data when no longer necessary",
  },
  {
    icon: "solar:pause-circle-bold-duotone",
    title: "Right to Restrict Processing",
    description: "Limit how we process your data in certain circumstances",
  },
  {
    icon: "solar:export-bold-duotone",
    title: "Right to Data Portability",
    description: "Receive your data in a machine-readable format",
  },
  {
    icon: "solar:hand-shake-bold-duotone",
    title: "Right to Object",
    description: "Object to processing based on legitimate interests",
  },
];

const securityMeasures = [
  {
    icon: "solar:shield-check-bold-duotone",
    title: "Technical Measures",
    items: [
      "256-bit SSL/TLS encryption in transit",
      "AES-256 encryption at rest",
      "Web Application Firewall (WAF)",
      "DDoS protection",
      "Regular security scanning",
    ],
  },
  {
    icon: "solar:buildings-2-bold-duotone",
    title: "Organizational Measures",
    items: [
      "Role-based access controls",
      "Employee security training",
      "Background checks for staff",
      "Confidentiality agreements",
      "Incident response procedures",
    ],
  },
  {
    icon: "solar:server-bold-duotone",
    title: "Infrastructure Security",
    items: [
      "SOC 2 Type II certified data centers",
      "Regular backups and disaster recovery",
      "Geographical data redundancy",
      "24/7 monitoring and alerting",
    ],
  },
  {
    icon: "solar:verified-check-bold-duotone",
    title: "Compliance & Audits",
    items: [
      "Annual security audits",
      "Penetration testing",
      "Vulnerability assessments",
      "Compliance certifications",
    ],
  },
];

export default function DataProtectionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-10 sm:py-12 lg:py-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-surface-secondary px-3 py-1.5 mb-3">
            <Icon
              className="text-foreground"
              icon="solar:shield-keyhole-bold-duotone"
              width={16}
            />
            <span className="text-sm font-medium text-muted">
              Data Protection
            </span>
          </div>
          <h1 className="text-3xl font-medium mb-3 sm:text-4xl lg:text-5xl">Data Protection</h1>
          <p className="text-base text-muted sm:text-lg mb-2">
            Your Rights and Our Commitments
          </p>
          <p className="text-sm text-muted">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="bg-surface rounded-[2rem] shadow-none mb-8">
            <Card.Content className="p-6">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:shield-keyhole-bold-duotone"
                />
                Our Commitment to Data Protection
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  At Meyoo, operated by Pyro Labs Private Limited, we take data
                  protection seriously. This page outlines your rights under
                  various data protection laws, including GDPR, CCPA, and other
                  regional regulations, and explains how we protect your
                  business data.
                </p>
                <p>
                  We believe in transparency, security, and giving you control
                  over your data. Our platform is designed with privacy by
                  design principles, ensuring your e-commerce data is handled
                  with the utmost care and in compliance with Shopify, Meta, and
                  Google policies.
                </p>
              </div>
            </Card.Content>
          </Card>

          {/* Data Protection Principles */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              Our Data Protection Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataProtectionPrinciples.map((principle) => (
                <Card
                  key={principle.title}
                  className="bg-surface rounded-[2rem] shadow-none transition-transform hover:-translate-y-0.5"
                >
                  <Card.Content className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon
                          className="w-6 h-6 text-accent"
                          icon={principle.icon}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          {principle.title}
                        </h3>
                        <p className="text-sm text-muted">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* GDPR Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
              <Icon
                className="w-6 h-6 text-accent"
                icon="tabler:brand-europa"
              />
              GDPR Rights (European Union)
            </h2>
            <Card className="bg-surface rounded-[2rem] shadow-none mb-3">
              <Card.Content className="p-6">
                <p className="text-muted">
                  If you&apos;re located in the European Economic Area (EEA),
                  you have the following rights under GDPR:
                </p>
              </Card.Content>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gdprRights.map((right) => (
                <Card
                  key={right.title}
                  className="bg-surface rounded-[2rem] shadow-none transition-transform hover:-translate-y-0.5"
                >
                  <Card.Content className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon
                        className="w-8 h-8 text-accent shrink-0"
                        icon={right.icon}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{right.title}</h3>
                        <p className="text-sm text-muted mb-3">
                          {right.description}
                        </p>
                        {right.details && (
                          <ul className="space-y-1">
                            {right.details.map((detail) => (
                              <li
                                key={detail}
                                className="text-xs text-muted flex items-start gap-2"
                              >
                                <Icon
                                  className="w-3 h-3 text-accent mt-0.5"
                                  icon="solar:check-circle-bold-duotone"
                                />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* CCPA Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
              <Icon className="w-6 h-6 text-accent" icon="tabler:flag-usa" />
              CCPA Rights (California, USA)
            </h2>
            <Card className="bg-surface rounded-[2rem] shadow-none mb-3">
              <Card.Content className="p-6">
                <p className="text-muted">
                  California residents have specific rights under the California
                  Consumer Privacy Act (CCPA):
                </p>
              </Card.Content>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:info-square-bold-duotone"
                    />
                    Right to Know
                  </h3>
                  <p className="text-sm text-muted">
                    Request disclosure of personal information collected, used,
                    disclosed, or sold in the past 12 months.
                  </p>
                </Card.Content>
              </Card>
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:trash-bin-2-bold-duotone"
                    />
                    Right to Delete
                  </h3>
                  <p className="text-sm text-muted">
                    Request deletion of personal information collected from you,
                    subject to certain exceptions.
                  </p>
                </Card.Content>
              </Card>
              <Card className="bg-surface shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:hand-money-bold-duotone"
                    />
                    Right to Opt-Out
                  </h3>
                  <p className="text-sm text-muted">
                    Opt-out of the sale of personal information. Note: Meyoo
                    does not sell personal information.
                  </p>
                </Card.Content>
              </Card>
              <Card className="bg-surface shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:shield-user-bold-duotone"
                    />
                    Non-Discrimination
                  </h3>
                  <p className="text-sm text-muted">
                    Exercise your privacy rights without experiencing
                    discrimination in service or pricing.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* How to Exercise Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              How to Exercise Your Rights
            </h2>
            <div className="space-y-6">
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3">Self-Service Options</h3>
                  <p className="text-muted text-sm mb-3">
                    Many data rights can be exercised directly through your
                    account:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm">
                      <Icon icon="solar:settings-bold-duotone" />
                      <span>Account Settings</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm">
                      <Icon icon="solar:download-square-bold-duotone" />
                      <span>Export Your Data</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger/20 text-danger rounded-full text-sm">
                      <Icon icon="solar:trash-bin-trash-bold-duotone" />
                      <span>Delete Account</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3">Submit a Request</h3>
                  <p className="text-muted text-sm mb-3">
                    For requests that cannot be completed through self-service:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon
                        className="w-5 h-5 text-accent mt-0.5"
                        icon="solar:letter-bold-duotone"
                      />
                      <div>
                        <p className="font-medium text-sm">Email</p>
                        <Link
                          className="text-sm text-accent hover:underline"
                          href="mailto:hey@meyoo.io"
                        >
                          hey@meyoo.io
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon
                        className="w-5 h-5 text-accent mt-0.5"
                        icon="solar:document-text-bold-duotone"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          Privacy Request Form
                        </p>
                        <Link
                          className="text-sm text-accent hover:underline"
                          href="/privacy/data-deletion"
                        >
                          Submit online form
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Platform-Specific Procedures */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              Platform-Specific Data Protection Procedures
            </h2>
            <div className="space-y-6">
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:verified-check-bold-duotone"
                    />
                    Google Ads Policy Exemption Requests
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    For Google Ads related policy matters:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>
                      • Policy violation exemptions are handled through our
                      automated compliance system
                    </li>
                    <li>
                      • Ignorable policy topics are identified and processed
                      according to Google&apos;s guidelines
                    </li>
                    <li>
                      • Policy finding errors are addressed with appropriate
                      validation parameters
                    </li>
                    <li>
                      • Campaign modifications require policy compliance
                      verification before implementation
                    </li>
                  </ul>
                </Card.Content>
              </Card>

              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="logos:meta-icon"
                    />
                    Meta App Review Policy Violations
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    For Meta platform policy concerns:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>
                      • App review policy violations are monitored
                      continuously
                    </li>
                    <li>
                      • Platform policy compliance is verified before any data
                      processing
                    </li>
                    <li>
                      • Policy exemption requests are submitted through proper
                      Meta channels
                    </li>
                    <li>
                      • Users are notified immediately of any policy-related
                      data restrictions
                    </li>
                  </ul>
                </Card.Content>
              </Card>

              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:shop-bold-duotone"
                    />
                    Shopify App Audit Compliance
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    For Shopify app audit and compliance procedures:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>
                      • App audit requests are responded to within 48 hours
                    </li>
                    <li>
                      • Compliance documentation is maintained and readily
                      available
                    </li>
                    <li>
                      • Merchant data protection measures are regularly
                      reviewed and updated
                    </li>
                    <li>
                      • GDPR webhook implementations are tested and verified
                      continuously
                    </li>
                  </ul>
                </Card.Content>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Security Measures */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              How We Protect Your Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityMeasures.map((measure) => (
                <Card
                  key={measure.title}
                  className="bg-surface rounded-[2rem] shadow-none"
                >
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Icon
                        className="w-5 h-5 text-accent"
                        icon={measure.icon}
                      />
                      {measure.title}
                    </h3>
                    <ul className="space-y-2">
                      {measure.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted flex items-start gap-2"
                        >
                          <Icon
                            className="w-4 h-4 text-success mt-0.5"
                            icon="solar:check-circle-bold-duotone"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* International Transfers */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              International Data Transfers
            </h2>
            <Card className="bg-surface shadow-none">
              <Card.Content className="p-6">
                <p className="text-muted mb-3">
                  As we are based in India and serve global customers, your data
                  may be transferred to and processed in countries other than
                  your own. We ensure appropriate safeguards:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon
                      className="w-5 h-5 text-accent mt-0.5"
                      icon="solar:document-text-bold-duotone"
                    />
                    <div>
                      <p className="font-medium text-sm mb-1">
                        Standard Contractual Clauses
                      </p>
                      <p className="text-sm text-muted">
                        EU-approved contractual terms for data transfers outside
                        the EEA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon
                      className="w-5 h-5 text-accent mt-0.5"
                      icon="solar:shield-keyhole-bold-duotone"
                    />
                    <div>
                      <p className="font-medium text-sm mb-1">
                        Adequacy Decisions
                      </p>
                      <p className="text-sm text-muted">
                        Transfers to countries with adequate data protection
                        laws
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon
                      className="w-5 h-5 text-accent mt-0.5"
                      icon="solar:lock-bold-duotone"
                    />
                    <div>
                      <p className="font-medium text-sm mb-1">
                        Technical Safeguards
                      </p>
                      <p className="text-sm text-muted">
                        Encryption and access controls regardless of data
                        location
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Data Breach Response */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">Data Breach Response</h2>
            <Card className="bg-surface rounded-[2rem] shadow-none">
              <Card.Content className="p-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Icon
                    className="w-5 h-5 text-warning"
                    icon="solar:danger-triangle-bold-duotone"
                  />
                  Our Commitment
                </h3>
                <p className="text-muted text-sm mb-3">
                  In the unlikely event of a data breach that affects your
                  personal information:
                </p>
                <ul className="space-y-2">
                  <li className="text-sm text-muted flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-warning mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>
                      We will notify affected users within 72 hours of discovery
                    </span>
                  </li>
                  <li className="text-sm text-muted flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-warning mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>
                      We will provide clear information about what happened
                    </span>
                  </li>
                  <li className="text-sm text-muted flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-warning mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>
                      We will explain the potential impact on your data
                    </span>
                  </li>
                  <li className="text-sm text-muted flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-warning mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>
                      We will outline steps we&apos;re taking to address the
                      breach
                    </span>
                  </li>
                  <li className="text-sm text-muted flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-warning mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>
                      We will provide guidance on protective measures you can
                      take
                    </span>
                  </li>
                </ul>
              </Card.Content>
            </Card>
          </div>

          {/* Contact DPO */}
          <Card className="bg-surface rounded-[2rem] shadow-none">
            <Card.Content className="p-6">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:phone-bold-duotone"
                />
                Contact Our Data Protection Team
              </h2>
              <p className="text-muted mb-3">
                Our Data Protection team is available to address your privacy
                concerns and questions:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-5 h-5 text-accent"
                    icon="solar:letter-bold-duotone"
                  />
                  <span>
                    Email:{" "}
                    <Link
                      className="text-accent hover:underline"
                      href="mailto:hey@meyoo.io"
                    >
                      hey@meyoo.io
                    </Link>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-accent mt-0.5"
                    icon="solar:buildings-2-bold-duotone"
                  />
                  <span>
                    Pyro Labs Private Limited
                    <br />
                    Noida, Uttar Pradesh, India
                  </span>
                </div>
              </div>
              <Separator className="my-6" />
              <p className="text-sm text-muted">
                You also have the right to lodge a complaint with your local
                data protection supervisory authority if you believe we have not
                adequately addressed your concerns.
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
}
