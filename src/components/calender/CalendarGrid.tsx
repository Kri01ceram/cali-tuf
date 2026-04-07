"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isAfter,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { useState } from "react";

export type CalendarGridProps = {
  startDate?: Date | null;
  endDate?: Date | null;
  onDayClick?: (day: number) => void;
  onRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
};

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function CalendarGrid({
  startDate: controlledStartDate,
  endDate: controlledEndDate,
  onDayClick,
  onRangeChange,
  className,
}: CalendarGridProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const dates = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isControlled =
    controlledStartDate !== undefined || controlledEndDate !== undefined;

  const [uncontrolledStartDate, setUncontrolledStartDate] =
    useState<Date | null>(null);
  const [uncontrolledEndDate, setUncontrolledEndDate] = useState<Date | null>(null);

  const startDate = isControlled ? (controlledStartDate ?? null) : uncontrolledStartDate;
  const endDate = isControlled ? (controlledEndDate ?? null) : uncontrolledEndDate;

  // date-fns getDay: 0=Sun..6=Sat; convert to Mon=0..Sun=6
  const leadingEmptyCells = (getDay(monthStart) + 6) % 7;
  const trailingEmptyCells =
    (7 - ((leadingEmptyCells + dates.length) % 7)) % 7;

  function setRange(nextStart: Date | null, nextEnd: Date | null) {
    if (!isControlled) {
      setUncontrolledStartDate(nextStart);
      setUncontrolledEndDate(nextEnd);
    }
    onRangeChange?.(nextStart, nextEnd);
  }

  function handleDateClick(date: Date) {
    // First click -> start
    // Second click -> end (swap if earlier)
    // Third click -> reset selection (start a new selection)
    if (startDate === null || (startDate !== null && endDate !== null)) {
      setRange(date, null);
      return;
    }

    // startDate is set and endDate is not set
    if (isBefore(date, startDate)) {
      setRange(date, startDate);
      return;
    }

    setRange(startDate, date);
  }

  return (
    <div className={className ?? ""}>
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((label) => (
          <div
            key={label}
            className="h-7 rounded bg-black/[.04] text-center text-xs font-medium leading-7 text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {Array.from({ length: leadingEmptyCells }, (_, index) => (
          <div
            key={`leading-empty-${index}`}
            aria-hidden="true"
            className="aspect-square w-full rounded-lg border border-transparent"
          />
        ))}

        {dates.map((date) => {
          const day = date.getDate();
          const isStart = startDate ? isSameDay(date, startDate) : false;
          const isEnd = endDate ? isSameDay(date, endDate) : false;
          const isInRange =
            startDate && endDate
              ? isAfter(date, startDate) && isBefore(date, endDate)
              : false;
          const isEndpoint = isStart || isEnd;

          const buttonClassName =
            "aspect-square w-full rounded-lg border border-black/[.06] p-2 text-left text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12] dark:border-white/[.10] dark:focus-visible:ring-white/[.18]" +
            (isInRange
              ? " bg-blue-600/10 hover:bg-blue-600/15 dark:bg-blue-400/15 dark:hover:bg-blue-400/20"
              : " bg-black/[.02] hover:bg-black/[.04] dark:bg-white/[.04] dark:hover:bg-white/[.06]");

          return (
          <button
            key={format(date, "yyyy-MM-dd")}
            type="button"
            onClick={() => {
              handleDateClick(date);
              onDayClick?.(day);
            }}
            className={buttonClassName}
            aria-label={`Day ${day}`}
            aria-pressed={isEndpoint || isInRange}
          >
            {isEndpoint ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {day}
              </span>
            ) : (
              day
            )}
          </button>
          );
        })}

        {Array.from({ length: trailingEmptyCells }, (_, index) => (
          <div
            key={`empty-${index}`}
            aria-hidden="true"
            className="aspect-square w-full rounded-lg border border-transparent"
          />
        ))}
      </div>
    </div>
  );
}
