"use client";

import {
  Button,
  Chip,
  cn,
  DatePicker,
  DateRangePicker,
  Dropdown,
  Input,
  Label,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import React from "react";

export type FilterType =
  | "select"
  | "multiselect"
  | "date"
  | "daterange"
  | "number"
  | "boolean";

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  color?: "default" | "accent" | "secondary" | "success" | "warning" | "danger";
}

export interface Filter {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  icon?: string;
  defaultValue?: string | number | boolean | null;
}

export interface FilterPreset {
  key: string;
  label: string;
  icon?: string;
  filters: Record<string, string | number | boolean | null>;
}

export interface FilterBarProps {
  filters: Filter[];
  values: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onReset?: () => void;
  presets?: FilterPreset[];
  onPresetSelect?: (preset: FilterPreset) => void;
  className?: string;
}

export function FilterBar({
  filters,
  values,
  onFilterChange,
  onReset,
  presets,
  onPresetSelect,
  className,
}: FilterBarProps) {
  // Check if we should display inline (for header usage) - moved to top
  const isInline = className?.includes("inline");

  const getActiveFiltersCount = () => {
    return Object.entries(values).filter(([key, value]) => {
      const filter = filters.find((f) => f.key === key);

      if (!filter) return false;

      if (filter.type === "multiselect" && Array.isArray(value)) {
        return value.length > 0;
      }

      return (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== filter.defaultValue
      );
    }).length;
  };

  const renderFilter = (filter: Filter) => {
    const value = values[filter.key];

    switch (filter.type) {
      case "select":
        return (
          <Dropdown>
            <Button
              className="w-full"
              size={isInline ? "sm" : "md"}
              variant="tertiary"
            >
              {value && filter.options?.find((o) => o.value === value)?.label
                ? filter.options.find((o) => o.value === value)?.label
                : filter.label}
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                selectedKeys={value ? new Set([value as string]) : new Set()}
                selectionMode="single"
                onAction={(key) => onFilterChange(filter.key, key)}
              >
                {filter.options?.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    id={option.value}
                    textValue={option.label}
                  >
                    <Dropdown.ItemIndicator />
                    <Label>{option.label}</Label>
                  </Dropdown.Item>
                )) || []}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        );

      case "multiselect": {
        const selectedValues = (value || []) as string[];

        return (
          <Dropdown>
            <Button size={isInline ? "sm" : "md"} variant="tertiary">
              {selectedValues && selectedValues.length > 0
                ? `${filter.label} (${selectedValues.length})`
                : filter.label}
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                selectedKeys={new Set(selectedValues)}
                selectionMode="multiple"
                onAction={(key) => {
                  const keyStr = String(key);
                  const newValues = selectedValues.includes(keyStr)
                    ? selectedValues.filter((v) => v !== keyStr)
                    : [...selectedValues, keyStr];

                  onFilterChange(filter.key, newValues);
                }}
              >
                {filter.options?.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    id={option.value}
                    textValue={option.label}
                  >
                    <Dropdown.ItemIndicator />
                    <Label>{option.label}</Label>
                  </Dropdown.Item>
                )) || []}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        );
      }

      case "date":
        return (
          <DatePicker
            className={isInline ? "w-40" : "max-w-xs"}
            value={
              value ? (parseDate(value as string) as unknown as never) : null
            }
            onChange={(date: unknown) =>
              onFilterChange(filter.key, date ? String(date) : null)
            }
          />
        );

      case "daterange":
        return (
          <DateRangePicker
            className={isInline ? "w-60" : "max-w-xs"}
            value={value as unknown as never}
            onChange={(range: unknown) => onFilterChange(filter.key, range)}
          />
        );

      case "number":
        return (
          <Input
            variant="secondary"
            className={isInline ? "w-32" : "max-w-xs"}
            placeholder={filter.placeholder}
            type="number"
            value={(value || "") as string}
            onChange={(event) => {
              const val = event.currentTarget.value;
              onFilterChange(filter.key, val ? Number(val) : undefined);
            }}
          />
        );

      case "boolean":
        return (
          <Button
            size={isInline ? "sm" : "md"}
            variant={value ? "primary" : "tertiary"}
            onPress={() => onFilterChange(filter.key, !value)}
          >
            {filter.label}
          </Button>
        );

      default:
        return null;
    }
  };

  const activeFilters = getActiveFiltersCount();

  if (isInline) {
    return (
      <div className={cn("flex gap-2 items-center flex-nowrap", className)}>
        {filters.map((filter) => (
          <React.Fragment key={filter.key}>
            {renderFilter(filter)}
          </React.Fragment>
        ))}
        {activeFilters > 0 && onReset && (
          <Button size="sm" variant="tertiary" onPress={onReset}>
            Clear ({activeFilters})
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Presets */}
      {presets && presets.length > 0 && (
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted">Quick filters:</span>
          {presets.map((preset) => (
            <Button
              key={preset.key}
              size="sm"
              variant="tertiary"
              onPress={() => onPresetSelect?.(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

      {/* Single row for filters and active status */}
      <div className="flex items-center gap-2 flex-nowrap">
        {/* Filters */}
        {filters.map((filter) => (
          <React.Fragment key={filter.key}>
            {renderFilter(filter)}
          </React.Fragment>
        ))}

        {/* Active filters indicator and reset - kept inline */}
        {activeFilters > 0 && (
          <>
            <Chip color="accent" size="sm" variant="soft">
              {activeFilters} active
            </Chip>
            {onReset && (
              <Button size="sm" variant="tertiary" onPress={onReset}>
                Reset
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
