import { DEFAULT_MAX_HOURS, type NewTask, type Task, type TaskPatch, type TaskStore } from "../types";

const TASKS_KEY = "tds.tasks";
const MAX_KEY = "tds.maxHours";

function read(): Task[] {
  try {
    const tasks: Task[] = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    // Tasks saved before reordering existed have no sort_order yet.
    return tasks.map((t) => ({ ...t, sort_order: t.sort_order ?? 0 }));
  } catch {
    return [];
  }
}

function write(tasks: Task[]) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // Storage blocked (private window etc.): data lasts until reload.
  }
}

export const localStore: TaskStore = {
  async listTasks() {
    return read();
  },
  async addTask(input: NewTask) {
    const task: Task = {
      id: crypto.randomUUID(),
      note: "",
      done: false,
      created_at: new Date().toISOString(),
      ...input,
    };
    write([...read(), task]);
    return task;
  },
  async updateTask(id: string, patch: TaskPatch) {
    write(read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
  },
  async deleteTask(id: string) {
    write(read().filter((t) => t.id !== id));
  },
  async getMaxHours() {
    try {
      const v = Number(localStorage.getItem(MAX_KEY));
      return v > 0 ? v : DEFAULT_MAX_HOURS;
    } catch {
      return DEFAULT_MAX_HOURS;
    }
  },
  async setMaxHours(hours: number) {
    try {
      localStorage.setItem(MAX_KEY, String(hours));
    } catch {}
  },
};
