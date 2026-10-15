"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { store } from "@/lib/store";
import { buildDayList, todayKey } from "@/lib/dates";
import { DEFAULT_MAX_HOURS, type NewTask, type Task, type TaskPatch } from "@/lib/types";
import AddTaskForm from "./AddTaskForm";
import DaySection from "./DaySection";
import MaxHoursInput from "./MaxHoursInput";
import TaskSheet from "./TaskSheet";

const NO_DATE = "none";

type Props = {
  localMode?: boolean;
  userEmail?: string;
  onSignOut?: () => void;
};

export default function Scheduler({ localMode, userEmail, onSignOut }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [maxHours, setMaxHours] = useState(DEFAULT_MAX_HOURS);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [daysAhead, setDaysAhead] = useState(28);
  const today = todayKey();
  const scrolled = useRef(false);

  const reload = useCallback(async () => {
    try {
      const [t, m] = await Promise.all([store.listTasks(), store.getMaxHours()]);
      setTasks(t);
      setMaxHours(m);
      setLoaded(true);
    } catch (e) {
      setError(messageOf(e));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // On first load, jump to today (past days with tasks sit above it).
  useEffect(() => {
    if (loaded && !scrolled.current) {
      scrolled.current = true;
      document.getElementById(`day-${today}`)?.scrollIntoView({ block: "start" });
    }
  }, [loaded, today]);

  // Save a change. The screen updates first; if saving fails, we reload.
  async function save(action: () => Promise<unknown>) {
    try {
      setError("");
      await action();
    } catch (e) {
      setError(messageOf(e));
      reload();
    }
  }

  async function addTask(input: NewTask) {
    await save(async () => {
      const task = await store.addTask(input);
      setTasks((prev) => [...prev, task]);
    });
  }

  function updateTask(id: string, patch: TaskPatch) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    save(() => store.updateTask(id, patch));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    save(() => store.deleteTask(id));
  }

  function changeMaxHours(hours: number) {
    setMaxHours(hours);
    save(() => store.setMaxHours(hours));
  }

  const sensors = useSensors(
    // Mouse: drag starts after moving 6px, so a normal click still opens the task.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Touch: press and hold briefly to drag, so you can still scroll.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  function onDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    if (typeof overId !== "string" || !overId.startsWith("day:")) return;
    const target = overId.slice(4);
    const due_date = target === NO_DATE ? null : target;
    const task = tasks.find((t) => t.id === event.active.id);
    if (task && task.due_date !== due_date) updateTask(task.id, { due_date });
  }

  const byDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const key = t.due_date ?? NO_DATE;
      map.set(key, [...(map.get(key) ?? []), t]);
    }
    return map;
  }, [tasks]);

  const days = useMemo(
    () =>
      buildDayList(
        tasks.flatMap((t) => (t.due_date ? [t.due_date] : [])),
        today,
        daysAhead
      ),
    [tasks, today, daysAhead]
  );

  const openTask = tasks.find((t) => t.id === openId) ?? null;
  const undated = byDate.get(NO_DATE) ?? [];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#f6f5f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">To Do Scheduler</h1>
          <div className="flex items-center gap-3">
            <MaxHoursInput value={maxHours} onChange={changeMaxHours} />
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title={userEmail}
                className="text-sm text-stone-600 underline underline-offset-2 hover:text-stone-900"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-24">
        {localMode && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
            Local mode: tasks are saved in this browser only. Add your Supabase keys to
            sync and sign in.
          </p>
        )}

        <AddTaskForm defaultDate={today} onAdd={addTask} />

        {error && (
          <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            Couldn&apos;t save: {error}
          </p>
        )}

        {!loaded && !error ? (
          <p className="py-8 text-center text-stone-500">Loading…</p>
        ) : (
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div className="space-y-3">
              {undated.length > 0 && (
                <DaySection
                  dayKey={NO_DATE}
                  title="No date"
                  tasks={undated}
                  onToggle={(t) => updateTask(t.id, { done: !t.done })}
                  onOpen={(t) => setOpenId(t.id)}
                />
              )}
              {days.map((d) => (
                <DaySection
                  key={d}
                  dayKey={d}
                  isToday={d === today}
                  isPast={d < today}
                  tasks={byDate.get(d) ?? []}
                  maxHours={maxHours}
                  onToggle={(t) => updateTask(t.id, { done: !t.done })}
                  onOpen={(t) => setOpenId(t.id)}
                />
              ))}
            </div>
          </DndContext>
        )}

        {loaded && (
          <button
            type="button"
            onClick={() => setDaysAhead((n) => n + 14)}
            className="mt-4 w-full rounded-lg py-2 text-sm text-stone-600 ring-1 ring-stone-300 hover:bg-white"
          >
            Show 2 more weeks
          </button>
        )}
      </main>

      {openTask && (
        <TaskSheet
          task={openTask}
          onClose={() => setOpenId(null)}
          onSave={(patch) => {
            updateTask(openTask.id, patch);
            setOpenId(null);
          }}
          onDelete={() => {
            deleteTask(openTask.id);
            setOpenId(null);
          }}
        />
      )}
    </div>
  );
}

function messageOf(e: unknown) {
  if (e && typeof e === "object" && "message" in e) return String(e.message);
  return String(e);
}
