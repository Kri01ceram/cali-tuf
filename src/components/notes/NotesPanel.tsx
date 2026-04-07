"use client";

import { format } from "date-fns";
import { useMemo } from "react";

export type NotesPanelProps = {
  className?: string;
  storageKey?: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

function toRangeKey(startDate?: Date | null, endDate?: Date | null) {
  if (!startDate && !endDate) return "all";
  if (startDate && !endDate) return format(startDate, "yyyy-MM-dd");
  if (!startDate && endDate) return format(endDate, "yyyy-MM-dd");

  const start = startDate as Date;
  const end = endDate as Date;
  const startKey = format(start, "yyyy-MM-dd");
  const endKey = format(end, "yyyy-MM-dd");
  return startKey <= endKey ? `${startKey}..${endKey}` : `${endKey}..${startKey}`;
}

function toRangeLabel(startDate?: Date | null, endDate?: Date | null) {
  if (!startDate && !endDate) return "";
  if (startDate && !endDate) return format(startDate, "MMM d, yyyy");
  if (!startDate && endDate) return format(endDate, "MMM d, yyyy");

  const start = startDate as Date;
  const end = endDate as Date;
  const a = format(start, "MMM d, yyyy");
  const b = format(end, "MMM d, yyyy");
  return a <= b ? `${a} – ${b}` : `${b} – ${a}`;
}

export default function NotesPanel({
  className,
  storageKey = "cali-tuf:notes",
  startDate,
  endDate,
}: NotesPanelProps) {
  const baseClassName =
    "rounded-xl border border-black/[.08] bg-background p-4 shadow-sm shadow-black/[.04]";

  const rangeKey = useMemo(
    () => toRangeKey(startDate, endDate),
    [startDate, endDate]
  );

  const fullStorageKey = useMemo(
    () => `${storageKey}:${rangeKey}`,
    [storageKey, rangeKey]
  );

  const rangeLabel = useMemo(
    () => toRangeLabel(startDate, endDate),
    [startDate, endDate]
  );

  const initialText = useMemo(() => {
    try {
      return window.localStorage.getItem(fullStorageKey) ?? "";
    } catch {
      return "";
    }
  }, [fullStorageKey]);

  return (
    <section
      className={className ? `${baseClassName} ${className}` : baseClassName}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          Notes
        </h2>
        {rangeLabel ? (
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {rangeLabel}
          </p>
        ) : null}
      </div>

      <textarea
        key={fullStorageKey}
        defaultValue={initialText}
        onChange={(event) => {
          try {
            window.localStorage.setItem(fullStorageKey, event.target.value);
          } catch {
            // Ignore write errors (private mode, quota, etc.)
          }
        }}
        placeholder="Write notes…"
        className="mt-3 min-h-32 w-full resize-y rounded-lg border border-black/[.08] bg-transparent p-3 text-sm leading-6 text-foreground shadow-sm shadow-black/[.02] transition-colors transition-shadow duration-150 ease-out placeholder:text-zinc-500 hover:border-black/[.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.12]"
      />
    </section>
  );
}
