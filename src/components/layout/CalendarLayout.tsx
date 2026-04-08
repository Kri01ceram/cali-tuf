"use client";

import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import CalendarGrid from "../calender/CalendarGrid";
import HeroImage from "../hero/HeroImage";
import NotesPanel from "../notes/NotesPanel";

export default function CalendarLayout() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [monthDirection, setMonthDirection] = useState<1 | -1>(1);

  const monthLabel = useMemo(
    () => format(visibleMonth, "MMMM yyyy"),
    [visibleMonth]
  );

  const handleRangeChange = useCallback((nextStart: Date | null, nextEnd: Date | null) => {
    setStartDate(nextStart);
    setEndDate(nextEnd);
  }, []);

  const goPrevMonth = useCallback(() => {
    setMonthDirection(-1);
    setVisibleMonth((current) => startOfMonth(subMonths(current, 1)));
  }, []);

  const goNextMonth = useCallback(() => {
    setMonthDirection(1);
    setVisibleMonth((current) => startOfMonth(addMonths(current, 1)));
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 text-foreground sm:p-8">
      <div className="relative w-full max-w-[980px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(100%-18px)] h-10 w-[88%] -translate-x-1/2 rounded-full bg-black/25 blur-2xl opacity-20"
        />

        <div className="relative overflow-hidden rounded-[12px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-40 h-10 w-16 -translate-x-1/2 -translate-y-1/2 rounded-b-[999px] bg-white shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
          />

          <div className="relative">
            <div className="relative z-30 bg-white pb-2 pt-4">
              <div
                aria-hidden="true"
                className="pointer-events-none mx-auto flex w-full max-w-[920px] items-end justify-between px-6 sm:px-10"
              >
                {Array.from({ length: 22 }, (_, index) => (
                  <span
                    key={index}
                    className="relative h-6 w-3 rounded-full border-2 border-[#444] bg-transparent shadow-[0_1px_0_rgba(0,0,0,0.10)]"
                  >
                    <span className="absolute left-1/2 top-1.5 h-3 w-1.5 -translate-x-1/2 rounded-full border border-[#666] bg-white" />
                  </span>
                ))}
              </div>

              <div aria-hidden="true" className="mt-3 h-px w-full bg-black/[.06]" />
            </div>

            <div className="relative z-10">
              <HeroImage
                imageUrl="/window.svg"
                alt="Calendar hero"
                date={visibleMonth}
                priority
                className="h-72 sm:h-80 md:h-[360px]"
              />
            </div>
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.6fr] md:gap-8 md:p-7">
            <NotesPanel startDate={startDate} endDate={endDate} />

            <section className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                  {monthLabel}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrevMonth}
                    aria-label="Previous month"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-white text-sm font-semibold text-foreground shadow-sm shadow-black/[.04] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <button
                    type="button"
                    onClick={goNextMonth}
                    aria-label="Next month"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-white text-sm font-semibold text-foreground shadow-sm shadow-black/[.04] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <AnimatePresence initial={false} mode="wait" custom={monthDirection}>
                  <motion.div
                    key={visibleMonth.toISOString()}
                    custom={monthDirection}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={{
                      enter: (direction: 1 | -1) => ({
                        x: direction === 1 ? 24 : -24,
                        opacity: 0,
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                      },
                      exit: (direction: 1 | -1) => ({
                        x: direction === 1 ? -24 : 24,
                        opacity: 0,
                      }),
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="transform-gpu"
                  >
                    <CalendarGrid
                      month={visibleMonth}
                      startDate={startDate}
                      endDate={endDate}
                      onRangeChange={handleRangeChange}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
