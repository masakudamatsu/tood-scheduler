"use client";

import { useState } from "react";
import { Linkify } from "@/lib/linkify";

/** What the user has typed, before it's turned into task values. */
export type TaskFieldValues = {
  title: string;
  date: string;
  hours: string;
  note: string;
};

/** Turn typed values into task values. A blank or negative hours means none. */
export function parseTaskFields(v: TaskFieldValues) {
  const h = Number(v.hours);
  return {
    title: v.title.trim(),
    due_date: v.date || null,
    hours: v.hours !== "" && h >= 0 ? h : null,
    note: v.note,
  };
}

/** Title, date, hours and note: shared by the new task popup and the task editor. */
export default function TaskFields({
  values,
  onChange,
}: {
  values: TaskFieldValues;
  onChange: (values: TaskFieldValues) => void;
}) {
  // A saved note is shown with clickable links until the user taps "Edit note".
  const [editingNote, setEditingNote] = useState(!values.note.trim());
  const set = (field: keyof TaskFieldValues) => (e: { target: { value: string } }) =>
    onChange({ ...values, [field]: e.target.value });

  return (
    <>
      <input
        // Both popups that use these fields start with the title.
        autoFocus
        aria-label="Title"
        placeholder="What to do?"
        value={values.title}
        onChange={set("title")}
        className="w-full rounded-md px-1 py-1 text-lg font-medium outline-none placeholder:text-stone-400 focus:bg-stone-50"
      />

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-stone-600">Date</span>
          <input
            type="date"
            value={values.date}
            onChange={set("date")}
            className="rounded-md border border-stone-300 px-2 py-1 text-base"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-stone-600">Hours</span>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={values.hours}
            onChange={set("hours")}
            className="w-20 rounded-md border border-stone-300 px-2 py-1 text-base"
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
            value={values.note}
            onChange={set("note")}
            rows={6}
            placeholder="Add details. Paste a link and it becomes clickable."
            className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-base"
          />
        ) : (
          <div
            data-testid="note-view"
            className="mt-1 whitespace-pre-wrap break-words rounded-md bg-stone-50 px-3 py-2 text-sm"
          >
            <Linkify text={values.note} />
          </div>
        )}
      </div>
    </>
  );
}
