"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { Task } from "./types";

const STORAGE_KEY = "ai-day-planner.tasks";

type Listener = () => void;

const EMPTY_TASKS: Task[] = [];
let cachedTasks: Task[] | null = null;
const listeners = new Set<Listener>();

type StoredTask = Omit<Task, "archived" | "archivedAt"> &
  Partial<Pick<Task, "archived" | "archivedAt">>;

function readTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_TASKS;
    const parsed = JSON.parse(raw) as StoredTask[];
    return parsed.map((t) => ({
      archived: false,
      archivedAt: null,
      ...t,
    }));
  } catch {
    return EMPTY_TASKS;
  }
}

function getSnapshot(): Task[] {
  if (cachedTasks === null) cachedTasks = readTasks();
  return cachedTasks;
}

function getServerSnapshot(): Task[] {
  return EMPTY_TASKS;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeTasks(updater: (prev: Task[]) => Task[]) {
  cachedTasks = updater(getSnapshot());
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedTasks));
  listeners.forEach((listener) => listener());
}

function createTask(
  text: string,
  dueDate: string | null = null,
  dueTime: string | null = null,
): Task {
  return {
    id: crypto.randomUUID(),
    text,
    createdAt: Date.now(),
    done: false,
    dueDate,
    dueTime: dueDate ? dueTime : null,
    durationMinutes: null,
    archived: false,
    archivedAt: null,
  };
}

export type ParsedTask = { text: string; dueDate?: string | null; dueTime?: string | null };

type TasksContextValue = {
  tasks: Task[];
  addTask: (text: string) => void;
  addTasks: (parsedTasks: ParsedTask[]) => void;
  toggleDone: (id: string) => void;
  updateText: (id: string, text: string) => void;
  setDueDate: (id: string, dueDate: string | null) => void;
  setDueTime: (id: string, dueTime: string | null) => void;
  setDuration: (id: string, durationMinutes: number | null) => void;
  setDueDateForMany: (ids: string[], dueDate: string | null) => void;
  removeTask: (id: string) => void;
  restoreTask: (id: string) => void;
  deleteForever: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const tasks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    writeTasks((prev) => [createTask(trimmed), ...prev]);
  }, []);

  const addTasks = useCallback((parsedTasks: ParsedTask[]) => {
    const newTasks = parsedTasks
      .map((t) => ({
        text: t.text.trim(),
        dueDate: t.dueDate ?? null,
        dueTime: t.dueTime ?? null,
      }))
      .filter((t) => t.text)
      .map((t) => createTask(t.text, t.dueDate, t.dueTime));
    if (newTasks.length === 0) return;
    writeTasks((prev) => [...newTasks, ...prev]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const updateText = useCallback((id: string, text: string) => {
    writeTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  }, []);

  const setDueDate = useCallback((id: string, dueDate: string | null) => {
    writeTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              dueDate,
              dueTime: dueDate ? t.dueTime : null,
              durationMinutes: dueDate ? t.durationMinutes : null,
            }
          : t,
      ),
    );
  }, []);

  const setDueTime = useCallback((id: string, dueTime: string | null) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dueTime } : t)),
    );
  }, []);

  const setDuration = useCallback((id: string, durationMinutes: number | null) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, durationMinutes } : t)),
    );
  }, []);

  const setDueDateForMany = useCallback((ids: string[], dueDate: string | null) => {
    const idSet = new Set(ids);
    writeTasks((prev) =>
      prev.map((t) =>
        idSet.has(t.id)
          ? {
              ...t,
              dueDate,
              dueTime: dueDate ? t.dueTime : null,
              durationMinutes: dueDate ? t.durationMinutes : null,
            }
          : t,
      ),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, archived: true, archivedAt: Date.now() } : t)),
    );
  }, []);

  const restoreTask = useCallback((id: string) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, archived: false, archivedAt: null } : t)),
    );
  }, []);

  const deleteForever = useCallback((id: string) => {
    writeTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        addTasks,
        toggleDone,
        updateText,
        setDueDate,
        setDueTime,
        setDuration,
        setDueDateForMany,
        removeTask,
        restoreTask,
        deleteForever,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
