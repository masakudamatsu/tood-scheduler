"use client";

import { useState } from "react";
import type { NewTaskInput } from "@/lib/types";
import TaskFields, { parseTaskFields, type TaskFieldValues } from "./TaskFields";

export default function AddTaskForm({
  defaultDate,
  onAdd,
}: {
  defaultDate: string;
  onAdd: (task: NewTaskInput) => Promise<void>;
}) {
  const [values, setValues] = useState<TaskFieldValues>({
    title: "",
    date: defaultDate,
    hours: "",
    note: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const task = parseTaskFields(values);
    if (!task.title) return;
    await onAdd(task);
    // Keep the date: the next task is often for the same day.
    setValues((v) => ({ ...v, title: "", hours: "", note: "" }));
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Add a task"
      className="my-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200"
    >
      <TaskFields values={values} onChange={setValues} />
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          disabled={!values.title.trim()}
        >
          Add
        </button>
      </div>
    </form>
  );
}
