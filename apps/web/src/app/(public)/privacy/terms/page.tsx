"use client";

import { Card, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const lastUpdated = "January 15, 2025";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: "solar:document-text-bold-duotone",
  },
  {
    id: "description",
    title: "Service Description",
    icon: "solar:info-square-bold-duotone",
  },
  {
    id: "account",
    title: "Account Terms",
    icon: "solar:user-circle-bold-duotone",
  },
  {
    id: "payment",
    title: "Payment & Billing",
    icon: "solar:wallet-bold-duotone",
  },
  {
    id: "usage",
    title: "Acceptable Use",
    icon: "solar:shield-check-bold-duotone",
  },
  {
    id: "integrations",
    title: "Third-Party Integrations",
    icon: "solar:link-bold-duotone",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: "solar:copyright-bold-duotone",
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    icon: "solar:lock-keyhole-bold-duotone",
  },
  {
    id: "warranties",
    title: "Warranties & Disclaimers",
    icon: "solar:danger-triangle-bold-duotone",
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: "solar:shield-warning-bold-duotone",
  },
  {
    id: "termination",
    title: "Termination",
    icon: "solar:close-circle-bold-duotone",
  },
  {
    id: "general",
    title: "General Provisions",
    icon: "solar:document-bold-duotone",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-10 sm:py-12 lg:py-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-surface-secondary px-3 py-1.5 mb-3">
            <Icon
              className="text-foreground"
              icon="solar:document-text-bold-duotone"
              width={16}
            />
            <span className="text-sm font-medium text-muted">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-3xl font-medium mb-3 sm:text-4xl lg:text-5xl">Terms of Service</h1>
          <p className="text-base text-muted sm:text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <Card className="bg-surface rounded-[2rem] shadow-none mb-8">
            <Card.Content className="p-6">
              <h2 className="text-xl font-medium mb-3">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-secondary transition-colors text-muted hover:text-accent"
                    href={`#${section.id}`}
                  >
                    <Icon className="w-4 h-4" icon={section.icon} />
                    <span className="text-sm">{section.title}</span>
                  </Link>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section id="acceptance">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:document-text-bold-duotone"
                />
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  By accessing or using Meyoo (&quot;Service&quot;), operated by
                  Pyro Labs Private Limited (&quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;), you agree to be bound by these Terms of
                  Service (&quot;Terms&quot;). If you disagree with any part of
                  these terms, you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who
                  access or use the Service, including but not limited to
                  Shopify merchants who install our application.
                </p>
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-2">Important Note</h3>
                    <p className="text-sm text-muted">
                      By using Meyoo, you also agree to comply with
                      Shopify&apos;s Terms of Service, Meta&apos;s Terms of
                      Service, Google&apos;s Terms of Service, and any other
                      third-party platform terms that you connect to our
                      Service.
                    </p>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Service Description */}
            <section id="description">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:info-square-bold-duotone"
                />
                Service Description
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  Meyoo is a profit intelligence platform designed for
                  e-commerce businesses that provides:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>Real-time profit and loss analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>
                      Integration with Shopify, Meta Ads, and Google Ads
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>Product-level profitability tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>Marketing performance analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold-duotone"
                    />
                    <span>Cost management and tracking</span>
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Account Terms */}
            <section id="account">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:user-circle-bold-duotone"
                />
                Account Terms
              </h2>
              <div className="space-y-4">
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Account Registration</h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • You must provide accurate and complete information
                      </li>
                      <li>
                        • You must be at least 18 years old or the age of
                        majority
                      </li>
                      <li>
                        • You are responsible for maintaining account security
                      </li>
                      <li>• One account per Shopify store is permitted</li>
                      <li>
                        • You must notify us of any unauthorized access
                        immediately
                      </li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">
                      Account Responsibilities
                    </h3>
                    <p className="text-muted text-sm mb-3">
                      You are responsible for:
                    </p>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>• All activities that occur under your account</li>
                      <li>
                        • Maintaining the confidentiality of your login
                        credentials
                      </li>
                      <li>• All content and data uploaded to your account</li>
                      <li>
                        • Ensuring your use complies with all applicable laws
                      </li>
                    </ul>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Payment & Billing */}
            <section id="payment">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:wallet-bold-duotone"
                />
                Payment & Billing
              </h2>
              <div className="space-y-4">
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Subscription Terms</h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>• 28-day free trial for new users</li>
                      <li>• Monthly or annual subscription plans available</li>
                      <li>• Automatic renewal unless cancelled</li>
                      <li>• Prices subject to change with 30 days notice</li>
                      <li>• All fees are exclusive of taxes</li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Billing via Shopify</h3>
                    <p className="text-muted text-sm mb-3">
                      For Shopify App Store users:
                    </p>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>• Billing is processed through Shopify</li>
                      <li>• Charges appear on your Shopify invoice</li>
                      <li>• Refunds are subject to Shopify&apos;s policies</li>
                      <li>
                        • Usage-based charges may apply for certain features
                      </li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Icon
                        className="w-5 h-5 text-warning"
                        icon="solar:info-circle-bold-duotone"
                      />
                      Refund Policy
                    </h3>
                    <p className="text-sm text-muted">
                      We offer a 30-day money-back guarantee for annual plans.
                      Monthly plans are non-refundable but can be cancelled at
                      any time to prevent future charges.
                    </p>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Acceptable Use */}
            <section id="usage">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:shield-check-bold-duotone"
                />
                Acceptable Use
              </h2>
              <div className="space-y-4 text-muted">
                <p>You agree not to use the Service to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-surface rounded-[2rem] shadow-none">
                    <Card.Content className="p-6">
                      <h3 className="font-medium mb-3 text-danger">
                        Prohibited Activities
                      </h3>
                      <ul className="space-y-2 text-sm text-muted">
                        <li>• Violate any laws or regulations</li>
                        <li>• Infringe on intellectual property rights</li>
                        <li>• Transmit malicious code or viruses</li>
                        <li>• Attempt to gain unauthorized access</li>
                        <li>• Interfere with service operations</li>
                        <li>• Scrape or harvest data</li>
                      </ul>
                    </Card.Content>
                  </Card>

                  <Card className="bg-surface rounded-[2rem] shadow-none">
                    <Card.Content className="p-6">
                      <h3 className="font-medium mb-3 text-danger">
                        Data Misuse
                      </h3>
                      <ul className="space-y-2 text-sm text-muted">
                        <li>• Share or sell access to your account</li>
                        <li>• Use data for unauthorized purposes</li>
                        <li>• Violate privacy of customers</li>
                        <li>• Manipulate or falsify analytics</li>
                        <li>• Exceed API rate limits</li>
                        <li>• Reverse engineer the Service</li>
                      </ul>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* Third-Party Integrations */}
            <section id="integrations">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:link-bold-duotone"
                />
                Third-Party Integrations
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  Meyoo integrates with third-party services. You acknowledge
                  and agree that:
                </p>
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Icon
                          className="w-4 h-4 text-accent mt-0.5"
                          icon="solar:info-circle-bold-duotone"
                        />
                        <span>
                          Your use of integrated services is subject to their
                          respective terms (Shopify Terms of Service, Meta
                          Platform Terms, Google Ads API Terms)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          className="w-4 h-4 text-accent mt-0.5"
                          icon="solar:info-circle-bold-duotone"
                        />
                        <span>
                          We are not responsible for third-party service
                          availability or performance
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          className="w-4 h-4 text-accent mt-0.5"
                          icon="solar:info-circle-bold-duotone"
                        />
                        <span>
                          You must maintain valid accounts with integrated
                          platforms and comply with their usage policies
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          className="w-4 h-4 text-accent mt-0.5"
                          icon="solar:info-circle-bold-duotone"
                        />
                        <span>
                          Changes to third-party APIs may affect Service
                          functionality
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          className="w-4 h-4 text-accent mt-0.5"
                          icon="solar:info-circle-bold-duotone"
                        />
                        <span>
                          You grant us necessary permissions to access your
                          third-party data in accordance with platform-specific
                          authorization scopes
                        </span>
                      </li>
                    </ul>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Platform API Compliance */}
            <section id="platform-api-compliance">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:verified-check-bold-duotone"
                />
                Platform API Compliance
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  Our Service integrates with multiple platforms and is subject
                  to their respective API terms and policies:
                </p>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3 text-accent">
                      Shopify Partner Program Compliance
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • We comply with Shopify&apos;s API License and Terms of
                        Use
                      </li>
                      <li>
                        • We adhere to Shopify App Store requirements and
                        policies
                      </li>
                      <li>
                        • We implement all mandatory GDPR webhooks as required
                        by Shopify
                      </li>
                      <li>• We do not contact your customers directly</li>
                      <li>
                        • We do not share your Shopify data with other merchants
                      </li>
                      <li>
                        • We use Shopify data solely for providing analytics and
                        insights services
                      </li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3 text-accent">
                      Meta Platform Terms Compliance
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • We comply with Meta&apos;s Platform Terms and
                        Developer Policies
                      </li>
                      <li>
                        • We adhere to Facebook Marketing API requirements
                      </li>
                      <li>
                        • We do not sell or transfer Meta data to third parties
                      </li>
                      <li>
                        • We do not store Meta user passwords or personal
                        credentials
                      </li>
                      <li>
                        • We use Meta data exclusively for advertising analytics
                        and reporting
                      </li>
                      <li>
                        • We maintain compliance with Meta&apos;s data retention
                        and deletion policies
                      </li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3 text-accent">
                      Google Ads API Terms Compliance
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>• We comply with Google Ads API Terms of Service</li>
                      <li>
                        • We implement Required Minimum Functionality (RMF) for
                        app campaign management
                      </li>
                      <li>
                        • We adhere to Google&apos;s Customer Data Usage
                        policies
                      </li>
                      <li>
                        • We only upload first-party customer data with proper
                        consent
                      </li>
                      <li>
                        • We maintain appropriate data retention limits as
                        specified by Google
                      </li>
                      <li>
                        • We handle policy violations and exemptions according
                        to Google&apos;s procedures
                      </li>
                    </ul>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Policy Violations & Exemptions */}
            <section id="policy-violations">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:shield-warning-bold-duotone"
                />
                Policy Violations & Exemptions
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  We maintain strict compliance with all platform policies and
                  handle violations according to each platform&apos;s
                  requirements:
                </p>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Icon
                        className="w-5 h-5 text-warning"
                        icon="solar:danger-triangle-bold-duotone"
                      />
                      Your Responsibilities
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • You must comply with all applicable platform policies
                        when using our Service
                      </li>
                      <li>
                        • You are responsible for ensuring your campaigns and
                        content meet platform guidelines
                      </li>
                      <li>
                        • You must not use our Service to circumvent platform
                        policies or restrictions
                      </li>
                      <li>
                        • You acknowledge that policy violations may result in
                        account suspension by the respective platforms
                      </li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">
                      Our Policy Violation Handling
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • We monitor compliance with platform policies
                        continuously
                      </li>
                      <li>
                        • Policy violations are addressed immediately upon
                        detection
                      </li>
                      <li>
                        • We maintain procedures for policy exemption requests
                        when applicable
                      </li>
                      <li>
                        • We cooperate fully with platform audits and compliance
                        reviews
                      </li>
                      <li>
                        • We notify users of any policy-related issues affecting
                        their accounts
                      </li>
                    </ul>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Intellectual Property */}
            <section id="intellectual-property">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:copyright-bold-duotone"
                />
                Intellectual Property
              </h2>
              <div className="space-y-4">
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Our Property</h3>
                    <p className="text-muted text-sm mb-3">
                      The Service, including all content, features, and
                      functionality, is owned by Pyro Labs Private Limited and
                      is protected by international copyright, trademark, and
                      other intellectual property laws.
                    </p>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • You may not copy, modify, or distribute our software
                      </li>
                      <li>
                        • Our trademarks and logos may not be used without
                        permission
                      </li>
                      <li>• All feedback provided becomes our property</li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Your Content</h3>
                    <p className="text-muted text-sm mb-3">
                      You retain ownership of data you upload to the Service. By
                      using Meyoo, you grant us:
                    </p>
                    <ul className="space-y-2 text-sm text-muted">
                      <li>
                        • A license to use your data to provide the Service
                      </li>
                      <li>
                        • Permission to aggregate anonymized data for analytics
                      </li>
                      <li>
                        • Rights to display your content within your account
                      </li>
                    </ul>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Privacy & Data */}
            <section id="privacy">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:lock-keyhole-bold-duotone"
                />
                Privacy & Data
              </h2>
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <p className="text-muted mb-3">
                    Your use of our Service is also governed by our Privacy
                    Policy. Please review our Privacy Policy, which also governs
                    the Site and informs users of our data collection practices.
                  </p>
                  <Link
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                    href="/privacy/policy"
                  >
                    <Icon icon="solar:document-text-bold-duotone" />
                    Read our Privacy Policy
                  </Link>
                </Card.Content>
              </Card>
            </section>

            <Separator />

            {/* Warranties & Disclaimers */}
            <section id="warranties">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:danger-triangle-bold-duotone"
                />
                Warranties & Disclaimers
              </h2>
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3">
                    Service Provided &quot;AS IS&quot;
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                    AVAILABLE&quot; BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES
                    OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
                    LIMITED TO:
                  </p>
                  <ul className="space-y-2 text-sm text-muted uppercase">
                    <li>• MERCHANTABILITY</li>
                    <li>• FITNESS FOR A PARTICULAR PURPOSE</li>
                    <li>• NON-INFRINGEMENT</li>
                    <li>• ACCURACY OF DATA OR ANALYTICS</li>
                    <li>• UNINTERRUPTED OR ERROR-FREE SERVICE</li>
                  </ul>
                </Card.Content>
              </Card>
            </section>

            <Separator />

            {/* Limitation of Liability */}
            <section id="liability">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:shield-warning-bold-duotone"
                />
                Limitation of Liability
              </h2>
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <p className="text-muted font-medium mb-3">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                  </p>
                  <ul className="space-y-3 text-sm text-muted">
                    <li>
                      • IN NO EVENT SHALL PYRO LABS PRIVATE LIMITED BE LIABLE
                      FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                      PUNITIVE DAMAGES
                    </li>
                    <li>
                      • OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY
                      YOU IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING
                      RISE TO LIABILITY
                    </li>
                    <li>
                      • WE SHALL NOT BE LIABLE FOR ANY LOSS OF PROFITS, DATA,
                      BUSINESS, OR GOODWILL
                    </li>
                  </ul>
                </Card.Content>
              </Card>
            </section>

            <Separator />

            {/* Termination */}
            <section id="termination">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:close-circle-bold-duotone"
                />
                Termination
              </h2>
              <div className="space-y-4">
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Termination by You</h3>
                    <p className="text-muted text-sm">
                      You may terminate your account at any time by:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      <li>
                        • Cancelling your subscription through account settings
                      </li>
                      <li>• Uninstalling the app from your Shopify admin</li>
                      <li>• Contacting our support team</li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Termination by Us</h3>
                    <p className="text-muted text-sm">
                      We may terminate or suspend your account immediately if:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      <li>• You breach these Terms</li>
                      <li>• You violate applicable laws</li>
                      <li>• Your actions harm other users or our reputation</li>
                      <li>• You fail to pay applicable fees</li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">
                      Effect of Termination
                    </h3>
                    <p className="text-muted text-sm">
                      Upon termination:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      <li>
                        • Your access to the Service will cease immediately
                      </li>
                      <li>• We may delete your data after 30 days</li>
                      <li>• You remain liable for any outstanding fees</li>
                      <li>
                        • Provisions that should survive will remain in effect
                      </li>
                    </ul>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* General Provisions */}
            <section id="general">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:document-bold-duotone"
                />
                General Provisions
              </h2>
              <div className="space-y-4">
                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Governing Law</h3>
                    <p className="text-muted text-sm">
                      These Terms shall be governed by and construed in
                      accordance with the laws of India, without regard to its
                      conflict of law provisions. Any disputes shall be subject
                      to the exclusive jurisdiction of the courts in Noida,
                      Uttar Pradesh, India.
                    </p>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Changes to Terms</h3>
                    <p className="text-muted text-sm">
                      We reserve the right to modify these Terms at any time. We
                      will notify users of any material changes via email or
                      through the Service. Your continued use after such
                      modifications constitutes acceptance of the updated Terms.
                    </p>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Severability</h3>
                    <p className="text-muted text-sm">
                      If any provision of these Terms is held to be invalid or
                      unenforceable, the remaining provisions shall continue in
                      full force and effect.
                    </p>
                  </Card.Content>
                </Card>

                <Card className="bg-surface rounded-[2rem] shadow-none">
                  <Card.Content className="p-6">
                    <h3 className="font-medium mb-3">Entire Agreement</h3>
                    <p className="text-muted text-sm">
                      These Terms, together with our Privacy Policy and any
                      other legal notices published by us on the Service,
                      constitute the entire agreement between you and Pyro Labs
                      Private Limited concerning the Service.
                    </p>
                  </Card.Content>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Contact Information */}
            <Card className="bg-surface rounded-[2rem] shadow-none">
              <Card.Content className="p-6">
                <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                  <Icon
                    className="w-6 h-6 text-accent"
                    icon="solar:phone-bold-duotone"
                  />
                  Contact Us
                </h2>
                <p className="text-muted mb-3">
                  If you have any questions about these Terms of Service, please
                  contact us:
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
                <div className="mt-6 pt-6 border-t border-surface-tertiary">
                  <p className="text-sm text-muted">
                    By using Meyoo, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms of Service.
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
