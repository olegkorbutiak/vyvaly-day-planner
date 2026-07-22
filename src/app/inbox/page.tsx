"use client";

import { CheckIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { useTasks } from "@/lib/tasks-context";

export default function InboxPage() {
  const { tasks, toggleDone, moveToToday } = useTasks();
  const inboxTasks = tasks.filter((t) => !t.scheduledForToday);

  if (inboxTasks.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <EmptyState
          title="В Inbox поки порожньо"
          description="Все, що ви занотуєте на екрані «Занотувати», з'явиться тут."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <ul className="flex flex-col gap-3">
        {inboxTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-md bg-brand-surface p-4 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleDone(task.id)}
              aria-pressed={task.done}
              aria-label="Позначити виконаним"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 transition ${
                task.done
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-neutral-300"
              }`}
            >
              {task.done && <CheckIcon className="h-4 w-4" />}
            </button>

            <p
              className={`flex-1 text-base ${
                task.done ? "text-neutral-400 line-through" : "text-brand-text"
              }`}
            >
              {task.text}
            </p>

            <button
              type="button"
              onClick={() => moveToToday(task.id)}
              className="shrink-0 rounded-md bg-brand-dark px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wide text-white"
            >
              Сьогодні
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
