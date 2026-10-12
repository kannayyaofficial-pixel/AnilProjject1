import { useState, useEffect } from "react";
import type { Tasks } from "../types";
import { subscribeToTasks } from "../lib/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState<Tasks>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToTasks((taskList) => {
      const map: Tasks = {};
      for (const t of taskList) {
        map[t.id] = t;
      }
      setTasks(map);
      setLoading(false);
      setError(null);
    });
    return unsub;
  }, []);

  return { tasks, loading, error };
}
