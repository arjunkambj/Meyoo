"use client";

import { Checkbox, cn, Input, ScrollShadow } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";

interface Item {
  id: string;
  label?: string;
  name?: string;
  icon: string;
  iconColor?: string;
  description?: string;
}

interface ItemSelectorProps {
  items: Item[];
  selectedIds: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onItemToggle: (id: string, checked: boolean) => void;
  placeholder: string;
  className?: string;
}

export function ItemSelector({
  items,
  selectedIds,
  searchQuery,
  onSearchChange,
  onItemToggle,
  placeholder,
  className,
}: ItemSelectorProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <div className={cn("px-4 overflow-hidden", className)}>
      <Input
        className="mb-4"
        placeholder={placeholder}
                value={searchQuery}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />
      <ScrollShadow hideScrollBar className="h-[420px]">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-2 border border-surface-tertiary rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Checkbox
                isSelected={selectedSet.has(item.id)}
                value={item.id}
                onChange={(checked) => onItemToggle(item.id, checked)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={item.iconColor}
                      icon={item.icon}
                      width={16}
                    />
                    <span className="text-sm font-medium">
                      {item.label || item.name}
                    </span>
                  </div>
                  {item.description && (
                    <span className="text-xs text-foreground ml-6">
                      {item.description}
                    </span>
                  )}
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
