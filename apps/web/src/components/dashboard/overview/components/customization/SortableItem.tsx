"use client";

import { Badge, Button, cn } from "@heroui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";

interface SortableItemProps {
  id: string;
  label: string;
  icon: string;
  type: "kpi" | "widget";
  isPinned?: boolean;
  onRemove: (id: string) => void;
}

export function SortableItem({
  id,
  label,
  icon,
  type: _type,
  isPinned,
  onRemove,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-between p-1.5 rounded-lg border border-200/50 bg-surface-secondary  mb-1.5",
        isDragging && "opacity-50"
      )}
      style={style}
    >
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 flex-shrink-0"
        >
          <Icon
            className="text-muted"
            icon="solar:hamburger-menu-linear"
            width={16}
          />
        </div>
        <Icon className="flex-shrink-0" icon={icon} width={14} />
        <span className="text-xs truncate text-muted">{label}</span>
        {isPinned && (
          <Badge
            className="flex-shrink-0"
            size="sm"
            variant="soft"
          >
            Pinned
          </Badge>
        )}
      </div>
      <Button
        isIconOnly
        className="flex-shrink-0 min-w-unit-6 w-unit-6 h-unit-6"
        size="sm"
        variant="tertiary"
        onPress={() => onRemove(id)}
      >
        <Icon icon="solar:close-circle-linear" width={14} />
      </Button>
    </div>
  );
}
