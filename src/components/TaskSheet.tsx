"use client";

import { useEffect, useRef, useState } from "react";
import { Linkify } from "@/lib/linkify";
import type { Task, TaskPatch } from "@/lib/types";

export default function TaskSheet({
  task,
  onClose,
  onSave,
  onDelete,
}: {
  task: Task;
  onClose: () => void;
  onSave: (patch: TaskPatch) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.due_date ?? "");
  const [hours, setHours] = useState(task.hours == null ? "" : String(task.hours));
  const [note, setNote] = useState(task.note);
  const [editingNote, setEditingNote] = useState(!task.note.trim());
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const h = Number(hours);
    onSave({
      title: title.trim() || task.title,
      due_date: date || null,
      hours: hours !== "" && h >= 0 ? h : null,
      note,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-stone-900/30" onClick={onClose} aria-hidden="true" />
      <form
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        onSubmit={onSubmit}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-2xl"
      >
        <input
          ref={firstField}
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md px-1 py-1 text-lg font-medium outline-none focus:bg-stone-50"
        />

        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-stone-600">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-stone-300 px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-stone-600">Hours</span>
            <input
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-20 rounded-md border border-stone-300 px-2 py-1"
            />
          </label>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700">Note</span>
            {!editingNote && (
              <button
                type="button"
                onClick={() => setEditingNote(true)}
                className="text-sm text-teal-700 underline underline-offset-2"
              >
                Edit note
              </button>
            )}
          </div>
          {editingNote ? (
            <textarea
              aria-label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              placeholder="Add details. Paste a link and it becomes clickable."
              className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm"
            />
          ) : (
            <div
              data-testid="note-view"
              className="mt-1 whitespace-pre-wrap break-words rounded-md bg-stone-50 px-3 py-2 text-sm"
            >
              <Linkify text={note} />
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
