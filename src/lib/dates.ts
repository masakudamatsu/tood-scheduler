// All dates are plain "YYYY-MM-DD" strings in the user's local time zone.

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, days: number): string {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function formatDay(key: string): { weekday: string; label: string } {
  const d = fromDateKey(key);
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
    label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  };
}

/**
 * Which days to show, in order:
 * - past days only when they have tasks
 * - every day from today for `daysAhead` days (empty ones too, so you can drop tasks there)
 * - any later day that has tasks, with the gap filled in
 */
export function buildDayList(taskDates: string[], today: string, daysAhead: number): string[] {
  const unique = Array.from(new Set(taskDates)).sort();
  const past = unique.filter((d) => d < today);
  let end = addDays(today, daysAhead - 1);
  const latest = unique[unique.length - 1];
  if (latest && latest > end) end = latest;
  const days: string[] = [...past];
  for (let d = today; d <= end; d = addDays(d, 1)) days.push(d);
  return days;
}
