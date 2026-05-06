"use client";

import { Button, Input, Modal, TextArea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { useCreateIntegrationRequest } from "@/hooks";

interface RequestIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RequestIntegrationModal({
  isOpen,
  onClose,
  onSuccess,
}: RequestIntegrationModalProps) {
  const { createRequest } = useCreateIntegrationRequest();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platformName: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Simplified schema: only platformName and description

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.platformName.trim()) {
      errors.platformName = "Platform name is required";
    } else if (formData.platformName.length < 2) {
      errors.platformName = "Platform name is too short";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Please provide more details (min 20 characters)";
    }

    // No additional fields required in simple schema

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createRequest({
        platformName: formData.platformName,
        description: formData.description,
      });

      if (result.success) {
        // Reset form
        setFormData({ platformName: "", description: "" });
        setFormErrors({});

        onSuccess?.();
        onClose();
      } else {
        setError(result.error || "Failed to submit request");
      }
    } catch (_err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };

        delete newErrors[field];

        return newErrors;
      });
    }
    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form on close
      setFormData({ platformName: "", description: "" });
      setFormErrors({});
      setError(null);
      onClose();
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <Modal.Container scroll="inside" size="lg">
          <Modal.Dialog className="bg-surface-secondary">
        {() => (
          <>
            <Modal.Header className="flex items-center gap-2">
              <Icon
                className="text-accent"
                icon="solar:add-square-bold-duotone"
                width={24}
              />
              <span>Request New Integration</span>
            </Modal.Header>

            <Modal.Body className="bg-surface-secondary gap-6 pb-6">
              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
                  <Icon
                    className="text-danger mt-0.5"
                    icon="solar:danger-triangle-bold"
                    width={18}
                  />
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              <Input
                required
                                                disabled={isSubmitting}
                                                                placeholder="e.g., QuickBooks, Klaviyo, TikTok Shop"
                                value={formData.platformName}
                onChange={(e) =>
                  handleInputChange("platformName", e.target.value)
                }
              />

              <TextArea
                required
                                                disabled={isSubmitting}
                placeholder="Briefly describe what this platform does and why you need it"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />

              {/* Simplified form: no use case, impact, priority or category */}

              <div className="bg-surface-secondary rounded-lg p-3 flex items-start gap-2">
                <Icon
                  className="text-muted mt-0.5"
                  icon="solar:info-circle-bold"
                  width={18}
                />
                <div className="text-xs text-muted">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-0.5">
                    <li>• We&apos;ll review your request within 48 hours</li>
                    <li>• Popular requests get prioritized in our roadmap</li>
                    <li>
                      • You&apos;ll be notified when the integration is
                      available
                    </li>
                  </ul>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
               
                isDisabled={isSubmitting}
                variant="tertiary"
                onPress={handleClose}
              >
                Cancel
              </Button>
              <Button variant="primary"
               
                isPending={isSubmitting}
               
                onPress={handleSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </Modal.Footer>
          </>
        )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
