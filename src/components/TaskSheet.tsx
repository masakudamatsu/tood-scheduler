"use client";

import { useId, useState } from "react";
import type { Task, TaskPatch } from "@/lib/types";
import Popup, { CancelAndSave } from "./Popup";
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
  const questionId = useId();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const patch = parseTaskFields(values);
    onSave({ ...patch, title: patch.title || task.title });
  }

  // Not window.confirm(): the browser decides where that box goes.
  const deleteQuestion = confirmingDelete && (
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
  );

  return (
    <Popup
      label="Task details"
      onClose={onClose}
      // Escape closes the delete question first, then the sheet.
      onEscape={confirmingDelete ? () => setConfirmingDelete(false) : onClose}
      onSubmit={onSubmit}
      extra={deleteQuestion}
    >
      <TaskFields values={values} onChange={setValues} />
      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
        <CancelAndSave onCancel={onClose} />
      </div>
    </Popup>
  );
}
