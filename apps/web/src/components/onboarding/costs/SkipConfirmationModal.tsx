"use client";

import { Button, Modal } from "@heroui/react";
import React from "react";

interface SkipConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SkipConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
}: SkipConfirmationModalProps) {
  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">
              Skip cost setup?
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-muted">
                You can add costs later, but profit calculations won&apos;t be available
                until you do.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onPress={onCancel}>
                Cancel
              </Button>
              <Button variant="primary" onPress={onConfirm}>
                Skip Setup
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
