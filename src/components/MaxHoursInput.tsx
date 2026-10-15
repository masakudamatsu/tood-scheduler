"use client";

import { useEffect, useState } from "react";

export default function MaxHoursInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (hours: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  function commit() {
    const n = Number(draft);
    if (n > 0 && n <= 24) {
      if (n !== value) onChange(n);
    } else {
      setDraft(String(value));
    }
  }

  return (
    <label className="flex items-center gap-1.5 text-sm text-stone-600">
      <span>Max / day</span>
      <input
        type="number"
        min={0.5}
        max={24}
        step={0.5}
        inputMode="decimal"
        aria-label="Maximum hours per day"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
        className="w-14 rounded-md border border-stone-300 bg-white px-1.5 py-1 text-right text-stone-900"
      />
      <span>h</span>
    </label>
  );
}
