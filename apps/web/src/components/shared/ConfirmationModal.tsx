"use client";

import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "danger" | "warning" | "success" | "primary";
  icon?: string;
  iconColor?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "danger",
  icon = "solar:trash-bin-bold-duotone",
  iconColor = "text-danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container size="md">
          <Modal.Dialog>
        {({ close }) => (
          <>
            <Modal.Header className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className={`${iconColor}`}>
                  <Icon icon={icon} width={24} />
                </div>
                <span>{title}</span>
              </div>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted">{message}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                isDisabled={isLoading}
                variant="tertiary"
                onPress={close}
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmColor === "danger" ? "danger" : "primary"}
                isPending={isLoading}
                onPress={handleConfirm}
              >
                {confirmText}
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
