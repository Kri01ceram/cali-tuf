"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";

export type CalendarGridProps = {
  month?: Date;
  startDate?: Date | null;
  endDate?: Date | null;
  onDayClick?: (day: number) => void;
  onRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
};

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export default function CalendarGrid({
  month,
  startDate: controlledStartDate,
  endDate: controlledEndDate,
  onDayClick,
  onRangeChange,
  className,
}: CalendarGridProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const visibleMonth = month ?? today;

  const monthStart = useMemo(() => startOfMonth(visibleMonth), [visibleMonth]);
  const monthEnd = useMemo(() => endOfMonth(visibleMonth), [visibleMonth]);
  const gridStart = useMemo(
    () => startOfWeek(monthStart, { weekStartsOn: 1 }),
    [monthStart]
  );
  const gridEnd = useMemo(
    () => endOfWeek(monthEnd, { weekStartsOn: 1 }),
    [monthEnd]
  );
  const dates = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd]
  );

  const isControlled =
    controlledStartDate !== undefined || controlledEndDate !== undefined;

  const [uncontrolledStartDate, setUncontrolledStartDate] =
    useState<Date | null>(null);
  const [uncontrolledEndDate, setUncontrolledEndDate] = useState<Date | null>(null);

  const startDate = isControlled ? (controlledStartDate ?? null) : uncontrolledStartDate;
  const endDate = isControlled ? (controlledEndDate ?? null) : uncontrolledEndDate;

  const sundayIndex = 6;

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
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS_OF_WEEK.map((label, index) => (
          <div
            key={label}
            className={
              "h-7 rounded-md bg-black/[.03] text-center text-[11px] font-semibold leading-7 tracking-wide " +
              (index === sundayIndex ? "text-[#2ea3f2]" : "text-zinc-700")
            }
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
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
          const isOutsideMonth = !isSameMonth(date, monthStart);
          const isSunday = getDay(date) === 0;

          const buttonClassName =
            "aspect-square w-full rounded-lg p-1.5 text-left text-xs font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.10] sm:p-2 sm:text-sm" +
            (isOutsideMonth ? " text-zinc-400" : " text-foreground") +
            (isSunday && !isEndpoint && !isInRange
              ? " text-[#2ea3f2]"
              : "") +
            (isInRange
              ? " bg-[#2ea3f2]/10 hover:bg-[#2ea3f2]/15"
              : " bg-black/[.02] hover:bg-black/[.04]");

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
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2ea3f2] text-xs font-semibold text-white sm:h-8 sm:w-8 sm:text-sm">
                  {day}
                </span>
              ) : isToday ? (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full font-semibold text-foreground ring-2 ring-[#2ea3f2]/35 sm:h-8 sm:w-8">
                  {day}
                </span>
              ) : (
                day
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
