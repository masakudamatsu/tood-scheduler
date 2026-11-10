"use client";

import { useEffect, type ReactNode } from "react";

/**
 * A form that pops up over the page: a sheet at the bottom on phones, a box in
 * the middle on wider screens. A tap outside it or the Escape key closes it.
 */
export default function Popup({
  label,
  onClose,
  onEscape = onClose,
  onSubmit,
  children,
  extra,
}: {
  label: string;
  onClose: () => void;
  /** What Escape does, if not the same as onClose. */
  onEscape?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  /** Shown on top of the popup, such as a question before deleting. */
  extra?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEscape]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-stone-900/30" onClick={onClose} aria-hidden="true" />
      <form
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onSubmit={onSubmit}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-2xl"
      >
        {children}
      </form>
      {extra}
    </div>
  );
}

/** Cancel and Save, at the right end of a popup's bottom row. */
export function CancelAndSave({
  onCancel,
  saveDisabled,
}: {
  onCancel: () => void;
  saveDisabled?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="ml-auto rounded-md px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saveDisabled}
        className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      >
        Save
      </button>
    </>
  );
}
