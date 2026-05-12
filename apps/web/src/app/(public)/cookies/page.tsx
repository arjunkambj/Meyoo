import { Card, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const lastUpdated = "January 15, 2025";

const cookieTypes = [
  {
    icon: "solar:shield-check-bold-duotone",
    title: "Essential Cookies",
    description: "Required for the website to function properly",
    examples: [
      "Authentication tokens to keep you logged in",
      "Security cookies to protect your account",
      "User preferences and settings",
      "Session management for your dashboard",
    ],
    canDisable: false,
  },
  {
    icon: "solar:chart-bold-duotone",
    title: "Analytics Cookies",
    description: "Help us understand how you use Meyoo",
    examples: [
      "Anonymous usage statistics",
      "Feature adoption tracking",
      "Performance monitoring",
      "Error tracking for debugging",
    ],
    canDisable: true,
  },
  {
    icon: "solar:settings-bold-duotone",
    title: "Functional Cookies",
    description: "Enable enhanced functionality and personalization",
    examples: [
      "Language preferences",
      "Time zone settings",
      "Dashboard customizations",
      "Recently viewed items",
    ],
    canDisable: true,
  },
];

const thirdPartyCookies = [
  {
    name: "Shopify",
    purpose: "Store authentication and session management",
    retention: "Session",
  },
  {
    name: "Meta (Facebook)",
    purpose: "Ad account access and campaign data retrieval",
    retention: "90 days",
  },
  {
    name: "Google",
    purpose: "Authentication and Google Ads API access",
    retention: "180 days",
  },
  {
    name: "Stripe",
    purpose: "Payment processing and fraud prevention",
    retention: "1 year",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-10 sm:py-12 lg:py-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-surface-secondary px-3 py-1.5 mb-3">
            <Icon
              className="text-foreground"
              icon="solar:cookie-bold-duotone"
              width={16}
            />
            <span className="text-sm font-medium text-muted">
              Cookie Policy
            </span>
          </div>
          <h1 className="text-3xl font-medium mb-3 sm:text-4xl lg:text-5xl">
            Cookie Policy
          </h1>
          <p className="text-base text-muted sm:text-lg">
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
                  icon="solar:info-circle-bold-duotone"
                />
                About This Policy
              </h2>
              <div className="space-y-4 text-muted">
                <p>
                  This Cookie Policy explains how Meyoo (&quot;we&quot;,
                  &quot;us&quot;, or &quot;our&quot;), operated by Pyro Labs
                  Private Limited, uses cookies and similar technologies to
                  recognize you when you visit our platform at meyoo.io.
                </p>
                <p>
                  It explains what these technologies are and why we use them,
                  as well as your rights to control our use of them. This policy
                  should be read in conjunction with our Privacy Policy.
                </p>
              </div>
            </Card.Content>
          </Card>

          {/* What Are Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">What Are Cookies?</h2>
            <Card className="bg-surface rounded-[2rem] shadow-none">
              <Card.Content className="p-6">
                <p className="text-muted mb-3">
                  Cookies are small data files that are placed on your computer
                  or mobile device when you visit a website. Cookies are widely
                  used by website owners to make their websites work, or to work
                  more efficiently, as well as to provide reporting information.
                </p>
                <p className="text-muted">
                  Cookies set by the website owner (in this case, Meyoo) are
                  called &quot;first party cookies&quot;. Cookies set by parties
                  other than the website owner are called &quot;third party
                  cookies&quot;. Third party cookies enable third party features
                  or functionality to be provided on or through the website
                  (e.g., analytics, interactive content and advertising).
                </p>
              </Card.Content>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Types of Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              {cookieTypes.map((type) => (
                <Card
                  key={type.title}
                  className="bg-surface rounded-[2rem] shadow-none transition-transform hover:-translate-y-0.5"
                >
                  <Card.Content className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon
                          className="w-6 h-6 text-accent"
                          icon={type.icon}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium">{type.title}</h3>
                          {type.canDisable ? (
                            <span className="text-xs bg-warning/10 text-warning px-3 py-1 rounded-full">
                              Optional
                            </span>
                          ) : (
                            <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-muted mb-3">{type.description}</p>
                        <div className="bg-surface-secondary rounded-xl p-4">
                          <p className="text-sm font-medium mb-2">Examples:</p>
                          <ul className="space-y-1">
                            {type.examples.map((example) => (
                              <li
                                key={example}
                                className="text-sm text-muted flex items-start gap-2"
                              >
                                <Icon
                                  className="w-4 h-4 text-accent mt-0.5"
                                  icon="solar:check-circle-bold"
                                />
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Third-Party Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">Third-Party Cookies</h2>
            <Card className="bg-surface rounded-[2rem] shadow-none mb-3">
              <Card.Content className="p-6">
                <p className="text-muted mb-3">
                  We use cookies from trusted third-party services to provide
                  core functionality and integrations. These cookies are
                  essential for connecting your e-commerce platforms and
                  analyzing your data.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-tertiary">
                        <th className="text-left py-3 px-4 font-medium">
                          Service
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Purpose
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Retention
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {thirdPartyCookies.map((cookie) => (
                        <tr
                          key={cookie.name}
                          className="border-b border-surface-tertiary/70 dark:border-surface-tertiary/60"
                        >
                          <td className="py-3 px-4 text-muted">
                            {cookie.name}
                          </td>
                          <td className="py-3 px-4 text-muted text-sm">
                            {cookie.purpose}
                          </td>
                          <td className="py-3 px-4 text-muted text-sm">
                            {cookie.retention}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Managing Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              Managing Your Cookie Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:settings-bold-duotone"
                    />
                    Browser Controls
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    Most web browsers allow you to control cookies through their
                    settings:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>• View what cookies are stored</li>
                    <li>• Delete cookies individually or all at once</li>
                    <li>• Block third-party cookies</li>
                    <li>• Block all cookies (may affect functionality)</li>
                  </ul>
                </Card.Content>
              </Card>

              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Icon
                      className="w-5 h-5 text-accent"
                      icon="solar:shield-check-bold-duotone"
                    />
                    Our Cookie Settings
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    You can manage your cookie preferences for Meyoo:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>• Essential cookies cannot be disabled</li>
                    <li>• Analytics cookies can be opted out</li>
                    <li>• Functional cookies can be managed</li>
                    <li>• Changes take effect immediately</li>
                  </ul>
                </Card.Content>
              </Card>
            </div>

            <Card className="bg-surface rounded-[2rem] shadow-none mt-6">
              <Card.Content className="p-6">
                <div className="flex gap-3">
                  <Icon
                    className="w-5 h-5 text-warning shrink-0 mt-0.5"
                    icon="solar:danger-triangle-bold"
                  />
                  <div>
                    <h4 className="font-medium mb-2">Important Note</h4>
                    <p className="text-sm text-muted">
                      Disabling certain cookies may impact the functionality of
                      Meyoo. Essential cookies are required for core features
                      like authentication, data syncing, and security. Without
                      these cookies, you won&apos;t be able to use the platform.
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Compliance */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              Compliance & Legal Basis
            </h2>
            <div className="space-y-6">
              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3">
                    GDPR Compliance (EU Users)
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    For users in the European Union, we comply with GDPR
                    requirements:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>• We obtain consent for non-essential cookies</li>
                    <li>• You can withdraw consent at any time</li>
                    <li>
                      • We process cookies based on legitimate interests where
                      applicable
                    </li>
                    <li>
                      • Cookie information is included in our privacy policy
                    </li>
                  </ul>
                </Card.Content>
              </Card>

              <Card className="bg-surface rounded-[2rem] shadow-none">
                <Card.Content className="p-6">
                  <h3 className="font-medium mb-3">Platform Compliance</h3>
                  <p className="text-muted text-sm mb-3">
                    Our cookie usage complies with platform requirements:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>
                      • <strong>Shopify:</strong> Follows Shopify App Store
                      requirements
                    </li>
                    <li>
                      • <strong>Meta:</strong> Complies with Meta Platform
                      Policy
                    </li>
                    <li>
                      • <strong>Google:</strong> Adheres to Google Ads API Terms
                    </li>
                  </ul>
                </Card.Content>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Updates & Contact */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-3">
              Updates to This Policy
            </h2>
            <Card className="bg-surface rounded-[2rem] shadow-none mb-3">
              <Card.Content className="p-6">
                <p className="text-muted mb-3">
                  We may update this Cookie Policy from time to time to reflect
                  changes in our practices or for operational, legal, or
                  regulatory reasons. When we make material changes, we will:
                </p>
                <ul className="space-y-2 text-muted">
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold"
                    />
                    <span>
                      Update the &quot;Last updated&quot; date at the top of
                      this policy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold"
                    />
                    <span>
                      Notify you via email or platform notification for
                      significant changes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 text-accent mt-0.5"
                      icon="solar:check-circle-bold"
                    />
                    <span>Request renewed consent where required by law</span>
                  </li>
                </ul>
              </Card.Content>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-surface rounded-[2rem] shadow-none">
            <Card.Content className="p-6">
              <h2 className="text-2xl font-medium mb-3 flex items-center gap-2">
                <Icon
                  className="w-6 h-6 text-accent"
                  icon="solar:phone-bold-duotone"
                />
                Questions About Cookies?
              </h2>
              <p className="text-muted mb-3">
                If you have questions about our use of cookies or this Cookie
                Policy, please contact our data protection team:
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
                  For more information about how we handle your data, please see
                  our{" "}
                  <Link
                    className="text-accent hover:underline"
                    href="/privacy/policy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
}
