"use client";

import { useMemo } from "react";
import { ArchiveIcon, CalendarIcon, RestoreIcon, TrashIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { useTasks } from "@/lib/tasks-context";
import { useTodayISO } from "@/lib/use-today";
import { formatDateLabel, formatScheduleLabel, toISODate } from "@/lib/date-utils";
import type { Task } from "@/lib/types";

export default function ArchivePage() {
  const { tasks, toggleDone, setDueDate, removeTask, restoreTask, deleteForever } = useTasks();
  const todayISO = useTodayISO();

  const overdueTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.archived && !t.done && t.dueDate !== null && t.dueDate < todayISO)
        .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : a.dueDate! > b.dueDate! ? 1 : 0)),
    [tasks, todayISO],
  );

  const deletedTasks = useMemo(
    () =>
      tasks
        .filter((t): t is Task & { archivedAt: number } => t.archived && t.archivedAt !== null)
        .sort((a, b) => b.archivedAt - a.archivedAt),
    [tasks],
  );

  const handleDeleteForever = (task: Task) => {
    if (window.confirm(`Видалити «${task.text}» назавжди? Цю дію не можна скасувати.`)) {
      deleteForever(task.id);
    }
  };

  if (overdueTasks.length === 0 && deletedTasks.length === 0) {
    return (
      <div className="flex h-full flex-col p-5">
        <EmptyState
          icon={ArchiveIcon}
          title="В архіві поки порожньо"
          description="Прострочені та видалені задачі з'являтимуться тут."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-6 pb-5">
      <p className="animate-fade-up font-condensed text-xs font-bold uppercase tracking-wide text-brand-green">
        Архів
      </p>

      {overdueTasks.length > 0 && (
        <section className="mt-4 flex flex-col gap-2">
          <p className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-muted">
            Прострочені · {overdueTasks.length}
          </p>
          <ul className="flex flex-col gap-3">
            {overdueTasks.map((task, index) => (
              <li
                key={task.id}
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                className="animate-fade-up flex flex-col gap-2 rounded-md bg-brand-surface p-4 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDone(task.id)}
                    aria-label="Позначити виконаним"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-neutral-300 transition-all duration-200 active:scale-90"
                  />
                  <p className="flex-1 text-base text-brand-text">{task.text}</p>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    aria-label="Видалити задачу"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-600/10 text-red-600 transition-all duration-200 active:scale-90 active:bg-red-600/20"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <p className="pl-11 font-condensed text-xs font-bold uppercase tracking-wide text-red-600">
                  {formatScheduleLabel(task.dueDate, task.dueTime, task.durationMinutes, todayISO)}
                </p>

                <div className="flex items-center gap-2 pl-11">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-dark text-white transition-transform duration-200 active:scale-90">
                    <CalendarIcon className="h-4 w-4" />
                    <input
                      type="date"
                      value={task.dueDate ?? ""}
                      aria-label="Перенести на іншу дату"
                      onChange={(e) => setDueDate(task.id, e.target.value || null)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setDueDate(task.id, todayISO)}
                    className="font-condensed text-xs font-bold uppercase tracking-wide text-brand-muted underline underline-offset-2 transition active:scale-95"
                  >
                    Перенести на сьогодні
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {deletedTasks.length > 0 && (
        <section className="mt-6 flex flex-col gap-2">
          <p className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-muted">
            Видалені · {deletedTasks.length}
          </p>
          <ul className="flex flex-col gap-3">
            {deletedTasks.map((task, index) => (
              <li
                key={task.id}
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                className="animate-fade-up flex items-center gap-3 rounded-md bg-brand-surface p-4 shadow-card"
              >
                <div className="flex-1">
                  <p className="text-base text-neutral-400 line-through">{task.text}</p>
                  <p className="text-xs text-brand-muted">
                    Видалено: {formatDateLabel(toISODate(new Date(task.archivedAt)), todayISO)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => restoreTask(task.id)}
                  aria-label="Відновити задачу"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-green/10 text-brand-green transition-all duration-200 active:scale-90 active:bg-brand-green/20"
                >
                  <RestoreIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteForever(task)}
                  aria-label="Видалити назавжди"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-600/10 text-red-600 transition-all duration-200 active:scale-90 active:bg-red-600/20"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
