"use client";

import type { Task } from "@/lib/types";
import { CheckIcon } from "@/components/icons";
import { formatDateLabel, formatWeekdayShort } from "@/lib/date-utils";

export function CalendarWeekView({
  weekDays,
  tasks,
  todayISO,
  onToggle,
}: {
  weekDays: string[];
  tasks: Task[];
  todayISO: string;
  onToggle: (id: string) => void;
}) {
  const tasksByDay = weekDays.map((day) =>
    tasks
      .filter((t) => t.dueDate === day)
      .sort((a, b) => (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99")),
  );
  const weekTasks = tasksByDay.flat();
  const doneCount = weekTasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col gap-4 p-5 pt-2">
      <div className="rounded-md bg-brand-surface p-4 shadow-card">
        <p className="font-condensed text-xs font-bold uppercase tracking-wide text-brand-muted">
          Огляд тижня
        </p>
        <p className="font-condensed text-lg font-bold text-brand-text">
          Виконано {doneCount} з {weekTasks.length} задач
        </p>
      </div>

      {weekDays.map((day, i) => {
        const isToday = day === todayISO;
        return (
          <div key={day} className="flex flex-col gap-2">
            <p
              className={`font-condensed text-xs font-bold uppercase tracking-wide ${
                isToday ? "text-brand-green" : "text-brand-muted"
              }`}
            >
              {formatWeekdayShort(day)} · {formatDateLabel(day, todayISO)}
            </p>

            {tasksByDay[i].length === 0 ? (
              <p className="text-sm text-neutral-400">Немає задач</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {tasksByDay[i].map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 rounded-md bg-brand-surface p-3 shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.99]"
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      aria-pressed={task.done}
                      aria-label="Позначити виконаним"
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 active:scale-90 ${
                        task.done
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-neutral-300"
                      }`}
                    >
                      {task.done && <CheckIcon className="h-3.5 w-3.5 animate-pop" />}
                    </button>
                    <p
                      className={`flex-1 text-sm transition-colors duration-300 ${
                        task.done ? "text-neutral-400 line-through" : "text-brand-text"
                      }`}
                    >
                      {task.text}
                    </p>
                    {task.dueTime && (
                      <span className="shrink-0 font-condensed text-xs font-bold uppercase tracking-wide text-brand-muted">
                        {task.dueTime}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
