"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Task, TaskPatch } from "@/lib/types";
import TaskFields, { parseTaskFields, type TaskFieldValues } from "./TaskFields";

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
  const [values, setValues] = useState<TaskFieldValues>({
    title: task.title,
    date: task.due_date ?? "",
    hours: task.hours == null ? "" : String(task.hours),
    note: task.note,
  });
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);
  const questionId = useId();

  useEffect(() => {
    firstField.current?.focus();
  }, []);

  useEffect(() => {
    // Escape closes the delete question first, then the sheet.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmingDelete) setConfirmingDelete(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, confirmingDelete]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const patch = parseTaskFields(values);
    onSave({ ...patch, title: patch.title || task.title });
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
        <TaskFields values={values} onChange={setValues} titleRef={firstField} />

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
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

      {/* Not window.confirm(): the browser decides where that box goes. */}
      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]">
          <div
            className="absolute inset-0 bg-stone-900/30"
            onClick={() => setConfirmingDelete(false)}
            aria-hidden="true"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${questionId}-title`}
            aria-describedby={`${questionId}-text`}
            className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl"
          >
            <h2 id={`${questionId}-title`} className="text-base font-medium">
              Delete this task?
            </h2>
            <p id={`${questionId}-text`} className="mt-1 text-sm text-stone-600">
              &ldquo;{task.title}&rdquo; will be gone for good.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmingDelete(false)}
                className="rounded-md px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md bg-red-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
