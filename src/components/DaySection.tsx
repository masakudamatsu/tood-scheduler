"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { formatDay } from "@/lib/dates";
import type { Task } from "@/lib/types";
import TaskCard from "./TaskCard";

type Props = {
  dayKey: string; // "YYYY-MM-DD" or "none"
  title?: string;
  isToday?: boolean;
  isPast?: boolean;
  tasks: Task[];
  highlighted?: boolean; // a card is being dragged over this day
  maxHours?: number;
  onToggle: (task: Task) => void;
  onOpen: (task: Task) => void;
};

export default function DaySection({
  dayKey,
  title,
  isToday,
  isPast,
  tasks,
  highlighted,
  maxHours,
  onToggle,
  onOpen,
}: Props) {
  const { setNodeRef } = useDroppable({ id: `day:${dayKey}` });
  const total = tasks.reduce((sum, t) => sum + (t.hours ?? 0), 0);
  const overloaded = maxHours !== undefined && total > maxHours;
  const day = title ? null : formatDay(dayKey);
  const headingId = `day-heading-${dayKey}`;

  return (
    <section
      ref={setNodeRef}
      id={`day-${dayKey}`}
      data-testid={`day-${dayKey}`}
      data-overloaded={overloaded ? "true" : "false"}
      aria-labelledby={headingId}
      className={[
        "scroll-mt-16 rounded-xl px-3 py-2 transition-colors",
        overloaded ? "border-2 border-red-500 bg-red-50/40" : "border-2 border-transparent",
        highlighted ? "bg-teal-50 ring-2 ring-teal-500/40" : "",
        isPast ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={headingId} className="flex items-baseline gap-2">
          {day ? (
            <>
              <span className={`text-xs font-semibold uppercase ${isToday ? "text-teal-700" : "text-stone-500"}`}>
                {day.weekday}
              </span>
              <span className={`font-medium ${isToday ? "text-teal-800" : ""}`}>{day.label}</span>
              {isToday && (
                <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[11px] font-medium text-white">
                  Today
                </span>
              )}
            </>
          ) : (
            <span className="font-medium">{title}</span>
          )}
        </h2>
        {maxHours !== undefined && tasks.length > 0 && (
          <span
            data-testid="day-total"
            className={`text-xs tabular-nums ${overloaded ? "font-semibold text-red-700" : "text-stone-500"}`}
          >
            {formatHours(total)} / {formatHours(maxHours)} h{overloaded ? " · over limit" : ""}
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="py-1 text-xs text-stone-400">Nothing planned</p>
      ) : (
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <ul className="mt-2 space-y-2">
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={() => onToggle(t)} onOpen={() => onOpen(t)} />
            ))}
          </ul>
        </SortableContext>
      )}
    </section>
  );
}

export function formatHours(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
