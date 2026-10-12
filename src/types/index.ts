export type TaskStatus = "todo" | "in-progress" | "done";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  createdAt: number;
  updatedAt: number;
  order: number;
}

export type Tasks = Record<string, Task>;

export interface ColumnDef {
  id: TaskStatus;
  title: string;
  accent: string;
  emptyText: string;
}

export const COLUMNS: ColumnDef[] = [
  {
    id: "todo",
    title: "To Do",
    accent: "#3b82f6",
    emptyText: "No tasks yet. Add one to get started.",
  },
  {
    id: "in-progress",
    title: "In Progress",
    accent: "#f59e0b",
    emptyText: "Nothing in progress right now.",
  },
  {
    id: "done",
    title: "Done",
    accent: "#22c55e",
    emptyText: "No completed tasks yet.",
  },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "#64748b",
  medium: "#f59e0b",
  high: "#ef4444",
};
