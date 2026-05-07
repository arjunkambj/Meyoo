"use client";

import { Button, Input, Popover, RangeCalendar } from "@heroui/react";
import {
  type CalendarDate,
  type DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RangeCalendarStateContext, useLocale } from "react-aria-components";
import type { AnalyticsDateRange } from "@repo/types";
import {
  DATE_RANGE_PRESETS,
  DEFAULT_DATE_RANGE_PRESET_KEYS,
  type CalendarDateRange,
  type DateRangePresetKey,
  calendarDateToString,
  getPresetRange,
} from "@/libs/dateRangePresets";

interface RangeValue<T> {
  start: T;
  end: T;
}

interface GlobalDateRangePickerProps {
  value?: CalendarDateRange;
  preset?: DateRangePresetKey | null;
  onAnalyticsChange?: (range: AnalyticsDateRange) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  placeholder?: string;
  presets?: DateRangePresetKey[];
  defaultPreset?: DateRangePresetKey;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
}

const formatSingleDate = (date?: CalendarDate): string => {
  if (!date) return "";
  try {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return jsDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date.toString();
  }
};

const formatRangeLabel = (range?: CalendarDateRange): string => {
  if (!range) return "Select date range";
  const startLabel = formatSingleDate(range.start);
  const endLabel = formatSingleDate(range.end);
  return `${startLabel} – ${endLabel}`;
};

const toAnalyticsRange = (
  range: CalendarDateRange,
  preset?: string | null,
): AnalyticsDateRange => ({
  startDate: calendarDateToString(range.start),
  endDate: calendarDateToString(range.end),
  preset: preset ?? undefined,
});

type CalendarDateConvertible = DateValue & {
  toCalendarDate: () => CalendarDate;
};

const isCalendarDateConvertible = (
  value: DateValue,
): value is CalendarDateConvertible => {
  return (
    typeof value === "object" &&
    value !== null &&
    "toCalendarDate" in value &&
    typeof (value as CalendarDateConvertible).toCalendarDate === "function"
  );
};

function toCalendarDateValue(value: DateValue): CalendarDate {
  if (isCalendarDateConvertible(value)) {
    return value.toCalendarDate();
  }
  return value as CalendarDate;
}

const areCalendarRangesEqual = (
  a?: CalendarDateRange | null,
  b?: CalendarDateRange | null,
): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    calendarDateToString(a.start) === calendarDateToString(b.start) &&
    calendarDateToString(a.end) === calendarDateToString(b.end)
  );
};

const RangeCalendarMonthHeading = ({ offset = 0 }: { offset?: number }) => {
  const state = useContext(RangeCalendarStateContext);
  const { locale } = useLocale();
  const monthDate = state?.visibleRange.start.add({ months: offset });

  if (!monthDate) return null;

  return (
    <span className="text-xs font-semibold text-default">
      {new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(monthDate.toDate(getLocalTimeZone()))}
    </span>
  );
};

export default function GlobalDateRangePicker({
  value,
  preset,
  onAnalyticsChange,
  size = "md",
  className,
  label,
  placeholder = "Select date range",
  presets = DEFAULT_DATE_RANGE_PRESET_KEYS,
  defaultPreset,
  minDate,
  maxDate,
}: GlobalDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] =
    useState<DateRangePresetKey | null>(() => {
      if (preset !== undefined) return preset;
      if (defaultPreset) return defaultPreset;
      return presets[0] ?? null;
    });

  const initialRange = useMemo(() => {
    if (value) return value;
    if (selectedPreset) return getPresetRange(selectedPreset);
    if (defaultPreset) return getPresetRange(defaultPreset);
    if (presets.length > 0) {
      const fallbackPreset = presets[0] ?? "last_30_days";
      return getPresetRange(fallbackPreset);
    }
    return getPresetRange("last_30_days");
  }, [value, selectedPreset, defaultPreset, presets]);

  const resolvePresetForRange = useCallback(
    (range: CalendarDateRange) => {
      const match = presets.find((presetKey) =>
        areCalendarRangesEqual(getPresetRange(presetKey), range),
      );
      return match ?? null;
    },
    [presets],
  );

  const [internalRange, setInternalRange] =
    useState<CalendarDateRange>(initialRange);
  const [draftRange, setDraftRange] = useState<CalendarDateRange>(initialRange);
  const hasEmittedInitial = useRef(false);

  const emitChange = useCallback(
    (range: CalendarDateRange, nextPreset?: string | null) => {
      if (onAnalyticsChange) {
        onAnalyticsChange(toAnalyticsRange(range, nextPreset ?? undefined));
      }
    },
    [onAnalyticsChange],
  );

  useEffect(() => {
    if (!value) {
      return;
    }
    if (
      areCalendarRangesEqual(value, internalRange) &&
      areCalendarRangesEqual(value, draftRange)
    ) {
      return;
    }
    setInternalRange(value);
    setDraftRange(value);
    if (preset === undefined) {
      setSelectedPreset(resolvePresetForRange(value));
    }
  }, [value, internalRange, draftRange, preset, resolvePresetForRange]);

  useEffect(() => {
    if (preset === undefined || preset === selectedPreset) {
      return;
    }
    setSelectedPreset(preset);
    if (!value && preset) {
      const presetRange = getPresetRange(preset);
      setInternalRange(presetRange);
      setDraftRange(presetRange);
    }
  }, [preset, selectedPreset, value]);

  const appliedRange = value ?? internalRange;

  useEffect(() => {
    if (value || hasEmittedInitial.current) {
      return;
    }

    hasEmittedInitial.current = true;
    emitChange(internalRange, selectedPreset ?? null);
  }, [value, internalRange, selectedPreset, emitChange]);

  const handlePresetChange = useCallback(
    (key: DateRangePresetKey) => {
      const presetRange = getPresetRange(key);
      setSelectedPreset(key);
      setInternalRange(presetRange);
      setDraftRange(presetRange);
      emitChange(presetRange, key);
      setIsOpen(false);
    },
    [emitChange],
  );

  const handleCalendarChange = useCallback(
    (range: RangeValue<DateValue>) => {
      if (!range?.start) return;

      const start = toCalendarDateValue(range.start);
      const end = range.end ? toCalendarDateValue(range.end) : start;

      const nextRange: CalendarDateRange = { start, end };
      setDraftRange(nextRange);

      // Clear preset when manually selecting dates
      if (preset === undefined) {
        setSelectedPreset(null);
      }

      // Auto-apply when both dates are selected
      if (range.end) {
        setInternalRange(nextRange);
        emitChange(nextRange, null);
        setIsOpen(false);
      }
    },
    [preset, emitChange],
  );

  const handleInputChange = useCallback(
    (field: "start" | "end", nextValue: string) => {
      if (!nextValue || nextValue.length < 10) return;
      try {
        const parsed = parseDate(nextValue);
        const nextRange =
          field === "start"
            ? { start: parsed, end: draftRange.end }
            : { start: draftRange.start, end: parsed };
        const normalizedRange =
          nextRange.start.compare(nextRange.end) <= 0
            ? nextRange
            : { start: nextRange.end, end: nextRange.start };
        setDraftRange(normalizedRange);
        setInternalRange(normalizedRange);
        // Clear preset when manually typing dates
        if (preset === undefined) {
          setSelectedPreset(null);
        }
        emitChange(normalizedRange, null);
      } catch (error) {
        console.error("Invalid date input", error);
      }
    },
    [draftRange, preset, emitChange],
  );

  const presetItems = useMemo(() => {
    return presets.map((key) => {
      const presetDefinition = DATE_RANGE_PRESETS[key];
      return {
        key,
        label: presetDefinition?.label ?? key,
      };
    });
  }, [presets]);

  useEffect(() => {
    if (isOpen) {
      setDraftRange(appliedRange);
      setSelectedPreset((current) => {
        if (preset !== undefined) return current;
        return resolvePresetForRange(appliedRange);
      });
    }
  }, [isOpen, appliedRange, preset, resolvePresetForRange]);

  const triggerLabel = useMemo(() => {
    if (selectedPreset) {
      const presetDefinition = DATE_RANGE_PRESETS[selectedPreset];
      if (presetDefinition?.label) {
        return presetDefinition.label;
      }
    }
    return formatRangeLabel(appliedRange);
  }, [appliedRange, selectedPreset]);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className={className} size={size} variant="outline">
        {label ? (
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted">{label}</span>
            <span className="text-sm font-medium">{triggerLabel}</span>
          </div>
        ) : (
          <span className="text-sm font-medium">
            {triggerLabel || placeholder}
          </span>
        )}
      </Button>
      <Popover.Content
        className="w-auto max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl p-0"
        placement="bottom start"
      >
        <Popover.Dialog className="p-0">
          <div className="flex">
            <div className="w-32 shrink-0 border-r border-surface-tertiary bg-surface-secondary p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-muted">
                Quick ranges
              </p>
              <div className="flex flex-col gap-0.5">
                {presetItems.map((presetItem) => {
                  const isActive = selectedPreset === presetItem.key;
                  return (
                    <Button
                      key={presetItem.key}
                      size="sm"
                      variant={isActive ? "secondary" : "tertiary"}
                      className="h-7 justify-start bg-transparent px-3 py-0 text-xs"
                      onPress={() => handlePresetChange(presetItem.key)}
                    >
                      {presetItem.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="w-[26.5rem] shrink-0 bg-surface p-3">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Input
                  variant="secondary"
                  className="h-9 text-sm"
                  placeholder="Start date"
                  value={calendarDateToString(draftRange.start)}
                  onChange={(event) => {
                    const input = event.currentTarget.value;
                    handleInputChange("start", input);
                  }}
                />
                <Input
                  variant="secondary"
                  className="h-9 text-sm"
                  placeholder="End date"
                  value={calendarDateToString(draftRange.end)}
                  onChange={(event) => {
                    const input = event.currentTarget.value;
                    handleInputChange("end", input);
                  }}
                />
              </div>

              <RangeCalendar
                aria-label="Date range"
                className="w-full max-w-none overflow-visible [&_.range-calendar__cell-button]:!size-6 [&_.range-calendar__cell-button]:!text-xs [&_.range-calendar__cell]:!my-0 [&_.range-calendar__grid]:!w-[11.75rem] [&_.range-calendar__header-cell]:!pb-1 [&_.range-calendar__header-cell]:!text-[11px] [&_.range-calendar__header]:!pb-2 [&_.range-calendar__nav-button-icon]:!size-3.5 [&_.range-calendar__nav-button]:!size-5"
                firstDayOfWeek="mon"
                minValue={minDate}
                maxValue={maxDate ?? today(getLocalTimeZone())}
                visibleDuration={{ months: 2 }}
                value={draftRange}
                onChange={handleCalendarChange}
              >
                <RangeCalendar.Heading className="sr-only" />
                <div className="flex gap-2">
                  <div className="w-[11.75rem] shrink-0">
                    <RangeCalendar.Header>
                      <RangeCalendar.NavButton slot="previous" />
                      <RangeCalendarMonthHeading />
                      <div className="size-5" />
                    </RangeCalendar.Header>
                    <RangeCalendar.Grid>
                      <RangeCalendar.GridHeader>
                        {(day) => (
                          <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                        )}
                      </RangeCalendar.GridHeader>
                      <RangeCalendar.GridBody>
                        {(date) => <RangeCalendar.Cell date={date} />}
                      </RangeCalendar.GridBody>
                    </RangeCalendar.Grid>
                  </div>

                  <div className="w-[11.75rem] shrink-0">
                    <RangeCalendar.Header>
                      <div className="size-5" />
                      <RangeCalendarMonthHeading offset={1} />
                      <RangeCalendar.NavButton slot="next" />
                    </RangeCalendar.Header>
                    <RangeCalendar.Grid offset={{ months: 1 }}>
                      <RangeCalendar.GridHeader>
                        {(day) => (
                          <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                        )}
                      </RangeCalendar.GridHeader>
                      <RangeCalendar.GridBody>
                        {(date) => <RangeCalendar.Cell date={date} />}
                      </RangeCalendar.GridBody>
                    </RangeCalendar.Grid>
                  </div>
                </div>
                <RangeCalendar.YearPickerGrid>
                  <RangeCalendar.YearPickerGridBody>
                    {({ year }) => (
                      <RangeCalendar.YearPickerCell year={year} />
                    )}
                  </RangeCalendar.YearPickerGridBody>
                </RangeCalendar.YearPickerGrid>
              </RangeCalendar>
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
