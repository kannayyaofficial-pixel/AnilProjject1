import { useState, useRef, useCallback } from "react";
import { useTasks } from "./hooks/useTasks";
import { Column } from "./components/Column";
import { TaskModal } from "./components/TaskModal";
import {
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "./lib/taskService";
import { COLUMNS } from "./types";
import type { Task, TaskStatus, Priority } from "./types";

export default function App() {
  const { tasks, loading } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const dragIdRef = useRef<string | null>(null);

  const taskList = Object.values(tasks);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleSave = async (data: {
    title: string;
    description: string;
    priority: Priority;
    assignee: string;
  }) => {
    try {
      if (modalMode === "edit" && editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(
          data.title,
          data.description,
          data.priority,
          data.assignee
        );
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save task:", err);
      alert("Could not save the task. Please check your connection and try again.");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Could not delete the task. Please try again.");
    }
  };

  const handleDragStart = useCallback(
    (e: React.DragEvent, taskId: string) => {
      dragIdRef.current = taskId;
      setDraggingId(taskId);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    dragIdRef.current = null;
    setDraggingId(null);
    setDragOverCol(null);
  }, []);

  const handleDrop = useCallback(
    async (status: TaskStatus) => {
      const taskId = dragIdRef.current;
      if (!taskId) return;
      const task = tasks[taskId];
      if (task && task.status !== status) {
        try {
          await updateTaskStatus(taskId, status);
        } catch (err) {
          console.error("Failed to move task:", err);
        }
      }
      handleDragEnd();
    },
    [tasks, handleDragEnd]
  );

  const counts = COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = taskList.filter((t) => t.status === col.id).length;
      return acc;
    },
    {} as Record<TaskStatus, number>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">T</div>
          <div>
            <div className="header-title">TaskFlow</div>
            <div className="header-subtitle">Collaborative Task Board</div>
          </div>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <div className="status-dot" />
            Live Sync
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            + <span>New Task</span>
          </button>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat-pill">
          <div className="stat-dot" style={{ background: "#3b82f6" }} />
          To Do: <strong>{counts.todo}</strong>
        </div>
        <div className="stat-pill">
          <div className="stat-dot" style={{ background: "#f59e0b" }} />
          In Progress: <strong>{counts["in-progress"]}</strong>
        </div>
        <div className="stat-pill">
          <div className="stat-dot" style={{ background: "#22c55e" }} />
          Done: <strong>{counts.done}</strong>
        </div>
      </div>

      <div className="board-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <div className="loading-text">Loading your board…</div>
          </div>
        ) : (
          <div className="board">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                status={col.id}
                tasks={taskList.filter((t) => t.status === col.id)}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                isDragOver={dragOverCol === col.id}
                setDragOver={setDragOverCol}
                draggingId={draggingId}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          mode={modalMode}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
