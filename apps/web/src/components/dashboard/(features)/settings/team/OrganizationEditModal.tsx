"use client";

import { Button, Input, Modal, toast } from "@heroui/react";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/libs/convexApi";

interface OrganizationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  currentName: string;
}

export default function OrganizationEditModal({
  isOpen,
  onClose,
  currentName,
}: OrganizationEditModalProps) {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const updateOrganizationName = useMutation(
    api.core.organizations.updateOrganization,
  );

  const handleSave = async () => {
    if (!name.trim()) {
      toast.danger("Name is required", {
        description: "Please enter a valid organization name",
        timeout: 3000,
      });

      return;
    }

    if (name === currentName) {
      onClose();

      return;
    }

    setIsLoading(true);
    try {
      // Update organization name in Convex
      await updateOrganizationName({ name: name.trim() });

      toast("Organization updated", {
        description: "Organization name has been updated successfully",
        timeout: 3000,
      });

      // Close modal
      onClose();
    } catch (error) {
      toast.danger("Update failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update organization name",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">
              Edit Organization Name
            </Modal.Header>
            <Modal.Body>
              <Input
                variant="secondary"
                placeholder="Enter organization name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                isDisabled={isLoading}
                variant="tertiary"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isPending={isLoading}
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
