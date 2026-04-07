import Image from "next/image";

import CalendarGrid from "../calender/CalendarGrid";

export default function CalendarLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-4 text-foreground dark:bg-black sm:p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-background shadow-lg ring-1 ring-black/[.08] dark:ring-white/[.145]">
        <div className="relative h-40 w-full sm:h-56 md:h-64">
          <Image
            src="/next.svg"
            alt="Hero banner"
            fill
            priority
            className="object-cover opacity-20 dark:invert"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/[.06] via-transparent to-black/[.06] dark:from-white/[.06] dark:to-white/[.06]" />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Calendar
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Notes + calendar layout
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 md:flex-row">
          <section className="rounded-xl border border-black/[.08] bg-background p-4 dark:border-white/[.145] md:basis-[30%]">
            <h2 className="text-sm font-medium text-foreground">Notes</h2>
            <div className="mt-3 space-y-3">
              <div className="h-4 w-3/4 rounded bg-black/[.06] dark:bg-white/[.08]" />
              <div className="h-4 w-2/3 rounded bg-black/[.06] dark:bg-white/[.08]" />
              <div className="h-4 w-5/6 rounded bg-black/[.06] dark:bg-white/[.08]" />
              <div className="h-24 w-full rounded bg-black/[.04] dark:bg-white/[.06]" />
            </div>
          </section>

          <section className="rounded-xl border border-black/[.08] bg-background p-4 dark:border-white/[.145] md:basis-[70%]">
            <h2 className="text-sm font-medium text-foreground">Calendar</h2>

            <div className="mt-3">
              <CalendarGrid />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
