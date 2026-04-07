"use client";

import { useState } from "react";

import CalendarGrid from "../calender/CalendarGrid";
import HeroImage from "../hero/HeroImage";
import NotesPanel from "../notes/NotesPanel";

export default function CalendarLayout() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-3 text-foreground dark:bg-black sm:p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-background shadow-lg ring-1 ring-black/[.08] dark:ring-white/[.145]">
        <HeroImage
          imageUrl="/window.svg"
          alt="Calendar hero"
          date={new Date()}
          priority
          className="h-40 sm:h-56 md:h-64"
        />

        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-start">
          <NotesPanel
            className="md:basis-[30%] md:min-w-72 md:max-w-sm"
            startDate={startDate}
            endDate={endDate}
          />

          <section className="min-w-0 rounded-xl border border-black/[.08] bg-background p-4 shadow-sm shadow-black/[.04] dark:border-white/[.145] dark:shadow-white/[.03] md:basis-[70%]">
            <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              Calendar
            </h2>

            <div className="mt-3">
              <CalendarGrid
                startDate={startDate}
                endDate={endDate}
                onRangeChange={(nextStart, nextEnd) => {
                  setStartDate(nextStart);
                  setEndDate(nextEnd);
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
