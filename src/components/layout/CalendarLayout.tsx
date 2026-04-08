"use client";

import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import CalendarGrid from "../calender/CalendarGrid";
import HeroImage from "../hero/HeroImage";
import NotesPanel from "../notes/NotesPanel";

const CODING_MONTH_FACTS: string[] = [
  "Git stores content-addressed snapshots, so branching and merging can stay fast as a repo grows.",
  "Cache headers often impact perceived speed more than server horsepower because browsers and CDNs can reuse responses.",
  "A tiny reproducible test case is the fastest way to turn a vague bug into a fix.",
  "Bundlers can remove dead code and inline constants, so shipping less JavaScript often beats clever micro-optimizations.",
  "The right database index can change a query from seconds to milliseconds without touching application code.",
  "Floating point is approximate (0.1 isn’t exact), so money is usually stored as integers or decimals.",
  "Latency dominates many apps; fewer round-trips and batched requests usually beat faster loops.",
  "Accessibility is engineering—semantic HTML and keyboard support make UIs usable and easier to maintain.",
  "Deep recursion can hit call-stack limits, so iterative versions are sometimes safer even when logic is the same.",
  "Logs should answer questions; include IDs and key state so you can debug without guessing.",
  "Encryption helps, but secrets management matters most—rotate keys and never ship credentials to the client.",
  "Clear module boundaries make refactors cheaper because components can change without breaking everything.",
];

export default function CalendarLayout() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [monthDirection, setMonthDirection] = useState<1 | -1>(1);
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(false);

  const visibleYear = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const monthProgress = Math.min(1, Math.max(0, monthIndex / 11));
  const monthQuote = CODING_MONTH_FACTS[monthIndex] ?? CODING_MONTH_FACTS[0];

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

  const notesScopeKey = format(visibleMonth, "yyyy-MM");

  useEffect(() => {
    if (!isMobileNotesOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNotesOpen]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 text-foreground sm:p-8">
      <div className="relative w-full max-w-[880px]">
        <div className="mb-3 flex items-center justify-between">
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

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(100%-18px)] h-12 w-[90%] -translate-x-1/2 rounded-full bg-black/30 blur-3xl opacity-25"
        />

        <div className="relative overflow-hidden rounded-[12px] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.14)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-40 h-10 w-16 -translate-x-1/2 -translate-y-1/2 rounded-b-[999px] bg-white shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
          />

          <div className="relative">
            <div className="relative z-30 bg-white pb-2 pt-4">
              <div
                aria-hidden="true"
                className="pointer-events-none mx-auto w-full max-w-[920px] px-6 sm:px-10"
              >
                <div className="relative pb-1 pt-2">
                  <div aria-hidden="true" className="absolute left-0 right-0 top-5 h-px bg-black/[.20]" />

                  <div aria-hidden="true" className="absolute left-0 right-0 top-5 flex justify-between">
                    {Array.from({ length: 24 }, (_, index) => (
                      <span key={index} className="h-1 w-1 rounded-full bg-black/[.22]" />
                    ))}
                  </div>

                  <motion.div
                    aria-hidden="true"
                    className="absolute top-0"
                    animate={{ left: `${monthProgress * 100}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ transform: "translateX(-50%)" }}
                  >
                    <div className="relative">
                      <div className="h-6 w-9 rounded-[10px] border-2 border-black/70 bg-white shadow-[0_2px_0_rgba(0,0,0,0.10)]" />
                      <div className="absolute -left-3 top-1.5 h-3 w-3 rounded-[6px] border-2 border-black/70 bg-white" />
                      <div className="absolute left-1.5 top-2 h-1.5 w-2 rounded-full bg-black/[.14]" />
                      <div className="absolute left-1.5 top-[18px] flex gap-1">
                        <span className="h-2 w-2 rounded-full border-2 border-black/70 bg-white" />
                        <span className="h-2 w-2 rounded-full border-2 border-black/70 bg-white" />
                      </div>
                    </div>
                  </motion.div>

                  <div className="relative z-10 flex items-start justify-between">
                    {Array.from({ length: 12 }, (_, index) => {
                      const stationDate = new Date(visibleYear, index, 1);
                      const isActive = index === monthIndex;
                      const isPast = index < monthIndex;

                      return (
                        <div key={index} className="flex w-[1px] flex-col items-center">
                          <span
                            className={
                              "mt-4 h-3 w-3 rounded-full border-2 " +
                              (isActive
                                ? "border-black/80 bg-white"
                                : isPast
                                  ? "border-black/70 bg-black/[.10]"
                                  : "border-black/[.45] bg-white")
                            }
                          />
                          <span
                            className={
                              "mt-2 text-[10px] font-semibold tracking-wide " +
                              (isActive ? "text-foreground" : "text-foreground/60")
                            }
                          >
                            {format(stationDate, "MMM")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div aria-hidden="true" className="mt-3 h-px w-full bg-black/[.06]" />
            </div>

            <div className="relative z-10">
              <HeroImage
                imageUrl="/window.svg"
                alt="Calendar hero"
                date={visibleMonth}
                quote={monthQuote}
                priority
                className="h-[360px] sm:h-[420px] md:h-[480px]"
              />
            </div>
          </div>

          <div className="grid gap-5 p-4 md:grid-cols-[1fr_1.6fr] md:gap-7 md:p-6">
            <div className="hidden md:block">
              <NotesPanel
                className="mt-2 md:mt-3"
                scopeKey={notesScopeKey}
                startDate={startDate}
                endDate={endDate}
              />
            </div>

            <section className="min-w-0">
              <div className="mt-1">
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

        <button
          type="button"
          onClick={() => setIsMobileNotesOpen(true)}
          aria-label="Open notes"
          aria-expanded={isMobileNotesOpen}
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 items-center justify-center rounded-full border border-black/[.08] bg-white px-4 text-sm font-semibold text-foreground shadow-sm shadow-black/[.10] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12] md:hidden"
        >
          Notes
        </button>

        <AnimatePresence>
          {isMobileNotesOpen ? (
            <motion.div
              className="fixed inset-0 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNotesOpen(false)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Notes"
                className="absolute inset-x-4 bottom-4 max-h-[85vh] overflow-auto rounded-[18px] bg-white p-4 shadow-[0_-24px_72px_rgba(0,0,0,0.28)] ring-1 ring-black/[.08]"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsMobileNotesOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-white text-sm font-semibold text-foreground shadow-sm shadow-black/[.04] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                    aria-label="Close notes"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <NotesPanel
                  className="mt-3"
                  scopeKey={notesScopeKey}
                  startDate={startDate}
                  endDate={endDate}
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
