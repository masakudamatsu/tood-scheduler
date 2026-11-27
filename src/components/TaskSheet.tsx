"use client";

import { useId, useState } from "react";
import type { Task, TaskPatch } from "@/lib/types";
import Popup, { CancelAndSave, focusOpener, Modal } from "./Popup";
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

  // Not window.confirm(): the browser decides where that box goes. A dialog of
  // its own, on top of the task details, so Escape or a tap outside closes
  // only the question.
  const deleteQuestion = confirmingDelete && (
    <Modal
      role="alertdialog"
      aria-labelledby={`${questionId}-title`}
      aria-describedby={`${questionId}-text`}
      onClose={() => setConfirmingDelete(false)}
      className="mx-auto mt-[15vh] w-[calc(100%-2rem)] max-w-sm rounded-2xl p-4"
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
    </Modal>
  );

  return (
    <>
      <Popup label="Task details" onClose={onClose} onSubmit={onSubmit}>
        <TaskFields values={values} onChange={setValues} />
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              focusOpener(e);
              setConfirmingDelete(true);
            }}
            className="rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
          <CancelAndSave onCancel={onClose} />
        </div>
      </Popup>
      {deleteQuestion}
    </>
  );
}
