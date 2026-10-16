"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { store } from "@/lib/store";
import { buildDayList, todayKey } from "@/lib/dates";
import {
  DEFAULT_MAX_HOURS,
  type NewTaskInput,
  type Task,
  type TaskPatch,
} from "@/lib/types";
import AddTaskForm from "./AddTaskForm";
import DaySection from "./DaySection";
import MaxHoursInput from "./MaxHoursInput";
import { TaskCardView } from "./TaskCard";
import TaskSheet from "./TaskSheet";

const NO_DATE = "none";

function dayOf(task: Task) {
  return task.due_date ?? NO_DATE;
}

// Prefer the card under the pointer; otherwise the day under the pointer.
const collisionDetection: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  const cardHits = hits.filter((h) => !String(h.id).startsWith("day:"));
  if (cardHits.length) return cardHits;
  if (hits.length) return hits;
  return rectIntersection(args);
};

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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overDay, setOverDay] = useState<string | null>(null);
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

  async function addTask(input: NewTaskInput) {
    await save(async () => {
      const task = await store.addTask({
        ...input,
        sort_order: endOrder(input.due_date ?? NO_DATE),
      });
      setTasks((prev) => [...prev, task]);
    });
  }

  function updateTask(id: string, patch: TaskPatch) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    save(() => store.updateTask(id, patch));
  }

  // Change several tasks at once (used when reordering a day).
  function updateMany(changes: { id: string; patch: TaskPatch }[]) {
    if (changes.length === 0) return;
    const byId = new Map(changes.map((c) => [c.id, c.patch]));
    setTasks((prev) => prev.map((t) => (byId.has(t.id) ? { ...t, ...byId.get(t.id) } : t)));
    save(() => Promise.all(changes.map((c) => store.updateTask(c.id, c.patch))));
  }

  /** A sort_order that puts a task at the bottom of the given day. */
  function endOrder(dayKey: string) {
    const list = byDate.get(dayKey) ?? [];
    return list.length ? Math.max(...list.map((t) => t.sort_order)) + 1 : 0;
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

  function dayKeyOf(id: string): string | null {
    if (id.startsWith("day:")) return id.slice(4);
    const t = tasks.find((x) => x.id === id);
    return t ? dayOf(t) : null;
  }

  function onDragStart(event: DragStartEvent) {
    setDraggingId(String(event.active.id));
  }

  function onDragOver(event: DragOverEvent) {
    setOverDay(event.over ? dayKeyOf(String(event.over.id)) : null);
  }

  function onDragCancel() {
    setDraggingId(null);
    setOverDay(null);
  }

  function onDragEnd(event: DragEndEvent) {
    onDragCancel();
    const { active, over } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (!task || !over) return;
    const overId = String(over.id);
    const targetDay = dayKeyOf(overId);
    if (targetDay === null) return;

    const sourceDay = dayOf(task);
    const targetList = byDate.get(targetDay) ?? [];
    let newOrder: Task[];

    if (overId.startsWith("day:")) {
      // Dropped on a day, not on a card: put it at the bottom.
      if (targetDay === sourceDay) return;
      newOrder = [...targetList, task];
    } else if (targetDay === sourceDay) {
      // Reorder within the same day.
      const from = targetList.findIndex((t) => t.id === task.id);
      const to = targetList.findIndex((t) => t.id === overId);
      if (from === to) return;
      newOrder = arrayMove(targetList, from, to);
    } else {
      // Moved onto a card in another day: insert above or below that card.
      const overIndex = targetList.findIndex((t) => t.id === overId);
      const dragged = active.rect.current.translated;
      const below = dragged ? dragged.top + dragged.height / 2 > over.rect.top + over.rect.height / 2 : false;
      newOrder = [...targetList];
      newOrder.splice(overIndex + (below ? 1 : 0), 0, task);
    }

    const due_date = targetDay === NO_DATE ? null : targetDay;
    updateMany(
      newOrder.flatMap((t, i) => {
        const patch: TaskPatch = {};
        if (t.sort_order !== i) patch.sort_order = i;
        if (t.id === task.id && t.due_date !== due_date) patch.due_date = due_date;
        return Object.keys(patch).length ? [{ id: t.id, patch }] : [];
      })
    );
  }

  const byDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const key = t.due_date ?? NO_DATE;
      map.set(key, [...(map.get(key) ?? []), t]);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)
      );
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
  const draggingTask = tasks.find((t) => t.id === draggingId) ?? null;
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
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
          >
            <div className="space-y-3">
              {undated.length > 0 && (
                <DaySection
                  dayKey={NO_DATE}
                  title="No date"
                  tasks={undated}
                  highlighted={overDay === NO_DATE}
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
                  highlighted={overDay === d}
                  maxHours={maxHours}
                  onToggle={(t) => updateTask(t.id, { done: !t.done })}
                  onOpen={(t) => setOpenId(t.id)}
                />
              ))}
            </div>
            <DragOverlay>
              {draggingTask && <TaskCardView task={draggingTask} lifted />}
            </DragOverlay>
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
            // A new date puts the task at the bottom of that day.
            if (patch.due_date !== undefined && patch.due_date !== openTask.due_date) {
              patch.sort_order = endOrder(patch.due_date ?? NO_DATE);
            }
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
