import type { Task, TaskStatus } from "../types";
import { COLUMNS } from "../types";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onDrop: (status: TaskStatus) => void;
  isDragOver: boolean;
  setDragOver: (status: TaskStatus | null) => void;
  draggingId: string | null;
}

export function Column({
  status,
  tasks,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragOver,
  setDragOver,
  draggingId,
}: ColumnProps) {
  const col = COLUMNS.find((c) => c.id === status)!;
  const sorted = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div
      className={`column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(status);
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(null);
        onDrop(status);
      }}
    >
      <div className="column-header">
        <div className="column-title-group">
          <div
            className="column-accent"
            style={{ background: col.accent }}
          />
          <span className="column-title">{col.title}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="column-body">
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div>{col.emptyText}</div>
          </div>
        ) : (
          sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={task.id === draggingId}
            />
          ))
        )}
      </div>
    </div>
  );
}
