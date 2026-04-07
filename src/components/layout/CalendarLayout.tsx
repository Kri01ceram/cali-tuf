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
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-3 text-foreground sm:p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-background shadow-lg ring-1 ring-black/[.08]">
        <div className="relative">
          <div className="relative z-20 h-10 bg-gradient-to-b from-zinc-200 to-zinc-50 sm:h-12">
            <div className="absolute inset-x-0 bottom-0 h-px bg-black/[.10]" />
            <div className="absolute inset-x-0 bottom-0 h-3 shadow-[inset_0_-12px_16px_rgba(0,0,0,0.06)]" />

            <div className="pointer-events-none absolute inset-x-4 -bottom-3 z-30 flex items-start justify-between sm:inset-x-8 sm:-bottom-3.5">
              {Array.from({ length: 24 }, (_, index) => {
                const isCenter = index === 12;

                return (
                  <span
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={
                      "relative rounded-t-full border-2 border-zinc-950/90 border-b-0 bg-transparent shadow-[0_1px_0_rgba(0,0,0,0.22)] " +
                      "before:absolute before:inset-0 before:rounded-t-full before:border before:border-white/70 before:border-b-0 before:opacity-60 before:content-[''] " +
                      "after:absolute after:left-1/2 after:top-full after:mt-0.5 after:-translate-x-1/2 after:rounded-full after:bg-black/25 after:blur-[1px] after:opacity-60 after:content-[''] " +
                      (isCenter
                        ? "h-9 w-6 -translate-y-1 sm:h-10 sm:w-7 after:h-2 after:w-8"
                        : "h-7 w-4 sm:h-8 sm:w-[18px] after:h-1.5 after:w-6")
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="relative z-10">
            <HeroImage
              imageUrl="/window.svg"
              alt="Calendar hero"
              date={visibleMonth}
              priority
              className="h-40 sm:h-56 md:h-64"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-start">
          <NotesPanel
            className="md:basis-[30%] md:min-w-72 md:max-w-sm"
            startDate={startDate}
            endDate={endDate}
          />

          <section className="min-w-0 rounded-xl border border-black/[.08] bg-background p-4 shadow-sm shadow-black/[.04] md:basis-[70%]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                {monthLabel}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  aria-label="Previous month"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[.08] bg-background text-sm font-semibold text-foreground shadow-sm shadow-black/[.03] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  onClick={goNextMonth}
                  aria-label="Next month"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[.08] bg-background text-sm font-semibold text-foreground shadow-sm shadow-black/[.03] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>

            <div className="mt-3">
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
  );
}
