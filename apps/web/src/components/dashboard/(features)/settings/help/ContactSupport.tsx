"use client";

import { Button, Card, Input, TextArea } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

import { useUser } from "@/hooks";

const SUPPORT_EMAIL = "hey@meyoo.io";

export default function ContactSupport() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.length < 20) {
      errors.message = "Message must be at least 20 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      formData.message,
    ].join("\n");

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      formData.subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border border-surface-tertiary bg-surface-secondary shadow-none lg:col-span-2">
          <Card.Content className="p-3">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  className="shadow-none"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />

                <Input
                  className="shadow-none"
                  required
                  placeholder="john@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <Input
                className="shadow-none"
                required
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />

              <TextArea
                className="shadow-none"
                required
                placeholder="Please provide as much detail as possible about your issue or question..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />

              <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-3 text-xs text-foreground">
                  <div className="flex items-center gap-1">
                    <Icon
                      className="text-success"
                      icon="solar:shield-check-bold-duotone"
                      width={16}
                    />
                    <span>Secure & private</span>
                  </div>
                  <div className="hidden h-3 w-px bg-separator sm:block" />
                  <div className="flex items-center gap-1">
                    <Icon
                      className="text-accent"
                      icon="solar:clock-circle-bold-duotone"
                      width={16}
                    />
                    <span>Avg. response 2-4 hrs</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="px-6"
                  size="md"
                  type="submit"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>

        <Card className="rounded-2xl border border-surface-tertiary bg-surface-secondary shadow-none">
          <Card.Content className="space-y-4 px-3 py-2">
            <div className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3">
              <span className="rounded-md bg-success/10 p-2">
                <Icon
                  className="text-success"
                  icon="solar:clock-circle-bold"
                  width={18}
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Response Time
                </p>
                <p className="text-xs text-foreground">
                  Typically 2-4 hours (Mon-Fri)
                </p>
              </div>
            </div>

            <a
              className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 transition-colors hover:bg-background"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              <span className="rounded-md bg-accent/10 p-2">
                <Icon
                  className="text-accent"
                  icon="solar:letter-bold-duotone"
                  width={18}
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Email Support
                </p>
                <p className="truncate text-xs text-accent">{SUPPORT_EMAIL}</p>
              </div>
            </a>

            <div className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3">
              <span className="rounded-md bg-warning/10 p-2">
                <Icon
                  className="text-warning"
                  icon="solar:calendar-bold-duotone"
                  width={18}
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Support Hours
                </p>
                <p className="text-xs text-foreground">
                  9AM-6PM EST, Monday-Friday
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
