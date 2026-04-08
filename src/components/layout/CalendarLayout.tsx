"use client";

import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import CalendarGrid from "../calender/CalendarGrid";
import HeroImage from "../hero/HeroImage";
import NotesPanel from "../notes/NotesPanel";

const CODING_MONTH_FACTS: string[] = [
  "Git stores content-addressed snapshots, so branching and merging can stay fast as a repo grows. Small commits make it easier to review and to bisect later.",
  "Cache headers often impact perceived speed more than server horsepower, because browsers and CDNs can reuse responses. A good cache strategy can make the UI feel instant.",
  "A tiny reproducible test case is the fastest way to turn a vague bug into a fix. When you can reproduce it reliably, you can fix it confidently.",
  "Bundlers can remove dead code and inline constants, so shipping less JavaScript often beats clever micro-optimizations. Measure first, then simplify.",
  "The right database index can change a query from seconds to milliseconds without touching application code. Always check the query plan before guessing.",
  "Floating point is approximate (0.1 isn’t exact), so money is usually stored as integers or decimals. Precision bugs are subtle and expensive.",
  "Latency dominates many apps; fewer round-trips and batched requests usually beat faster loops. Reducing network chatter is often the biggest win.",
  "Accessibility is engineering—semantic HTML and keyboard support make UIs usable and easier to maintain. A11y improvements usually improve overall UX too.",
  "Deep recursion can hit call-stack limits, so iterative versions are sometimes safer even when logic is the same. Clarity beats cleverness in the long run.",
  "Logs should answer questions; include IDs and key state so you can debug without guessing. Good logs are like time travel for incidents.",
  "Encryption helps, but secrets management matters most—rotate keys and never ship credentials to the client. Assume anything in the browser can be inspected.",
  "Clear module boundaries make refactors cheaper because components can change without breaking everything. Strong boundaries are a form of future-proofing.",
];

type TaskPriority = "low" | "mid" | "high";

type CalendarTask = {
  id: string;
  text: string;
  priority: TaskPriority;
  startKey: string;
  endKey: string;
  createdAt: number;
};

const TASKS_STORAGE_KEY = "cali-tuf:tasks:v1";

function priorityRank(priority: TaskPriority) {
  if (priority === "high") return 3;
  if (priority === "mid") return 2;
  return 1;
}

export default function CalendarLayout() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2000, 0, 1));
  const [monthDirection, setMonthDirection] = useState<1 | -1>(1);
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(false);

  const [tasks, setTasks] = useState<CalendarTask[]>([]);

  useEffect(() => {
    setVisibleMonth(startOfMonth(new Date()));
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;

      const hydrated = parsed
        .filter(Boolean)
        .filter((item): item is CalendarTask => {
          if (typeof item !== "object" || item === null) return false;
          const candidate = item as Partial<CalendarTask>;
          return (
            typeof candidate.id === "string" &&
            typeof candidate.text === "string" &&
            (candidate.priority === "low" || candidate.priority === "mid" || candidate.priority === "high") &&
            typeof candidate.startKey === "string" &&
            typeof candidate.endKey === "string" &&
            typeof candidate.createdAt === "number"
          );
        });

      setTasks(hydrated);
    } catch {
      // ignore
    }
  }, []);
  const [taskText, setTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("mid");
  const [notesRefreshToken, setNotesRefreshToken] = useState(0);

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

  const dayMarkers = (() => {
    const markers: Record<string, TaskPriority> = {};

    for (const task of tasks) {
      const start = task.startKey <= task.endKey ? task.startKey : task.endKey;
      const end = task.startKey <= task.endKey ? task.endKey : task.startKey;

      // Iterate by string keys (yyyy-MM-dd) using Date for safe stepping.
      const cursor = new Date(`${start}T00:00:00`);
      const endDateValue = new Date(`${end}T00:00:00`);
      if (Number.isNaN(cursor.getTime()) || Number.isNaN(endDateValue.getTime())) continue;

      while (cursor <= endDateValue) {
        const key = format(cursor, "yyyy-MM-dd");
        const existing = markers[key];
        if (!existing || priorityRank(task.priority) > priorityRank(existing)) {
          markers[key] = task.priority;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return markers;
  })();

  const canAddTask = Boolean(startDate && endDate && taskText.trim().length > 0);

  const addTask = useCallback(() => {
    if (!startDate || !endDate) return;
    const trimmed = taskText.trim();
    if (trimmed.length === 0) return;

    const startKey = format(startDate, "yyyy-MM-dd");
    const endKey = format(endDate, "yyyy-MM-dd");
    const task: CalendarTask = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: trimmed,
      priority: taskPriority,
      startKey,
      endKey,
      createdAt: Date.now(),
    };

    setTasks((current) => {
      const next = [task, ...current];
      try {
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    // Append into month notes so the user can edit manually.
    try {
      const notesKey = `cali-tuf:notes:${notesScopeKey}`;
      const previous = window.localStorage.getItem(notesKey) ?? "";
      const priorityLabel =
        taskPriority === "high" ? "HIGH" : taskPriority === "mid" ? "MID" : "LOW";
      const rangeLabel =
        startKey === endKey ? startKey : startKey <= endKey ? `${startKey}..${endKey}` : `${endKey}..${startKey}`;
      const line = `- [${priorityLabel}] ${trimmed} (${rangeLabel})`;
      const nextNotes = previous.trim().length > 0 ? `${previous.replace(/\s*$/u, "")}\n${line}\n` : `${line}\n`;
      window.localStorage.setItem(notesKey, nextNotes);
      setNotesRefreshToken((token) => token + 1);
    } catch {
      // ignore
    }

    setTaskText("");
  }, [startDate, endDate, taskText, taskPriority, notesScopeKey]);

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
                refreshToken={notesRefreshToken}
              />
            </div>

            <section className="min-w-0">
              {startDate && endDate ? (
                <div className="mb-3 rounded-xl border border-black/[.08] bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-foreground/70">
                      Add a task for this range
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={taskPriority}
                        onChange={(event) => setTaskPriority(event.target.value as TaskPriority)}
                        className="h-9 rounded-lg border border-black/[.10] bg-white px-2 text-xs font-semibold text-foreground shadow-sm shadow-black/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                        aria-label="Task priority"
                      >
                        <option value="low">Low</option>
                        <option value="mid">Mid</option>
                        <option value="high">High</option>
                      </select>
                      <button
                        type="button"
                        onClick={addTask}
                        disabled={!canAddTask}
                        className={
                          "inline-flex h-9 items-center justify-center rounded-lg border border-black/[.10] bg-white px-3 text-xs font-semibold text-foreground shadow-sm shadow-black/[.04] transition-colors duration-150 hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12] " +
                          (!canAddTask ? "opacity-50" : "")
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <input
                    value={taskText}
                    onChange={(event) => setTaskText(event.target.value)}
                    placeholder="Task description…"
                    className="mt-2 h-10 w-full rounded-lg border border-black/[.08] bg-white px-3 text-sm text-foreground shadow-[0_1px_0_rgba(0,0,0,0.03)] placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
                  />
                </div>
              ) : null}

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
                      dayMarkers={dayMarkers}
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
                  refreshToken={notesRefreshToken}
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
