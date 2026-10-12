import type { Task } from "../types";
import { PRIORITY_LABELS, PRIORITY_COLORS } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
}: TaskCardProps) {
  const initials = task.assignee
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div
      className={`task-card priority-${task.priority} ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
      <div className="task-header">
        <div className="task-title">{task.title}</div>
        <div className="task-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            ✎
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            🗑
          </button>
        </div>
      </div>
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}
      <div className="task-footer">
        <div className="task-assignee">
          <div className="assignee-avatar">{initials}</div>
          <span>{task.assignee}</span>
        </div>
        <span
          className="priority-badge"
          style={{
            background: `${PRIORITY_COLORS[task.priority]}20`,
            color: PRIORITY_COLORS[task.priority],
          }}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
    </div>
  );
}
