"use client";

import { Drawer } from "@heroui/react";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks";
import { sidebarOpenAtom } from "@/store/atoms";

import SidebarContent from "./SidebarContent";

const Sidebar = React.memo(({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleResizeLogic = useCallback(() => {
    const mobile = window.innerWidth < 768;

    setIsMobile(mobile);

    if (mobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [setIsOpen]);

  const handleResize = useDebounce(handleResizeLogic, 150);

  const handleDrawerOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
    },
    [setIsOpen]
  );

  useEffect(() => {
    setIsClient(true);

    handleResizeLogic();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, handleResizeLogic]);

  const sidebarContent = useMemo(
    () => <SidebarContent onClose={handleClose} />,
    [handleClose]
  );

  const drawerClasses = useMemo(
    () =>
      // Match Settings drawer styling: solid surface, subtle border, no shadow padding
      "max-w-66 w-66 bg-surface border-r border-surface-tertiary shadow-none p-0",
    []
  );
  const sectionClasses = useMemo(
    () => `h-full ${className || ""}`,
    [className]
  );

  const drawerContent = useMemo(
    () => (
      <Drawer
      >
        <Drawer.Backdrop
          isOpen={isOpen}
          variant="transparent"
          onOpenChange={handleDrawerOpenChange}
        >
          <Drawer.Content className={drawerClasses} placement="left">
            <Drawer.Dialog>
              {({ close }) => (
                <Drawer.Body className="p-0 rounded-none">
                  <SidebarContent onClose={close} />
                </Drawer.Body>
              )}
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    ),
    [drawerClasses, isOpen, handleDrawerOpenChange]
  );

  if (!isClient) {
    return <section className={sectionClasses}>{sidebarContent}</section>;
  }

  return (
    <section className={sectionClasses}>
      {!isMobile && sidebarContent}
      {isMobile && drawerContent}
    </section>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
