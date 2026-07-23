"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "@/components/icons";
import { useTasks } from "@/lib/tasks-context";
import { useTodayISO } from "@/lib/use-today";
import {
  addDaysISO,
  addMonthsISO,
  dayOfMonth,
  formatMonthLabel,
  formatWeekRangeLabel,
  formatWeekdayShort,
  getMonthGridDays,
  getWeekStartISO,
  isSameMonth,
} from "@/lib/date-utils";
import type { Task } from "@/lib/types";

type ViewMode = "week" | "month";

function pluralDays(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дні";
  return "днів";
}

function computeStreak(tasks: Task[], todayIso: string): number {
  const byDate = new Map<string, Task[]>();
  let earliest: string | null = null;
  for (const t of tasks) {
    if (t.archived || !t.dueDate) continue;
    const list = byDate.get(t.dueDate) ?? [];
    list.push(t);
    byDate.set(t.dueDate, list);
    if (!earliest || t.dueDate < earliest) earliest = t.dueDate;
  }
  if (!earliest) return 0;

  let streak = 0;
  let cursor = todayIso;
  while (cursor >= earliest) {
    const dayTasks = byDate.get(cursor);
    if (dayTasks && dayTasks.length > 0) {
      const allDone = dayTasks.every((t) => t.done);
      if (allDone) {
        streak++;
      } else if (cursor !== todayIso) {
        // A past day left unfinished breaks the streak; today just hasn't
        // ended yet, so it's skipped rather than counted as a break.
        break;
      }
    }
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

function summarize(tasks: Task[], dates: Set<string>) {
  const relevant = tasks.filter((t) => !t.archived && t.dueDate && dates.has(t.dueDate));
  return { total: relevant.length, done: relevant.filter((t) => t.done).length };
}

export default function StatisticsPage() {
  const { tasks } = useTasks();
  const todayISO = useTodayISO();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const weekStart = getWeekStartISO(addDaysISO(todayISO, weekOffset * 7));
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysISO(weekStart, i)),
    [weekStart],
  );
  const monthAnchor = addMonthsISO(todayISO, monthOffset);
  const monthDays = useMemo(
    () => getMonthGridDays(monthAnchor).filter((d) => isSameMonth(d, monthAnchor)),
    [monthAnchor],
  );

  const streak = useMemo(() => computeStreak(tasks, todayISO), [tasks, todayISO]);

  const activeDates = viewMode === "week" ? weekDays : monthDays;
  const { total, done } = useMemo(
    () => summarize(tasks, new Set(activeDates)),
    [tasks, activeDates],
  );
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const perDay = useMemo(
    () =>
      activeDates.map((date) => {
        const dayTasks = tasks.filter((t) => !t.archived && t.dueDate === date);
        return { date, total: dayTasks.length, done: dayTasks.filter((t) => t.done).length };
      }),
    [tasks, activeDates],
  );

  const rangeLabel =
    viewMode === "week" ? formatWeekRangeLabel(weekStart) : formatMonthLabel(monthAnchor);

  const handlePrev = () => {
    if (viewMode === "week") setWeekOffset((w) => w - 1);
    else setMonthOffset((m) => m - 1);
  };
  const handleNext = () => {
    if (viewMode === "week") setWeekOffset((w) => w + 1);
    else setMonthOffset((m) => m + 1);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-6 pb-5">
      <div className="flex items-center justify-between">
        <p className="animate-fade-up font-condensed text-xs font-bold uppercase tracking-wide text-brand-green">
          Статистика
        </p>
        <Link
          href="/calendar"
          aria-label="Назад до календаря"
          className="flex h-8 w-8 items-center justify-center rounded-md text-brand-muted transition-all duration-200 active:scale-90"
        >
          <XIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 flex animate-fade-up items-center gap-4 rounded-xl bg-brand-dark p-4 shadow-card-hover">
        <span className="text-3xl">🔥</span>
        <div>
          <p className="font-condensed text-2xl font-bold text-white">
            {streak} {pluralDays(streak)}
          </p>
          <p className="text-xs text-white/60">поспіль усі задачі виконано</p>
        </div>
      </div>

      <div className="mt-4 flex rounded-md bg-brand-dark p-1">
        <button
          type="button"
          onClick={() => setViewMode("week")}
          aria-pressed={viewMode === "week"}
          className={`flex-1 rounded-md py-2 font-condensed text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
            viewMode === "week" ? "bg-brand-green text-white" : "text-white/50"
          }`}
        >
          Тиждень
        </button>
        <button
          type="button"
          onClick={() => setViewMode("month")}
          aria-pressed={viewMode === "month"}
          className={`flex-1 rounded-md py-2 font-condensed text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
            viewMode === "month" ? "bg-brand-green text-white" : "text-white/50"
          }`}
        >
          Місяць
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Попередній період"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand-text transition-all duration-200 hover:bg-brand-dark/[0.06] active:scale-90"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1 rounded-xl bg-brand-surface py-2.5 text-center shadow-card">
          <p
            key={rangeLabel}
            className="animate-fade-up font-condensed text-sm font-bold uppercase tracking-wide text-brand-text"
          >
            {rangeLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Наступний період"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand-text transition-all duration-200 hover:bg-brand-dark/[0.06] active:scale-90"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div
        key={rangeLabel + viewMode}
        className="mt-4 animate-fade-up rounded-md bg-brand-surface p-4 shadow-card"
      >
        <div className="flex items-baseline justify-between">
          <p className="font-condensed text-lg font-bold text-brand-text">
            {done} з {total} задач
          </p>
          <p className="font-condensed text-lg font-bold text-brand-green">{percent}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {viewMode === "week" ? (
        <div className="mt-4 flex animate-fade-up items-end justify-between gap-2 rounded-md bg-brand-surface p-4 shadow-card">
          {perDay.map((day) => {
            const ratio = day.total > 0 ? day.done / day.total : 0;
            const isToday = day.date === todayISO;
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="relative flex h-16 w-full items-end overflow-hidden rounded-md bg-neutral-100"
                  title={`${day.done}/${day.total}`}
                >
                  {day.total > 0 && (
                    <div
                      className="w-full rounded-md bg-brand-green transition-all duration-500"
                      style={{ height: `${Math.max(ratio * 100, 6)}%` }}
                    />
                  )}
                </div>
                <p
                  className={`font-condensed text-[10px] font-bold uppercase ${
                    isToday ? "text-brand-green" : "text-brand-muted"
                  }`}
                >
                  {formatWeekdayShort(day.date)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 animate-fade-up rounded-md bg-brand-surface p-3 shadow-card">
          <div className="grid grid-cols-7 gap-1">
            {perDay.map((day) => {
              const isToday = day.date === todayISO;
              const dotColor =
                day.total === 0
                  ? "bg-transparent"
                  : day.done === day.total
                    ? "bg-brand-green"
                    : day.done === 0
                      ? "bg-red-600/50"
                      : "bg-amber-500";
              return (
                <div
                  key={day.date}
                  title={day.total > 0 ? `${day.done}/${day.total}` : undefined}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-condensed text-[11px] font-bold ${
                      isToday ? "bg-brand-green text-white" : "text-brand-text"
                    }`}
                  >
                    {dayOfMonth(day.date)}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
