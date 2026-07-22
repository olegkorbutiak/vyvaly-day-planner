"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { Task } from "./types";

const STORAGE_KEY = "ai-day-planner.tasks";

type Listener = () => void;

const EMPTY_TASKS: Task[] = [];
let cachedTasks: Task[] | null = null;
const listeners = new Set<Listener>();

function readTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : EMPTY_TASKS;
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

type TasksContextValue = {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleDone: (id: string) => void;
  moveToToday: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const tasks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: Date.now(),
      done: false,
      scheduledForToday: false,
    };
    writeTasks((prev) => [task, ...prev]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const moveToToday = useCallback((id: string) => {
    writeTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, scheduledForToday: true } : t)),
    );
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleDone, moveToToday }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
