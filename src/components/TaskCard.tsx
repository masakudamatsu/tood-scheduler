"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Task } from "@/lib/types";
import { formatHours } from "./DaySection";

export default function TaskCard({
  task,
  onToggle,
  onOpen,
}: {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const { setNodeRef, listeners, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      data-testid="task-card"
      data-task-title={task.title}
      className={[
        "flex cursor-grab touch-manipulation items-center gap-3 rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-stone-200 select-none",
        isDragging ? "relative z-30 cursor-grabbing shadow-lg ring-teal-500" : "",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        aria-label={`Mark "${task.title}" as done`}
        className="size-5 shrink-0 cursor-pointer accent-teal-700"
      />
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <span className={`min-w-0 flex-1 truncate ${task.done ? "text-stone-400 line-through" : ""}`}>
          {task.title}
        </span>
        {task.note.trim() && (
          <span aria-label="Has a note" title="Has a note" className="text-stone-400">
            ✎
          </span>
        )}
        {task.hours != null && (
          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs tabular-nums text-stone-600">
            {formatHours(task.hours)} h
          </span>
        )}
      </button>
    </li>
  );
}
