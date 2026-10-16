import { getSupabase } from "../supabaseClient";
import { DEFAULT_MAX_HOURS, type NewTask, type Task, type TaskPatch, type TaskStore } from "../types";

const COLUMNS = "id, title, note, due_date, hours, done, sort_order, created_at";

function normalize(row: Task): Task {
  return {
    ...row,
    hours: row.hours == null ? null : Number(row.hours),
    sort_order: Number(row.sort_order ?? 0),
  };
}

export const supabaseStore: TaskStore = {
  async listTasks() {
    const { data, error } = await getSupabase()
      .from("tasks")
      .select(COLUMNS)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as Task[]).map(normalize);
  },
  async addTask(input: NewTask) {
    const { data, error } = await getSupabase()
      .from("tasks")
      .insert(input)
      .select(COLUMNS)
      .single();
    if (error) throw error;
    return normalize(data as Task);
  },
  async updateTask(id: string, patch: TaskPatch) {
    const { error } = await getSupabase().from("tasks").update(patch).eq("id", id);
    if (error) throw error;
  },
  async deleteTask(id: string) {
    const { error } = await getSupabase().from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
  async getMaxHours() {
    const { data, error } = await getSupabase()
      .from("settings")
      .select("max_hours")
      .maybeSingle();
    if (error) throw error;
    return data ? Number(data.max_hours) : DEFAULT_MAX_HOURS;
  },
  async setMaxHours(hours: number) {
    const { error } = await getSupabase()
      .from("settings")
      .upsert({ max_hours: hours }, { onConflict: "user_id" });
    if (error) throw error;
  },
};
