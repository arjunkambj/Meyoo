"use client";

import { Button, Modal, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { setSettingsPendingAtom } from "@/store/atoms";

import { api } from "@/libs/convexApi";

export default function LeaveOrganizationButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const leaveOrg = useMutation(api.core.teams.leaveOrganization);
  const router = useRouter();
  const setPending = useSetAtom(setSettingsPendingAtom);

  const onConfirm = async () => {
    setLoading(true);
    setPending(true);
    try {
      const res = await leaveOrg({});
      if (res.success) {
        toast("Left organization successfully");
        // Redirect to onboarding
        router.push("/onboarding/shopify");
      } else {
        toast.danger(res.message);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to leave organization";
      toast.danger(msg);
    } finally {
      setLoading(false);
      setOpen(false);
      // Keep pending while redirecting only if success path triggered a navigation.
      // If we got here due to error (no redirect), clear pending.
      setPending(false);
    }
  };

  return (
    <>
      <Button variant="danger"
       
       
        onPress={() => setOpen(true)}
      >
        Leave Organization
      </Button>

      <Modal>
        <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
          <Modal.Container placement="center" size="md">
            <Modal.Dialog>
          {({ close }) => (
            <>
              <Modal.Header className="flex items-center gap-2">
                <Icon
                  className="text-danger"
                  icon="solar:warning-triangle-bold-duotone"
                  width={20}
                />
                <span>Leave Organization</span>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-foreground">
                  Are you sure you want to leave this organization? You will
                  lose access to its data. A new personal organization will be
                  created for you, like a fresh signup.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="danger" isPending={loading} onPress={onConfirm}>
                  Yes, Leave
                </Button>
              </Modal.Footer>
            </>
          )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
