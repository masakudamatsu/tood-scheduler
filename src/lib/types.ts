export type Task = {
  id: string;
  title: string;
  note: string;
  due_date: string | null; // "YYYY-MM-DD" or null for no date
  hours: number | null;
  done: boolean;
  sort_order: number; // order within its day (smaller = higher up)
  created_at: string;
};

export type NewTask = {
  title: string;
  due_date: string | null;
  hours: number | null;
  sort_order: number;
};

/** What the "add task" form provides; the app picks the order. */
export type NewTaskInput = Omit<NewTask, "sort_order">;

export type TaskPatch = Partial<Omit<Task, "id" | "created_at">>;

export interface TaskStore {
  listTasks(): Promise<Task[]>;
  addTask(input: NewTask): Promise<Task>;
  updateTask(id: string, patch: TaskPatch): Promise<void>;
  deleteTask(id: string): Promise<void>;
  getMaxHours(): Promise<number>;
  setMaxHours(hours: number): Promise<void>;
}

export const DEFAULT_MAX_HOURS = 8;
