"use client";

import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HourglassIcon,
  InboxIcon,
  TrashIcon,
} from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { NotificationBanner } from "@/components/notification-banner";
import { useTasks } from "@/lib/tasks-context";
import { useTodayISO } from "@/lib/use-today";
import { formatScheduleLabel } from "@/lib/date-utils";

const DURATION_OPTIONS = [
  { value: "", label: "Без тривалості" },
  { value: "15", label: "15 хв" },
  { value: "30", label: "30 хв" },
  { value: "45", label: "45 хв" },
  { value: "60", label: "1 год" },
  { value: "90", label: "1 год 30 хв" },
  { value: "120", label: "2 год" },
  { value: "180", label: "3 год" },
  { value: "240", label: "4 год" },
];

export default function InboxPage() {
  const { tasks, toggleDone, updateText, setDueDate, setDueTime, setDuration, removeTask } =
    useTasks();
  const todayISO = useTodayISO();

  if (tasks.length === 0) {
    return (
      <div className="flex h-full flex-col p-5">
        <NotificationBanner />
        <EmptyState
          icon={InboxIcon}
          title="У Вхідних поки порожньо"
          description="Все, що ви занотуєте на екрані «Занотувати», з'явиться тут."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <NotificationBanner />
      <ul className="flex flex-col gap-3">
        {tasks.map((task, index) => {
          const scheduleLabel = formatScheduleLabel(
            task.dueDate,
            task.dueTime,
            task.durationMinutes,
            todayISO,
          );
          return (
            <li
              key={task.id}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              className="flex animate-fade-up flex-col gap-2 rounded-md bg-brand-surface p-4 shadow-card transition-all duration-200 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDone(task.id)}
                  aria-pressed={task.done}
                  aria-label="Позначити виконаним"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 active:scale-90 ${
                    task.done
                      ? "border-brand-green bg-brand-green text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {task.done && <CheckIcon className="h-4 w-4 animate-pop" />}
                </button>

                <input
                  type="text"
                  value={task.text}
                  onChange={(e) => updateText(task.id, e.target.value)}
                  aria-label="Текст задачі"
                  className={`flex-1 bg-transparent text-base outline-none transition-colors duration-300 ${
                    task.done ? "text-neutral-400 line-through" : "text-brand-text"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  aria-label="Видалити задачу"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-600/10 text-red-600 transition-all duration-200 active:scale-90 active:bg-red-600/20"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              {scheduleLabel && (
                <p className="pl-11 font-condensed text-xs font-bold uppercase tracking-wide text-brand-green">
                  {scheduleLabel}
                </p>
              )}

              <div className="flex items-center gap-2 pl-11">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-dark text-white transition-transform duration-200 active:scale-90">
                  <CalendarIcon className="h-4 w-4" />
                  <input
                    type="date"
                    value={task.dueDate ?? ""}
                    aria-label="Призначити дату"
                    onChange={(e) => setDueDate(task.id, e.target.value || null)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>

                {task.dueDate && (
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-dark text-white transition-transform duration-200 active:scale-90">
                    <ClockIcon className="h-4 w-4" />
                    <input
                      type="time"
                      value={task.dueTime ?? ""}
                      aria-label="Призначити час"
                      onChange={(e) => setDueTime(task.id, e.target.value || null)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                )}

                {task.dueDate && (
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-dark text-white transition-transform duration-200 active:scale-90">
                    <HourglassIcon className="h-4 w-4" />
                    <select
                      value={task.durationMinutes ?? ""}
                      aria-label="Тривалість задачі"
                      onChange={(e) =>
                        setDuration(task.id, e.target.value ? Number(e.target.value) : null)
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    >
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
