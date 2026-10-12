import { supabase } from "./firebase";
import type { Task, TaskStatus, Priority } from "../types";

export interface TaskRow {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    assignee: row.assignee,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    order: row.sort_order,
  };
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as TaskRow[]).map(rowToTask);
}

export async function createTask(
  title: string,
  description: string,
  priority: Priority,
  assignee: string
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee: assignee.trim() || "Unassigned",
      status: "todo",
    })
    .select()
    .single();

  if (error) throw error;
  return rowToTask(data as TaskRow);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw error;
}

export async function updateTask(
  taskId: string,
  updates: Partial<Pick<Task, "title" | "description" | "priority" | "assignee">>
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw error;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}

export function subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
  // Initial fetch
  fetchTasks()
    .then(callback)
    .catch((err) => {
      console.error("Failed to fetch tasks:", err);
      callback([]);
    });

  // Realtime subscription
  const channel = supabase
    .channel("tasks-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      () => {
        fetchTasks()
          .then(callback)
          .catch((err) => {
            console.error("Realtime refetch failed:", err);
          });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
