"use client";

import { useState } from "react";
import type { NewTaskInput } from "@/lib/types";
import Popup, { CancelAndSave } from "./Popup";
import TaskFields, { parseTaskFields, type TaskFieldValues } from "./TaskFields";

/** The round + button at the bottom right, and the new task popup it opens. */
export default function AddTaskPopup({
  defaultDate,
  onAdd,
}: {
  defaultDate: string;
  onAdd: (task: NewTaskInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Add a task"
        title="Add a task"
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-12 items-center justify-center rounded-full bg-teal-700 text-white shadow-lg hover:bg-teal-800 sm:right-6 sm:bottom-6"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
      {/* Mounted only while open, so each new task starts with empty fields. */}
      {open && (
        <NewTaskForm defaultDate={defaultDate} onAdd={onAdd} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function NewTaskForm({
  defaultDate,
  onAdd,
  onClose,
}: {
  defaultDate: string;
  onAdd: (task: NewTaskInput) => Promise<void>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<TaskFieldValues>({
    title: "",
    date: defaultDate,
    hours: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const task = parseTaskFields(values);
    if (!task.title || saving) return;
    setSaving(true);
    await onAdd(task);
    onClose();
  }

  return (
    <Popup label="New task" onClose={onClose} onSubmit={onSubmit}>
      <TaskFields values={values} onChange={setValues} />
      <div className="mt-5 flex items-center gap-2">
        <CancelAndSave onCancel={onClose} saveDisabled={!values.title.trim() || saving} />
      </div>
    </Popup>
  );
}
