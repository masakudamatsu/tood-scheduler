"use client";

import { useState } from "react";
import type { NewTask } from "@/lib/types";

export default function AddTaskForm({
  defaultDate,
  onAdd,
}: {
  defaultDate: string;
  onAdd: (task: NewTask) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [hours, setHours] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const h = Number(hours);
    await onAdd({
      title: trimmed,
      due_date: date || null,
      hours: hours !== "" && h >= 0 ? h : null,
    });
    setTitle("");
    setHours("");
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Add a task"
      className="my-4 rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-200"
    >
      <input
        aria-label="What to do"
        placeholder="What to do?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md px-2 py-1.5 text-base outline-none placeholder:text-stone-400 focus:bg-stone-50"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          type="date"
          aria-label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-stone-300 px-2 py-1 text-sm"
        />
        <input
          type="number"
          aria-label="Estimated hours"
          placeholder="Hours"
          min={0}
          step={0.5}
          inputMode="decimal"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-20 rounded-md border border-stone-300 px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="ml-auto rounded-md bg-teal-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          disabled={!title.trim()}
        >
          Add
        </button>
      </div>
    </form>
  );
}
