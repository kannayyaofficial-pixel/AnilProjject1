import { useState, useEffect, useCallback } from "react";
import type { Tasks } from "../types";
import { subscribeToTasks } from "../lib/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState<Tasks>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToTasks((data) => {
      setTasks(data);
      setLoading(false);
      setError(null);
    });
    return unsub;
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    const unsub = subscribeToTasks((data) => {
      setTasks(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { tasks, loading, error, refresh };
}
