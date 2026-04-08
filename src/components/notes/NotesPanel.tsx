"use client";

import { format } from "date-fns";
import { useMemo } from "react";

export type NotesPanelProps = {
  className?: string;
  storageKey?: string;
  scopeKey?: string;
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
  scopeKey,
  startDate,
  endDate,
}: NotesPanelProps) {
  const baseClassName = "min-w-0";

  const rangeKey = useMemo(
    () => toRangeKey(startDate, endDate),
    [startDate, endDate]
  );

  const fullStorageKey = useMemo(() => {
    if (scopeKey && scopeKey.trim().length > 0) {
      return `${storageKey}:${scopeKey.trim()}`;
    }

    return `${storageKey}:${rangeKey}`;
  }, [storageKey, scopeKey, rangeKey]);

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
        <h2 className="text-xs font-semibold tracking-tight text-zinc-500 sm:text-sm">
          Notes
        </h2>
        {rangeLabel ? (
          <p className="text-[11px] font-medium text-zinc-500">
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
        className={
          "mt-3 min-h-56 w-full resize-y rounded-lg border border-black/[.06] bg-white p-3 text-sm leading-[30px] text-foreground " +
          "shadow-[0_1px_0_rgba(0,0,0,0.03)] placeholder:text-zinc-400 " +
          "[background-image:repeating-linear-gradient(to_bottom,transparent,transparent_29px,rgba(0,0,0,0.10)_29px,rgba(0,0,0,0.10)_30px)] " +
          "[background-size:100%_30px] [background-position:0_0.75rem] " +
          "hover:border-black/[.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.10]"
        }
      />
    </section>
  );
}
