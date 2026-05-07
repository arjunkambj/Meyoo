"use client";

import { Button, Input, ListBox, Select, TextArea, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import type React from "react";
import { useState } from "react";

const contactReasons = [
  { value: "sales", label: "Sales Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "feedback", label: "Product Feedback" },
  { value: "other", label: "Other" },
];

const CONTACT_EMAIL = "hey@meyoo.io";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    reason: "sales",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const body = [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        formData.company ? `Company: ${formData.company}` : null,
        "",
        formData.message,
      ]
        .filter(Boolean)
        .join("\n");

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Contact form: ${formData.reason}`,
      )}&body=${encodeURIComponent(body)}`;
      setIsSubmitted(true);
      toast("Message ready", {
        description: "Your email app should open with the message.",
        timeout: 5000,
      });

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          reason: "sales",
          message: "",
        });
      }, 5000);
    } catch {
      toast.danger("Error", {
        description: "Something went wrong. Please try again.",
        timeout: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Icon
            className="w-8 h-8 text-success"
            icon="solar:check-circle-bold-duotone"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-muted">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          variant="secondary"
          required
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Input
          variant="secondary"
          required
          placeholder="john@company.com"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          variant="secondary"
          placeholder="Acme Inc."
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />
        <Select
          variant="secondary"
          isRequired
          placeholder="Select a reason"
          value={formData.reason || null}
          onChange={(key) => handleChange("reason", key?.toString() || "")}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {contactReasons.map((reason) => (
                <ListBox.Item
                  key={reason.value}
                  id={reason.value}
                  textValue={reason.label}
                >
                  {reason.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <TextArea
        required
        placeholder="Tell us how we can help you..."
        value={formData.message}
        onChange={(e) => handleChange("message", e.target.value)}
      />

      <Button
        variant="primary"
        className="w-full font-semibold"
        isPending={isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
