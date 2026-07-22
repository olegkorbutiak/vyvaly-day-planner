import type { Task } from "./types";
import { addDaysISO } from "./date-utils";

function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

function formatStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function taskToEvent(task: Task): string {
  const uid = `${task.id}@my-perfect-day-planner`;
  const stamp = formatStamp(task.createdAt);
  const summary = escapeText(task.text);
  const status = task.done ? "CONFIRMED" : "NEEDS-ACTION";

  const dateCompact = task.dueDate!.replace(/-/g, "");

  const lines = ["BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${stamp}`];

  if (task.dueTime) {
    const timeCompact = task.dueTime.replace(":", "") + "00";
    lines.push(`DTSTART:${dateCompact}T${timeCompact}`);
    lines.push(`DURATION:PT${task.durationMinutes ?? 30}M`);
  } else {
    const nextDay = addDaysISO(task.dueDate!, 1).replace(/-/g, "");
    lines.push(`DTSTART;VALUE=DATE:${dateCompact}`);
    lines.push(`DTEND;VALUE=DATE:${nextDay}`);
  }

  lines.push(`SUMMARY:${summary}`, `STATUS:${status}`, "END:VEVENT");
  return lines.map(foldLine).join("\r\n");
}

export function tasksToICS(tasks: Task[]): string {
  const events = tasks.filter((t) => t.dueDate).map(taskToEvent);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//My Perfect Day Planner//UA",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(tasks: Task[]) {
  const ics = tasksToICS(tasks);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "planner.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
