"use client";

import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { sidebarOpenAtom } from "@/store/atoms";

export default function SidebarToggle() {
  const isOpen = useAtomValue(sidebarOpenAtom);
  const setIsOpen = useSetAtom(sidebarOpenAtom);

  const handleToggle = useCallback(() => {
    setIsOpen((prev: boolean) => !prev);
  }, [setIsOpen]);

  const tooltipContent = useMemo(
    () => (isOpen ? "Close sidebar" : "Open sidebar"),
    [isOpen]
  );

  const iconContent = useMemo(
    () => (
      <Icon
        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        icon="solar:sidebar-minimalistic-bold-duotone"
        width={22}
      />
    ),
    [isOpen]
  );

  return (
    <Tooltip closeDelay={0} delay={300}>
      <Tooltip.Trigger>
        <Button
          isIconOnly           className="text-foreground hover:text-foreground transition-colors"
          size="sm"
          variant="tertiary"
          onPress={handleToggle}
        >
          {iconContent}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content placement="bottom">{tooltipContent}</Tooltip.Content>
    </Tooltip>
  );
}
