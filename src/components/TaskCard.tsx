"use client";

import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/types";
import { formatHours } from "./DaySection";

/** A task card you can drag up/down within its day, or onto another day. */
export default function TaskCard({
  task,
  onToggle,
  onOpen,
}: {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  return (
    <TaskCardView
      task={task}
      onToggle={onToggle}
      onOpen={onOpen}
      nodeRef={setNodeRef}
      dragProps={listeners}
      placeholder={isDragging}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    />
  );
}

/** How a card looks. Also used for the copy that follows the pointer while dragging. */
export function TaskCardView({
  task,
  onToggle,
  onOpen,
  nodeRef,
  dragProps,
  style,
  placeholder,
  lifted,
}: {
  task: Task;
  onToggle?: () => void;
  onOpen?: () => void;
  nodeRef?: Ref<HTMLLIElement>;
  dragProps?: HTMLAttributes<HTMLElement>;
  style?: CSSProperties;
  placeholder?: boolean; // the empty spot left behind while dragging
  lifted?: boolean; // the copy under the pointer
}) {
  const Tag = lifted ? "div" : "li";
  return (
    <Tag
      ref={nodeRef as Ref<HTMLLIElement & HTMLDivElement>}
      style={style}
      {...dragProps}
      data-testid={lifted ? "drag-preview" : "task-card"}
      data-task-title={task.title}
      className={[
        "flex cursor-grab touch-manipulation items-center gap-3 rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-stone-200 select-none",
        placeholder ? "opacity-40" : "",
        lifted ? "cursor-grabbing shadow-lg ring-2 ring-teal-500" : "",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        readOnly={!onToggle}
        tabIndex={lifted ? -1 : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        aria-label={`Mark "${task.title}" as done`}
        className="size-5 shrink-0 cursor-pointer accent-teal-700"
      />
      <button
        type="button"
        onClick={onOpen}
        tabIndex={lifted ? -1 : undefined}
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
    </Tag>
  );
}
