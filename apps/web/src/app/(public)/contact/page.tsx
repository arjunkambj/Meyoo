import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { designSystem } from "@/libs/design-system";

const contactInfo = [
  {
    icon: "solar:letter-bold-duotone",
    title: "Email",
    description: "hey@meyoo.io",
    link: "mailto:hey@meyoo.io",
  },
  {
    icon: "solar:phone-calling-bold-duotone",
    title: "Mobile",
    description: "Coming soon",
  },
];

export default function ContactPage() {
  return (
    <div className={`min-h-screen ${designSystem.background.gradient} pb-14`}>
      {/* Hero Section */}
      <section className="relative px-4 pb-8 pt-14 sm:pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${designSystem.typography.sectionChip} mb-4`}>
            <span className="text-sm uppercase tracking-[0.15em] font-medium text-accent/70">
              Contact Us
            </span>
          </div>
          <h1 className={`${designSystem.typography.sectionTitle} mb-3`}>
            Contact
          </h1>
          <p
            className={`${designSystem.typography.sectionSubtitle} max-w-2xl mx-auto`}
          >
            Questions about profit tracking? Let us know.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((item) => (
              <Card
                key={item.title}
                className="rounded-[2rem] bg-surface p-6 shadow-none transition-all duration-300 hover:scale-[1.02] sm:p-7"
              >
                <Card.Content className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-surface-secondary flex items-center justify-center shrink-0">
                      <Icon
                        className="text-foreground"
                        icon={item.icon}
                        width={22}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-1.5 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted text-sm mb-3 leading-relaxed">
                        {item.description}
                      </p>
                      {item.link && (
                        <a
                          className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1"
                          href={item.link}
                        >
                          Contact via {item.title}
                          <Icon
                            className="w-4 h-4"
                            icon="solar:alt-arrow-right-linear"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
