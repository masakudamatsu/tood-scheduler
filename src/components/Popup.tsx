"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

// Safari doesn't support closedby="any" yet, so it needs our own code for a
// tap outside (docs/adrs/0031).
const needsTapOutsideFallback =
  typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype);

/**
 * Call this first in the click handler of a button that opens a popup.
 * When a popup closes, the browser puts focus back on whatever had focus when
 * it opened. Safari doesn't focus a button when you click it, so without this
 * there's nothing to go back to (docs/adrs/0033).
 */
export function focusOpener(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.focus();
}

/**
 * A native <dialog>, open over the page while it's mounted. The browser keeps
 * focus inside it, closes it on Escape or a tap outside, and puts focus back
 * on the button that opened it (if that button calls focusOpener). Escape
 * closes only the top dialog, so a question opened over another dialog closes
 * first.
 *
 * onClose runs when the user closes it. The parent then removes it.
 */
export function Modal({
  onClose,
  className,
  children,
  ...aria
}: {
  onClose: () => void;
  className?: string;
  children: ReactNode;
  role?: "alertdialog";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // A layout effect, so its cleanup runs before React removes the dialog.
  // close() puts focus back on the opener; removing the dialog doesn't.
  useLayoutEffect(() => {
    const dialog = ref.current!;
    // The close event comes a moment after close(). By then React may have
    // opened the dialog again (in development it runs effects twice).
    const handleClose = () => {
      if (!dialog.open) onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    dialog.showModal();
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    if (!needsTapOutsideFallback) return;
    const dialog = ref.current!;
    // A tap on the backdrop has the dialog as its target, but so does a tap on
    // the dialog's own padding. So check where the pointer is too.
    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      const offBox =
        e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      return e.target === dialog && offBox;
    };
    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    // Both the press and the release must be outside, so selecting text
    // and letting go over the backdrop doesn't close it.
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) dialog.close();
    };
    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      // React doesn't know this attribute yet.
      {...{ closedby: "any" }}
      {...aria}
      className={`bg-white text-inherit shadow-xl backdrop:bg-stone-900/30 ${className ?? ""}`}
    >
      {children}
    </dialog>
  );
}

/**
 * A form that pops up over the page: a sheet at the bottom on phones, a box in
 * the middle on wider screens. A tap outside it or the Escape key closes it.
 */
export default function Popup({
  label,
  onClose,
  onSubmit,
  children,
}: {
  label: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
}) {
  return (
    <Modal
      aria-label={label}
      onClose={onClose}
      className="mx-auto mt-auto mb-0 max-h-[90vh] w-full max-w-xl rounded-t-2xl p-4 sm:my-auto sm:rounded-2xl"
    >
      <form onSubmit={onSubmit}>{children}</form>
    </Modal>
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
