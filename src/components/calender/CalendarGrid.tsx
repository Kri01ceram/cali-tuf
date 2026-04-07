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
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {DAYS_OF_WEEK.map((label) => (
          <div
            key={label}
            className="h-6 rounded bg-black/[.04] text-center text-[11px] font-semibold leading-6 text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300 sm:h-7 sm:text-xs sm:leading-7"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
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
          const isToday = isSameDay(date, today);
          const isInRange =
            startDate && endDate
              ? isAfter(date, startDate) && isBefore(date, endDate)
              : false;
          const isEndpoint = isStart || isEnd;

          const buttonClassName =
            "aspect-square w-full rounded-lg border border-black/[.06] p-1.5 text-left text-xs font-medium text-foreground shadow-sm shadow-black/[.03] transition-colors transition-shadow duration-150 ease-out hover:border-black/[.12] hover:shadow-black/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12] active:shadow-black/[.03] dark:border-white/[.10] dark:shadow-white/[.02] dark:hover:border-white/[.18] dark:hover:shadow-white/[.05] dark:focus-visible:ring-white/[.18] sm:p-2 sm:text-sm" +
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
            aria-current={isToday ? "date" : undefined}
          >
            {isEndpoint ? (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white sm:h-8 sm:w-8 sm:text-sm">
                {day}
              </span>
            ) : isToday ? (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full font-semibold text-foreground ring-2 ring-blue-600/35 dark:ring-blue-400/35 sm:h-8 sm:w-8">
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
