"use client";

import { useState } from "react";

import CalendarGrid from "../calender/CalendarGrid";
import HeroImage from "../hero/HeroImage";
import NotesPanel from "../notes/NotesPanel";

export default function CalendarLayout() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-4 text-foreground dark:bg-black sm:p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-background shadow-lg ring-1 ring-black/[.08] dark:ring-white/[.145]">
        <HeroImage
          imageUrl="/window.svg"
          alt="Calendar hero"
          date={new Date()}
          priority
          className="h-40 sm:h-56 md:h-64"
        />

        <div className="flex flex-col gap-6 p-6 md:flex-row">
          <NotesPanel
            className="md:basis-[30%]"
            startDate={startDate}
            endDate={endDate}
          />

          <section className="rounded-xl border border-black/[.08] bg-background p-4 dark:border-white/[.145] md:basis-[70%]">
            <h2 className="text-sm font-medium text-foreground">Calendar</h2>

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
