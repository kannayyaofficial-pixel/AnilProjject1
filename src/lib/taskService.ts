import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  serverTimestamp,
} from "firebase/database";
import { db } from "./firebase";
import type { Task, TaskStatus, Tasks, Priority } from "../types";

const tasksRef = ref(db, "tasks");

export function subscribeToTasks(callback: (tasks: Tasks) => void): () => void {
  const listener = onValue(
    tasksRef,
    (snapshot) => {
      const val = snapshot.val() as Tasks | null;
      callback(val ?? {});
    },
    (error) => {
      console.error("Firebase subscribe error:", error);
      callback({});
    }
  );
  return () => off(tasksRef, "value", listener);
}

export async function createTask(
  title: string,
  description: string,
  priority: Priority,
  assignee: string
): Promise<string> {
  const newRef = push(tasksRef);
  const id = newRef.key;
  if (!id) throw new Error("Failed to generate task ID");

  const now = Date.now();
  const task: Task = {
    id,
    title: title.trim(),
    description: description.trim(),
    status: "todo",
    priority,
    assignee: assignee.trim() || "Unassigned",
    createdAt: now,
    updatedAt: now,
    order: now,
  };

  await set(newRef, task);
  return id;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<void> {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, {
    status,
    updatedAt: Date.now(),
  });
}

export async function updateTask(
  taskId: string,
  updates: Partial<Pick<Task, "title" | "description" | "priority" | "assignee">>
): Promise<void> {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = ref(db, `tasks/${taskId}`);
  await remove(taskRef);
}

export { serverTimestamp };
