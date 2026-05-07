"use client";

import { Button, InputGroup, Modal, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Team } from "@stackframe/stack";
import { type FormEvent, useMemo, useState } from "react";

type TeamInviteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null | undefined;
};

const getInviteCallbackUrl = () =>
  `${window.location.origin}/handler/team-invitation`;

export default function TeamInviteModal({
  isOpen,
  onClose,
  team,
}: TeamInviteModalProps) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const canInvite = normalizedEmail.length > 0 && !isInviting && !!team;

  const close = () => {
    if (isInviting) return;
    setEmail("");
    onClose();
  };

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!team || !normalizedEmail) return;

    setIsInviting(true);
    try {
      await team.inviteUser({
        email: normalizedEmail,
        callbackUrl: getInviteCallbackUrl(),
      });
      toast.success(`Invitation sent to ${normalizedEmail}`);
      setEmail("");
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send invitation";
      toast.danger(message);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && close()}>
        <Modal.Container placement="center" size="md">
          <Modal.Dialog>
            {() => (
              <form onSubmit={handleInvite}>
                <Modal.Header className="font-medium px-1">
                  Invite Team Member
                </Modal.Header>
                <Modal.Body className="pt-3 pb-4 px-1">
                  <InputGroup fullWidth variant="secondary">
                    <InputGroup.Prefix>
                      <Icon icon="solar:letter-bold-duotone" width={18} />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      autoFocus
                      disabled={isInviting}
                      placeholder="teammate@example.com"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    isDisabled={isInviting}
                    type="button"
                    variant="tertiary"
                    onPress={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    isDisabled={!canInvite}
                    isPending={isInviting}
                    type="submit"
                    variant="primary"
                  >
                    Send Invite
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
