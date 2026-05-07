"use client";

import { cn } from "@heroui/react";
import { Accordion } from "@heroui/react/accordion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: Route;
  items?: SidebarItem[];
  isCategoryOpen?: boolean;
};

export type SidebarMenuProps = {
  items: SidebarItem[];
  className?: string;
};

const SidebarMenu = ({ items, className }: SidebarMenuProps) => {
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string) => {
      return pathname === href;
    },
    [pathname]
  );

  // Memoize defaultExpandedKeys to prevent hydration issues
  const defaultExpandedKeys = useMemo(() => {
    return items
      .filter((item) => item.isCategoryOpen !== false)
      .map((item) => item.key);
  }, [items]);

  const renderMenuItem = useCallback(
    (item: SidebarItem) => {
      if (!item.href) return null;

      const active = isActive(item.href);

      return (
        <Link
          key={item.key}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
            "no-underline group",
            active
              ? "bg-accent/20 text-foreground font-semibold"
              : "text-foreground hover:text-foreground hover:bg-surface-tertiary/70"
          )}
          href={item.href}
          prefetch={true}
        >
          {item.icon && (
            <Icon
              aria-hidden
              className={cn(
                "shrink-0 transition-all w-5 h-5",
                active
                  ? "text-foreground"
                  : "text-foreground group-hover:text-foreground"
              )}
              icon={item.icon}
            />
          )}
          <span className="text-sm font-medium truncate">{item.title}</span>
        </Link>
      );
    },
    [isActive]
  );

  const renderCategory = useCallback(
    (category: SidebarItem) => (
      <Accordion.Item
        key={category.key}
        className="border-none"
        classNames={{
          base: "!border-none bg-transparent shadow-none",
          heading: "!border-none bg-transparent",
        }}
        id={category.key}
      >
        <Accordion.Heading>
          <Accordion.Trigger className="flex h-10 w-full items-center justify-between gap-2.5 px-3">
            <div className="flex items-center gap-2.5">
            {category.icon && (
              <Icon
                aria-hidden
                className="text-foreground"
                icon={category.icon}
                width={18}
              />
            )}
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              {category.title}
            </span>
            </div>
            <Accordion.Indicator>
              <Icon
                aria-hidden
                className="transition-transform"
                icon="solar:alt-arrow-right-linear"
                width={16}
              />
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body className="p-0">
            <div className="space-y-1 overflow-hidden mt-1">
              {category.items?.map(renderMenuItem)}
            </div>
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    ),
    [renderMenuItem]
  );

  const accordionContent = useMemo(
    () => (
      <Accordion
        className="gap-4 divide-y-0 bg-transparent px-0 [&_[role=separator]]:hidden"
        allowsMultipleExpanded
        defaultExpandedKeys={defaultExpandedKeys}
        hideSeparator
        itemClasses={{
          base: "!border-none bg-transparent shadow-none",
          content: "bg-transparent p-0",
          heading: "!border-none bg-transparent",
          trigger: "bg-transparent hover:bg-transparent",
        }}
      >
        {items.map(renderCategory)}
      </Accordion>
    ),
    [defaultExpandedKeys, items, renderCategory]
  );

  return <nav className={cn("w-full", className)}>{accordionContent}</nav>;
};

export default SidebarMenu;
