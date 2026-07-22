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
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <button
              type="button"
              onClick={() => toggleDone(task.id)}
              aria-pressed={task.done}
              aria-label="Позначити виконаним"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${
                task.done
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {task.done && <CheckIcon className="h-4 w-4" />}
            </button>

            <p
              className={`flex-1 text-base ${
                task.done ? "text-neutral-400 line-through" : "text-neutral-900 dark:text-neutral-50"
              }`}
            >
              {task.text}
            </p>

            <button
              type="button"
              onClick={() => moveToToday(task.id)}
              className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
            >
              Сьогодні
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
